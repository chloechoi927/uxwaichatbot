export default async function handler(req, res) {
  // CORS 설정
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
    
    // 환경변수 확인
    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
    if (!CLAUDE_API_KEY) {
      res.status(500).json({ 
        success: false, 
        error: 'CLAUDE_API_KEY not found' 
      });
      return;
    }

    // 간단한 응답 (Claude API 없이 테스트)
    let result;
    if (action === 'translate') {
      result = `[TEST] Translated "${text}" to ${targetLanguage}`;
    } else if (action === 'suggest') {
      result = `[TEST] Suggestions for "${text}": 1. Better text 2. Improved text 3. Refined text`;
    } else {
      result = `[TEST] Processed: ${text}`;
    }

    res.status(200).json({
      success: true,
      result: result
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
