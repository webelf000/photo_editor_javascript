
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
  sessionStorage.setItem("sidx", 6);
  
  // location.href = type == 0 ? "photo_paper.html" : "print_paper.html";

  $.post(cover_send_url,
  {
    front_cover: cover,
    page_info: type,
    easy_cutting: easy_cutting
  },
  function(data, status){
    console.log(data);
    if (status == "success") {
      sessionStorage.setItem("sidx", JSON.parse(data).sidx);
      if (toOption == 0)
        location.href = type == 0 ? "photo_paper.html" : "print_paper.html";
    }
    else
      alert("보관도중 오유가 발생하였습니다.");
  });
}