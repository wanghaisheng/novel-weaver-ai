
import type { AuthResponse, AuthErrorResponse, User, SignUpInitiateResponse, VerificationResponse, OpenAuthUser } from '../types';

// This should be the root of your OpenAuth worker
export const OPENAUTH_SERVER_URL = 'https://openauth-template.v2ray-tokyo.workers.dev';
const PASSWORD_API_BASE_URL = `${OPENAUTH_SERVER_URL}/password`;

// This redirect URI must be registered with your OpenAuth server and each OAuth provider
// configured on your OpenAuth server.
export const OAUTH_REDIRECT_URI = `${window.location.origin}/auth/callback`;
// A generic client ID for your app, OpenAuth server should know this.
// For real OAuth, specific client IDs for Google, GitHub, etc., are configured on the server.
export const OAUTH_CLIENT_ID = 'your-client-id'; // Match this with your OpenAuth server config


interface SignUpCredentials {
  email: string;
  password: string;
}

interface VerifyCodeCredentials {
  email: string;
  code: string;
}

interface SignInCredentials extends SignUpCredentials {}

// Interface for the raw server response from /password/authorize
interface PasswordAuthServerResponse {
  token: string;
  user?: OpenAuthUser; // User object from server might have optional email or be optional itself
  message?: string;
  // AuthErrorResponse fields if error, for direct parsing
  error?: string; 
  error_description?: string;
}


export const signUpUser = async (credentials: SignUpCredentials): Promise<SignUpInitiateResponse> => {
  const response = await fetch(`${PASSWORD_API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json() as AuthErrorResponse;
    throw new Error(errorData.message || errorData.error_description || `Sign-up initiation failed with status: ${response.status}`);
  }
  
  const data = await response.json() as SignUpInitiateResponse;
  return { 
    message: data.message || "Verification code sent. Please check your email (or worker logs for this demo).",
  };
};

export const verifySignUpCode = async (credentials: VerifyCodeCredentials): Promise<VerificationResponse> => {
  const response = await fetch(`${PASSWORD_API_BASE_URL}/verify`, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json() as AuthErrorResponse;
    throw new Error(errorData.message || errorData.error_description || `Verification failed with status: ${response.status}`);
  }

  const data = await response.json() as VerificationResponse;
  return {
    message: data.message || "Account verified successfully. You can now sign in.",
    user: data.user // Assuming server might return some user info here
  };
};

export const signInUser = async (credentials: SignInCredentials): Promise<AuthResponse> => { // AuthResponse expects User
  const response = await fetch(`${PASSWORD_API_BASE_URL}/authorize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const serverData: PasswordAuthServerResponse = await response.json();

  if (!response.ok) {
    throw new Error(serverData.message || serverData.error_description || `Sign-in failed with status: ${response.status}`);
  }

  // Ensure user and user.id exist from server. OpenAuthUser type requires id.
  if (!serverData.user || !serverData.user.id) { 
     throw new Error("User data or ID missing from server authentication response.");
  }

  // Construct the AuthResponse, ensuring its 'user' field is a 'User'
  return {
    token: serverData.token,
    user: { // This part creates a User object
        id: serverData.user.id, // Known to be string due to OpenAuthUser and the check above
        email: serverData.user.email || credentials.email, // Ensures email is string
    },
    message: serverData.message
  };
};


export const fetchUserProfile = async (token: string): Promise<User> => {
  const response = await fetch(`${OPENAUTH_SERVER_URL}/me`, { // Common endpoint for user profile
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    // If response.json() fails, catch will provide a default AuthErrorResponse structure.
    // If response.json() succeeds but isn't AuthErrorResponse, it will be handled by property checks.
    const errorData = await response.json().catch((): AuthErrorResponse => ({ message: "Failed to fetch user profile: Response body not JSON or unparseable" }));
    
    // Ensure errorData has the message property before using it.
    const message = (errorData as AuthErrorResponse)?.message || "Unknown error when fetching user profile";
    const description = (errorData as AuthErrorResponse)?.error_description;
    
    throw new Error(message || description || `Failed to fetch user profile: ${response.status}`);
  }
  
  const userData = await response.json() as User; // Assuming successful response gives User
  if (!userData.id || !userData.email) {
    throw new Error("User profile data from server is incomplete (missing ID or email).");
  }
  return userData;
};
