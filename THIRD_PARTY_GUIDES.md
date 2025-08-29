# Third-Party Service Setup Guides

This document contains setup guides for the third-party services used in this project.

---

## Google Calendar API (for Appointment Scheduling)

### Step 1: Create a Google Cloud Project
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a **"New Project"**.
3.  Name it (e.g., "Law-Site-Integration") and click **"Create"**.

### Step 2: Enable the Google Calendar API
1.  Search for "Google Calendar API" and select it.
2.  Click **"Enable"**.

### Step 3: Configure the OAuth Consent Screen
1.  Navigate to **"APIs & Services"** > **"OAuth consent screen"**.
2.  Choose **"External"** and click **"Create"**.
3.  Fill out the required app info (App name, support email).
4.  On the **"Scopes"** page, add the `https://www.googleapis.com/auth/calendar.events` scope.
5.  On the **"Test users"** page, add your own Google account email address.

### Step 4: Create Credentials
1.  Navigate to **"APIs & Services"** > **"Credentials"**.
2.  Click **"+ Create Credentials"** > **"OAuth client ID"**.
3.  Select **"Web application"**.
4.  Add `http://localhost:3000` to **"Authorized JavaScript origins"**.
5.  Add `http://localhost:3000/api/auth/google/callback` to **"Authorized redirect URIs"**.
6.  Click **"Create"**.

### Step 5: Store Your Credentials
1.  Copy your **Client ID** and **Client Secret**.
2.  Add them to your `app/.env.local` file:
    ```
    GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
    GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
    ```

---

## SendGrid API (for Email Notifications)

### Step 1: Create a SendGrid Account
1.  Sign up for an account at [SendGrid](https://signup.sendgrid.com/).

### Step 2: Verify a Sender
1.  Go to **Settings** > **Sender Authentication**.
2.  Complete the **"Single Sender Verification"** process. You will need to click a link in a verification email.

### Step 3: Create an API Key
1.  Go to **Settings** > **API Keys**.
2.  Click **"Create API Key"**.
3.  Give it a name and choose **"Full Access"**.
4.  Click **"Create & View"**.

### Step 4: Store Your API Key
1.  **Important:** Copy the API key immediately, as SendGrid will only show it to you once.
2.  Add the key and your verified sender email to your `app/.env.local` file:
    ```
    SENDGRID_API_KEY=YOUR_API_KEY_HERE
    SENDER_EMAIL=your-verified-email@example.com
    ```

---

## Twilio API (for SMS/WhatsApp Notifications)

### Step 1: Create a Twilio Account
1.  Sign up for an account at [Twilio](https://www.twilio.com/try-twilio).

### Step 2: Get a Twilio Phone Number
1.  Go to your Twilio Console and click on **"Phone Numbers"**.
2.  Click **"Buy a Number"** and choose a number with SMS or WhatsApp capabilities.

### Step 3: Find Your Credentials
1.  In your Twilio Console, you will find your **Account SID** and **Auth Token** on the dashboard.

### Step 4: Store Your Credentials
1.  Add your Account SID, Auth Token, and Twilio phone number to your `app/.env.local` file:
    ```
    TWILIO_ACCOUNT_SID=YOUR_ACCOUNT_SID_HERE
    TWILIO_AUTH_TOKEN=YOUR_AUTH_TOKEN_HERE
    TWILIO_PHONE_NUMBER=YOUR_TWILIO_PHONE_NUMBER_HERE
    ```