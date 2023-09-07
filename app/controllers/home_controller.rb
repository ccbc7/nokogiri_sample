class HomeController < ApplicationController
  require 'open-uri'
  require 'nokogiri'
  require 'uri'

  WORDS = ["自然", "景色", "海", "名物", "食", "山", "絶景", "歴史", "温泉","サウナ", "湯", "魚", "宿泊", "フッター", "ヘッダー", "div", "class", "伝統", "酒"]

  def index
  end

  def aaa
    body = request.body.read # request.body.read でリクエストボディを読み取り、JSON.parse でJSONをRubyのハッシュに変換します。
    parsed_data = JSON.parse(body)
    targetUrl = parsed_data["targetUrl"]

    puts targetUrl

    data = analyse(targetUrl)
    render :json => data
  end

  def analyse(url)
    html = URI.open(url).read
    charset = 'utf-8'
    doc = Nokogiri::HTML.parse(html, nil, charset)
    body = doc.at_css('body')
    body.css('footer, header').each do |element|#複数の要素を取得する場合はcssを使う
      element.remove
    end

    article = body.text

    word_counts = Hash.new(0) # この位置でword_countsを初期化

    title = doc.at_css('title').text

    WORDS.each do |word|
      count = article.scan(/#{word}/).count
      word_counts[word] = count
    end

    top_3_words = word_counts.sort_by { |_, v| -v }.first(3) #{ |_, v| -v }は降順に並べ替えるための記述
    result = {
      keyword: top_3_words,
    }
    return result
  end
end
