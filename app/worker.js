
import { issuer } from "@openauthjs/openauth";
import { CloudflareStorage } from "@openauthjs/openauth/storage/cloudflare";
import { PasswordProvider } from "@openauthjs/openauth/provider/password";
import { PasswordUI } from "@openauthjs/openauth/ui/password";
import { GoogleProvider } from "@openauthjs/openauth/provider/google";
import { MicrosoftProvider } from "@openauthjs/openauth/provider/microsoft";
import { AppleProvider } from "@openauthjs/openauth/provider/apple";
import { GithubProvider } from "@openauthjs/openauth/provider/github";
import { createSubjects } from "@openauthjs/openauth/subject";
import { object, string } from "valibot";

// Define your Env interface based on your worker's bindings
interface Env {
  AUTH_STORAGE: KVNamespace;
  AUTH_DB: D1Database;
  // Add OAuth client secrets here if you prefer to use environment variables
  // GOOGLE_CLIENT_ID: string; // Store actual ID in env
  // GOOGLE_CLIENT_SECRET: string;
  // MICROSOFT_CLIENT_ID: string;
  // MICROSOFT_CLIENT_SECRET: string;
  // APPLE_CLIENT_ID: string; // e.g., com.example.app
  // APPLE_TEAM_ID: string;
  // APPLE_KEY_ID: string;
  // APPLE_P8_PRIVATE_KEY: string; // Store the content of the .p8 file
  // GITHUB_CLIENT_ID: string;
  // GITHUB_CLIENT_SECRET: string;
}

const subjects = createSubjects({
  user: object({
    id: string(),
    email: string(), // Added email to the subject definition
  }),
});

// Define your allowed origins - IMPORTANT: Update this list
const allowedOrigins = [
  'https://47biaa75s8oj1xrfci68ilrjmuoptrc2uwq34e2jtztho5psof-h769614562.scf.usercontent.goog', // Your provided frontend origin
  // 'http://localhost:3000', // Example for local development
  // Add any other origins your frontend might be served from
];

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const requestOrigin = request.headers.get('Origin');
    let corsHeaders: Record<string, string> = {};

    if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
      corsHeaders = {
        'Access-Control-Allow-Origin': requestOrigin,
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      };
    }

    if (request.method === 'OPTIONS') {
      if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
        return new Response(null, { headers: corsHeaders });
      } else {
        return new Response('CORS preflight check failed for this origin.', { status: 403 });
      }
    }

    const url = new URL(request.url);

    if (url.pathname === "/" && request.method === "GET") { // More specific for demo redirect
      const demoAuthUrl = new URL(url.origin);
      demoAuthUrl.pathname = "/google/authorize"; // Example: default to Google for demo
      demoAuthUrl.searchParams.set("redirect_uri", url.origin + "/auth/callback"); // SPA's actual callback
      demoAuthUrl.searchParams.set("client_id", "your-client-id"); // Client ID known to OpenAuth
      demoAuthUrl.searchParams.set("response_type", "token"); // For implicit flow
      return Response.redirect(demoAuthUrl.toString(), 302);
    }
    // Note: The OpenAuth library itself handles paths like /google/authorize, /password/register etc.
    // The /callback path is typically for the OAuth provider to redirect to OpenAuth server,
    // then OpenAuth server redirects to your SPA's redirect_uri (e.g. /auth/callback on SPA).

    const openAuthIssuer = issuer({
      storage: CloudflareStorage({
        namespace: env.AUTH_STORAGE,
      }),
      subjects,
      providers: {
        password: PasswordProvider(
          PasswordUI({
            sendCode: async (email, code) => {
              console.log(`DEMO: Verification code for ${email} is ${code}. In production, send this via email.`);
            },
            copy: {
              input_code: "Code (check Worker logs)",
            },
          }),
        ),
        google: GoogleProvider({
          clientID: "YOUR_GOOGLE_CLIENT_ID", // Replace with actual
          clientSecret: "YOUR_GOOGLE_CLIENT_SECRET", // Replace with actual
        }),
        microsoft: MicrosoftProvider({
          clientID: "YOUR_MICROSOFT_CLIENT_ID", // Replace with actual
          clientSecret: "YOUR_MICROSOFT_CLIENT_SECRET", // Replace with actual
          tenant: "common",
        }),
        apple: AppleProvider({
          clientID: "YOUR_APPLE_CLIENT_ID_OR_SERVICE_ID", // e.g. web.com.example.app
          teamID: "YOUR_APPLE_TEAM_ID",
          keyID: "YOUR_APPLE_KEY_ID",
          clientSecret: "YOUR_APPLE_P8_PRIVATE_KEY_CONTENT_AS_STRING", // Paste .p8 content here
                                                                    // Or load from env.APPLE_P8_PRIVATE_KEY
        }),
        github: GithubProvider({
          clientID: "YOUR_GITHUB_CLIENT_ID", // Replace with actual
          clientSecret: "YOUR_GITHUB_CLIENT_SECRET", // Replace with actual
        }),
      },
      theme: {
        title: "Novel Weaver AI Auth",
        primary: "#0EA5E9",
        favicon: "https://workers.cloudflare.com/favicon.ico", // Replace
        logo: {
          dark: "https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/db1e5c92-d3a6-4ea9-3e72-155844211f00/public", // Replace
          light:
            "https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/fa5a3023-7da9-466b-98a7-4ce01ee6c700/public", // Replace
        },
      },
      success: async (issuerCtx, value) => {
        if (!value.email) {
          console.error("Email not provided by authentication provider for value:", value);
          // Attempt to get user info again if possible, or throw error
          // This depends on the provider and OpenAuth's handling
          throw new Error("User email could not be determined after authentication.");
        }
        const userId = await getOrCreateUser(env, value.email);
        return issuerCtx.subject("user", {
          id: userId,
          email: value.email, // Ensure email is included in the subject
        });
      },
      // Optional: Define a /me endpoint if OpenAuth's default doesn't suffice
      // The default /me (if issuer.me() is called) should return the subject data.
      // If 'email' is in the subject, it should be returned.
      // me: async (meCtx) => {
      //   const subject = await meCtx.getSubject("user");
      //   if (!subject) return null;
      //   return subject; // This will return { id: "...", email: "..." } if subject was created with email
      // }
    });

    let response: Response;
    // Check if the request is for the /me endpoint specifically
    if (url.pathname === "/me" && request.method === "GET") {
        const meResponse = await openAuthIssuer.me(request, env, ctx);
        if (meResponse) {
            response = meResponse;
        } else {
            response = new Response(JSON.stringify({ error: "Not authenticated or /me endpoint misconfigured" }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }
    } else {
        response = await openAuthIssuer.fetch(request, env, ctx);
    }
    

    const newResponse = new Response(response.body, response);
    if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
      Object.entries(corsHeaders).forEach(([key, value]) => {
        newResponse.headers.set(key, value);
      });
    }
    
    return newResponse;
  },
} satisfies ExportedHandler<Env>;

async function getOrCreateUser(env: Env, email: string): Promise<string> {
  if (!email || typeof email !== 'string') {
    throw new Error(`Invalid email provided for user creation: ${email}`);
  }

  const result = await env.AUTH_DB.prepare(
    `INSERT INTO user (email) VALUES (?) ON CONFLICT (email) DO UPDATE SET email = excluded.email RETURNING id;`
  )
    .bind(email)
    .first<{ id: string }>();

  if (!result || !result.id) {
    throw new Error(`Failed to create or retrieve user ID for email: ${email}`);
  }
  console.log(`DB: Found or created user ${result.id} with email ${email}`);
  return result.id;
}
