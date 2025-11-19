# Local Development Guide

## ⚠️ Important: Running the App Locally

To run the app with **Netlify Functions** (required for database connectivity), you need to use `netlify dev` instead of `npm start`.

## Setup

### 1. Install Netlify CLI

```bash
npm install --save-dev netlify-cli
```

Or install globally:
```bash
npm install -g netlify-cli
```

### 2. Run Local Development Server

**Use this command:**
```bash
npm run dev
```

**Or directly:**
```bash
netlify dev
```

This will:
- ✅ Start your React app on `http://localhost:8888` (or similar)
- ✅ Run Netlify Functions locally at `/.netlify/functions/submit-survey`
- ✅ Load environment variables from `.env` file
- ✅ Enable hot reloading for both frontend and functions

### 3. Alternative: Use React Dev Server (Functions won't work)

If you only need to work on the frontend without database functionality:
```bash
npm start
```
⚠️ **Note**: This will show 404 errors when submitting forms because Netlify Functions are not available.

## Environment Variables

Make sure your `.env` file is in the root directory:
```
DATABASE_URL=postgresql://neondb_owner:npg_j0Iyaf8ltPwC@ep-nameless-unit-a4ywv0ih-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## Troubleshooting

### Port Already in Use

If port 8888 is already in use, Netlify will automatically use the next available port (8889, 8890, etc.). Check the terminal output for the actual port number.

### Functions Not Loading

1. Make sure you're using `npm run dev` or `netlify dev`
2. Check that `netlify/functions/submit-survey.js` exists
3. Verify `netlify.toml` has the correct `functions` path
4. Check terminal for any function loading errors

### Database Connection Issues

1. Verify `.env` file exists and has the correct `DATABASE_URL`
2. Check that your Neon database is accessible
3. Look at the terminal logs when submitting a form for detailed error messages

## Production vs Development

- **Development**: Use `npm run dev` → Functions available at `/.netlify/functions/submit-survey`
- **Production**: Deployed to Netlify → Functions automatically available

