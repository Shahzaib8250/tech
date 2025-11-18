-- TECNO Tribe Survey Database Schema
-- Run this script in your PostgreSQL database to create the survey_responses table

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

-- Create index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_survey_responses_created_at ON survey_responses(created_at);

-- Create index on contact_number for lookups (if needed)
CREATE INDEX IF NOT EXISTS idx_survey_responses_contact_number ON survey_responses(contact_number);

