const { Pool } = require('pg');

// Initialize PostgreSQL connection pool
let pool;

const getPool = () => {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    console.log('🔌 Connecting to database...');
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000
    });
    
    // Handle pool errors
    pool.on('error', (err) => {
      console.error('❌ Unexpected error on idle client', err);
    });
  }
  return pool;
};

// Create table if it doesn't exist
const ensureTableExists = async () => {
  const pool = getPool();
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS survey_responses (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      
      -- Basic Information
      gender VARCHAR(50),
      age VARCHAR(50),
      province VARCHAR(100),
      
      -- Social Media Habits
      social_media_platforms JSONB,
      social_media_platforms_other TEXT,
      time_spent_on_social_media VARCHAR(50),
      follows_tech_content VARCHAR(50),
      tech_update_sources JSONB,
      tech_update_sources_other TEXT,
      
      -- Mobile Phone Usage
      current_phone_brand VARCHAR(100),
      current_phone_brand_other TEXT,
      top_phone_functions JSONB,
      top_phone_functions_other TEXT,
      phone_change_frequency VARCHAR(50),
      tecno_experience VARCHAR(50),
      tecno_experience_rating VARCHAR(50),
      
      -- Phone Preferences
      phone_features_ranking JSONB,
      phone_budget VARCHAR(50),
      preferred_phone_colors JSONB,
      preferred_phone_colors_secondary JSONB,
      
      -- Feature Ratings
      feature_ratings JSONB,
      
      -- TECNO Campus Brand Ambassador Program
      interested_in_ambassador VARCHAR(10),
      ambassador_strengths JSONB,
      ambassador_strengths_other TEXT,
      ambassador_benefits JSONB,
      ambassador_benefits_other TEXT,
      name VARCHAR(255),
      contact_number VARCHAR(50),
      social_media_link TEXT,
      follower_count VARCHAR(50),
      
      -- Suggestions
      suggestions TEXT
    );
  `;
  
  try {
    await pool.query(createTableQuery);
    console.log('✅ Survey responses table ensured');
  } catch (error) {
    console.error('❌ Error creating table:', error);
    throw error;
  }
};

exports.handler = async (event, context) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        success: false, 
        error: 'Method not allowed. Only POST requests are accepted.' 
      })
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // Ensure table exists
    await ensureTableExists();

    // Parse request body
    let surveyData;
    try {
      surveyData = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (parseError) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Invalid JSON in request body',
          details: parseError.message
        })
      };
    }

    // Validate required fields
    const requiredFields = [
      'gender', 
      'age', 
      'province', 
      'socialMediaPlatforms', 
      'timeSpentOnSocialMedia',
      'followsTechContent', 
      'techUpdateSources', 
      'currentPhoneBrand', 
      'topPhoneFunctions',
      'phoneChangeFrequency', 
      'tecnoExperience', 
      'phoneBudget', 
      'preferredPhoneColors',
      'featureRatings'
    ];

    const missingFields = requiredFields.filter(field => {
      if (field === 'socialMediaPlatforms' || field === 'techUpdateSources' || 
          field === 'topPhoneFunctions' || field === 'preferredPhoneColors') {
        const value = surveyData[field];
        return !value || (Array.isArray(value) && value.length === 0);
      }
      if (field === 'featureRatings') {
        const ratings = surveyData[field] || {};
        const requiredFeatures = [
          'intelligentCamera', 'longBattery', 'fastCharging', 'slimDesign',
          'durable', 'highDisplay', 'highPerformance', 'aiFeatures'
        ];
        return !requiredFeatures.every(f => 
          ratings[f] && ratings[f] >= 1 && ratings[f] <= 5
        );
      }
      return !surveyData[field];
    });

    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Validation failed',
          details: {
            missingFields,
            message: `Missing required fields: ${missingFields.join(', ')}`
          }
        })
      };
    }

    // Get database connection pool
    const pool = getPool();

    // Insert survey data into database
    const insertQuery = `
      INSERT INTO survey_responses (
        gender, age, province,
        social_media_platforms, social_media_platforms_other,
        time_spent_on_social_media, follows_tech_content,
        tech_update_sources, tech_update_sources_other,
        current_phone_brand, current_phone_brand_other,
        top_phone_functions, top_phone_functions_other,
        phone_change_frequency, tecno_experience, tecno_experience_rating,
        phone_features_ranking, phone_budget,
        preferred_phone_colors, preferred_phone_colors_secondary,
        feature_ratings,
        interested_in_ambassador,
        ambassador_strengths, ambassador_strengths_other,
        ambassador_benefits, ambassador_benefits_other,
        name, contact_number, social_media_link, follower_count,
        suggestions
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
        $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32
      ) RETURNING id, created_at;
    `;

    const values = [
      // Basic Information
      surveyData.gender || null,
      surveyData.age || null,
      surveyData.province || null,
      
      // Social Media Habits
      JSON.stringify(surveyData.socialMediaPlatforms || []),
      surveyData.socialMediaPlatformsOther || null,
      surveyData.timeSpentOnSocialMedia || null,
      surveyData.followsTechContent || null,
      JSON.stringify(surveyData.techUpdateSources || []),
      surveyData.techUpdateSourcesOther || null,
      
      // Mobile Phone Usage
      surveyData.currentPhoneBrand || null,
      surveyData.currentPhoneBrandOther || null,
      JSON.stringify(surveyData.topPhoneFunctions || []),
      surveyData.topPhoneFunctionsOther || null,
      surveyData.phoneChangeFrequency || null,
      surveyData.tecnoExperience || null,
      surveyData.tecnoExperienceRating || null,
      
      // Phone Preferences
      JSON.stringify(surveyData.phoneFeaturesRanking || []),
      surveyData.phoneBudget || null,
      JSON.stringify(surveyData.preferredPhoneColors || []),
      JSON.stringify(surveyData.preferredPhoneColorsSecondary || []),
      
      // Feature Ratings
      JSON.stringify(surveyData.featureRatings || {}),
      
      // TECNO Campus Brand Ambassador Program
      surveyData.interestedInAmbassador || null,
      JSON.stringify(surveyData.ambassadorStrengths || []),
      surveyData.ambassadorStrengthsOther || null,
      JSON.stringify(surveyData.ambassadorBenefits || []),
      surveyData.ambassadorBenefitsOther || null,
      surveyData.name || null,
      surveyData.contactNumber || null,
      surveyData.socialMediaLink || null,
      surveyData.followerCount || null,
      
      // Suggestions
      surveyData.suggestions || null
    ];

    const result = await pool.query(insertQuery, values);
    const insertedId = result.rows[0].id;
    const createdAt = result.rows[0].created_at;

    console.log(`✅ Survey response saved to database with ID: ${insertedId}`);

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Survey submitted successfully and saved to database',
        data: {
          id: insertedId,
          timestamp: createdAt
        }
      })
    };

  } catch (error) {
    console.error('❌ Error submitting survey:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    });
    
    // Return detailed error for debugging
    const errorDetails = {
      success: false,
      error: 'Internal server error',
      message: error.message,
      ...(process.env.NODE_ENV === 'development' || !process.env.NETLIFY ? {
        stack: error.stack,
        code: error.code,
        databaseUrlSet: !!process.env.DATABASE_URL
      } : {})
    };
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(errorDetails)
    };
  }
};

