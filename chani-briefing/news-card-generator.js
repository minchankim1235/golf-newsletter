const NewsCollector = require('./news-collector');
const fs = require('fs');
const path = require('path');
const config = require('./config');

class NewsCardGenerator {
  constructor() {
    this.collector = new NewsCollector();
    this.outputDir = config.outputDir || './output';
  }

  async generateNewsCards(date) {
    try {
      console.log(`${date} 뉴스 카드 생성 시작...`);
      
      const mainNews = await this.collector.fetchPopularNews(date, config.maxMainNewsItems || 10);
      const golfNews = await this.collector.fetchGolfNews(date, config.maxGolfNewsItems || 5);
      
      console.log(`메인 뉴스 ${mainNews.length}개, 골프 뉴스 ${golfNews.length}개 수집 완료`);
      
      const mainNewsCardPath = await this.generateMainNewsCard(date, mainNews);
      const golfNewsCardPath = await this.generateGolfNewsCard(date, golfNews);
      const summaryPath = await this.generateSummaryMarkdown(date, mainNews, golfNews);
      
      return {
        date,
        mainNewsCardPath,
        golfNewsCardPath,
        summaryPath
      };
    } catch (error) {
      console.error('뉴스 카드 생성 중 오류:', error);
      throw error;
    }
  }

  async generateMainNewsCard(date, newsData) {
    const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>찬이브리핑 - 메인뉴스 ${date}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
    body { font-family: 'Noto Sans KR', sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
    .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #667eea; padding-bottom: 20px; }
    .title { font-size: 2.5em; font-weight: 700; color: #333; margin: 0; }
    .date { font-size: 1.2em; color: #666; margin-top: 10px; }
    .news-item { margin-bottom: 25px; padding: 20px; border-left: 4px solid #667eea; background: #f8f9ff; border-radius: 0 10px 10px 0; }
    .news-title { font-size: 1.3em; font-weight: 600; color: #333; margin: 0 0 10px 0; line-height: 1.4; }
    .news-content { color: #555; line-height: 1.6; margin-bottom: 10px; }
    .news-source { font-size: 0.9em; color: #888; font-weight: 500; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="title">📰 찬이브리핑 메인뉴스</h1>
      <div class="date">${date}</div>
    </div>
    <div class="news-list">
      ${newsData.map((news, index) => `
        <div class="news-item">
          <h2 class="news-title">${index + 1}. ${news.title}</h2>
          <p class="news-content">${news.content}</p>
          <div class="news-source">📍 ${news.source}</div>
        </div>
      `).join('')}
    </div>
    <div class="footer">
      <p>🤖 찬이브리핑뉴스 자동 생성 시스템</p>
      <p>생성 시간: ${new Date().toLocaleString('ko-KR')}</p>
    </div>
  </div>
</body>
</html>`;

    const filePath = path.join(this.outputDir, `main-news-${date}.html`);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`메인 뉴스 카드 생성: ${filePath}`);
    return filePath;
  }

  async generateGolfNewsCard(date, newsData) {
    const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>찬이브리핑 - 골프뉴스 ${date}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
    body { font-family: 'Noto Sans KR', sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%); min-height: 100vh; }
    .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #4CAF50; padding-bottom: 20px; }
    .title { font-size: 2.5em; font-weight: 700; color: #333; margin: 0; }
    .date { font-size: 1.2em; color: #666; margin-top: 10px; }
    .news-item { margin-bottom: 25px; padding: 20px; border-left: 4px solid #4CAF50; background: #f1f8e9; border-radius: 0 10px 10px 0; }
    .news-title { font-size: 1.3em; font-weight: 600; color: #333; margin: 0 0 10px 0; line-height: 1.4; }
    .news-content { color: #555; line-height: 1.6; margin-bottom: 10px; }
    .news-source { font-size: 0.9em; color: #888; font-weight: 500; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="title">🏌️ 찬이브리핑 골프뉴스</h1>
      <div class="date">${date}</div>
    </div>
    <div class="news-list">
      ${newsData.map((news, index) => `
        <div class="news-item">
          <h2 class="news-title">${index + 1}. ${news.title}</h2>
          <p class="news-content">${news.content}</p>
          <div class="news-source">🏌️ ${news.source}</div>
        </div>
      `).join('')}
    </div>
    <div class="footer">
      <p>🤖 찬이브리핑뉴스 자동 생성 시스템</p>
      <p>생성 시간: ${new Date().toLocaleString('ko-KR')}</p>
    </div>
  </div>
</body>
</html>`;

    const filePath = path.join(this.outputDir, `golf-news-${date}.html`);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`골프 뉴스 카드 생성: ${filePath}`);
    return filePath;
  }

  async generateSummaryMarkdown(date, mainNews, golfNews) {
    const markdown = `# 📰 찬이브리핑뉴스 - ${date}

## 🔥 메인뉴스 TOP ${mainNews.length}

${mainNews.map((news, index) => `### ${index + 1}. ${news.title}
- **출처**: ${news.source}
- **내용**: ${news.content}
- **링크**: ${news.url || 'N/A'}

`).join('')}

## 🏌️ 골프뉴스

${golfNews.map((news, index) => `### ${index + 1}. ${news.title}
- **출처**: ${news.source}
- **내용**: ${news.content}
- **링크**: ${news.url || 'N/A'}

`).join('')}

---
**생성 시간**: ${new Date().toLocaleString('ko-KR')}  
**자동 생성**: 찬이브리핑뉴스 시스템`;

    const filePath = path.join(this.outputDir, `news-summary-${date}.md`);
    fs.writeFileSync(filePath, markdown, 'utf8');
    console.log(`뉴스 요약 마크다운 생성: ${filePath}`);
    return filePath;
  }
}

module.exports = NewsCardGenerator;
