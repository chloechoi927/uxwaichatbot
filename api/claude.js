// UX Writing Assistant API - Claude Integration
// Handles text analysis, translation, and UX writing suggestions

const SUPPORTED_LANGUAGES = {
  'en': 'English',
  'ko': 'Korean',
  'ja': 'Japanese',
  'zh-cn': 'Chinese (Simplified)',
  'zh-tw': 'Chinese (Traditional)',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'th': 'Thai',
  'vi': 'Vietnamese'
};

const UX_WRITING_RULES = {
  tone: {
    friendly: ['warm', 'approachable', 'conversational', 'helpful'],
    professional: ['clear', 'concise', 'authoritative', 'precise'],
    casual: ['relaxed', 'informal', 'friendly', 'easy-going'],
    urgent: ['direct', 'action-oriented', 'immediate', 'clear']
  },
  length: {
    button: { max: 20, optimal: 12 },
    label: { max: 30, optimal: 20 },
    description: { max: 100, optimal: 60 },
    error: { max: 80, optimal: 50 },
    success: { max: 60, optimal: 40 }
  },
  violations: {
    jargon: 'Avoid technical jargon and use plain language',
    passive: 'Use active voice instead of passive voice',
    negative: 'Use positive language when possible',
    unclear: 'Be specific and clear in your instructions',
    long: 'Keep text concise and scannable'
  }
};

// Claude API configuration
const CLAUDE_CONFIG = {
  model: 'claude-3-sonnet-20240229',
  maxTokens: 4000,
  temperature: 0.3
};

// Main handler function
module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { text, action, targetLanguage, context } = req.body;

    if (!text || !action) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters: text and action' 
      });
    }

    let result;
    switch (action) {
      case 'analyze':
        result = await analyzeText(text, context);
        break;
      case 'translate':
        result = await translateText(text, targetLanguage);
        break;
      case 'suggest':
        result = await getSuggestions(text, context);
        break;
      case 'scan':
        result = await scanText(text, context);
        break;
      default:
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid action. Supported actions: analyze, translate, suggest, scan' 
        });
    }

    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    });
  }
}

// Text analysis function
async function analyzeText(text, context = {}) {
  const analysis = {
    text: text,
    length: analyzeLength(text, context.uiType),
    tone: analyzeTone(text),
    violations: detectViolations(text),
    suggestions: [],
    score: 0
  };

  // Generate AI-powered suggestions
  const aiSuggestions = await getAISuggestions(text, context);
  analysis.suggestions = aiSuggestions;

  // Calculate overall score
  analysis.score = calculateScore(analysis);

  return analysis;
}

// Length analysis
function analyzeLength(text, uiType = 'general') {
  const length = text.length;
  const rules = UX_WRITING_RULES.length[uiType] || UX_WRITING_RULES.length.description;
  
  return {
    current: length,
    max: rules.max,
    optimal: rules.optimal,
    status: length <= rules.optimal ? 'ok' : length <= rules.max ? 'warning' : 'too-long',
    percentage: Math.round((length / rules.max) * 100)
  };
}

// Tone analysis
function analyzeTone(text) {
  const words = text.toLowerCase().split(/\s+/);
  const toneScores = {
    friendly: 0,
    professional: 0,
    casual: 0,
    urgent: 0
  };

  // Simple keyword-based tone detection
  Object.keys(toneScores).forEach(tone => {
    UX_WRITING_RULES.tone[tone].forEach(keyword => {
      if (text.toLowerCase().includes(keyword)) {
        toneScores[tone]++;
      }
    });
  });

  const dominantTone = Object.keys(toneScores).reduce((a, b) => 
    toneScores[a] > toneScores[b] ? a : b
  );

  return {
    dominant: dominantTone,
    scores: toneScores,
    confidence: Math.max(...Object.values(toneScores)) / words.length
  };
}

// Violation detection
function detectViolations(text) {
  const violations = [];
  const lowerText = text.toLowerCase();

  // Check for jargon
  const jargonWords = ['utilize', 'facilitate', 'leverage', 'optimize', 'synergy'];
  if (jargonWords.some(word => lowerText.includes(word))) {
    violations.push({
      type: 'jargon',
      reason: UX_WRITING_RULES.violations.jargon,
      suggested: text.replace(/\b(utilize|facilitate|leverage|optimize|synergy)\b/gi, (match) => {
        const replacements = {
          'utilize': 'use',
          'facilitate': 'help',
          'leverage': 'use',
          'optimize': 'improve',
          'synergy': 'teamwork'
        };
        return replacements[match.toLowerCase()] || match;
      })
    });
  }

  // Check for passive voice
  if (/\b(is|are|was|were|be|been|being)\s+\w+ed\b/i.test(text)) {
    violations.push({
      type: 'passive',
      reason: UX_WRITING_RULES.violations.passive,
      suggested: convertToActiveVoice(text)
    });
  }

  // Check for negative language
  const negativeWords = ['cannot', 'unable', 'impossible', 'error', 'fail', 'problem'];
  if (negativeWords.some(word => lowerText.includes(word))) {
    violations.push({
      type: 'negative',
      reason: UX_WRITING_RULES.violations.negative,
      suggested: convertToPositiveLanguage(text)
    });
  }

  return violations;
}

// AI-powered suggestions using Claude
async function getAISuggestions(text, context) {
  try {
    const prompt = `As a UX writing expert, analyze this text and provide specific, actionable suggestions for improvement:

Text: "${text}"
Context: ${context.uiType || 'general UI element'}

Please provide:
1. A tone assessment (friendly, professional, casual, urgent)
2. Specific improvements for clarity and user experience
3. Alternative phrasings if applicable
4. Any accessibility considerations

Format your response as a JSON object with these fields:
- tone: string
- improvements: array of strings
- alternatives: array of strings
- accessibility: array of strings

Keep suggestions concise and actionable.`;

    const response = await callClaudeAPI(prompt);
    return JSON.parse(response);
  } catch (error) {
    console.error('AI suggestions error:', error);
    return {
      tone: 'unknown',
      improvements: ['Unable to generate AI suggestions at this time'],
      alternatives: [],
      accessibility: []
    };
  }
}

// Translation function
async function translateText(text, targetLanguage) {
  if (!targetLanguage || !SUPPORTED_LANGUAGES[targetLanguage]) {
    throw new Error(`Unsupported target language: ${targetLanguage}`);
  }

  try {
    const prompt = `Translate the following text to ${SUPPORTED_LANGUAGES[targetLanguage]} for a user interface. 
    Maintain the original tone and meaning while ensuring it's natural and culturally appropriate for the target language.
    Consider UX writing best practices for the target language.

    Original text: "${text}"
    
    Provide only the translation, no additional text.`;

    const translation = await callClaudeAPI(prompt);
    
    // Analyze the translated text
    const analysis = await analyzeText(translation, { uiType: 'translation' });
    
    return translation.trim();
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error(`Translation failed: ${error.message}`);
  }
}

// Get suggestions for text improvement
async function getSuggestions(text, context) {
  try {
    const analysis = await analyzeText(text, context);
    return {
      original: text,
      analysis: analysis,
      recommendations: generateRecommendations(analysis)
    };
  } catch (error) {
    console.error('Suggestions error:', error);
    throw new Error(`Failed to generate suggestions: ${error.message}`);
  }
}

// Scan text for comprehensive analysis
async function scanText(text, context) {
  try {
    const analysis = await analyzeText(text, context);
    const translations = {};
    
    // Generate translations for common languages
    const commonLanguages = ['en', 'ja', 'zh-cn', 'es', 'fr'];
    
    for (const lang of commonLanguages) {
      try {
        const translation = await translateText(text, lang);
        translations[lang] = translation;
      } catch (error) {
        console.error(`Translation failed for ${lang}:`, error);
        translations[lang] = {
          text: `Translation unavailable for ${SUPPORTED_LANGUAGES[lang]}`,
          language: lang,
          quality: 'error',
          length: { current: 0, max: 0, status: 'error' },
          tone: { dominant: 'unknown' }
        };
      }
    }

    return {
      analysis: analysis,
      translations: translations,
      summary: generateSummary(analysis, translations)
    };
  } catch (error) {
    console.error('Scan error:', error);
    throw new Error(`Text scanning failed: ${error.message}`);
  }
}

// Helper functions
function convertToActiveVoice(text) {
  // Simple active voice conversion (basic implementation)
  return text.replace(/\b(is|are|was|were)\s+(\w+ed)\b/gi, (match, verb, pastParticiple) => {
    // This is a simplified conversion - in practice, you'd need more sophisticated NLP
    return `will ${pastParticiple.replace(/ed$/, '')}`;
  });
}

function convertToPositiveLanguage(text) {
  const positiveReplacements = {
    'cannot': 'can',
    'unable': 'able',
    'impossible': 'possible',
    'error': 'issue',
    'fail': 'succeed',
    'problem': 'challenge'
  };
  
  let result = text;
  Object.entries(positiveReplacements).forEach(([negative, positive]) => {
    result = result.replace(new RegExp(`\\b${negative}\\b`, 'gi'), positive);
  });
  
  return result;
}

function calculateScore(analysis) {
  let score = 100;
  
  // Deduct points for violations
  score -= analysis.violations.length * 10;
  
  // Deduct points for length issues
  if (analysis.length.status === 'too-long') score -= 20;
  else if (analysis.length.status === 'warning') score -= 10;
  
  // Deduct points for low tone confidence
  if (analysis.tone.confidence < 0.3) score -= 15;
  
  return Math.max(0, Math.min(100, score));
}

function generateRecommendations(analysis) {
  const recommendations = [];
  
  if (analysis.length.status === 'too-long') {
    recommendations.push(`Text is too long (${analysis.length.current}/${analysis.length.max} characters). Consider shortening to ${analysis.length.optimal} characters or less.`);
  }
  
  if (analysis.violations.length > 0) {
    recommendations.push(`Found ${analysis.violations.length} writing issues that could be improved.`);
  }
  
  if (analysis.tone.confidence < 0.3) {
    recommendations.push('Tone is unclear. Consider making the text more direct and purposeful.');
  }
  
  return recommendations;
}

function generateSummary(analysis, translations) {
  const totalTranslations = Object.keys(translations).length;
  const successfulTranslations = Object.values(translations).filter(t => t.quality !== 'error').length;
  
  return {
    overallScore: analysis.score,
    textLength: analysis.length.current,
    violations: analysis.violations.length,
    translations: {
      total: totalTranslations,
      successful: successfulTranslations,
      failed: totalTranslations - successfulTranslations
    },
    recommendations: generateRecommendations(analysis)
  };
}

// Claude API call function
async function callClaudeAPI(prompt) {
  const apiKey = process.env.CLAUDE_API_KEY;
  
  console.log('Claude API 호출 시작, 프롬프트:', prompt);
  console.log('API 키 존재 여부:', !!apiKey);
  
  if (!apiKey) {
    throw new Error('Claude API key not configured');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: CLAUDE_CONFIG.model,
      max_tokens: CLAUDE_CONFIG.maxTokens,
      temperature: CLAUDE_CONFIG.temperature,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    console.error('Claude API 오류:', response.status, response.statusText);
    throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Claude API 응답:', data);
  const result = data.content[0].text;
  console.log('Claude API 결과:', result);
  return result;
}
