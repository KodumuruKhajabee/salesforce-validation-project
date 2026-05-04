# Salesforce Validation Manager
### CloudVandana Solutions — Assignment Project

A React web app that connects to Salesforce, fetches Validation Rules on the Account object, lets you toggle them Active/Inactive, and deploys changes back via the Tooling API.

---

## Tech Stack
- **React 18** + Vite
- **Salesforce OAuth 2.0** (Implicit Flow)
- **Salesforce Tooling API** (v59.0)

---

## Setup Guide (Step by Step)

### Step 1 — Create Salesforce Developer Org
1. Go to: https://developer.salesforce.com/signup
2. Fill form → verify email → login

### Step 2 — Create a Connected App in Salesforce
1. Go to **Setup** (gear icon) → search **App Manager**
2. Click **New Connected App**
3. Fill in:
   - **Connected App Name**: Validation Manager
   - **API Name**: Validation_Manager
   - **Contact Email**: your email
4. Under **OAuth Settings**:
   - ✅ Enable OAuth Settings
   - **Callback URL**: `http://localhost:5173`
   - **Selected Scopes**: Add `Access and manage your data (api)`
5. Click **Save** → wait 2–10 mins for it to activate
6. Go back → click **Manage Consumer Details** → copy **Consumer Key** (= Client ID)

### Step 3 — Create Validation Rules on Account Object
1. Go to **Setup** → **Object Manager** → **Account**
2. Click **Validation Rules** → **New**
3. Create 4–5 rules. Examples:

**Rule 1 — Phone Required**
- Name: `Phone_Required`
- Error Condition Formula: `ISBLANK(Phone)`
- Error Message: "Phone number is required"

**Rule 2 — Valid Email Format**
- Name: `Valid_Email_Format`
- Error Condition Formula: `NOT(REGEX(Email, "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}"))`
- Error Message: "Enter a valid email address"

**Rule 3 — Account Name Min Length**
- Name: `Account_Name_Min_Length`
- Error Condition Formula: `LEN(Name) < 3`
- Error Message: "Account name must be at least 3 characters"

**Rule 4 — Website URL Format**
- Name: `Website_URL_Format`
- Error Condition Formula: `NOT(ISBLANK(Website)) && NOT(BEGINS(Website, "http"))`
- Error Message: "Website must start with http or https"

**Rule 5 — Annual Revenue Positive**
- Name: `Annual_Revenue_Positive`
- Error Condition Formula: `NOT(ISBLANK(AnnualRevenue)) && AnnualRevenue < 0`
- Error Message: "Annual Revenue cannot be negative"

### Step 4 — Run the React App

```bash
# Clone / copy project folder
cd salesforce-validation-manager

# Install dependencies
npm install

# Copy env file and fill in your Client ID
cp .env.example .env
# Edit .env → set VITE_SF_CLIENT_ID=your_consumer_key

# Start dev server
npm run dev

# Open http://localhost:5173
```

### Step 5 — Login & Test
1. Open http://localhost:5173
2. Click **Login with Salesforce**
3. You'll be redirected to Salesforce login → login with your Dev Org credentials
4. App loads → shows all Account validation rules
5. Toggle ON/OFF → click **Deploy Changes** → confirm

---

## Project Structure
```
src/
├── pages/
│   ├── LoginPage.jsx       # OAuth login screen
│   └── DashboardPage.jsx   # Main dashboard
├── components/
│   ├── RuleCard.jsx        # Individual rule card with toggle
│   ├── DeployModal.jsx     # Deploy confirmation modal
│   └── Toast.jsx           # Success/error notifications
├── services/
│   ├── auth.js             # OAuth flow + token storage
│   └── salesforce.js       # Tooling API calls
└── App.jsx                 # Root component + auth routing
```

---

## API Used
- `GET /services/data/v59.0/tooling/query?q=SELECT...` — Fetch validation rules
- `PATCH /services/data/v59.0/tooling/sobjects/ValidationRule/{Id}` — Toggle active/inactive

---

## Notes
- Uses **OAuth 2.0 Implicit Flow** (no backend server needed)
- Token is stored in `localStorage` (cleared on logout)
- Only changes made via toggles are deployed — unchanged rules are left as-is
- Works with both Production (`login.salesforce.com`) and Sandbox (`test.salesforce.com`)
