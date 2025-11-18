# Troubleshooting Guide

## "Internal server error" when submitting survey

If you're seeing an "Internal server error" when submitting the survey, check the following:

### 1. Check Netlify Environment Variables

**For Production (Netlify):**

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Make sure `DATABASE_URL` is set with your complete connection string:
   ```
   postgresql://neondb_owner:npg_j0Iyaf8ltPwC@ep-nameless-unit-a4ywv0ih-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```
4. **Important**: After adding/updating environment variables, you need to **redeploy** your site

### 2. Check Netlify Function Logs

1. Go to Netlify Dashboard → Your Site → **Functions** tab
2. Click on `submit-survey`
3. Check the **Logs** section for detailed error messages
4. Look for errors like:
   - "DATABASE_URL environment variable is not set"
   - Database connection errors
   - SQL syntax errors

### 3. Verify Database Connection

Test your database connection using the connection string:

```bash
# If you have psql installed
psql "postgresql://neondb_owner:npg_j0Iyaf8ltPwC@ep-nameless-unit-a4ywv0ih-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### 4. Common Issues and Solutions

#### Issue: "DATABASE_URL is not set"
**Solution**: Add the environment variable in Netlify dashboard and redeploy

#### Issue: "Cannot find module 'pg'"
**Solution**: 
- The `pg` package should be in your root `package.json` (already installed)
- If still failing, try installing it in the functions directory:
  ```bash
  cd netlify/functions
  npm install pg
  ```

#### Issue: Database connection timeout
**Solution**: 
- Check if your Neon database allows connections from Netlify's IP ranges
- Verify the connection string is correct
- Check if SSL is properly configured

#### Issue: Table doesn't exist
**Solution**: 
- The table should be created automatically on first submission
- If it fails, manually run the SQL script in `database-schema.sql`

### 5. Testing Locally

To test Netlify functions locally, you need Netlify CLI:

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Start local dev server with functions
netlify dev
```

This will:
- Start your React app on `http://localhost:8888`
- Run Netlify functions locally
- Use environment variables from `.env` file

### 6. Check Browser Console

Open browser DevTools (F12) and check:
- **Console tab**: For JavaScript errors
- **Network tab**: 
  - Look for the request to `/.netlify/functions/submit-survey`
  - Check the response status and body
  - Look for detailed error messages

### 7. Enable Detailed Error Messages

The function now returns detailed error messages in development mode. Check the response in the Network tab to see:
- Error message
- Error code
- Stack trace (in development)
- Whether DATABASE_URL is set

### 8. Redeploy After Changes

**Important**: After making any changes to:
- Environment variables
- Function code
- `netlify.toml`

You must **redeploy** your site for changes to take effect.

### 9. Verify Function is Deployed

1. Go to Netlify Dashboard → Your Site → **Functions**
2. You should see `submit-survey` listed
3. If not, make sure:
   - The file exists at `netlify/functions/submit-survey.js`
   - `netlify.toml` is configured correctly
   - The site has been deployed

### 10. Database Table Creation

The table is created automatically, but if you want to create it manually:

1. Connect to your database
2. Run the SQL in `database-schema.sql`
3. Or use the connection string:
   ```bash
   psql "YOUR_CONNECTION_STRING" -f database-schema.sql
   ```

## Still Having Issues?

1. Check Netlify function logs (most important!)
2. Verify environment variables are set correctly
3. Test database connection separately
4. Check that all dependencies are installed
5. Ensure the function file is in the correct location: `netlify/functions/submit-survey.js`

