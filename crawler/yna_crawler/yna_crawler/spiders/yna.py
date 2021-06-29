# -*- coding: utf-8 -*-

from scrapy.utils.project import get_project_settings

from scrapy.spidermiddlewares.httperror import HttpError
from twisted.internet.error import TimeoutError, TCPTimedOutError
from twisted.internet.error import DNSLookupError

from datetime import datetime, timedelta

import os
import scrapy
import re


class YnaSpider(scrapy.Spider):
  name = 'yna_spider'
  crawler_id = 'yna_crawler'
  board_id = 'news_yna'
  board_name = ['total']
  board_error = [False]
  start_urls = ['https://www.yna.co.kr/news?site=navi_latest_depth01']

  news_url = 'https://www.yna.co.kr/news/'

  # https://docs.scrapy.org/en/2.4/topics/settings.html
  custom_settings = {
      # https://docs.scrapy.org/en/2.4/topics/settings.html#robotstxt-obey
      'ROBOTSTXT_OBEY': (os.getenv('EDGE_ROBOTSTXT_OBEY', 'True') == 'True'),
      # https://docs.scrapy.org/en/2.4/topics/settings.html#log-level
      'LOG_LEVEL': os.getenv('EDGE_LOG_LEVEL', 'INFO'),
      # https://docs.scrapy.org/en/2.4/topics/settings.html#concurrent-requests-per-domain
      'CONCURRENT_REQUESTS_PER_DOMAIN': os.getenv('EDGE_CONCURRENT_REQUESTS_PER_DOMAIN', 2),
      # https://docs.scrapy.org/en/2.4/topics/settings.html#download-delay
      'DOWNLOAD_DELAY': os.getenv('EDGE_DOWNLOAD_DELAY', 0.5),
      # https://docs.scrapy.org/en/2.4/topics/feed-exports.html#feed-export-encoding
      'FEED_EXPORT_ENCODING': os.getenv('EDGE_FEED_EXPORT_ENCODING', 'utf-8'),
  }

  def __init__(self):
    self.settings = get_project_settings()

  def start_requests(self):
    for url in self.start_urls:
      yield scrapy.Request(url=url, callback=self.parse, errback=self.error_page)

  def parse(self, response):
    # unset NEWS_PAGE_NUMBER
    # export NEWS_PAGE_NUMBER=1
    page = int(os.getenv('NEWS_PAGE_NUMBER', '0'))
    self.logger.info(">>>>>>>>>>>>>>>> scrap %d page <<<<<<<<<<<<<<<<", page)
    for i in range(1, page+1):
      yield response.follow(self.news_url + str(i), self.parse_page)

  def parse_page(self, response):
    article_total = response.xpath('//*[@id="container"]/div/div/div[1]/section/div[1]').get()
    article_list = article_total.split('<div class="item-box01">')
    if len(article_list) > 1:
      article_list.pop(0)
    else:
      return

    for article in article_list:
      article_url = article.split('<div class="news-con">')[1].split('<a href="')[1].split('" class=')[0]

      yield response.follow('https:' + article_url, self.parse_article)

  def parse_article(self, response):
    article_date = response.xpath('//*[@id="articleWrap"]/div[1]/header/p/text()').get()

    # 컨테이너 시간을 KST로 지정해야 합니다.
    article_date_time = datetime.strptime(article_date, '%Y-%m-%d %H:%M')
    hour_ago_date = (datetime.now() + timedelta(hours=-1)).replace(minute=0, second=0, microsecond=0)
    now_date = datetime.now().replace(minute=0, second=0, microsecond=0)

    self.logger.debug("article_date_time: %s", article_date_time)
    self.logger.debug("hour_ago_date: %s", hour_ago_date)
    self.logger.debug("now_date: %s", now_date)

    if hour_ago_date <= article_date_time and article_date_time < now_date:
      item = {}

      url = response.request.url
      article_date_datetime = article_date_time.strftime("%Y-%m-%dT%H:%M:%S+09:00")

      item['title'] = self.text_escape(response.xpath('//*[@id="articleWrap"]/div[1]/header/h1/text()').get())
      item['content'] = self.text_escape(response.xpath('//*[@id="articleWrap"]/div[2]/div/div/article/p/text()').extract())
      item['url'] = url
      item['news_category'] = self.text_escape(response.xpath('//*[@id="articleWrap"]/div[1]/header/ul[1]/li[2]/a/text()').get())
      item['article_date'] = article_date_datetime
      item['crawled_date'] = datetime.now().strftime("%Y-%m-%dT%H:%M:%S+09:00")
      self.logger.debug(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> parse_article <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
      self.logger.debug("article_content:\n%s\n", item['content'])

      yield item

  def text_escape(self, texts):
    result_text = ''
    for text in texts:
      regex = re.compile(r'[\n\r\t\xa0]')
      text = regex.sub('', text)
      result_text = result_text + text

    return result_text

  def error_page(self, failure):
    request = failure.request
    self.logger.error('[ERROR] %s', request.url)
    url_index = self.start_urls.index(request.url)
    self.board_error[url_index] = True

    if failure.check(HttpError):
      response = failure.value.response
      self.update_link(
          self.crawler_id, self.board_id + "_" + self.board_name[url_index],
          str(response.status),
          self.start_urls[url_index],
          0)
    elif failure.check(DNSLookupError):
      self.update_link(
          self.crawler_id, self.board_id + "_" + self.board_name[url_index],
          'DNSLookupError', self.start_urls[url_index],
          0)
    elif failure.check(TimeoutError, TCPTimedOutError):
      self.update_link(
          self.crawler_id, self.board_id + "_" + self.board_name[url_index],
          'TimeoutError', self.start_urls[url_index],
          0)

  def closed(self, _reason):
    self.logger.info('[CLOSE] %s', self.name)
