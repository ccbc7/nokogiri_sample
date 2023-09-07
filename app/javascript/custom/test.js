let btnAnalisys = document.getElementById("btnAnalisys");
btnAnalisys.addEventListener("click", btnAnalisysClick, false);

function btnAnalisysClick(e) {
    call();
}

async function call() {
    let url = "http://localhost:3000/home/aaa";

  // CSRFトークンの取得
    let csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

    let data = {};
    data["targetUrl"] = document.getElementById("textUrl").value;

    await fetch(url, {
    method: "POST",
    headers: {
        "Content-Type": "application/json;charset=utf-8",
        "X-CSRF-Token": csrfToken, // CSRFトークンをヘッダーに追加
    },
    body: JSON.stringify(data),
    })
    .then((response) => {
      return response.json(); //ここでBodyからJSONを返す
    })
    .then((a) => {
        let keyword = document.getElementById("keyword");
        keyword.value = a["keyword"];
        console.log(a); //取得したJSONデータを関数に渡す
    })
    .catch((e) => {
      console.log(e); //エラーをキャッチし表示
    });
}
