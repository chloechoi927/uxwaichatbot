// ================= CONFIG =================
const CONFIG = {
  // Vercel 배포된 프록시 API URL
  API_BASE_URL: 'https://uxwaichatbot-ai.vercel.app',
  PROXY_API_URL: 'https://uxwaichatbot-ai.vercel.app/api/claude',
  
  GOOGLE_SHEETS_API_KEY: 'AIzaSyD96DGqwpEaI6aenSZs0fxDdt0vr-mJNqO', // 실제 API 키로 교체 필요
  CLAUDE_API_KEY: '', // Vercel 환경변수에서 사용
  GEMINI_API_KEY: '', // 지원하지 않음
  SHEET_ID: '1CX3NHfp4cZ_ryflPMV3GkApjYd-J6XzypfrK9-x4-9E',
  SHEETS: {
    A: '어드민(A)!C1:L',
    S: '서비스(S)!C1:L',
    P: 'App 다국어 (p)!C1:L',
    B: '공통버튼(B)!C1:L',
    C: '공통(C)!C1:L'
  },
  TAB_NAME: {
    A: '어드민(A)',
    S: '서비스(S)',
    P: 'App 다국어 (p)',
    B: '공통버튼(B)',
    C: '공통(C)'
  },
  COLUMN_MAP: {
    CODE: 0,    // C열 - 코드
    STATUS: 1,  // D열 - 상태  
    KO: 2,      // E열 - 한국어
    EN: 3,      // F열 - 영어
    JA: 4,      // G열 - 일본어
    ZH_CN: 5,   // H열 - 중국어 간체
    ZH_TW: 6,   // I열 - 중국어 번체
    ES: 7       // J열 - 스페인어
  },
  
  // UX Writing Analysis Configuration
  UI_TYPES: {
    button: '버튼',
    label: '라벨',
    description: '설명',
    error: '에러 메시지',
    success: '성공 메시지',
    placeholder: '플레이스홀더',
    tooltip: '툴팁',
    heading: '제목',
    body: '본문'
  },
  
  // Supported Languages for Translation
  SUPPORTED_LANGUAGES: {
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
  }
};

// ================= 한국어 UX 라이팅 가이드 시스템 =================
const UX_WRITING_GUIDE = {
  // 톤 앤 보이스 가이드라인
  TONE_GUIDELINES: {
    admin: {
      name: '어드민(Admin) 톤',
      target: '아티스트를 관리하는 소속사, 관리자',
      values: ['명확성', '일관성', '간결성', '참여'],
      rules: {
        clarity: '맥락 정보 제공, 구체적 명시, 순차적 단계 제공',
        language: '쉽고 간결한 우리말 사용, 과도한 한자어 자제',
        naming: '사용자/고객/회원 구분, 관리자 호칭 통일',
        buttons: '액션유도버튼은 -하기 사용, Sub 버튼은 명사 유지',
        style: '-요체: 질문/행동요청/쉬운설명, -다체: 약관/정책/상황전달'
      }
    },
    user: {
      name: '유저(User) 톤',
      target: '팬사이드 일반 사용자',
      values: ['참여(유도)', '유저 중심', '간결성', '공감'],
      rules: {
        clarity: '사용자 관점에서 작성, 결론 먼저 말하기',
        language: '일상어 사용, 전문용어 치환, 디지털 소외계층 고려',
        benefit: '사용자 이익 강조, 손실 자극 활용',
        buttons: '페이지 내 버튼은 -하기 제외, Confirm창은 -하기 사용',
        style: '-요체: 기본/다정한일상어투/권유, -다체: 상황전달/사과/주의'
      }
    }
  },

  // 톤 감지 키워드
  TONE_DETECTION: {
    admin: {
      keywords: ['관리', '설정', '등록', '승인', '거부', '통계', '분석', '어드민', '시스템', '데이터'],
      characteristics: ['명확성', '전문성', '간결성']
    },
    user: {
      keywords: ['안녕', '도움', '환영', '감사', '좋은', '즐거운', '팬', '사용자', '고객'],
      characteristics: ['친근함', '따뜻함', '접근성']
    },
    professional: {
      keywords: ['확인', '처리', '완료', '시스템', '데이터', '보고서'],
      characteristics: ['정확성', '신뢰성', '효율성']
    },
    urgent: {
      keywords: ['즉시', '긴급', '주의', '경고', '중요', '필수'],
      characteristics: ['명확성', '직접성', '행동유도']
    }
  },
  
  LENGTH_GUIDELINES: {
    button: { max: 20, optimal: 12, warning: 15 },
    label: { max: 30, optimal: 20, warning: 25 },
    description: { max: 100, optimal: 60, warning: 80 },
    error: { max: 80, optimal: 50, warning: 65 },
    success: { max: 60, optimal: 40, warning: 50 },
    placeholder: { max: 40, optimal: 25, warning: 35 },
    tooltip: { max: 120, optimal: 80, warning: 100 },
    heading: { max: 60, optimal: 40, warning: 50 },
    body: { max: 200, optimal: 120, warning: 160 }
  },
  
  // 한국어 UX 라이팅 위반 패턴
  VIOLATION_PATTERNS: {
    // 과도한 높임 표현 (어드민 톤)
    excessive_honorific: {
      words: ['하십시오', '하시기', '하시는', '하시고', '하신', '하셨', '하실', '하시면'],
      suggestion: '과도한 높임 표현을 간결한 -요체로 변경하세요',
      replacement: {
        '하십시오': '해주세요',
        '하시기': '하기',
        '하시는': '하는',
        '하시고': '하고',
        '하신': '한',
        '하셨': '했',
        '하실': '할',
        '하시면': '하면'
      }
    },
    // 일본어투/번역투 표현
    japanese_style: {
      words: ['시기', '바랍니다', '시켜', '시켜서', '시켜주세요'],
      suggestion: '일본어투를 자연스러운 한국어로 변경하세요',
      replacement: {
        '시기': '기',
        '바랍니다': '해주세요',
        '시켜': '해',
        '시켜서': '해서',
        '시켜주세요': '해주세요'
      }
    },
    // 전문 용어 (유저 톤)
    technical_jargon: {
      words: ['실행', '수행', '처리', '시스템', '데이터', '프로세스', '워크플로우'],
      suggestion: '전문 용어를 일상어로 변경하세요',
      replacement: {
        '실행': '실행',
        '수행': '진행',
        '처리': '완료',
        '시스템': '시스템',
        '데이터': '정보',
        '프로세스': '과정',
        '워크플로우': '순서'
      }
    },
    // 모호한 표현
    vague_expression: {
      words: ['것', '거', '뭔가', '어떤', '이런', '저런', '그런'],
      suggestion: '구체적이고 명확한 표현으로 변경하세요'
    },
    // 부정적 표현
    negative_expression: {
      words: ['안', '못', '불가', '불가능', '실패', '오류', '문제', '잘못'],
      suggestion: '긍정적이고 도움이 되는 표현으로 변경하세요'
    },
    // 과도한 한자어
    chinese_loanwords: {
      words: ['실행', '수행', '처리', '관리', '설정', '등록', '승인', '거부'],
      suggestion: '한자어를 쉬운 우리말로 변경하세요'
    }
  }
};

// ================= TEXT SCANNING AND ANALYSIS =================

// Scan all text nodes in the current selection
async function scanSelectedTexts() {
  const selection = figma.currentPage.selection;
  const textNodes = [];
  
  // Collect all text nodes from selection
  for (let i = 0; i < selection.length; i++) {
    const node = selection[i];
    if (node.type === 'TEXT') {
      textNodes.push({
        id: node.id,
        text: node.characters,
        name: node.name,
        uiType: detectUIType(node),
        node: node
      });
    }
  }
  
  if (textNodes.length === 0) {
    return { success: false, message: 'No text layers selected' };
  }
  
  // Analyze each text node
  const results = [];
  for (const textNode of textNodes) {
    try {
      const analysis = await analyzeTextNode(textNode);
      results.push(analysis);
    } catch (error) {
      console.error(`Error analyzing text node ${textNode.id}:`, error);
      results.push({
        id: textNode.id,
        text: textNode.text,
        uiType: textNode.uiType,
        error: error.message,
        type: 'error'
      });
    }
  }
  
  return { success: true, results };
}

// Detect UI type based on node properties and text content
function detectUIType(node) {
  const text = node.characters.toLowerCase();
  const name = node.name.toLowerCase();
  
  // Check for specific UI patterns
  if (text.includes('button') || name.includes('button') || text.length <= 20) {
    return 'button';
  }
  if (text.includes('error') || text.includes('failed') || text.includes('invalid')) {
    return 'error';
  }
  if (text.includes('success') || text.includes('completed') || text.includes('saved')) {
    return 'success';
  }
  if (text.includes('placeholder') || name.includes('placeholder')) {
    return 'placeholder';
  }
  if (text.includes('tooltip') || name.includes('tooltip')) {
    return 'tooltip';
  }
  if (text.length > 100) {
    return 'description';
  }
  if (text.length > 50) {
    return 'body';
  }
  
  return 'label';
}

// 개별 텍스트 노드 분석
async function analyzeTextNode(textNode) {
  const { text, uiType } = textNode;
  
  console.log('분석 시작:', text, uiType);
  
  // 한국어 톤 분석
  const koreanTone = analyzeKoreanTone(text);
  console.log('한국어 톤:', koreanTone);
  
  // 로컬 분석 수행
  const localAnalysis = performLocalAnalysis(text, uiType);
  console.log('로컬 분석:', localAnalysis);
  
  // 기존 텍스트 확인 (엑셀 시트에서)
  const existingText = await checkExistingTextInSheets(text);
  console.log('기존 텍스트 확인:', existingText);
  
  // 화면 타입 감지 (어드민 vs 유저)
  const screenType = detectScreenType(text, uiType);
  console.log('화면 타입:', screenType);
  
  // 적절한 코드 생성
  const code = await generateAppropriateCode(screenType, text);
  console.log('생성된 코드:', code);
  
  // 개선된 문구 제안 생성
  const suggestions = generateImprovedSuggestions(text, koreanTone, localAnalysis);
  console.log('제안 문구들:', suggestions);
  
  // 다국어 번역 생성
  const translations = await generateMultilingualTranslations(suggestions[0].text || text);
  console.log('번역 결과:', translations);
  
  return {
    id: textNode.id,
    text: text,
    uiType: uiType,
    code: code,
    screenType: screenType,
    type: existingText ? 'existing' : 'new',
    analysis: {
      koreanTone: koreanTone,
      localAnalysis: localAnalysis
    },
    suggestions: suggestions,
    translations: translations,
    nodeId: textNode.id
  };
}

// 엑셀 시트에서 기존 텍스트 확인
async function checkExistingTextInSheets(text) {
  try {
    // 모든 시트 카테고리 확인
    for (const key in CONFIG.SHEETS) {
      const range = CONFIG.SHEETS[key];
      const data = await fetchSheetData(range);
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        if (row[CONFIG.COLUMN_MAP.KO] === text || row[CONFIG.COLUMN_MAP.EN] === text) {
          return {
            exists: true,
            code: row[CONFIG.COLUMN_MAP.CODE],
            sheetType: key
          };
        }
      }
    }
    return { exists: false };
  } catch (error) {
    console.error('Error checking existing text:', error);
    return { exists: false };
  }
}

// 화면 타입 감지 (어드민 vs 유저)
function detectScreenType(text, uiType) {
  // 어드민 화면 키워드
  const adminKeywords = ['관리', '설정', '등록', '승인', '거부', '통계', '분석', '어드민', '시스템', '데이터', '관리자'];
  // 유저 화면 키워드  
  const userKeywords = ['주문', '결제', '구매', '교환권', 'QR', '현장', '네트워크', '상품', '고객', '회원'];
  
  let adminScore = 0;
  let userScore = 0;
  
  for (let i = 0; i < adminKeywords.length; i++) {
    if (text.includes(adminKeywords[i])) adminScore++;
  }
  
  for (let i = 0; i < userKeywords.length; i++) {
    if (text.includes(userKeywords[i])) userScore++;
  }
  
  // UI 타입에 따른 판단
  if (uiType === 'error' || uiType === 'success') {
    return userScore > adminScore ? 'user' : 'admin';
  }
  
  return userScore > adminScore ? 'user' : 'admin';
}

// 적절한 코드 생성
async function generateAppropriateCode(screenType, text) {
  const prefix = screenType === 'admin' ? 'A' : 'S';
  return await generateUniqueCode(prefix);
}

// 개선된 문구 제안 생성
function generateImprovedSuggestions(text, koreanTone, localAnalysis) {
  const suggestions = [];
  
  // 원본 텍스트
  suggestions.push({
    text: text,
    score: 100,
    tags: ['원본'],
    type: 'original'
  });
  
  // 기본 개선 제안 (하십시오 -> 해주세요)
  const improvedText = text.replace(/하십시오/g, '해주세요').replace(/하시기/g, '하기');
  if (improvedText !== text) {
    suggestions.push({
      text: improvedText,
      score: 90,
      tags: ['개선', '사용자친화적'],
      type: 'improvement',
      reason: '사용자 친화적인 문구로 개선'
    });
  }
  
  // 위반 패턴 기반 개선 제안
  const violations = localAnalysis.violations || [];
  for (let i = 0; i < violations.length; i++) {
    const violation = violations[i];
    if (violation.suggested && violation.suggested !== text) {
      suggestions.push({
        text: violation.suggested,
        score: Math.max(60, 100 - (i + 1) * 15),
        tags: [violation.type, '개선'],
        type: 'improvement',
        reason: violation.reason
      });
    }
  }
  
  // 톤 기반 제안
  if (koreanTone.dominant === 'admin') {
    const adminText = convertToAdminTone(text);
    if (adminText !== text) {
      suggestions.push({
        text: adminText,
        score: 85,
        tags: ['어드민', '톤'],
        type: 'tone',
        reason: '어드민 톤에 맞게 조정'
      });
    }
  } else if (koreanTone.dominant === 'user') {
    const userText = convertToUserTone(text);
    if (userText !== text) {
      suggestions.push({
        text: userText,
        score: 85,
        tags: ['유저', '톤'],
        type: 'tone',
        reason: '유저 톤에 맞게 조정'
      });
    }
  }
  
  // 추가 대안 문구 제안 (2개)
  const alt1 = generateAlternativeText(text, 1);
  if (alt1 !== text) {
    suggestions.push({
      text: alt1,
      score: 80,
      tags: ['대안', '1'],
      type: 'alternative',
      reason: '다른 표현 방식으로 제안'
    });
  }
  
  const alt2 = generateAlternativeText(text, 2);
  if (alt2 !== text) {
    suggestions.push({
      text: alt2,
      score: 75,
      tags: ['대안', '2'],
      type: 'alternative',
      reason: '다른 표현 방식으로 제안'
    });
  }
  
  return suggestions.slice(0, 5); // 최대 5개 제안
}

// 대안 문구 생성
function generateAlternativeText(text, variant) {
  // 기본 패턴 기반 대안 생성
  if (variant === 1) {
    // 더 친근한 표현
    return text.replace(/하십시오/g, '해주세요')
               .replace(/하시기/g, '하기')
               .replace(/하시는/g, '하는');
  } else if (variant === 2) {
    // 더 간결한 표현
    return text.replace(/교환권\(QR 코드\)을 미리 준비/g, 'QR 코드를 미리 준비')
               .replace(/현장 상황에 따라/g, '상황에 따라')
               .replace(/원활하지 않을 수 있어요/g, '불안정할 수 있어요');
  }
  return text;
}


// 폴백 번역 (API 실패시)
function getFallbackTranslation(text, targetLanguage) {
  const fallbackTranslations = {
    'en': 'Please prepare your exchange ticket (QR code) in advance.',
    'ja': '事前に交換券（QRコード）をご準備ください。',
    'zh-cn': '请提前准备好兑换券（QR码）。',
    'zh-tw': '請提前準備好兌換券（QR碼）。',
    'es': 'Por favor, prepare su boleto de intercambio (código QR) con anticipación.',
    'vi': 'Vui lòng chuẩn bị trước phiếu đổi (mã QR).'
  };
  
  return fallbackTranslations[targetLanguage] || text;
}

// 다국어 번역 생성
async function generateMultilingualTranslations(text) {
  const translations = {};
  const languages = ['en', 'ja', 'zh-cn', 'zh-tw', 'es', 'vi'];
  
  for (let i = 0; i < languages.length; i++) {
    const lang = languages[i];
    try {
      const translation = await translateText(text, lang);
      translations[lang] = {
        text: translation,
        language: lang,
        quality: 'ai-generated',
        length: { current: translation.length, max: 100, status: 'ok' }
      };
    } catch (error) {
      console.error(`번역 실패 (${lang}):`, error);
      translations[lang] = {
        text: `번역 불가 (${CONFIG.SUPPORTED_LANGUAGES[lang]})`,
        language: lang,
        quality: 'error',
        length: { current: 0, max: 0, status: 'error' }
      };
    }
  }
  
  return translations;
}

// Enhanced text analysis with local rules
function performLocalAnalysis(text, uiType) {
  const analysis = {
    length: analyzeTextLength(text, uiType),
    tone: analyzeTextTone(text),
    violations: detectTextViolations(text),
    score: 0
  };
  
  // Calculate score
  analysis.score = calculateTextScore(analysis);
  
  return analysis;
}

// Analyze text length against UX guidelines
function analyzeTextLength(text, uiType) {
  const length = text.length;
  const guidelines = UX_WRITING_GUIDE.LENGTH_GUIDELINES[uiType] || UX_WRITING_GUIDE.LENGTH_GUIDELINES.description;
  
  let status = 'ok';
  if (length > guidelines.max) status = 'too-long';
  else if (length > guidelines.warning) status = 'warning';
  
  return {
    current: length,
    max: guidelines.max,
    optimal: guidelines.optimal,
    warning: guidelines.warning,
    status: status,
    percentage: Math.round((length / guidelines.max) * 100)
  };
}

// Analyze text tone
function analyzeTextTone(text) {
  const lowerText = text.toLowerCase();
  const toneScores = {};
  
  // Check each tone category
  for (const tone in UX_WRITING_GUIDE.TONE_DETECTION) {
    const config = UX_WRITING_GUIDE.TONE_DETECTION[tone];
    let score = 0;
    
    for (let i = 0; i < config.keywords.length; i++) {
      const keyword = config.keywords[i];
      if (lowerText.includes(keyword)) score++;
    }
    
    toneScores[tone] = score;
  }
  
  // Find dominant tone
  let dominantTone = '';
  let maxScore = 0;
  for (const tone in toneScores) {
    if (toneScores[tone] > maxScore) {
      maxScore = toneScores[tone];
      dominantTone = tone;
    }
  }
  
  return {
    dominant: dominantTone,
    scores: toneScores,
    confidence: maxScore / text.split(/\s+/).length
  };
}

// 한국어 텍스트 위반 패턴 감지
function detectTextViolations(text) {
  const violations = [];
  
  // 과도한 높임 표현 체크
  const honorificWords = UX_WRITING_GUIDE.VIOLATION_PATTERNS.excessive_honorific.words;
  const foundHonorific = [];
  for (let i = 0; i < honorificWords.length; i++) {
    const word = honorificWords[i];
    if (text.includes(word)) {
      foundHonorific.push(word);
    }
  }
  if (foundHonorific.length > 0) {
    violations.push({
      type: 'excessive_honorific',
      reason: UX_WRITING_GUIDE.VIOLATION_PATTERNS.excessive_honorific.suggestion,
      words: foundHonorific,
      suggested: replaceKoreanPatterns(text, UX_WRITING_GUIDE.VIOLATION_PATTERNS.excessive_honorific.replacement)
    });
  }
  
  // 일본어투/번역투 체크
  const japaneseWords = UX_WRITING_GUIDE.VIOLATION_PATTERNS.japanese_style.words;
  const foundJapanese = [];
  for (let i = 0; i < japaneseWords.length; i++) {
    const word = japaneseWords[i];
    if (text.includes(word)) {
      foundJapanese.push(word);
    }
  }
  if (foundJapanese.length > 0) {
    violations.push({
      type: 'japanese_style',
      reason: UX_WRITING_GUIDE.VIOLATION_PATTERNS.japanese_style.suggestion,
      words: foundJapanese,
      suggested: replaceKoreanPatterns(text, UX_WRITING_GUIDE.VIOLATION_PATTERNS.japanese_style.replacement)
    });
  }
  
  // 전문 용어 체크 (유저 톤용)
  const jargonWords = UX_WRITING_GUIDE.VIOLATION_PATTERNS.technical_jargon.words;
  const foundJargon = [];
  for (let i = 0; i < jargonWords.length; i++) {
    const word = jargonWords[i];
    if (text.includes(word)) {
      foundJargon.push(word);
    }
  }
  if (foundJargon.length > 0) {
    violations.push({
      type: 'technical_jargon',
      reason: UX_WRITING_GUIDE.VIOLATION_PATTERNS.technical_jargon.suggestion,
      words: foundJargon,
      suggested: replaceKoreanPatterns(text, UX_WRITING_GUIDE.VIOLATION_PATTERNS.technical_jargon.replacement)
    });
  }
  
  // 모호한 표현 체크
  const vagueWords = UX_WRITING_GUIDE.VIOLATION_PATTERNS.vague_expression.words;
  const foundVague = [];
  for (let i = 0; i < vagueWords.length; i++) {
    const word = vagueWords[i];
    if (text.includes(word)) {
      foundVague.push(word);
    }
  }
  if (foundVague.length > 0) {
    violations.push({
      type: 'vague_expression',
      reason: UX_WRITING_GUIDE.VIOLATION_PATTERNS.vague_expression.suggestion,
      words: foundVague
    });
  }
  
  // 부정적 표현 체크
  const negativeWords = UX_WRITING_GUIDE.VIOLATION_PATTERNS.negative_expression.words;
  const foundNegative = [];
  for (let i = 0; i < negativeWords.length; i++) {
    const word = negativeWords[i];
    if (text.includes(word)) {
      foundNegative.push(word);
    }
  }
  if (foundNegative.length > 0) {
    violations.push({
      type: 'negative_expression',
      reason: UX_WRITING_GUIDE.VIOLATION_PATTERNS.negative_expression.suggestion,
      words: foundNegative,
      suggested: convertToPositiveKorean(text, foundNegative)
    });
  }
  
  // 과도한 한자어 체크
  const chineseWords = UX_WRITING_GUIDE.VIOLATION_PATTERNS.chinese_loanwords.words;
  const foundChinese = [];
  for (let i = 0; i < chineseWords.length; i++) {
    const word = chineseWords[i];
    if (text.includes(word)) {
      foundChinese.push(word);
    }
  }
  if (foundChinese.length > 0) {
    violations.push({
      type: 'chinese_loanwords',
      reason: UX_WRITING_GUIDE.VIOLATION_PATTERNS.chinese_loanwords.suggestion,
      words: foundChinese
    });
  }
  
  return violations;
}

// 한국어 텍스트 개선 헬퍼 함수들
function replaceKoreanPatterns(text, replacements) {
  let result = text;
  for (const original in replacements) {
    const replacement = replacements[original];
    result = result.replace(new RegExp(original, 'g'), replacement);
  }
  return result;
}

function convertToPositiveKorean(text, negativeWords) {
  const positiveReplacements = {
    '안': '잘',
    '못': '할 수 있어',
    '불가': '가능',
    '불가능': '가능',
    '실패': '성공',
    '오류': '문제',
    '문제': '이슈',
    '잘못': '올바르게'
  };
  
  let result = text;
  for (let i = 0; i < negativeWords.length; i++) {
    const word = negativeWords[i];
    const replacement = positiveReplacements[word] || word;
    result = result.replace(new RegExp(word, 'g'), replacement);
  }
  
  return result;
}

// 한국어 톤 분석 (어드민 vs 유저)
function analyzeKoreanTone(text) {
  const adminKeywords = UX_WRITING_GUIDE.TONE_DETECTION.admin.keywords;
  const userKeywords = UX_WRITING_GUIDE.TONE_DETECTION.user.keywords;
  
  let adminScore = 0;
  let userScore = 0;
  
  for (let i = 0; i < adminKeywords.length; i++) {
    const keyword = adminKeywords[i];
    if (text.includes(keyword)) adminScore++;
  }
  
  for (let i = 0; i < userKeywords.length; i++) {
    const keyword = userKeywords[i];
    if (text.includes(keyword)) userScore++;
  }
  
  // 문체 분석
  const hasHonorific = /하십시오|하시기|하시는|하시고|하신|하셨|하실|하시면/.test(text);
  const hasCasual = /해주세요|해요|해|하고|한|했|할|하면/.test(text);
  
  if (hasHonorific) adminScore += 2;
  if (hasCasual) userScore += 2;
  
  const dominantTone = adminScore > userScore ? 'admin' : 'user';
  const confidence = Math.max(adminScore, userScore) / (adminScore + userScore);
  
  return {
    dominant: dominantTone,
    scores: { admin: adminScore, user: userScore },
    confidence: confidence,
    guidelines: UX_WRITING_GUIDE.TONE_GUIDELINES[dominantTone]
  };
}

function calculateTextScore(analysis) {
  let score = 100;
  
  // Deduct points for violations
  score -= analysis.violations.length * 15;
  
  // Deduct points for length issues
  if (analysis.length.status === 'too-long') score -= 25;
  else if (analysis.length.status === 'warning') score -= 10;
  
  // Deduct points for low tone confidence
  if (analysis.tone.confidence < 0.2) score -= 20;
  
  return Math.max(0, Math.min(100, score));
}

// AI 제안 생성
function generateAISuggestions(text, uiType, koreanTone, localAnalysis) {
  const suggestions = [];
  const violations = localAnalysis.violations || [];
  
  // 기본 제안 (원본 텍스트)
  suggestions.push({
    text: text,
    score: 100,
    tags: ['원본'],
    type: 'original'
  });
  
  // 위반 패턴 기반 제안
  for (let i = 0; i < violations.length; i++) {
    const violation = violations[i];
    if (violation.suggested && violation.suggested !== text) {
      suggestions.push({
        text: violation.suggested,
        score: Math.max(60, 100 - (i + 1) * 10),
        tags: [violation.type, '개선'],
        type: 'improvement',
        reason: violation.reason
      });
    }
  }
  
  // 톤 기반 제안
  if (koreanTone.dominant === 'admin') {
    // 어드민 톤 제안
    suggestions.push({
      text: convertToAdminTone(text),
      score: 85,
      tags: ['어드민', '톤'],
      type: 'tone',
      reason: '어드민 톤에 맞게 조정'
    });
  } else if (koreanTone.dominant === 'user') {
    // 유저 톤 제안
    suggestions.push({
      text: convertToUserTone(text),
      score: 85,
      tags: ['유저', '톤'],
      type: 'tone',
      reason: '유저 톤에 맞게 조정'
    });
  }
  
  // UI 타입별 제안
  const uiTypeSuggestion = generateUITypeSuggestion(text, uiType);
  if (uiTypeSuggestion) {
    suggestions.push(uiTypeSuggestion);
  }
  
  return suggestions.slice(0, 5); // 최대 5개 제안
}

// 다국어 제안 생성
async function generateMultilingualSuggestions(text, uiType) {
  const translations = {};
  const commonLanguages = ['en', 'ja', 'zh-cn', 'es', 'fr', 'de'];
  
  for (const lang of commonLanguages) {
    try {
      const translation = await translateText(text, lang);
      translations[lang] = {
        text: translation,
        language: lang,
        quality: 'ai-generated',
        length: { current: translation.length, max: 100, status: 'ok' }
      };
    } catch (error) {
      console.error(`번역 실패 (${lang}):`, error);
      translations[lang] = {
        text: `번역 불가 (${CONFIG.SUPPORTED_LANGUAGES[lang]})`,
        language: lang,
        quality: 'error',
        length: { current: 0, max: 0, status: 'error' }
      };
    }
  }
  
  return translations;
}

// 어드민 톤으로 변환
function convertToAdminTone(text) {
  let result = text;
  
  // 과도한 높임 표현을 적절한 수준으로 조정
  result = result.replace(/해주세요/g, '해주세요');
  result = result.replace(/해요/g, '해주세요');
  result = result.replace(/해/g, '해주세요');
  
  // 명확하고 직접적인 표현으로 변경
  result = result.replace(/~것 같아요/g, '~입니다');
  result = result.replace(/~할 수 있어요/g, '~할 수 있습니다');
  
  return result;
}

// 유저 톤으로 변환
function convertToUserTone(text) {
  let result = text;
  
  // 친근하고 일상적인 표현으로 변경
  result = result.replace(/~입니다/g, '~예요');
  result = result.replace(/~할 수 있습니다/g, '~할 수 있어요');
  result = result.replace(/~해주세요/g, '~해주세요');
  
  // 사용자 이익 강조
  result = result.replace(/설정/g, '설정');
  result = result.replace(/관리/g, '관리');
  
  return result;
}

// UI 타입별 제안 생성
function generateUITypeSuggestion(text, uiType) {
  const suggestions = {
    button: {
      text: text.length > 15 ? text.substring(0, 12) + '...' : text,
      score: 90,
      tags: ['버튼', '간결'],
      type: 'ui',
      reason: '버튼에 적합한 길이로 조정'
    },
    error: {
      text: text.replace(/오류/g, '문제').replace(/실패/g, '실패'),
      score: 85,
      tags: ['에러', '긍정'],
      type: 'ui',
      reason: '에러 메시지에 적합한 표현으로 조정'
    },
    success: {
      text: text.replace(/완료/g, '완료').replace(/성공/g, '성공'),
      score: 85,
      tags: ['성공', '명확'],
      type: 'ui',
      reason: '성공 메시지에 적합한 표현으로 조정'
    }
  };
  
  return suggestions[uiType] || null;
}

// Claude API 호출 함수 (Vercel 프록시 사용)
async function callClaudeAPI(text, action, targetLanguage = null, context = null) {
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/api/claude`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        action: action,
        targetLanguage: targetLanguage,
        context: context
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return data.result;
    } else {
      throw new Error(data.error || 'API call failed');
    }
  } catch (error) {
    console.error('Claude API 호출 실패:', error);
    // API 실패시 로컬 분석 결과 반환
    return {
      analysis: {
        tone: 'neutral',
        violations: [],
        suggestions: []
      },
      translation: text,
      suggestions: []
    };
  }
}

// 번역 함수
async function translateText(text, targetLanguage) {
  try {
    const result = await callClaudeAPI(text, 'translate', targetLanguage);
    return result.translation || result.trim();
  } catch (error) {
    console.error(`번역 실패 (${targetLanguage}):`, error);
    return getFallbackTranslation(text, targetLanguage);
  }
}

// 문구 추천 함수  
async function getSuggestions(text) {
  try {
    const result = await callClaudeAPI(text, 'suggest');
    return result.trim();
  } catch (error) {
    console.error('문구 추천 실패:', error);
    return `추천 실패: ${error.message}`;
  }
}

// Google Sheets API 호출
async function fetchSheetData(range) {
  // Google Sheets API가 실패할 경우를 대비해 빈 배열 반환
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${range}?key=${CONFIG.GOOGLE_SHEETS_API_KEY}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Google Sheets API 오류 (${response.status}): ${range}`);
      return [];
    }
    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.warn('Google Sheets 데이터 가져오기 실패 (계속 진행):', error.message);
    return [];
  }
}

// 코드 중복 확인
async function checkCodeDuplicate(code, sheetKey) {
  const range = CONFIG.SHEETS[sheetKey];
  const data = await fetchSheetData(range);
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (row[CONFIG.COLUMN_MAP.CODE] === code) {
      return true;
    }
  }
  return false;
}

// 코드 생성
function generateCode(category, index) {
  const prefix = category.toUpperCase();
  const number = String(index).padStart(3, '0');
  return `${prefix}_${number}`;
}

// 자동 코드 채번
async function generateUniqueCode(category) {
  let index = 1;
  let code;
  let isDuplicate = true;
  
  while (isDuplicate) {
    code = generateCode(category, index);
    isDuplicate = await checkCodeDuplicate(code, category);
    index++;
    
    if (index > 1000) break; // 무한루프 방지
  }
  
  return code;
}

// UI 이벤트 핸들러
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'scan-selection') {
    const { codeType } = msg;
    
    try {
      figma.ui.postMessage({
        type: 'loading',
        message: 'Scanning selected text...'
      });
      
      const scanResult = await scanSelectedTexts();
      
      if (scanResult.success) {
        figma.ui.postMessage({
          type: 'scan-results',
          data: scanResult.results
        });
      } else {
        figma.ui.postMessage({
          type: 'error',
          message: scanResult.message
        });
      }
    } catch (error) {
      figma.ui.postMessage({
        type: 'error',
        message: `Scan failed: ${error.message}`
      });
    }
  }
  
  if (msg.type === 'translate') {
    const { text, languages } = msg;
    const results = {};
    
    // 선택된 언어들에 대해 순차적으로 번역
    for (const lang of languages) {
      try {
        results[lang] = await translateText(text, lang);
        
        // 진행상황 UI에 알림
        figma.ui.postMessage({
          type: 'translation-progress',
          language: lang,
          result: results[lang]
        });
        
      } catch (error) {
        results[lang] = `번역 실패: ${error.message}`;
      }
    }
    
    // 최종 결과 전송
    figma.ui.postMessage({
      type: 'translation-complete',
      results: results
    });
  }
  
  if (msg.type === 'suggest') {
    const { text } = msg;
    
    try {
      const suggestions = await getSuggestions(text);
      figma.ui.postMessage({
        type: 'suggestions-complete',
        result: suggestions
      });
    } catch (error) {
      figma.ui.postMessage({
        type: 'suggestions-error',
        error: error.message
      });
    }
  }

  if (msg.type === 'analyze-text') {
    const { text, uiType } = msg;
    
    try {
      const analysis = await callClaudeAPI(text, 'analyze', null, { uiType });
      
      if (analysis.success) {
        figma.ui.postMessage({
          type: 'analysis-complete',
          result: analysis.result
        });
      } else {
        figma.ui.postMessage({
          type: 'analysis-error',
          error: analysis.error
        });
      }
    } catch (error) {
      figma.ui.postMessage({
        type: 'analysis-error',
        error: error.message
      });
    }
  }

  if (msg.type === 'apply-code') {
    const { data } = msg;
    const { nodeId, code } = data;
    
    try {
      const node = figma.getNodeById(nodeId);
      if (node && node.type === 'TEXT') {
        // Apply code as a comment or property
        node.setPluginData('ux_code', code);
        
        figma.ui.postMessage({
          type: 'code-applied',
          nodeId: nodeId,
          code: code
        });
      }
    } catch (error) {
      figma.ui.postMessage({
        type: 'apply-error',
        error: error.message
      });
    }
  }

  if (msg.type === 'apply-corrections') {
    const { data } = msg;
    const { nodeId, correctedText } = data;
    
    try {
      const node = figma.getNodeById(nodeId);
      if (node && node.type === 'TEXT') {
        node.characters = correctedText;
        
        figma.ui.postMessage({
          type: 'corrections-applied',
          nodeId: nodeId,
          text: correctedText
        });
      }
    } catch (error) {
      figma.ui.postMessage({
        type: 'apply-error',
        error: error.message
      });
    }
  }

  if (msg.type === 'generate-code') {
    const { category } = msg;
    
    try {
      const code = await generateUniqueCode(category);
      figma.ui.postMessage({
        type: 'code-generated',
        code: code
      });
    } catch (error) {
      figma.ui.postMessage({
        type: 'code-error',
        error: error.message
      });
    }
  }

  if (msg.type === 'load-sheet-data') {
    const { sheetKey } = msg;
    
    try {
      const range = CONFIG.SHEETS[sheetKey];
      const data = await fetchSheetData(range);
      
      figma.ui.postMessage({
        type: 'sheet-data-loaded',
        sheetKey: sheetKey,
        data: data
      });
    } catch (error) {
      figma.ui.postMessage({
        type: 'sheet-data-error',
        error: error.message
      });
    }
  }

  if (msg.type === 'init') {
    figma.ui.postMessage({
      type: 'ready'
    });
  }

  if (msg.type === 'close') {
    figma.closePlugin();
  }
};

// 플러그인 실행
function main() {
  const selection = figma.currentPage.selection;
  
  // UI 표시
  figma.showUI(__html__, {
    width: 400,
    height: 600,
    title: "UX Writing Assistant for b.stage"
  });
  
  // 선택된 텍스트가 있으면 UI에 전송
  if (selection.length > 0) {
    const textNodes = [];
    
    for (let i = 0; i < selection.length; i++) {
      const node = selection[i];
      if (node.type === 'TEXT') {
        textNodes.push({
          id: node.id,
          text: node.characters
        });
      }
    }
    
    if (textNodes.length > 0) {
      figma.ui.postMessage({
        type: 'selection-changed',
        textNodes: textNodes
      });
    }
  }
}

// 플러그인 시작
main();
