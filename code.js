// ================= CONFIG =================
const CONFIG = {
  // Vercel 배포된 프록시 API URL
  PROXY_API_URL: 'https://uxwaichatbot-ai.vercel.app/api/claude',
  
  GOOGLE_SHEETS_API_KEY: 'AIzaSyD96DGqwpEaI6aenSZs0fxDdt0vr-mJNqO',
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
  }
};

// ================= UX 라이팅 가이드 시스템 =================
const UX_WRITING_GUIDE = {
  TONE_DETECTION: {
    admin: {
      keywords: ['관리', '설정', '등록', '승인', '거부', '통계', '분석', '어드민'],
      characteristics: ['명확성', '전문성', '간결성']
    }
  }
};

// Claude API 호출 함수 (Vercel 프록시 사용)
async function callClaudeAPI(text, action, targetLanguage = null) {
  try {
    const response = await fetch(CONFIG.PROXY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        action: action,
        targetLanguage: targetLanguage
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return data.result;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Claude API 호출 실패:', error);
    throw error;
  }
}

// 번역 함수
async function translateText(text, targetLanguage) {
  try {
    const result = await callClaudeAPI(text, 'translate', targetLanguage);
    return result.trim();
  } catch (error) {
    console.error(`번역 실패 (${targetLanguage}):`, error);
    return `번역 실패: ${error.message}`;
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
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${range}?key=${CONFIG.GOOGLE_SHEETS_API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error('Google Sheets 데이터 가져오기 실패:', error);
    return [];
  }
}

// 코드 중복 확인
async function checkCodeDuplicate(code, sheetKey) {
  const range = CONFIG.SHEETS[sheetKey];
  const data = await fetchSheetData(range);
  
  return data.some(row => row[CONFIG.COLUMN_MAP.CODE] === code);
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
    
    selection.forEach(node => {
      if (node.type === 'TEXT') {
        textNodes.push({
          id: node.id,
          text: node.characters
        });
      }
    });
    
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
