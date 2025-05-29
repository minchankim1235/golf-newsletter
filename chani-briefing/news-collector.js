const axios = require('axios');
const cheerio = require('cheerio');
const config = require('./config');

class NewsCollector {
  constructor() {
    this.sources = [
      { name: '다음뉴스', url: 'https://news.daum.net/' },
      { name: '네이버뉴스', url: 'https://news.naver.com/' },
      { name: 'SBS뉴스', url: 'https://news.sbs.co.kr/' },
      { name: '연합뉴스', url: 'https://www.yna.co.kr/' },
      { name: '조선일보', url: 'https://www.chosun.com/' }
    ];
    
    this.golfSources = [
      { name: '골프한국', url: 'https://golfhankook.hankooki.com/' },
      { name: 'KPGA', url: 'https://www.kpga.co.kr/' },
      { name: '골프다이제스트', url: 'https://golfdigest.co.kr/' },
      { name: '골프경제신문', url: 'http://www.golfbiz.co.kr/' }
    ];
    
    this.axiosConfig = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    };
  }
  
  async fetchPopularNews(date, count = 10) {
    try {
      console.log(`메인 뉴스 ${count}개 수집 시작...`);
      return this.generateSampleNewsData(count);
    } catch (error) {
      console.error('메인 뉴스 수집 실패:', error.message);
      return this.generateSampleNewsData(count);
    }
  }
  
  async fetchGolfNews(date, count = 3) {
    try {
      console.log(`골프 뉴스 ${count}개 수집 시작...`);
      return this.generateSampleGolfNewsData(count);
    } catch (error) {
      console.error('골프 뉴스 수집 실패:', error.message);
      return this.generateSampleGolfNewsData(count);
    }
  }
  
  generateSampleNewsData(count) {
    const sampleNews = [
      {
        title: '정부, 주요 경제 정책 발표 예정',
        content: '정부가 내주 초 경제 활성화를 위한 종합 대책을 발표할 예정입니다.',
        source: '경제일보',
        url: 'https://example.com/news/1',
        publishedDate: new Date().toISOString()
      },
      {
        title: '교육부, 새 학기 교육 방향 제시',
        content: '교육부가 새 학기를 맞아 디지털 교육 강화와 창의적 인재 육성을 위한 새로운 교육 방향을 제시했습니다.',
        source: '한국교육신문',
        url: 'https://example.com/news/2',
        publishedDate: new Date().toISOString()
      },
      {
        title: '수도권 미세먼지 나쁨 수준 지속',
        content: '수도권 지역의 미세먼지 농도가 나쁨 수준을 유지하고 있습니다.',
        source: '환경뉴스',
        url: 'https://example.com/news/3',
        publishedDate: new Date().toISOString()
      }
    ];
    
    return sampleNews.slice(0, count);
  }
  
  generateSampleGolfNewsData(count) {
    const sampleGolfNews = [
      {
        title: 'KPGA 투어 챔피언십, 김성현 우승',
        content: '김성현 선수가 KPGA 투어 챔피언십에서 15언더파로 우승을 차지했습니다.',
        source: '골프한국',
        url: 'https://golfhankook.hankooki.com/',
        publishedDate: new Date().toISOString()
      },
      {
        title: '박인비, 미국 LPGA 투어서 준우승',
        content: '박인비 선수가 미국 LPGA 투어 대회에서 준우승을 차지했습니다.',
        source: '골프다이제스트',
        url: 'https://golfdigest.co.kr/',
        publishedDate: new Date().toISOString()
      },
      {
        title: '국내 골프장 이용료 인상 추세',
        content: '국내 주요 골프장들이 운영비 증가를 이유로 이용료를 인상하는 추세입니다.',
        source: '골프경제신문',
        url: 'http://www.golfbiz.co.kr/',
        publishedDate: new Date().toISOString()
      }
    ];
    
    return sampleGolfNews.slice(0, count);
  }
}

module.exports = NewsCollector;
