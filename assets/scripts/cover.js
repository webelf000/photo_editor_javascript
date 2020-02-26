const COVER_SEND_URL = "";

function screenShot() {
  $("#btns").hide();
  html2canvas(document.getElementById('main-editor')).then(function(canvas){
    var link=document.createElement("a");
    link.href=canvas.toDataURL('image/jpg');
    link.download = 'screenshot.jpg';
    // link.click();
    $("#btns").show();
  });
}

var max_thumbnail = 20;
function init() {
  const cover_get_url = "http://thecamp.inity.co.kr/Book/CoverInfo.asp";
  $.get(
    cover_get_url,
    {},
    function(data, status){
      if (status=="success") {
        showCovers(JSON.parse(data));
      }
      else {
        alert("오유가 발생하였습니다.");
      }
    }
  );
  // showCovers(data);
}

function showCovers(data) {
  // data = {
  //     "coverinfo": [
  //         {
  //             "num": 22,
  //             "url": "http://thecamp.inity.co.kr/Storage/Cover/2002/Cover_2002201445350939.jpg",
  //             "thumb": "http://thecamp.inity.co.kr/Storage/Cover/2002/th_Cover_2002201445350939.jpg",
  //             "title": "커버3"
  //         },
  //         {
  //             "num": 21,
  //             "url": "http://thecamp.inity.co.kr/Storage/Cover/2002/Cover_2002201445350919.jpg",
  //             "thumb": "http://thecamp.inity.co.kr/Storage/Cover/2002/th_Cover_2002201445350919.jpg",
  //             "title": "커버2"
  //         },
  //         {
  //             "num": 20,
  //             "url": "http://thecamp.inity.co.kr/Storage/Cover/2002/Cover_2002201445350909.jpg",
  //             "thumb": "http://thecamp.inity.co.kr/Storage/Cover/2002/th_Cover_2002201445350909.jpg",
  //             "title": "커버1"
  //         }
  //     ]
  // };
  var coverInfo = data.coverinfo;
  coverInfo.forEach(element => {
    var img = document.createElement('img');
    var figcaption = document.createElement('figcaption');
    img.src = element.thumb;
    img.setAttribute('imgurl', element.url);
    img.addEventListener('click', coverSelect);
    figcaption.innerHTML = element.title;
    var div = document.createElement('div');
    div.classList.add('thumbnail-item');
    div.appendChild(img);
    div.appendChild(figcaption);
    div.setAttribute('page', element.num);
    div.addEventListener('click', selectItem);
    document.getElementsByClassName('thumbnail-list')[0].appendChild(div);
  });
}

const coverSelect = function() {
    var coverShow = document.getElementById('cover-show');
    coverShow.innerHTML = "";
    var img = document.createElement('img');
    img.src = this.getAttribute('imgurl');
    coverShow.appendChild(img);
}

const selectItem = function() {
  var items = document.getElementsByClassName('thumbnail-item');
  for (const key in items) {
    if (items.hasOwnProperty(key)) {
      if (items[key].getAttribute('page') != this.getAttribute('page'))
        items[key].classList.remove('current-item');
      else {
        cur_thumbnail = this.getAttribute('page');
      }
    }
  }
  this.classList.add("current-item");
}

function saveCover() {
  var type = sessionStorage.getItem("type");
  var easy_cutting = sessionStorage.getItem("easy_cutting");
  if (type === null) {
    type = 0;
    sessionStorage.setItem("type", type);
  }
  if (easy_cutting === null) {
    easy_cutting = 0;
    sessionStorage.setItem("easy_cutting", easy_cutting);
  }
  sessionStorage.setItem("cover", cur_thumbnail);
  sendCover(cur_thumbnail, type, easy_cutting);
}

function goBack() {
  const sidx = sessionStorage.getItem('sidx');
  if (sidx == null) {
    alert("되돌아가실 수 없습니다.");
    return false;
  }
  else {
  saveCover();
  window.history.back();
  }
}

function goOption() {
  const sidx = sessionStorage.getItem('sidx');
  if (sidx == null) {
    alert("커버를 저장하세요.");
    return false;
  } else
  location.href='option.html';
}

var cur_thumbnail = 0;

init();