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
  var div;
  var number = max_thumbnail;
  for (var i = 0; i < number; i++) {
    img = document.createElement('img');
    figcaption = document.createElement('figcaption');
    img.src = "./assets/images/photos/" + (i + 1) + ".png";
    img.addEventListener('click', coverSelect);
    figcaption.innerHTML = "커버" + (i + 1);
    div = document.createElement('div');
    div.classList.add('thumbnail-item');
    div.appendChild(img);
    div.appendChild(figcaption);
    div.setAttribute('page', i + 1);
    div.addEventListener('click', selectItem);
    document.getElementsByClassName('thumbnail-list')[0].appendChild(div);
  }
}

const coverSelect = function() {
    var coverShow = document.getElementById('cover-show');
    coverShow.innerHTML = "";
    var img = document.createElement('img');
    img.src = this.src;
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

var cur_thumbnail;

init();