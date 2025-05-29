module.exports = {
  // 뉴스 API 설정
  apiKey: process.env.NEWS_API_KEY || '',
  newsApiEndpoint: '',
  golfNewsApiEndpoint: '',
  
  // 뉴스 수집 설정
  maxMainNewsItems: 10,
  maxGolfNewsItems: 5,
  
  // GitHub Actions용 설정
  openInBrowser: false,
  openBrowserOnStart: false,
  serverMode: false,
  autoGenerateToday: true,
  autoShare: false,
  
  // 출력 경로
  outputDir: './output',
  imageOutputDir: './output/images',
  
  // 템플릿 설정
  template: {
    mainNewsTitle: '📰 찬이브리핑 메인뉴스',
    golfNewsTitle: '🏌️ 찬이브리핑 골프뉴스',
    footer: '🤖 찬이브리핑뉴스 자동 생성 시스템'
  }
};
