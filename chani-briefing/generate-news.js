const NewsCardGenerator = require('./news-card-generator');
const path = require('path');
const fs = require('fs');
const config = require('./config');

async function generateNewsFromCLI(date) {
  try {
    console.log(`\n🚀 찬이브리핑뉴스 생성 시작 - ${date}`);
    
    const generator = new NewsCardGenerator();
    const result = await generator.generateNewsCards(date);
    
    console.log('\n✅ ===== 생성 완료 =====');
    console.log(`📅 날짜: ${result.date}`);
    console.log(`📰 메인 뉴스 카드: ${result.mainNewsCardPath}`);
    console.log(`🏌️ 골프 뉴스 카드: ${result.golfNewsCardPath}`);
    console.log(`📄 뉴스 요약: ${result.summaryPath}`);
    
    return result;
  } catch (error) {
    console.error(`\n❌ 오류가 발생했습니다: ${error.message}`);
    process.exit(1);
  }
}

function main() {
  console.log('🤖 찬이브리핑뉴스 시스템 시작');
  console.log(`📍 실행 환경: ${process.env.GITHUB_ACTIONS ? 'GitHub Actions' : 'Local'}`);
  
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    const date = args[0];
    console.log(`📅 지정된 날짜: ${date}`);
    generateNewsFromCLI(date);
  } else {
    const today = new Date();
    const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    console.log(`📅 오늘 날짜로 생성: ${date}`);
    generateNewsFromCLI(date);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  generateNewsFromCLI
};
