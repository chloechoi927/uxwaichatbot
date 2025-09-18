export default async function handler(req, res) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { text, action, targetLanguage } = req.body;
    
    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
    if (!CLAUDE_API_KEY) {
      res.status(500).json({ 
        success: false, 
        error: 'CLAUDE_API_KEY not found' 
      });
      return;
    }

    // Simple test response
    let result;
    if (action === 'translate') {
      result = `Translated "${text}" to ${targetLanguage}`;
    } else if (action === 'suggest') {
      result = `Suggestions for "${text}": 1. Better text 2. Improved text 3. Refined text`;
    } else {
      result = `Processed: ${text}`;
    }

    res.status(200).json({
      success: true,
      result: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
