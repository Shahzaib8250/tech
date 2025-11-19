exports.handler = async (event, context) => {
  console.log('✅ Test function called!');
  console.log('Event:', JSON.stringify(event, null, 2));
  console.log('Environment variables:', {
    DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV,
    NETLIFY: process.env.NETLIFY
  });

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      success: true,
      message: 'Test function is working!',
      timestamp: new Date().toISOString(),
      databaseUrlSet: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV
    })
  };
};


