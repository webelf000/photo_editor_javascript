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
}

function showCovers(data) {
  var coverInfo = data.coverinfo;
  coverInfo.forEach(element => {
    var div = document.createElement('div');
    div.classList.add("col-6");
    div.classList.add("cover-item");
    div.setAttribute('cover_num', element.num);
    var img = document.createElement('img');
    var figcaption = document.createElement('figcaption');
    img.src = element.thumb;
    img.setAttribute('width', "100%");
    img.classList.add('shadow-sm');
    figcaption.innerHTML = element.title;
    div.setAttribute('page', element.num);
    div.addEventListener('click', selectItem);
    div.appendChild(img);
    div.appendChild(figcaption);
    document.getElementById('main-cover-list').appendChild(div);
  });
}

const selectItem = function() {
  cur_thumbnail = this.getAttribute("cover_num");
  $('.cover-item').removeClass('current-item');
  this.classList.add("current-item");
}

function goBack() {
  window.history.back();
}

function goOption() {
  if (cur_thumbnail == -1) {
    alert("커버를 선택하세요.");
    return false;
  }
  sessionStorage.setItem('cover', cur_thumbnail);
  window.history.back();
}

var cur_thumbnail = -1;

init();