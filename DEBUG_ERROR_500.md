# Debugging 500 Error - Step by Step Guide

## 🔍 What to Check Right Now

### Step 1: Check Browser Console (Most Important!)

Open your browser's Developer Tools (F12) and look at the **Console** tab. You should now see detailed error information:

1. **Look for these logs:**
   ```
   ❌ Survey submission error: [error object]
   ❌ Error details: { ... }
   ❌ Server error response: { ... }
   ```

2. **Check for this specific message:**
   ```
   ⚠️ DATABASE_URL is NOT SET
   ```
   If you see this, the environment variable is missing in Netlify.

3. **Look at the "fullError" object** - it will show:
   - The actual error message from the server
   - Whether DATABASE_URL is set
   - Any stack traces (in development mode)

### Step 2: Check Network Tab

1. Open **Network** tab in DevTools
2. Find the request to `/.netlify/functions/submit-survey`
3. Click on it
4. Go to **Response** tab
5. You should see the actual error response from the server

The response should look like:
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "[actual error message]",
  "databaseUrlSet": false  // or true
}
```

### Step 3: Check Netlify Function Logs

1. Go to **Netlify Dashboard** → Your Site
2. Click on **Functions** tab
3. Click on `submit-survey`
4. Check the **Logs** section

Look for:
- `🔌 Connecting to database...` - means it's trying to connect
- `❌ Error submitting survey:` - shows the actual error
- `DATABASE_URL environment variable is not set` - confirms the issue

### Step 4: Verify Environment Variable

1. Go to **Netlify Dashboard** → Your Site → **Site settings**
2. Click **Environment variables**
3. Verify `DATABASE_URL` exists and has the correct value
4. **Important**: Make sure it's set for **Production** scope (or All scopes)

### Step 5: Redeploy After Setting Environment Variable

**CRITICAL**: After adding/updating `DATABASE_URL`:
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for deployment to complete
4. Try submitting again

## 🐛 Common Issues and Solutions

### Issue 1: "DATABASE_URL is NOT SET"

**Solution:**
1. Add `DATABASE_URL` in Netlify environment variables
2. Value: `postgresql://neondb_owner:npg_j0Iyaf8ltPwC@ep-nameless-unit-a4ywv0ih-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
3. Redeploy the site

### Issue 2: "Cannot find module 'pg'"

**Solution:**
The `pg` package should be in your root `package.json` (it is). If still failing:
1. Make sure `package.json` includes `"pg": "^8.16.3"`
2. Redeploy the site
3. Check Netlify build logs to ensure dependencies are installed

### Issue 3: Database Connection Timeout

**Solution:**
1. Verify the connection string is correct
2. Check if Neon database allows connections from Netlify
3. Verify SSL settings are correct

### Issue 4: Function Not Found (404)

**Solution:**
1. Verify `netlify/functions/submit-survey.js` exists
2. Check `netlify.toml` is configured correctly
3. Redeploy the site

## 📋 Quick Checklist

- [ ] Checked browser console for detailed error logs
- [ ] Checked Network tab for server response
- [ ] Checked Netlify function logs
- [ ] Verified `DATABASE_URL` is set in Netlify
- [ ] Redeployed site after setting environment variable
- [ ] Verified function exists at `netlify/functions/submit-survey.js`

## 🆘 Still Not Working?

1. **Copy the full error from browser console** (the "fullError" object)
2. **Copy the error from Netlify function logs**
3. **Share both** so we can identify the exact issue

The improved error handling will now show you exactly what's wrong!

