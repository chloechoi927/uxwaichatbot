// ================== CONFIG ==================
const CONFIG = {
  GOOGLE_SHEETS_API_KEY: 'AIzaSyD96DGgwpEaI6aenSZs0fxDdt0vr-mJNq0',
  CLAUDE_API_KEY: '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',  // 회사 클로드 API 키로 교체
  GEMINI_API_KEY: '', // 사용하지 않음
  SHEET_ID: '1CX3NHfp4cZ_ryflPMV3GkApiYd-J6XzypfrK9-x4-9E',
  SHEETS: {
    A: '어드민(A)!C:L',
    S: '서비스(S)!C:L', 
    P: 'App 다국어 (p)!C:L',
    B: '공통버튼(B)!C:L',
    C: '공통(C)!C:L'
  },
  TAB_NAME: { 
    A: '어드민(A)', 
    S: '서비스(S)', 
    P: 'App 다국어 (p)', 
    B: '공통버튼(B)', 
    C: '공통(C)' 
  },
  COLUMN_MAP: {
    CODE: 0,      // C열 - 코드
    STATUS: 1,    // D열 - 상태
    KO: 2,        // E열 - 한국어
    EN: 3,        // F열 - 영어
    JA: 4,        // G열 - 일본어
    ZH_CN: 5,     // H열 - 중국어 간체
    ZH_TW: 6,     // I열 - 중국어 번체
    ES: 7         // J열 - 스페인어
  }
};

// ================== UX 라이팅 가이드 시스템 ==================
const UX_WRITING_GUIDE = {
  TONE_DETECTION: {
    admin: {
      keywords: ['관리', '설정', '등록', '승인', '거부', '통계', '분석', '어드민', 'admin'],
      characteristics: ['명확성', '일관성', '간결성']
    },
    user: {
      keywords: ['구매', '결제', '좋아요', '팬', '스테이지', '멤버십', '혜택'],
      characteristics: ['참여유도', '유저중심', '공감적']
    }
  },
  
  IMPROVEMENT_RULES: {
    common: {
      avoid: ['유저', '실명', '오류', '에러'],
      replace: {
        '유저': '사용자',
        '실명': '이름', 
        '오류': '문제',
        '에러': '문제'
      }
    },
    admin: {
      tone: 'yo_form',
      avoid_excessive_honorifics: true,
      prefer: ['간결', '명확', '직접적']
    },
    user: {
      tone: 'yo_form',
      emphasize_benefits: true,
      avoid: ['한자어', '전문용어', '일본어투'],
      prefer: ['일상어', '친근한', '공감적']
    }
  }
};

// ============== 보이스톤 / 길이 규칙 ==============
const VOICE_TONE_RULES = {
  simple: {
    "유저": "사용자",
    "실명": "이름", 
    "오류": "문제",
    "에러": "문제",
    "가능해요": "할 수 있어요",
    "불가능해요": "할 수 없어요",
    "개설": "만들기",
    "납부": "내기",
    "송금": "보내기",
    "입니다": "이에요",
    "합니다": "해요",
    "십시오": "주세요",
    "하십시오": "해주세요",
    "해주십시오": "해주세요"
  },
  typos: [
    { pattern: /저장해주주세요/g, replacement: "저장해주세요", msg: "오타: '저장해주주세요' → '저장해주세요'" },
    { pattern: /해주주세요/g, replacement: "해주세요", msg: "오타: '해주주세요' → '해주세요'" },
    { pattern: /있있습니다/g, replacement: "있습니다", msg: "오타: '있있습니다' → '있습니다'" },
    { pattern: /준비해주주세요/g, replacement: "준비해주세요", msg: "오타: '준비해주주세요' → '준비해주세요'" },
    { pattern: /(.)\1{2,}/g, replacement: "$1", msg: "연속된 글자 오타 감지" }
  ],
  patterns: [
    { pattern: /(.+)하십시오\.?$/, replacement: "$1해주세요.", msg: "'하십시오' → '해주세요'" },
    { pattern: /(.+)가능해요\.?$/, replacement: "$1할 수 있어요.", msg: "'가능해요' → '할 수 있어요'" },
    { pattern: /(.+)입니다\.?$/, replacement: "$1이에요.", msg: "'입니다' → '이에요'" },
    { pattern: /(.+)합니다\.?$/, replacement: "$1해요.", msg: "'합니다' → '해요'" }
  ],
  tone: {
    formal: ["입니다", "합니다", "하십시오", "해주십시오", "십시오"],
    friendly: ["해요", "이에요", "어떠세요", "해주세요"],
    preferred: "friendly"
  }
};

const LENGTH_CONSTRAINTS = {
  button: { ko: 8, en: 12, ja: 10, zh: 8, es: 15 },
  title: { ko: 20, en: 30, ja: 25, zh: 20, es: 35 },
  body: { ko: 50, en: 80, ja: 60, zh: 50, es: 90 },
  tooltip: { ko: 15, en: 25, ja: 20, zh: 15, es: 30 },
  modal: { ko: 30, en: 45, ja: 35, zh: 30, es: 50 }
};

// ================== UI 띄우기 ==================
figma.showUI(__html__, { width: 520, height: 800, themeColors: true });

// ================== UTIL ==================
function toFriendly(text) {
  let result = text;
  const replacements = {
    "입니다": "이에요",
    "합니다": "해요", 
    "십시오": "주세요",
    "하십시오": "해주세요",
    "해주십시오": "해주세요"
  };
  
  for (const [formal, friendly] of Object.entries(replacements)) {
    result = result.replace(new RegExp(formal, 'g'), friendly);
  }
  return result;
}

function detectUIType(node) {
  const bounds = node.absoluteBoundingBox;
  const textLength = node.characters.length;
  const width = bounds ? bounds.width : 0;
  const height = bounds ? bounds.height : 0;
  
  if (width < 120 && height < 50 && textLength <= 15) return 'button';
  if (textLength <= 30 && (node.name.includes('title') || node.name.includes('header'))) return 'title';
  if (width < 200 && textLength <= 20) return 'tooltip';
  if (textLength <= 50) return 'modal';
  return 'body';
}

// 개선된 보이스톤 검사
function checkVoiceTone(text) {
  const violations = [];
  let correctedText = text;
  
  // 1. 오타 검증 (최우선)
  VOICE_TONE_RULES.typos.forEach(typo => {
    if (typo.pattern.test(correctedText)) {
      violations.push({
        type: 'typo',
        reason: typo.msg,
        severity: 'high'
      });
      correctedText = correctedText.replace(typo.pattern, typo.replacement);
    }
  });
  
  // 2. Pattern replacements (더 구체적인 패턴 먼저 처리)
  VOICE_TONE_RULES.patterns.forEach(rule => {
    if (rule.pattern.test(correctedText)) {
      violations.push({
        type: 'pattern',
        reason: rule.msg,
        severity: 'low'
      });
      correctedText = correctedText.replace(rule.pattern, rule.replacement);
    }
  });
  
  // 3. Simple replacements (패턴 처리 후에 수행)
  for (const [bad, good] of Object.entries(VOICE_TONE_RULES.simple)) {
    if (correctedText.includes(bad)) {
      violations.push({
        type: 'simple',
        reason: `"${bad}" → "${good}"`,
        severity: 'medium'
      });
      correctedText = correctedText.replace(new RegExp(bad, 'g'), good);
    }
  }
  
  // 4. Tone check
  const isFormal = VOICE_TONE_RULES.tone.formal.some(word => correctedText.includes(word));
  if (isFormal && VOICE_TONE_RULES.tone.preferred === 'friendly') {
    violations.push({
      type: 'tone',
      reason: '친근한 톤 권장',
      severity: 'low'
    });
    correctedText = toFriendly(correctedText);
  }
  
  violations.forEach(violation => {
    violation.suggested = correctedText;
  });
  
  return violations;
}

function toneScore(violations) {
  if (!violations.length) return 100;
  
  let deduction = 0;
  violations.forEach(v => {
    deduction += v.severity === 'high' ? 30 : (v.severity === 'medium' ? 20 : 10);
  });
  
  return Math.max(0, 100 - deduction);
}

function lengthCheck(text, uiType, lang = 'ko') {
  const constraints = LENGTH_CONSTRAINTS[uiType];
  if (!constraints || !constraints[lang]) return { status: 'unknown' };
  
  const current = Array.from(text).length;
  const max = constraints[lang];
  
  return {
    current,
    max,
    status: current <= max ? 'ok' : 'too-long',
    overflow: Math.max(0, current - max),
    percentage: Math.round((current / max) * 100)
  };
}

function pad5(num) {
  return String(num).padStart(5, '0');
}

// ================== Google Sheets READ ==================
async function fetchSheetData(rangeA1) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${encodeURIComponent(rangeA1)}?key=${CONFIG.GOOGLE_SHEETS_API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Sheets API error: ${response.status}`);
    }
    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

function getNextAvailableCode(sheetData, prefix) {
  const existingCodes = [];
  
  sheetData.forEach(row => {
    const code = row[CONFIG.COLUMN_MAP.CODE];
    if (typeof code === 'string' && code.startsWith(prefix)) {
      const numPart = code.slice(1);
      const num = parseInt(numPart, 10);
      if (!isNaN(num)) {
        existingCodes.push(num);
      }
    }
  });
  
  const maxNum = existingCodes.length > 0 ? Math.max(...existingCodes) : 0;
  return prefix + pad5(maxNum + 1);
}

function findExistingCode(sheetData, text) {
  const cleanText = text.trim().toLowerCase();
  
  for (const row of sheetData) {
    const koText = row[CONFIG.COLUMN_MAP.KO];
    if (typeof koText === 'string') {
      const cleanKoText = koText.trim().toLowerCase();
      if (cleanKoText === cleanText) {
        return {
          code: row[CONFIG.COLUMN_MAP.CODE],
          existing: true,
          originalText: koText
        };
      }
    }
  }
  
  for (const row of sheetData) {
    const koText = row[CONFIG.COLUMN_MAP.KO];
    if (typeof koText === 'string') {
      const similarity = calculateSimilarity(cleanText, koText.trim().toLowerCase());
      if (similarity > 0.9) {
        return {
          code: row[CONFIG.COLUMN_MAP.CODE],
          existing: true,
          originalText: koText,
          similarity: similarity
        };
      }
    }
  }
  
  return null;
}

function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  const editDistance = getEditDistance(longer, shorter);
  
  if (longer.length === 0) return 1.0;
  return (longer.length - editDistance) / longer.length;
}

function getEditDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// ================== UX 가이드 적용 AI 번역 ==================
function getPlaceholderTranslation(text, lang) {
  const placeholders = {
    en: `[EN] ${text}`,
    ja: `[JA] ${text}`,
    'zh-cn': `[ZH-CN] ${text}`,
    'zh-tw': `[ZH-TW] ${text}`,
    es: `[ES] ${text}`,
    vi: `[VI] ${text}`
  };
  return placeholders[lang] || text;
}

function detectToneFromContext(text, codeType, uiType) {
  if (codeType === 'A') return 'admin';
  
  const adminKeywords = UX_WRITING_GUIDE.TONE_DETECTION.admin.keywords;
  const userKeywords = UX_WRITING_GUIDE.TONE_DETECTION.user.keywords;
  
  const hasAdminKeywords = adminKeywords.some(keyword => text.includes(keyword));
  const hasUserKeywords = userKeywords.some(keyword => text.includes(keyword));
  
  if (hasAdminKeywords) return 'admin';
  if (hasUserKeywords) return 'user';
  
  return 'user';
}

function buildUXGuidedPrompt(koreanText, targetLang, targetLangName, tone, uiType) {
  const toneGuidelines = tone === 'admin' ? `
**Admin 톤 (관리자용) 가이드라인:**
- 명확성: 맥락 정보 제공, 구체적으로 명시, 순차적 단계 제공
- 간결성: 과도한 한자어 지양, 한 문장 하나의 정보
- 일관성: "사용자" 호칭 사용, "유저" 금지
- 문체: '-요'체 사용 (질문, 행동 요청, 설명, 완료 알림)
- 버튼명: 액션유도버튼에 '-하기' 사용
` : `
**User 톤 (일반 사용자용) 가이드라인:**
- 참여유도: 사용자 이익 강조, 결론 먼저 말하기
- 유저중심: 사용자 관점에서 작성, 사용자 상황 고려
- 공감적: 일상어 사용, 디지털 소외계층 고려
- 간결성: 한자어/전문용어/일본어투 지양
- 문체: '~요'체 기본, 다정하고 일상어투
- 버튼명: 페이지 내 버튼은 '-하기' 제외, Confirm창은 '-하기' 사용
`;

  const uiTypeContext = {
    button: `이것은 버튼 텍스트입니다. 클릭 가능한 액션을 나타내므로 간결하고 명확해야 합니다.`,
    title: `이것은 제목/헤더 텍스트입니다. 섹션이나 페이지의 목적을 명확히 전달해야 합니다.`,
    tooltip: `이것은 툴팁 텍스트입니다. 짧고 도움이 되는 설명이어야 합니다.`,
    modal: `이것은 모달/팝업 텍스트입니다. 사용자의 주의를 끌고 명확한 정보를 전달해야 합니다.`,
    body: `이것은 본문 텍스트입니다. 자세한 설명이나 안내 정보를 포함할 수 있습니다.`
  };

  return `You are a UX writing expert for b.stage, a K-pop fan platform. Translate the following Korean UI text into ${targetLangName}, following these specific guidelines:

${toneGuidelines}

**UI Context:**
${uiTypeContext[uiType] || uiTypeContext.body}

**Translation Requirements:**
- Maintain the ${tone} tone characteristics in ${targetLangName}
- Keep the text length appropriate for ${uiType} UI element
- Ensure cultural appropriateness for ${targetLangName} users
- Preserve the user experience intent of the original Korean text

**Length Constraints for ${uiType}:**
${JSON.stringify(LENGTH_CONSTRAINTS[uiType] || LENGTH_CONSTRAINTS.body)}

**Original Korean text:** "${koreanText}"

Respond with ONLY the translated ${targetLangName} text that best represents the original meaning while following all UX guidelines.`;
}

function optimizeForUIConstraints(translatedText, uiType, targetLang) {
  const constraints = LENGTH_CONSTRAINTS[uiType];
  if (!constraints) return translatedText;
  
  const langKey = targetLang === 'zh-cn' || targetLang === 'zh-tw' ? 'zh' : targetLang;
  const maxLength = constraints[langKey];
  
  if (!maxLength) return translatedText;
  
  const currentLength = Array.from(translatedText).length;
  
  if (currentLength > maxLength) {
    console.log(`Text too long (${currentLength}/${maxLength}), attempting to optimize`);
    
    let optimized = translatedText
      .replace(/please\s+/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (Array.from(optimized).length > maxLength) {
      optimized = Array.from(optimized).slice(0, maxLength - 3).join('') + '...';
    }
    
    return optimized;
  }
  
  return translatedText;
}

async function translateWithUXGuide(text, targetLang, uiType, codeType) {
  const API_KEY = CONFIG.CLAUDE_API_KEY;
  
  if (!API_KEY || API_KEY === 'YOUR_COMPANY_CLAUDE_API_KEY_HERE') {
    console.log('No Claude API key found, using placeholder');
    return getPlaceholderTranslation(text, targetLang);
  }

  const detectedTone = detectToneFromContext(text, codeType, uiType);
  
  const langMap = {
    en: 'English',
    ja: 'Japanese', 
    'zh-cn': 'Simplified Chinese',
    'zh-tw': 'Traditional Chinese',
    es: 'Spanish',
    vi: 'Vietnamese'
  };

  const prompt = buildUXGuidedPrompt(text, targetLang, langMap[targetLang], detectedTone, uiType);

  try {
    console.log(`Translating "${text}" to ${targetLang} with ${detectedTone} tone using Claude`);
    
    const result = await callClaudeAPI(prompt, API_KEY);
    return optimizeForUIConstraints(result, uiType, targetLang);
    
  } catch (error) {
    console.error(`UX-guided translation failed for ${targetLang}:`, error);
    return getPlaceholderTranslation(text, targetLang);
  }
}

async function callClaudeAPI(prompt, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API failed: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  return data.content[0].text.trim();
}

async function generateUXGuidedTranslations(text, uiType, codeType) {
  const languages = ['en', 'ja', 'zh-cn', 'zh-tw', 'es', 'vi'];
  const translations = {};
  
  console.log('Starting UX-guided translations for:', text);
  
  const translationPromises = languages.map(async (lang) => {
    try {
      const translated = await translateWithUXGuide(text, lang, uiType, codeType);
      const lengthInfo = lengthCheck(translated, uiType, lang === 'zh-cn' || lang === 'zh-tw' ? 'zh' : lang);
      
      return [lang, {
        text: translated,
        length: lengthInfo,
        quality: translated.includes('[') ? 'placeholder' : 'ux-guided'
      }];
    } catch (error) {
      console.error(`UX-guided translation failed for ${lang}:`, error);
      return [lang, {
        text: getPlaceholderTranslation(text, lang),
        length: { status: 'unknown' },
        quality: 'placeholder'
      }];
    }
  });

  const results = await Promise.all(translationPromises);
  results.forEach(([lang, data]) => {
    translations[lang] = data;
  });
  
  console.log('UX-guided translation results:', translations);
  return translations;
}

// ================== 레이어 태깅 ==================
function tagLayer(node, code) {
  const cleanName = node.name.replace(/^[🔵🟡🟢]\s*\w+\s*-\s*/, '');
  node.name = `🔵 ${code} - ${cleanName}`;
  node.setPluginData('uxw-code', code);
  node.setPluginData('uxw-timestamp', Date.now().toString());
}

// ================== UI 메시지 처리 ==================
figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === 'init') {
      figma.ui.postMessage({ type: 'ready', message: '플러그인 준비 완료' });
      return;
    }

    if (msg.type === 'scan-selection') {
      const codeType = msg.codeType || 'S';
      const range = CONFIG.SHEETS[codeType];
      
      if (!range) {
        figma.ui.postMessage({ type: 'error', message: '시트 범위를 찾을 수 없습니다.' });
        return;
      }

      const selectedTexts = figma.currentPage.selection.filter(n => n.type === 'TEXT');
      
      if (!selectedTexts.length) {
        figma.ui.postMessage({ type: 'error', message: '텍스트 노드를 선택해주세요.' });
        return;
      }

      figma.ui.postMessage({ type: 'loading', message: `${codeType} 코드 데이터 로딩 중...` });

      const sheetData = await fetchSheetData(range);
      const results = [];
      
      for (const node of selectedTexts) {
        const text = node.characters.trim();
        const existing = findExistingCode(sheetData, text);
        
        if (existing) {
          results.push({
            nodeId: node.id,
            type: 'existing',
            code: existing.code,
            text: text,
            codeType: codeType,
            uiType: detectUIType(node),
            message: '기존 코드 발견'
          });
        } else {
          const newCode = getNextAvailableCode(sheetData, codeType);
          const uiType = detectUIType(node);
          const toneViolations = checkVoiceTone(text);
          const toneScore = calculateToneScore(toneViolations);
          const lengthInfo = lengthCheck(text, uiType, 'ko');
          
          const translations = await generateUXGuidedTranslations(text, uiType, codeType);
          
          results.push({
            nodeId: node.id,
            type: 'new',
            code: newCode,
            text: text,
            codeType: codeType,
            uiType: uiType,
            report: {
              toneScore: toneScore,
              toneViolations: toneViolations,
              length: lengthInfo,
              translations: translations
            }
          });
          
          const newRow = new Array(Object.keys(CONFIG.COLUMN_MAP).length);
          newRow[CONFIG.COLUMN_MAP.CODE] = newCode;
          newRow[CONFIG.COLUMN_MAP.KO] = text;
          sheetData.push(newRow);
        }
      }

      figma.ui.postMessage({ 
        type: 'scan-results', 
        data: results, 
        codeType: codeType 
      });
    }

    if (msg.type === 'apply-code') {
      const { nodeId, code } = msg.data;
      const node = figma.getNodeById(nodeId);
      
      if (!node) {
        figma.ui.postMessage({ type: 'error', message: '노드를 찾을 수 없습니다.' });
        return;
      }
      
      tagLayer(node, code);
      figma.notify(`✅ ${code} 코드가 레이어에 적용되었습니다.`);
    }

    if (msg.type === 'apply-corrections') {
      const { nodeId, correctedText } = msg.data;
      const node = figma.getNodeById(nodeId);
      
      if (!node || node.type !== 'TEXT') {
        figma.ui.postMessage({ type: 'error', message: '텍스트 노드를 찾을 수 없습니다.' });
        return;
      }
      
      await figma.loadFontAsync(node.fontName);
      node.characters = correctedText;
      
      figma.notify('✅ 텍스트가 수정되었습니다.');
    }

    if (msg.type === 'close') {
      figma.closePlugin();
    }

  } catch (error) {
    console.error('Plugin error:', error);
    figma.ui.postMessage({ 
      type: 'error', 
      message: `오류가 발생했습니다: ${error.message}` 
    });
  }
};

function calculateToneScore(violations) {
  if (!violations.length) return 100;
  
  let deduction = 0;
  violations.forEach(v => {
    switch (v.severity) {
      case 'high': deduction += 30; break;
      case 'medium': deduction += 20; break;
      case 'low': deduction += 10; break;
    }
  });
  
  return Math.max(0, 100 - deduction);
}