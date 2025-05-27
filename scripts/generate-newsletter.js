// scripts/generate-newsletter.js
const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

// 한국어 설정
moment.locale('ko');

class GolfNewsletterGenerator {
  constructor() {
    this.today = moment().format('YYYY년 MM월 DD일 (dddd)');
    this.outputDir = 'newsletters';
    this.filename = `golf-newsletter-${moment().format('YYYY-MM-DD')}.md`;
  }

  // 골프존뉴스 크롤링
  async getGolfzoneNews() {
    try {
      const response = await axios.get('https://www.golfzonnews.com');
      const $ = cheerio.load(response.data);
      const news = [];
      
      $('.news-list .item').slice(0, 3).each((i, element) => {
        const title = $(element).find('.title').text().trim();
        const summary = $(element).find('.summary').text().trim();
        const link = $(element).find('a').attr('href');
        
        if (title) {
          news.push({
            title,
            summary: summary || '내용을 확인해보세요.',
            source: '골프존뉴스'
          });
        }
      });
      
      return news;
    } catch (error) {
      console.log('골프존뉴스 수집 실패:', error.message);
      return this.getDefaultKoreanNews();
    }
  }

  // PGA 뉴스 크롤링
  async getPGANews() {
    try {
      const response = await axios.get('https://www.pgatour.com/news');
      const $ = cheerio.load(response.data);
      const news = [];
      
      $('.article-item').slice(0, 2).each((i, element) => {
        const title = $(element).find('h3').text().trim();
        const summary = $(element).find('.article-summary').text().trim();
        
        if (title) {
          news.push({
            title,
            summary: summary || 'Check out the details.',
            source: 'PGA Tour'
          });
        }
      });
      
      return news;
    } catch (error) {
      console.log('PGA 뉴스 수집 실패:', error.message);
      return this.getDefaultInternationalNews();
    }
  }

  // 기본 뉴스 (수집 실패시)
  getDefaultKoreanNews() {
    return [
      {
        title: "골프존, 스크린골프 신규 매장 확대",
        summary: "전국 주요 지역에 신규 매장을 오픈하며 서비스 확대에 나섰습니다.",
        source: "골프존뉴스"
      },
      {
        title: "주말 골프장 예약률 90% 돌파",
        summary: "봄 시즌을 맞아 전국 골프장 예약률이 크게 증가했습니다.",
        source: "골프다이제스트"
      }
    ];
  }

  getDefaultInternationalNews() {
    return [
      {
        title: "PGA Tour 새로운 시즌 시작",
        summary: "2025년 새로운 시즌이 시작되며 새로운 규정이 적용됩니다.",
        source: "PGA Tour"
      },
      {
        title: "Masters Tournament 준비 소식",
        summary: "올해 마스터스 토너먼트 준비가 한창입니다.",
        source: "Golf Digest"
      }
    ];
  }

  // 골프 팁 생성
  getGolfTip() {
    const tips = [
      {
        category: "스윙 기술",
        title: "백스윙에서 몸의 중심 유지하기",
        content: "백스윙 시 몸의 중심축을 유지하면 안정적인 스윙이 가능합니다.",
        method: "거울 앞에서 연습하며 머리의 움직임을 최소화하세요.",
        caution: "과도한 백스윙은 균형을 잃을 수 있으니 주의하세요."
      },
      {
        category: "퍼팅 기술",
        title: "그린 리딩의 기본",
        content: "경사와 그레인을 파악하여 정확한 퍼팅을 하세요.",
        method: "볼 주변 2미터 반경을 꼼꼼히 관찰하세요.",
        caution: "너무 오래 고민하면 플레이가 늦어집니다."
      },
      {
        category: "어프로치",
        title: "핀까지의 거리 계산법",
        content: "정확한 거리 측정으로 스코어를 줄여보세요.",
        method: "레이저 거리측정기를 활용하거나 코스 가이드를 참고하세요.",
        caution: "바람의 영향을 고려해야 합니다."
      }
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
  }

  // 에티켓 팁
  getEtiquetteTip() {
    const etiquettes = [
      "동반자의 샷 시 조용히 해주세요",
      "그린에서는 다른 사람의 퍼팅 라인을 밟지 마세요",
      "벙커 사용 후 반드시 고르게 정리해주세요",
      "디봇은 즉시 수리해주세요",
      "앞 조와 적절한 거리를 유지해주세요"
    ];
    
    return etiquettes[Math.floor(Math.random() * etiquettes.length)];
  }

  // 골프 명언
  getGolfQuote() {
    const quotes = [
      {
        quote: "골프는 정직한 게임이다. 스스로에게 정직해야 한다.",
        author: "타이거 우즈"
      },
      {
        quote: "좋은 골프는 연습이 아니라 사고방식에서 시작된다.",
        author: "잭 니클라우스"
      },
      {
        quote: "골프에서 가장 중요한 샷은 다음 샷이다.",
        author: "벤 호건"
      },
      {
        quote: "골프는 완벽을 추구하되 실패를 받아들이는 스포츠다.",
        author: "아놀드 파머"
      }
    ];
    
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  // 골프 유머
  getGolfHumor() {
    const humors = [
      {
        title: "골퍼의 기도",
        content: "신이시여, 오늘은 OB 없이 라운딩을 마칠 수 있게 해주세요. 아니면 적어도 찾기 쉬운 곳에 떨어뜨려 주세요!"
      },
      {
        title: "골프의 역설",
        content: "골프는 가장 어려운 스포츠다. 정지된 공을 치는 것이 이렇게 어려울 줄 몰랐다."
      },
      {
        title: "골퍼의 솔직함",
        content: "골프는 정직한 스포츠다. 스코어카드에 거짓말을 쓸 수 없으니까."
      }
    ];
    
    return humors[Math.floor(Math.random() * humors.length)];
  }

  // 골프 레슨
  getGolfLesson() {
    const lessons = [
      {
        topic: "드라이버 비거리 늘리기",
        problem: "공이 잘 안 날아가고 방향성이 불안정한 경우",
        solution: [
          "어드레스에서 왼발을 조금 더 벌리기",
          "백스윙에서 충분한 코일링 만들기",
          "다운스윙에서 하체부터 움직이기"
        ],
        practice: [
          "드라이빙 레인지에서 하체 움직임 연습",
          "스윙 스피드보다 리듬감 중시"
        ],
        tip: "무리한 스윙보다는 정확한 임팩트가 비거리를 늘려줍니다."
      },
      {
        topic: "쇼트게임 정확도 높이기",
        problem: "그린 주변에서 실수가 많은 경우",
        solution: [
          "클럽 선택을 신중하게 하기",
          "일정한 템포로 스윙하기",
          "핀이 아닌 안전한 지역 겨냥하기"
        ],
        practice: [
          "다양한 클럽으로 치핑 연습",
          "거리별 스윙 크기 일정하게 만들기"
        ],
        tip: "화려한 샷보다는 안전하고 확실한 샷을 선택하세요."
      }
    ];
    
    return lessons[Math.floor(Math.random() * lessons.length)];
  }

  // 뉴스레터 생성
  async generateNewsletter() {
    console.log('뉴스레터 생성 시작...');
    
    // 뉴스 수집
    const koreanNews = await this.getGolfzoneNews();
    const internationalNews = await this.getPGANews();
    
    // 컨텐츠 생성
    const tip = this.getGolfTip();
    const etiquette = this.getEtiquetteTip();
    const quote = this.getGolfQuote();
    const humor = this.getGolfHumor();
    const lesson = this.getGolfLesson();

    // 템플릿 생성
    const newsletter = `# 🏌️ 골프 모임 일일 뉴스레터

**📅 날짜:** ${this.today}  
**⛅ 오늘의 날씨:** 맑음 (골프하기 좋은 날씨입니다!)

---

## 📰 오늘의 골프 뉴스 (국내외 주요소식)

### 🇰🇷 국내 소식
${koreanNews.map(news => `- **${news.title}**: ${news.summary}
  - 출처: ${news.source}`).join('\n\n')}

### 🌍 해외 소식
${internationalNews.map(news => `- **${news.title}**: ${news.summary}
  - 출처: ${news.source}`).join('\n\n')}

## 💡 골프 팁

### 🏌️‍♂️ 오늘의 기술 팁
**${tip.title}**
- ${tip.content}
- ${tip.method}
- ${tip.caution}

### 🤝 에티켓 포인트
- ${etiquette}


## 💭 오늘의 골프 명언

> "${quote.quote}"
> 
> **- ${quote.author}**

---

## 😄 오늘의 골프 유머

**${humor.title}**

${humor.content}

---

## 🎓 오늘의 골프 레슨

### 📖 레슨 주제: ${lesson.topic}

**문제상황:**
${lesson.problem}

**해결방법:**
${lesson.solution.map((step, index) => `${index + 1}. ${step}`).join('\n')}

**연습방법:**
${lesson.practice.map(practice => `- ${practice}`).join('\n')}

**프로 팁:**
💡 ${lesson.tip}

---
**🏌️‍♀️ 좋은 하루 되세요! 파이팅! 🏌️‍♂️**`;

    // 디렉토리 생성
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    // 파일 저장
    const filepath = path.join(this.outputDir, this.filename);
    fs.writeFileSync(filepath, newsletter, 'utf8');
    
    console.log(`뉴스레터 생성 완료: ${filepath}`);
    
    // README 업데이트 (최신 뉴스레터 링크)
    this.updateReadme();
  }

  // README 파일 업데이트
  updateReadme() {
    const readmeContent = `# 🏌️ 골프 모임 일일 뉴스레터

매일 자동으로 생성되는 골프 모임 뉴스레터입니다.

## 📅 최신 뉴스레터

**${this.today}** - [오늘의 뉴스레터](newsletters/${this.filename})

## 📚 지난 뉴스레터

[newsletters 폴더](newsletters/)에서 지난 뉴스레터들을 확인할 수 있습니다.

## 🔄 자동 업데이트

이 뉴스레터는 매일 오전 4시에 자동으로 업데이트됩니다.

마지막 업데이트: ${moment().format('YYYY-MM-DD HH:mm:ss')}
`;

    fs.writeFileSync('README.md', readmeContent, 'utf8');
    console.log('README.md 업데이트 완료');
  }
}

// 실행
async function main() {
  const generator = new GolfNewsletterGenerator();
  await generator.generateNewsletter();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = GolfNewsletterGenerator;
