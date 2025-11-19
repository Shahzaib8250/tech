# Database Setup Guide

This guide explains how to set up the PostgreSQL database connection for the TECNO Tribe Survey application.

## Prerequisites

1. PostgreSQL database (Neon, Supabase, or any PostgreSQL provider)
2. Database connection URL

## Setup Steps

### 1. Environment Variables

The `.env` file has been created with your database connection URL. The connection string is configured as:

```
DATABASE_URL=postgresql://neondb_owner:npg_j0Iyaf8ltPwC@ep-nameless-unit-a4ywv0ih-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

✅ **The `.env` file is already configured with your connection string and ready for local development.**

### 2. Netlify Environment Variables

**⚠️ IMPORTANT: For production deployment on Netlify, you MUST set the environment variable in the Netlify dashboard.**

1. Go to your Netlify site dashboard (https://app.netlify.com)
2. Navigate to **Site settings** → **Environment variables**
3. Add a new variable:
   - **Key**: `DATABASE_URL`
   - **Value**: `postgresql://neondb_owner:npg_j0Iyaf8ltPwC@ep-nameless-unit-a4ywv0ih-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
   - **Scopes**: Select **All scopes** (or at least **Production** and **Deploy previews**)
4. **IMPORTANT**: After adding/updating the environment variable, you must **redeploy your site** for the changes to take effect.

### 3. Database Table Creation

The database table will be created **automatically** when the first survey is submitted. The `submit-survey.js` function includes code to ensure the table exists before inserting data.

If you want to create it manually, you can:

1. Connect to your Neon database using their web console
2. Execute the SQL script from `database-schema.sql`
3. Or use a PostgreSQL client with the connection string:
   ```bash
   psql "postgresql://neondb_owner:npg_j0Iyaf8ltPwC@ep-nameless-unit-a4ywv0ih-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" -f database-schema.sql
   ```

### 4. Testing the Connection

To test the database connection:

1. Start your development server: `npm start`
2. Complete a survey submission
3. Check the browser console for success messages
4. Verify data in your PostgreSQL database

## Data Storage

All survey data from all pages is stored in the `survey_responses` table, including:

- **Basic Information**: Gender, Age, Province
- **Social Media Habits**: Platforms, time spent, tech content following, update sources
- **Mobile Phone Usage**: Current brand, top functions, change frequency, TECNO experience
- **Phone Preferences**: Features ranking, budget, preferred colors
- **Feature Ratings**: All 8 feature ratings (1-5 stars)
- **Ambassador Program**: Interest, strengths, benefits, contact info
- **Contact Information**: Contact number
- **Suggestions**: Optional feedback

## Database Schema

The table includes:
- `id`: Auto-incrementing primary key
- `created_at`: Timestamp of submission
- All survey fields as defined in the forms
- JSONB fields for arrays (platforms, functions, colors, etc.)
- TEXT fields for "Other" options and free text

## Troubleshooting

### Connection Issues

If you encounter connection errors:

1. Verify your `DATABASE_URL` is correct
2. Check that your database allows connections from Netlify's IP ranges
3. Ensure SSL is properly configured (required for Neon)
4. Check Netlify function logs in the dashboard

### Missing Data

If data isn't being saved:

1. Check browser console for errors
2. Check Netlify function logs
3. Verify the table exists in your database
4. Ensure all required fields are filled in the survey

## Security Notes

- Never commit the `.env` file to version control
- Use Netlify environment variables for production
- The `.env` file is already in `.gitignore`
- Database credentials should be kept secure

