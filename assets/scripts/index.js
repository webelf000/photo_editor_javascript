
var type = 0, easy_cutting = 0;
function make_photobook() {
  var type = 0, easy_cutting = 0;
  if (document.getElementById('opt_print_paper').parentElement.classList.contains('active')) {
    type = 1;
  }
  if (document.getElementById('opt_easy_cut_off').parentElement.classList.contains('active')) {
    easy_cutting = 1;
  }
  var cover = sessionStorage.getItem("cover");
  sessionStorage.setItem("type", type);
  sessionStorage.setItem("easy_cutting", easy_cutting);
  sendCover(cover, type, easy_cutting, 0);
}

function sendCover(cover, type, easy_cutting, toOption = 1){
  const cover_send_url = "http://thecamp.inity.co.kr/Book/CoverSave.asp";
  console.log(cover);
  console.log(type);
  console.log(easy_cutting);
  var sidx = sessionStorage.getItem("sidx");
  // location.href = type == 0 ? "photo_paper.html" : "print_paper.html";

  $.post(cover_send_url,
  {
    front_cover: cover,
    page_info: type,
    easy_cutting: easy_cutting,
    sidx: (sidx == null ? 0 : sidx)
  },
  function(data, status){
    if (status == "success") {
      sessionStorage.setItem("sidx", JSON.parse(data).sidx);
      if (toOption == 0)
        location.href = type == 0 ? "photo_paper.html" : "print_paper.html";
      else
        alert('보관되였습니다.');
    }
    else
      alert("보관도중 오유가 발생하였습니다.");
  });
}

function init_here() {
  type = sessionStorage.getItem('type');
  easy_cutting = sessionStorage.getItem('easy_cutting');
  if (type == 0) {
    $('#opt_photo_paper').attr("checked", "checked");
    $('#opt_photo_paper').parent().addClass("active");
    $('#opt_print_paper').removeAttr("checked");
    $('#opt_print_paper').parent().removeClass("active");
  } else {
    $('#opt_print_paper').attr("checked", "checked");
    $('#opt_print_paper').parent().addClass("active");
    $('#opt_photo_paper').removeAttr("checked");
    $('#opt_photo_paper').parent().removeClass("active");
  }
  if (easy_cutting == 0) {
    $('#opt_easy_cut_off').attr("checked", "checked");
    $('#opt_easy_cut_off').parent().addClass("active");
    $('#opt_easy_cut_on').removeAttr("checked");
    $('#opt_easy_cut_on').parent().removeClass("active");
  } else {
    $('#opt_easy_cut_on').attr("checked", "checked");
    $('#opt_easy_cut_on').parent().addClass("active");
    $('#opt_easy_cut_off').removeAttr("checked");
    $('#opt_easy_cut_off').parent().removeClass("active");
  }
}
$(function(){
  init_here();
  if (sessionStorage.getItem("editing")) {
    if (type == 0) {
      $('#opt_photo_paper').attr("checked", "checked");
      $('#opt_photo_paper').parent().addClass("active");
      $('#opt_print_paper').removeAttr("checked");
      $('#opt_print_paper').parent().removeClass("active");
      $('#opt_print_paper').parent().addClass("disabled");
    } else {
      $('#opt_print_paper').attr("checked", "checked");
      $('#opt_print_paper').parent().addClass("active");
      $('#opt_photo_paper').removeAttr("checked");
      $('#opt_photo_paper').parent().removeClass("active");
      $('#opt_photo_paper').parent().addClass("disabled");
    }
    $('#paper_type input').closest('tr').hide();
  }
});
