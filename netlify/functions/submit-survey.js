const { Pool } = require('pg');

// Initialize PostgreSQL connection pool
let pool;

const getPool = () => {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    console.log('🔌 Connecting to database...');
    console.log('📋 Connection string format:', process.env.DATABASE_URL ? 'Valid' : 'Missing');
    
    // Parse connection string to ensure proper SSL configuration for Neon
    const connectionString = process.env.DATABASE_URL;
    
    pool = new Pool({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false,
        require: true
      },
      connectionTimeoutMillis: 15000, // Increased timeout for Neon
      idleTimeoutMillis: 30000,
      max: 20, // Maximum pool size
      allowExitOnIdle: true
    });
    
    // Handle pool errors
    pool.on('error', (err) => {
      console.error('❌ Unexpected error on idle client', err);
      console.error('❌ Error code:', err.code);
      console.error('❌ Error message:', err.message);
      // Reset pool on error to allow reconnection
      pool = null;
    });
    
    // Test connection
    pool.query('SELECT NOW()', (err, result) => {
      if (err) {
        console.error('❌ Database connection test failed:', err);
      } else {
        console.log('✅ Database connection test successful');
      }
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
  // Log function invocation
  console.log('🚀 Function invoked');
  console.log('📋 Event method:', event.httpMethod);
  console.log('📋 Event path:', event.path);
  console.log('📋 Event body type:', typeof event.body);
  console.log('📋 DATABASE_URL set:', !!process.env.DATABASE_URL);
  
  // Only accept POST requests
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'OPTIONS') {
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
    console.log('✅ Starting survey submission process');
    
    // Ensure table exists
    console.log('📊 Ensuring table exists...');
    await ensureTableExists();
    console.log('✅ Table check complete');

    // Parse request body
    console.log('📦 Parsing request body...');
    let surveyData;
    try {
      surveyData = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      console.log('✅ Body parsed successfully');
      console.log('📊 Survey data keys:', Object.keys(surveyData || {}));
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
    console.log('🔌 Getting database connection pool...');
    const pool = getPool();
    console.log('✅ Pool obtained');

    // Insert survey data into database
    console.log('💾 Preparing database insert...');
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
        $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31
      ) RETURNING id, created_at;
    `;

    const values = [
      // Basic Information
      surveyData.gender || null,
      surveyData.age || null,
      surveyData.province || null,
      
      // Social Media Habits
      Array.isArray(surveyData.socialMediaPlatforms) ? JSON.stringify(surveyData.socialMediaPlatforms) : JSON.stringify([]),
      (surveyData.socialMediaPlatformsOther && surveyData.socialMediaPlatformsOther.trim()) ? surveyData.socialMediaPlatformsOther.trim() : null,
      surveyData.timeSpentOnSocialMedia || null,
      surveyData.followsTechContent || null,
      Array.isArray(surveyData.techUpdateSources) ? JSON.stringify(surveyData.techUpdateSources) : JSON.stringify([]),
      (surveyData.techUpdateSourcesOther && surveyData.techUpdateSourcesOther.trim()) ? surveyData.techUpdateSourcesOther.trim() : null,
      
      // Mobile Phone Usage
      surveyData.currentPhoneBrand || null,
      (surveyData.currentPhoneBrandOther && surveyData.currentPhoneBrandOther.trim()) ? surveyData.currentPhoneBrandOther.trim() : null,
      Array.isArray(surveyData.topPhoneFunctions) ? JSON.stringify(surveyData.topPhoneFunctions) : JSON.stringify([]),
      (surveyData.topPhoneFunctionsOther && surveyData.topPhoneFunctionsOther.trim()) ? surveyData.topPhoneFunctionsOther.trim() : null,
      surveyData.phoneChangeFrequency || null,
      surveyData.tecnoExperience || null,
      surveyData.tecnoExperienceRating || null,
      
      // Phone Preferences
      Array.isArray(surveyData.phoneFeaturesRanking) ? JSON.stringify(surveyData.phoneFeaturesRanking) : 
        (typeof surveyData.phoneFeaturesRanking === 'object' && surveyData.phoneFeaturesRanking !== null) ? 
          JSON.stringify(surveyData.phoneFeaturesRanking) : JSON.stringify([]),
      surveyData.phoneBudget || null,
      Array.isArray(surveyData.preferredPhoneColors) ? JSON.stringify(surveyData.preferredPhoneColors) : JSON.stringify([]),
      Array.isArray(surveyData.preferredPhoneColorsSecondary) ? JSON.stringify(surveyData.preferredPhoneColorsSecondary) : JSON.stringify([]),
      
      // Feature Ratings
      (typeof surveyData.featureRatings === 'object' && surveyData.featureRatings !== null) ? 
        JSON.stringify(surveyData.featureRatings) : JSON.stringify({}),
      
      // TECNO Campus Brand Ambassador Program
      surveyData.interestedInAmbassador || null,
      Array.isArray(surveyData.ambassadorStrengths) ? JSON.stringify(surveyData.ambassadorStrengths) : JSON.stringify([]),
      (surveyData.ambassadorStrengthsOther && surveyData.ambassadorStrengthsOther.trim()) ? surveyData.ambassadorStrengthsOther.trim() : null,
      Array.isArray(surveyData.ambassadorBenefits) ? JSON.stringify(surveyData.ambassadorBenefits) : JSON.stringify([]),
      (surveyData.ambassadorBenefitsOther && surveyData.ambassadorBenefitsOther.trim()) ? surveyData.ambassadorBenefitsOther.trim() : null,
      (surveyData.name && surveyData.name.trim()) ? surveyData.name.trim() : null,
      (surveyData.contactNumber && surveyData.contactNumber.trim()) ? surveyData.contactNumber.trim() : null,
      (surveyData.socialMediaLink && surveyData.socialMediaLink.trim()) ? surveyData.socialMediaLink.trim() : null,
      (surveyData.followerCount && surveyData.followerCount.trim()) ? surveyData.followerCount.trim() : null,
      
      // Suggestions
      (surveyData.suggestions && surveyData.suggestions.trim()) ? surveyData.suggestions.trim() : null
    ];

    console.log('📝 Executing database insert...');
    console.log('📊 Values to insert:', values.map((v, i) => {
      // Log value types and lengths for debugging
      if (typeof v === 'string' && v.length > 100) {
        return `$${i + 1}: [String, length: ${v.length}]`;
      }
      return `$${i + 1}: ${typeof v === 'object' ? JSON.stringify(v).substring(0, 100) : v}`;
    }));
    
    let result;
    try {
      result = await pool.query(insertQuery, values);
    } catch (queryError) {
      console.error('❌ Database query error:', queryError);
      console.error('❌ Query:', insertQuery);
      console.error('❌ Error code:', queryError.code);
      console.error('❌ Error detail:', queryError.detail);
      console.error('❌ Error hint:', queryError.hint);
      throw queryError;
    }
    
    if (!result || !result.rows || result.rows.length === 0) {
      throw new Error('Insert query did not return a result');
    }
    
    const insertedId = result.rows[0].id;
    const createdAt = result.rows[0].created_at;
    console.log('✅ Data inserted successfully, ID:', insertedId);
    console.log('✅ Created at:', createdAt);

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
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
      databaseUrl: process.env.DATABASE_URL ? 'Set (length: ' + process.env.DATABASE_URL.length + ')' : 'Not set'
    });
    
    // Check for specific database errors
    let errorMessage = 'Internal server error';
    let statusCode = 500;
    
    if (error.message && error.message.includes('DATABASE_URL')) {
      errorMessage = 'Database connection not configured. Please set DATABASE_URL environment variable.';
      statusCode = 500;
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      errorMessage = 'Unable to connect to database. Please check your connection string.';
      statusCode = 503;
    } else if (error.code === '23505') { // Unique violation
      errorMessage = 'This survey has already been submitted.';
      statusCode = 409;
    } else if (error.code === '42P01') { // Table doesn't exist
      errorMessage = 'Database table not found. Please ensure the table is created.';
      statusCode = 500;
    } else if (error.code === '23502') { // Not null violation
      errorMessage = 'Missing required fields. Please fill all required fields.';
      statusCode = 400;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // Return detailed error for debugging
    const errorDetails = {
      success: false,
      error: errorMessage,
      message: error.message,
      ...(process.env.NODE_ENV === 'development' || !process.env.NETLIFY ? {
        stack: error.stack,
        code: error.code,
        detail: error.detail,
        hint: error.hint,
        databaseUrlSet: !!process.env.DATABASE_URL
      } : {})
    };
    
    return {
      statusCode: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(errorDetails)
    };
  }
};

