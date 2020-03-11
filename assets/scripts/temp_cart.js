function orderBook(){
    const url = "http://thecamp.inity.co.kr/Book/Bookmake.asp"; //최종보관URL
    var sidx = sessionStorage.getItem('sidx');
    if (sidx == null) sidx = 0;
    $.post(
      url,
      {
        sidx: sidx
      },
      function(data, status) {
        if (status == "success") {
          location.href="settle.html"
        }
        else {
          alert("오류가 발생하였습니다.");
        }
      }
    );
}
var type;
var cover;
$(function(){
    type = sessionStorage.getItem('type');
    cover = sessionStorage.getItem('cover');
    var easy_cutting = sessionStorage.getItem('easy_cutting');
    if (type == 1)
        $('.paper_type').eq(0).html("인쇄지(양면)");
    else
        $('.paper_type').eq(0).html("인화지(단면)");
    if (easy_cutting == 1)
        $('.easy_cutting').eq(0).html("있음");
    else
        $('.easy_cutting').eq(0).html("없음");
    var page_add = sessionStorage.getItem('page_add');
    if (page_add > 0)
        $('.page_add').eq(0).html("있음");
    else
        $('.page_add').eq(0).html("없음");
    var page_count = sessionStorage.getItem('page_count');
    $('.page_count').eq(0).html(page_count);
    var val = sessionStorage.getItem('value');
    if (val == 0) val = 9900;
    $('.value').eq(0).html(formatMoney(val, 0, 3, ','));
    // $('#all_value').html(formatMoney((parseInt(val) + 2500), 0, 3, ','));
    console.log("data");
    $.get(
        "http://thecamp.inity.co.kr/Book/CoverInfo.asp",
        {},
        function(data, status){
          if (status=="success") {
            showFinalCover(JSON.parse(data))
          }
          else {
            alert("오유가 발생하였습니다.");
          }
        }
      );
});

function showFinalCover(data) {
    var coverInfo = data.coverinfo;
    coverInfo.forEach(element => {
        if (element.num = cover) {
            document.getElementsByClassName('cover_thumb')[0].setAttribute('src', element.url);
        }
    });
  }

function formatMoney(number, decPlaces, decSep, thouSep) {
    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
    decSep = typeof decSep === "undefined" ? "." : decSep;
    thouSep = typeof thouSep === "undefined" ? "," : thouSep;
    var sign = number < 0 ? "-" : "";
    var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
    var j = (j = i.length) > 3 ? j % 3 : 0;
    
    return sign +
      (j ? i.substr(0, j) + thouSep : "") +
      i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
      (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
    }

function returnEdit() {
    location.href = type == 0 ? "photo_paper.html" : "print_paper.html";
}