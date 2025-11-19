# How to Check if Function is Working

## Step 1: Verify Function is Deployed

1. Go to **Netlify Dashboard** → Your Site
2. Click on **Functions** tab
3. You should see `submit-survey` listed
4. If you don't see it, the function isn't deployed

## Step 2: Check Function Logs

1. In Netlify Dashboard → Functions → `submit-survey`
2. Click on the function name
3. Go to **Logs** tab
4. Try submitting the form
5. You should see logs like:
   ```
   🚀 Function invoked
   📋 Event method: POST
   📋 DATABASE_URL set: true/false
   ```

## Step 3: Test Function Directly

You can test the function directly using curl or Postman:

```bash
curl -X POST https://tecnotribe.site/.netlify/functions/submit-survey \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

Or use the test function:
```bash
curl https://tecnotribe.site/.netlify/functions/test
```

## Step 4: Check Browser Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Submit the form
4. Look for request to `/.netlify/functions/submit-survey`
5. Check:
   - **Status**: Should be 200, 400, 500, etc.
   - **Response**: Click on it to see the actual error

## Step 5: Common Issues

### Function Not Found (404)
- Function isn't deployed
- Wrong path in code
- Need to redeploy

### No Logs Appearing
- Function might not be getting called
- Check Network tab to see if request is being made
- Verify the URL is correct: `/.netlify/functions/submit-survey`

### Function Error Before Logging
- Syntax error in function
- Missing dependencies
- Check Netlify build logs

## What to Share

If still having issues, share:
1. Screenshot of Netlify Functions page (showing if function exists)
2. Screenshot of Function Logs (even if empty)
3. Screenshot of Browser Network tab (showing the request)
4. The response body from Network tab


