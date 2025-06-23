Okay, I can help you outline an integration plan for Square's Subscription API with your current `PricingPlan` structure.

**Understanding Your Current `PricingPlan` Structure:**

Your `PricingPlan` interface is quite comprehensive and includes:
*   Plan identifiers (`id`, `nameKey`).
*   Pricing for different currencies and billing cycles (`prices`, `priceMonthly`, `priceYearly`).
*   Support for displaying original (non-discounted) prices.
*   Features associated with each plan.
*   CTA information.
*   Current integration with Gumroad links.

**Square Subscription API Key Concepts to Leverage:**

1.  **Square Catalog:**
    *   **Items/Variations:** Your "Pro" or "Lite" plans can be modeled as Square Catalog Items.
    *   **Subscription Plans:** For each way a user can subscribe to an item (e.g., "Pro Monthly", "Pro Yearly"), you'll create a Subscription Plan in Square. Each Subscription Plan is tied to a specific item variation and defines:
        *   **Phases:** A plan has one or more phases. For simple recurring billing, you'll typically have one phase.
            *   **Cadence:** `MONTHLY` or `ANNUALLY` (corresponds to your `BillingCycle`).
            *   **Amount & Currency:** The price for that phase in a specific currency. Square plans are currency-specific.

2.  **Customers:** Subscribers need to be represented as Customers in Square.
3.  **Payment Methods:** Securely collected card details (or other payment methods Square supports) are associated with a Customer. The Square Web Payments SDK is essential for this.
4.  **Subscriptions:** This object links a Customer to a Subscription Plan, using a specific Payment Method.
5.  **Webhooks:** Crucial for receiving real-time updates about subscription events (payments, cancellations, failures) from Square to keep your application's state synchronized.

**Integration Strategy:**

Here's a step-by-step approach to integrate Square Subscriptions:

**Phase 1: Setup in Square & Backend Mapping**

1.  **Define Your Catalog in Square:**
    *   For each `PricingPlan` you offer (e.g., "Lite", "Pro"):
        *   Create a corresponding Catalog Item in your Square Dashboard (or via the Catalog API).
        *   For this item, create multiple **Subscription Plans** in Square:
            *   **One Square Plan for each Billing Cycle and Currency Combination:**
                *   Example for "Pro" plan:
                    *   `Pro - Monthly - USD`: Cadence `MONTHLY`, Price (e.g., `29.99 USD` from your `prices.USD`).
                    *   `Pro - Monthly - KRW`: Cadence `MONTHLY`, Price (e.g., `36683 KRW` from your `prices.KRW`).
                    *   `Pro - Yearly - USD`: Cadence `ANNUALLY`, Price (e.g., `(29.99 * 12 * 0.8)` USD or your `priceYearly` if it's the full annual amount).
                    *   `Pro - Yearly - KRW`: Cadence `ANNUALLY`, Price (e.g., `352160 KRW`).
            *   Repeat for the "Lite" plan and any other plans.
    *   **Note on Prices:**
        *   Your `priceYearly` seems to be the total annual amount. When creating the `ANNUALLY` cadence plan in Square, you'd set this full amount. Your frontend logic to display "Save 20%" and the effective monthly price for yearly plans would remain.
        *   The `originalPrices` can be used for display on your pricing page to show savings, but the Square Subscription Plan itself should be created with the *actual selling price*.

2.  **Store Square Plan IDs:**
    *   Each Subscription Plan created in Square will have a unique ID (e.g., `sq0subp-xxxxxxxx`).
    *   You'll need a robust way to map your application's plan identifiers (`PricingPlan.id`, `BillingCycle`, `currencyCode`) to these Square Plan IDs. This mapping can be stored in a configuration file or a database on your backend.
    *   Example Mapping:
        *   `{ plan: 'pro', cycle: 'monthly', currency: 'USD' } -> 'SQUARE_PLAN_ID_PRO_MONTHLY_USD'`
        *   `{ plan: 'pro', cycle: 'yearly', currency: 'USD' } -> 'SQUARE_PLAN_ID_PRO_YEARLY_USD'`

**Phase 2: Frontend Changes (Your `PricingPage.tsx` and related components)**

1.  **Integrate Square Web Payments SDK:**
    *   Replace the Gumroad link redirection with a flow that uses Square's Web Payments SDK.
    *   Add the Square JS library to your `index.html`.
    *   On your checkout/payment modal (which you might need to build if not just redirecting):
        *   Mount Square's secure card input fields.
        *   When the user submits payment details, the SDK will tokenize the card information into a secure, single-use `nonce`.

2.  **Modify CTA (`handlePlanCtaClick`):**
    *   When a user clicks the CTA for a paid plan:
        *   Collect user details if necessary (for creating a Square Customer).
        *   Initiate the Square Web Payments SDK flow to get the payment `nonce`.
        *   Once you have the `nonce` and the selected plan details (your internal plan ID, billing cycle, currency), send this information to a new backend endpoint.

**Phase 3: Backend API Endpoints (New)**

You'll need a backend service (e.g., a new set of Cloudflare Worker functions or a separate server) to interact securely with the Square API. **Never expose Square API secret keys on the frontend.**

1.  **Endpoint: `POST /api/create-subscription`**
    *   **Request Body:**
        ```json
        {
          "internalPlanId": "pro", // Your app's plan ID
          "billingCycle": "yearly",
          "currencyCode": "USD",
          "paymentNonce": "SQ_NONCE_FROM_FRONTEND",
          "customerDetails": { // For creating/updating Square Customer
            "emailAddress": "user@example.com",
            "givenName": "John", // Optional
            "familyName": "Doe"  // Optional
          },
          "userId": "YOUR_APP_USER_ID" // If you have an internal user ID
        }
        ```
    *   **Logic:**
        1.  **Map to Square Plan ID:** Use the `internalPlanId`, `billingCycle`, and `currencyCode` to look up the corresponding Square Subscription Plan ID from your mapping.
        2.  **Get or Create Square Customer:**
            *   Check if you have a `square_customer_id` stored for `userId`.
            *   If not, or if details need updating, call Square's `POST /v2/customers` endpoint to create/update a customer. Store the `square_customer_id`.
        3.  **Create Payment Source (Card):**
            *   Using the `square_customer_id` and the `paymentNonce`, call Square's `POST /v2/cards` (or the newer `POST /v2/customers/{customer_id}/cards`) to create a card on file for the customer. This returns a `card_id`. The nonce is single-use.
        4.  **Create Square Subscription:**
            *   Call Square's `POST /v2/subscriptions` endpoint with:
                *   `location_id` (your Square business location ID).
                *   `plan_id` (the mapped Square Subscription Plan ID).
                *   `customer_id` (the Square Customer ID).
                *   `card_id` (the ID of the card on file).
                *   Optionally, a `start_date`.
        5.  **Store Subscription Info:** In your database, link `userId` to the `square_subscription_id`, `square_customer_id`, and the active plan details.
        6.  **Return Success/Failure:** Respond to the frontend.

**Phase 4: Handling Webhooks (Backend)**

This is critical for keeping your app's subscription states up-to-date.

1.  **Create a Webhook Endpoint:** `POST /api/square-webhooks`
2.  **Configure in Square Developer Dashboard:** Point Square subscription webhooks (e.g., `subscription.created`, `subscription.updated`, `invoice.paid`, `invoice.payment_failed`, `subscription.cancelled`) to this endpoint.
3.  **Webhook Handler Logic:**
    *   **Verify Signature:** Crucial for security.
    *   **Process Event:** Based on the event type:
        *   `invoice.paid`: Confirm successful payment, ensure subscription is active in your system.
        *   `invoice.payment_failed`: Notify user, potentially restrict access to premium features if grace period expires.
        *   `subscription.cancelled`: Update user's status in your app.
        *   `subscription.updated`: Handle plan changes, status updates.
    *   **Idempotency:** Ensure your webhook handler can safely process the same event multiple times.

**Impact on Your `PricingPlan` Interface:**
*   The `gumroadLinkMonthly` and `gumroadLinkYearly` fields would become obsolete for Square integration.
*   You might add a new field like `squarePlanIdMappings: { [cycle: string]: { [currency: string]: string } }` directly to the `PricingPlan` if you want to keep this info close, or manage it entirely on the backend. The backend mapping is generally more secure and flexible.

**User Experience Flow:**

1.  User visits the pricing page.
2.  Selects a plan, billing cycle, and currency.
3.  Clicks CTA (e.g., "Go Pro").
4.  If not signed in, prompt for sign-in/sign-up.
5.  Presented with a payment modal/form powered by Square Web Payments SDK.
6.  User enters card details.
7.  Frontend gets a nonce from Square SDK.
8.  Frontend sends nonce + plan details + customer info to your backend (`/api/create-subscription`).
9.  Backend interacts with Square API to create customer, card, and subscription.
10. Backend updates your app's database with subscription status.
11. Frontend shows success/failure message. User gets access to premium features.

This plan provides a solid foundation for integrating Square Subscriptions. Remember to consult Square's official API documentation for the most up-to-date details and best practices.
