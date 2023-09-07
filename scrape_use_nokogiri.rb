require 'open-uri'
require 'nokogiri'
require 'uri'

urls = [
  'https://www.kankomie.or.jp/report/1536',
  'https://www.kankomie.or.jp/report/1565'
]

words = ["自然", "景色", "海", "名物", "食", "山", "絶景", "歴史", "温泉","サウナ", "湯", "魚", "宿泊", "フッター", "ヘッダー", "div", "伝統", "酒", ]

urls.each do |url|
  html = URI.open(url).read
  charset = 'utf-8'

  doc = Nokogiri::HTML.parse(html, nil, charset)
  body = doc.at_css('body')

  # body.at_css('footer').remove if body.at_css('footer')#単数の要素を取得する場合はat_cssを使う
  body.css('footer, header').each do |element|#複数の要素を取得する場合はcssを使う
    element.remove
  end

  article = body.text
  puts article

  word_counts = Hash.new(0) # この位置でword_countsを初期化

  puts "ページ: #{url}"

  title = doc.at_css('title').text
  puts title


  words.each do |word|
    count = article.scan(/#{word}/).count
    word_counts[word] = count
  end

  top_3_words = word_counts.sort_by { |_, v| -v }.first(3) #{ |_, v| -v }は降順に並べ替えるための記述
  puts "頻出単語トップ3:"
  top_3_words.each do |word, count|
    puts "「#{word}」: #{count}回"
  end

  puts "詳細結果:"
  words.each do |word|
    puts "「#{word}」という単語は記事内で#{word_counts[word]}回出てきます。"
  end

  puts "----------------------------------\n\n"
end
