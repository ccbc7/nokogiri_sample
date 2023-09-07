let KEYWORDS = [
    {
        "word": "いなべ市",
        "keyword_id": "1",
        "name": "いなべ市"
    },
    {
        "word": "神社",
        "keyword_id": "2",
        "name": "神社"
    },
    {
        "word": "御朱印",
        "keyword_id": "2",
        "name": "神社"
    },
    {
        "word": "金井神社",
        "keyword_id": "2",
        "name": "神社"
    },
    {
        "word": "参拝",
        "keyword_id": "2",
        "name": "神社"
    },
    {
        "word": "かない風鈴",
        "keyword_id": "2",
        "name": "神社"
    },
    {
        "word": "花",
        "keyword_id": "3",
        "name": "花"
    },
    {
        "word": "花火大会",
        "keyword_id": "4",
        "name": "花火"
    },
    {
        "word": "花火",
        "keyword_id": "4",
        "name": "花火"
    },
    {
        "word": "子ども",
        "keyword_id": "5",
        "name": "ファミリー"
    },
    {
        "word": "ファミリー",
        "keyword_id": "5",
        "name": "ファミリー"
    },
    {
        "word": "子供",
        "keyword_id": "5",
        "name": "ファミリー"
    },
    {
        "word": "家族",
        "keyword_id": "5",
        "name": "ファミリー"
    },
    {
        "word": "アンパンマン",
        "keyword_id": "5",
        "name": "ファミリー"
    },
    {
        "word": "アンパンマン",
        "keyword_id": "5",
        "name": "ファミリー"
    },
    {
        "word": "動物園",
        "keyword_id": "6",
        "name": "動物園"
    },
    {
        "word": "水族館",
        "keyword_id": "7",
        "name": "水族館"
    },
    {
        "word": "キャンプ",
        "keyword_id": "8",
        "name": "キャンプ"
    },
];


//除外
let setting = {
    "jyogais": ["noscript", "script", "header", "footer", ".topics-aside"]
};


/**
 * 解析
 */
function Analysis(element) {

    //除外要素を取り除く
    let jyogais = setting["jyogais"];
    removeJyogai(jyogais, element);

    //キーワードの取得
    let keywords = getKeyword();

    //ランキングの取得
    let rankings = getRanking(keywords, element);

    //使用頻度でのソート
    rankings.sort(compareFrequencyOfUse);

    //上位指定件数に絞る
    rankings = rankings.slice(0, 3)


    //★★★
    //単語取得
    getTango(keywords, element);

    return rankings;
}

/**
 * 除外要素を取り除く
 */
function removeJyogai(jyogais, element) {

    //除外要素かを判定
    if (judgementJyogai(jyogais, element)) {
        element.parentNode.removeChild(element);
        return;
    }

    //子要素がある場合は子要素で再帰
    if (element.children.length != 0) {
        let childElems = element.children;
        let len = childElems.length;
        for (var i = len - 1; i >= 0; i--) {
            removeJyogai(jyogais, childElems[i]);
        }
    }
}

/**
 * 除外要素かを判定
 * setting.jyogaisはセレクターの配列とし、独自でやる場合は下記のようにid,class,要素名は設定可能にする
 * selectorが使用できる場合はそれの方がより良し。
 */
function judgementJyogai(jyogais, element) {
    for (let i = 0; i < jyogais.length; i++) {
        let jyogai = jyogais[i];
        if (jyogai.slice(0, 1) == "#") {
            let name = jyogai.slice(1);
            if (jyogai.id == name) {
                return true;
            }
        } else if (jyogai.slice(0, 1) == ".") {
            let name = jyogai.slice(1);
            if (element.classList.contains(name)) {
                return true;
            }
        } else {
            let name = jyogai;
            if (element.localName == name.trim()) {
                return true;
            }
        }
    }
    return false;
}

/**
 * キーワードの取得
 */
function getKeyword() {
    return KEYWORDS.sort(compareWordLength);
}

/**
 * キーワードの文字数でソート（降順）
 */
function compareWordLength(a, b) {
    if (a["word"].length < b["word"].length) return 1;
    if (a["word"].length > b["word"].length) return -1;
    return 0;
}

/**
 * ランキングの取得
 */
function getRanking(keywords, element) {

    let text = element.innerText;
    text = text.replace(/　/g, " ");
    text = text.replace(/\r?\n/g, " ");
    text = text.replace(/ +/g, " ");

    let rankings = [];
    keywords.forEach(keyword => {

        //指定ワードが存在する数を取得
        let count = (text.match(new RegExp(keyword["word"], "g")) || []).length;

        if (count != 0) {

            //キーワード毎のランキングデータに登録
            let ranking = getRankingResult(rankings, keyword["keyword_id"]);
            if (ranking == null) {
                ranking = {
                    "keyword_id": keyword["keyword_id"],
                    "name": keyword["name"],
                    "count": 0
                };
                rankings.push(ranking);
            }
            ranking["count"] += count;

            //処理済みワードを削除する
            let reg = new RegExp(keyword["word"], "g");
            text = text.replace(reg, ' ')

            console.log("[" + keyword["word"] + "] が " + count + "件マッチしました。 " + keyword["name"] + "に加算されます。");
        }

    });

    element.innerText = text;

    return rankings;
}

function getRankingResult(rankings, keyword_id) {
    for (let i = 0; i < rankings.length; i++) {
        if (rankings[i]["keyword_id"] == keyword_id) {
            return rankings[i];
        }
    }
    return null;
}

/**
 * 使用頻度でのソート
 */
function compareFrequencyOfUse(a, b) {
    if (a["count"] < b["count"]) return 1;
    if (a["count"] > b["count"]) return -1;
    return 0;
}

//JsのサンプルではHtmlを壊すとまずいのでcloneを作成している
//rubyの場合のこぎりでnodeを取得できる場合はそのbodyでよい
let body = document.querySelector("body");
console.log(body);

let element = body.cloneNode(true);
let rankings = Analysis(element);

console.log(element);

//デバッグ
let text = "";
rankings.forEach(ranking => {
    if (text != "") text = text + "、";
    text = text + "[" + ranking["name"] + "]";
});
console.log("このページは" + text + "のページです。");


/**
 * 単語の取得
 */
function getTango(keywords, element) {

    let text = element.innerText;
    text = text.replace(/　/g, " ");
    text = text.replace(/\r?\n/g, " ");
    text = text.replace(/ +/g, " ");


}

