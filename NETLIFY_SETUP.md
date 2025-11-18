# Netlify Setup Guide - Fix "Internal Server Error"

## ⚠️ CRITICAL: Set Environment Variable in Netlify

The `.env` file only works for local development. For your deployed site on Netlify, you **must** set the environment variable in the Netlify dashboard.

### Step-by-Step Instructions:

1. **Go to Netlify Dashboard**
   - Visit https://app.netlify.com
   - Log in to your account
   - Select your site (tecnotribe.site)

2. **Navigate to Environment Variables**
   - Click on **Site settings** (in the top menu)
   - Click on **Environment variables** (in the left sidebar)

3. **Add DATABASE_URL**
   - Click **Add a variable** button
   - **Key**: `DATABASE_URL`
   - **Value**: 
     ```
     postgresql://neondb_owner:npg_j0Iyaf8ltPwC@ep-nameless-unit-a4ywv0ih-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
     ```
   - **Scopes**: Select **All scopes** (or at least **Production** and **Deploy previews**)
   - Click **Save**

4. **Redeploy Your Site**
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**
   - OR push a new commit to trigger automatic deployment
   - **Important**: Environment variable changes require a redeploy to take effect!

### Verify It's Working:

1. After redeploy, try submitting a survey again
2. If still getting errors, check the function logs:
   - Go to **Functions** tab
   - Click on `submit-survey`
   - Check the **Logs** section for detailed error messages

## Alternative: Quick Test

You can also test if the environment variable is set by checking the function logs. The improved error handling will now show:
- Whether DATABASE_URL is set
- The actual error message
- More debugging information

## Common Mistakes:

❌ **Only setting .env file** - This doesn't work for deployed sites  
❌ **Not redeploying after adding env var** - Changes require redeploy  
❌ **Setting wrong scope** - Make sure it's available for production builds  
❌ **Typo in variable name** - Must be exactly `DATABASE_URL` (case-sensitive)

## Still Not Working?

1. Check **Functions** → **Logs** for detailed error messages
2. Verify the connection string is correct (no extra spaces, correct password)
3. Test database connection separately using psql or a database client
4. Make sure the `pg` package is installed (check `package.json`)

