const IMAGE_SEND_URL = "http://thecamp.inity.co.kr/Book/ImageSave.asp";
const IMAGE_RECEIVE_URL = "http://thecamp.inity.co.kr/Book/ImageGetUrl.asp";
const PAGE_SEND_URL = "http://thecamp.inity.co.kr/Book/pageSave.asp";
const PAGE_RECEIVE_URL = "http://thecamp.inity.co.kr/Book/pageGetData.asp";

var defaultEditer;
var type = 0;
var easy_cutting = 0;
var cover = 0;
var sidx;
var isPreview = 0;
var val = 9900;

function fileopen() {
    $('.openfile').eq(cur_thumbnail).trigger('click');
}

function afterfileopen() {
    var input = document.getElementsByClassName("openfile")[cur_thumbnail];
    var fReader = new FileReader();
    fReader.readAsDataURL(input.files[0]);
    fReader.onloadend = function(event){
        var imgPath = event.target.result;
        document.getElementsByClassName('image-workplace')[cur_thumbnail].innerHTML="";
        var imgElement = document.createElement('img');
        imgElement.setAttribute('class', 'image');
        imgElement.setAttribute('src', imgPath);
        document.getElementsByClassName('image-workplace')[cur_thumbnail].appendChild(imgElement);
        $('.ctrl-btn-group').show();
        initCrop();
        getThumbnail();
    }
}
var cropping;
var cropper;

function initCrop() {
  cropper = null;
  cropping = false;
  var input = document.getElementsByClassName("openfile")[cur_thumbnail];
  input.value = "";
}

var imgTempSrc;
function crop() {
  if (cropping = ! cropping){
  var image = document.getElementsByClassName("paper-item")[cur_thumbnail].getElementsByClassName('image')[0];
  imgTempSrc = image.src;
  cropper = new Cropper(image, {
    movable: false,
    zoomable: true,
    rotatable: false,
    scalable: false,
    viewMode: 2
  });
  } else {
    document.getElementsByClassName('image-workplace')[cur_thumbnail].innerHTML="";
    var canvas = cropper.getCroppedCanvas();
    var img = document.createElement("img");
    img.src = canvas.toDataURL("image/png");
    img.setAttribute('class', 'image');
    document.getElementsByClassName('image-workplace')[cur_thumbnail].appendChild(img);
    getThumbnail();
  }
  $('.ctrl-btn').toggleClass('btn-hidden');
}

function rotateR() {
  var img = document.getElementsByClassName("paper-item")[cur_thumbnail].getElementsByClassName('image')[0];
  var rotationCanvas = document.createElement('canvas');

  rotationCanvas.height = img.naturalWidth;
  rotationCanvas.width = img.naturalHeight;

  var ctx = rotationCanvas.getContext("2d");
  ctx.translate(rotationCanvas.width/2,rotationCanvas.height/2);
  ctx.rotate(Math.PI/2);
  ctx.drawImage(img,-img.naturalWidth/2,-img.naturalHeight/2);
  ctx.rotate(-Math.PI/2);
  ctx.translate(-rotationCanvas.width/2,-rotationCanvas.height/2);

  img.src = rotationCanvas.toDataURL();
  getThumbnail();
}

function rotateL() {
  var img = document.getElementsByClassName("paper-item")[cur_thumbnail].getElementsByClassName('image')[0];
  var rotationCanvas = document.createElement('canvas');

  rotationCanvas.height = img.naturalWidth;
  rotationCanvas.width = img.naturalHeight;

  var ctx = rotationCanvas.getContext("2d");
  ctx.translate(rotationCanvas.width/2,rotationCanvas.height/2);
  ctx.rotate(-Math.PI/2);
  ctx.drawImage(img,-img.naturalWidth/2,-img.naturalHeight/2);
  ctx.rotate(Math.PI/2);
  ctx.translate(-rotationCanvas.width/2,-rotationCanvas.height/2);

  img.src = rotationCanvas.toDataURL();
}

function scaleUp(){
  cropper.zoom(0.1);
}

function scaleDown(){
  cropper.zoom(-0.1);
}

function del() {
  document.getElementsByClassName('image-workplace')[cur_thumbnail].innerHTML="";
  initCrop();
  getThumbnail();
}

function cancelCrop() {
  var img = document.createElement("img");
  if (imgTempSrc != undefined && cropping) {
    document.getElementsByClassName('image-workplace')[cur_thumbnail].innerHTML="";
    img.src = imgTempSrc;
    img.setAttribute('class', 'image');
    document.getElementsByClassName('image-workplace')[cur_thumbnail].appendChild(img);
  }
  cropping = false;
  $('.ctrl-btn-default').removeClass('btn-hidden');
  $('.ctrl-btn-edit').addClass('btn-hidden');
}

var mydiv;
function saveImages(cb = null) {
  $(".btns").hide();
  
  mydiv = document.getElementsByClassName('paper-item');
  cbSendImages(0, cb);
}

function cbSendImages(i, cb=null) {
  if (i > max_thumbnail) {
    $(".btns").show();
    isSended = true;
    if (cb != null) cb();
    return;
  }
  $('.paper-item').hide();
  $('.paper-item').eq(i).show();
    html2canvas(mydiv[i]).then(function(canvas){
      var data = canvas.toDataURL('image/jpg');
      var fd = new FormData();
      fd.append('sidx', sidx);
      fd.append('page', i);
      fd.append('data', makeblob(data));
      $.ajax({
        url: IMAGE_SEND_URL,
        type: 'POST',
        processData: false,
        contentType: false,
        data: fd
      })
      .done(function(data) {
        cbSendImages(i + 1, cb);
      })
      .fail(function() {alert("화상보관중 오류가 발생하였습니다.");});
    });
}

function init() {
  sessionStorage.setItem("editing", 1);
  sidx = sessionStorage.getItem("sidx");
  const url = "http://thecamp.inity.co.kr/Book/pageGetData.asp";
  $.ajax({
    url: url,
    type: 'GET',
    data: {
      sidx: sidx,
      page: 0
    }
  })
  .done(function(data) {
    data = JSON.parse(data);
    var temp = data.data.replace(/\\n/g, '').replace(/\\"/g, '"').replace(/^\"/, "").replace(/\"$/, "");
    document.getElementsByClassName('save-content')[0].innerHTML = temp;
    afterinit(true);
  })
  .fail(function() {
    afterinit(false);
  });
}

var max_thumbnail = 20;
function afterinit(isSaved) {
  sessionStorage.setItem("editing", 1);
  sidx = sessionStorage.getItem("sidx");

  type = sessionStorage.getItem("type");
  if (type == null) type = 0;
  easy_cutting = sessionStorage.getItem("easy_cutting");
  if (easy_cutting == null) easy_cutting = 0;
  cover = sessionStorage.getItem("cover");
  if (cover == null) cover = 0;
  if (!isSaved) {
    var div = document.createElement('div');
    div.classList.add('thumbnail-item');
    var img = document.createElement('img');
    img.src = "./assets/images/white.png";
    div.appendChild(img);
    var figcaption = document.createElement('figcaption');
    figcaption.innerHTML = "커버";
    div.appendChild(figcaption);
    div.setAttribute('page', 0);
    div.addEventListener('click', selectItem);
    document.getElementsByClassName('thumbnail-list')[0].appendChild(div);

    const url = "http://thecamp.inity.co.kr/Book/CoverInfo.asp";
    $.get(
      url,
      {},
      function(data, status){
        if (status=="success") {
          getCover(JSON.parse(data));
        }
      }
    );
    var number = max_thumbnail;
    for (var i = 0; i < number; i++) {
      img = document.createElement('img');
      img.src = "./assets/images/white.png";
      figcaption = document.createElement('figcaption');
      figcaption.innerHTML = "속지" + (i + 1);
      div = document.createElement('div');
      div.classList.add('thumbnail-item');
      div.appendChild(img);
      div.appendChild(figcaption);
      div.setAttribute('page', i + 1);
      div.addEventListener('click', selectItem);
      document.getElementsByClassName('thumbnail-list')[0].appendChild(div);
      
    }
      
    div = document.createElement('div');
    div.classList.add('thumbnail-item');

    document.getElementsByClassName('thumbnail-list')[0].appendChild(div);

    var tag = document.getElementById('value');
    tag.innerHTML = "9,900"; // Photo_paper
    tag = document.getElementById('type');
    tag.innerHTML = (type == 0 ? "인화지" : "인쇄지");
    tag = document.getElementById('easy_cutting');
    tag.innerHTML = (easy_cutting == 1 ? "유" : "무");
    afterShowPage();
    if (easy_cutting == 1 && cur_thumbnail != 0) {
      document.getElementsByClassName('left-cutting-line')[0].setAttribute('style', 'border-left: 1px dashed #FF0000;');
    }
  }
  else {
    var div = document.getElementsByClassName('thumbnail-item');
    for (var i = 0; i < div.length; i++) {
      div[i].addEventListener('click', selectItem);      
    }
    afterShowPage();
  }
  defaultEditer = document.getElementsByClassName('paper-item')[1].cloneNode(true);
  defaultEditer.getElementsByClassName('image-workplace')[0].innerHTML = "";
  defaultEditer.getElementsByClassName('info-insert')[0].innerHTML = "";
}

function loadImg(id, imgUrl) {
  var img = new Image();
  img.onload = function(){
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");
  document.getElementById(id).src=dataURL;
  };
  img.setAttribute('crossOrigin', 'anonymous');
  img.src = imgUrl;
}

function afterShowPage() {
  if (document.getElementsByClassName('paper-item')[cur_thumbnail].getElementsByClassName('image')[0] == undefined) {
    document.getElementsByClassName('ctrl-btn-group')[cur_thumbnail].setAttribute('style', 'display:none;');
  }
  document.getElementsByClassName('add-photo')[cur_thumbnail].addEventListener('click', fileopen);
  document.getElementsByClassName('btn-rotate-r')[cur_thumbnail].addEventListener('click', rotateR);
  document.getElementsByClassName('btn-rotate-l')[cur_thumbnail].addEventListener('click', rotateL);
  document.getElementsByClassName('btn-cropstart')[cur_thumbnail].addEventListener('click', crop);

  document.getElementsByClassName('btn-del')[cur_thumbnail].addEventListener('click', del);
  document.getElementsByClassName('btn-scaleup')[cur_thumbnail].addEventListener('click', scaleUp);
  document.getElementsByClassName('btn-cropsave')[cur_thumbnail].addEventListener('click', crop);
  document.getElementsByClassName('btn-cropcancel')[cur_thumbnail].addEventListener('click', cancelCrop);
  document.getElementsByClassName('btn-scaledown')[cur_thumbnail].addEventListener('click', scaleDown);

  document.getElementsByClassName('openfile')[cur_thumbnail].addEventListener('change', afterfileopen);
  document.getElementsByClassName('preview-arrow-prev')[0].addEventListener('click', preview_prev);
  document.getElementsByClassName('preview-arrow-next')[0].addEventListener('click', preview_next);
  
  $('.thumbnail-item').removeClass('current-item');
  $('.thumbnail-item').eq(cur_thumbnail).addClass('current-item');
  $('.paper-item').hide();
  $('.paper-item').eq(cur_thumbnail).show();
  if (isPreview) {
    $('.btns').hide();
    $('.preview-arrow').show();
  }
  else {
    $('.btns').show();
    $('.preview-arrow').hide();
  }
}

function getCover(data) {
  data.coverinfo.forEach(element => {
    if (element.num == cover) {
      document.getElementsByClassName("thumbnail-list")[0].getElementsByTagName('img')[0].src = element.url;
      loadImg("main-paper-img", element.url);
      document.getElementById("main-paper-img").setAttribute("width", 1280);
      document.getElementById("main-paper-img").setAttribute("height", 360);
    }
  });
}

var selectItem = function() {
  cancelCrop();
  getThumbnail();
  $(".btns").hide();

  cur_thumbnail = this.getAttribute('page');
  afterShowPage();
}

function showPage(data) {
  var temp = data.data.replace(/\\n/g, '').replace(/\\"/g, '"').replace(/^\"/, "").replace(/\"$/, "");
  document.getElementById('main-paper').innerHTML = temp;
  afterShowPage();
}

var cur_thumbnail = 0;

function thumbnail_prev() {
  cancelCrop();
  getThumbnail();
  if (cur_thumbnail == undefined || cur_thumbnail ==0) {
    cur_thumbnail = 0;
    return;
  }
  else {
    cur_thumbnail--;
  }
  var thumbnail_item = document.getElementsByClassName('thumbnail-item');
  thumbnail_item[cur_thumbnail].scrollIntoView();
  afterShowPage();
}

function thumbnail_next() {
  cancelCrop();
  getThumbnail();
  if (cur_thumbnail == undefined) {
    cur_thumbnail = 1;
    return;
  }
  else if (cur_thumbnail < max_thumbnail) {
    cur_thumbnail ++;
  }
  else {
    return;
  }

  var thumbnail_item = document.getElementsByClassName('thumbnail-item');
  thumbnail_item[cur_thumbnail].scrollIntoView();
  afterShowPage();
}

function thumbnail_add() {
  cancelCrop();
  getThumbnail();
  if (max_thumbnail >= 50) return;
  var thumbnail_item = document.getElementsByClassName('thumbnail-item');
  img = document.createElement('img');
  figcaption = document.createElement('figcaption');
  img.src = "./assets/images/white.png";
  figcaption.innerHTML = "속지" + (max_thumbnail + 1);
  var div = document.createElement('div');
  div.classList.add('thumbnail-item');
  div.appendChild(img);
  div.appendChild(figcaption);
  div.setAttribute('page', (max_thumbnail + 1));
  div.addEventListener('click', selectItem);
  max_thumbnail++;
  cur_thumbnail = max_thumbnail;
  thumbnail_item[max_thumbnail].setAttribute('page', (max_thumbnail + 1));
  thumbnail_item[max_thumbnail].parentNode.insertBefore(div, thumbnail_item[max_thumbnail]);
  thumbnail_item[cur_thumbnail].scrollIntoView();
  var value = document.getElementById('value');
  val = Number(value.innerHTML.replace(',', '')) + (type==0 ? 500 : 250); // Photo_paper
  value.innerHTML = formatMoney(val, 0, 3, ',');
  var page = document.getElementById('page');
  page.innerHTML = Number(page.innerHTML) + 1;
  
  defaultEditer.setAttribute('page', cur_thumbnail);
  tempHTML = defaultEditer.outerHTML;
  document.getElementById('main-paper').innerHTML += tempHTML;
  afterShowPage();
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

function addSideText() {
  addText();
}

function addText() {
  document.getElementsByClassName('info-insert')[cur_thumbnail - 1].setAttribute('contenteditable', 'true');
  document.getElementsByClassName('info-insert')[cur_thumbnail - 1].focus();
}

function preview() {
  if (isPreview == 0) {
    var el = document.getElementById('main-paper');
    $(".btns").hide();
    $('.preview-arrow').show();
    $("#nav-div").attr('style', 'visibility:hidden;');
    $('.thumbnail-region').attr('style', 'visibility:hidden;');
    Hammer(el).on('swipeleft', preview_next);
    Hammer(el).on('swiperight', preview_prev);
    Hammer(el).on('doubletap', escapePreview);
    isPreview = 1;
  }
}

function preview_next() {
  if (isPreview)
    thumbnail_next();
}

function preview_prev() {
  if (isPreview)
    thumbnail_prev();
}

function escapePreview() {
  if (isPreview == 1) {
    var el = document.getElementById('main-paper');
    $(".btns").show();
    $('.preview-arrow').hide();
    $("#nav-div").attr('style', 'visibility:visible;');
    $('.thumbnail-region').attr('style', 'visibility:visible;');
    isPreview = 0;
  }
}

function sendPage(callback=undefined){
  var data = document.getElementsByClassName('save-content')[0].innerHTML;
  data = JSON.stringify(data);
  $.post(PAGE_SEND_URL,
  {
    sidx: sidx,
    page: 0,
    data: data
  },
  function(data, status){
    if (status == "success")
    {
      if (callback != undefined)
        callback();
    }
    else
      alert("페지보관중 오류가 발생하였습니다.");
  });
}

function my_cart() {
  sessionStorage.setItem('page_add', max_thumbnail - 20);
  sessionStorage.setItem('page_count', max_thumbnail);
  sessionStorage.setItem('value', val);
  if (!isSended) {
    saveImages(goConfirm);
  } else {
    goConfirm();
  }
}

function goConfirm() {
  // sendPage(goConfirm2); // 페지 데이터를 업로드하려는 경우
  location.href = "confirm.html";
}

function goConfirm2() {
  location.href = "confirm.html";
}

function makeblob(dataURL) {
  var BASE64_MARKER = ';base64,';
  if (dataURL.indexOf(BASE64_MARKER) == -1) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = decodeURIComponent(parts[1]);
      return new Blob([raw], { type: contentType });
  }
  var parts = dataURL.split(BASE64_MARKER);
  var contentType = parts[0].split(':')[1];
  var raw = atob(parts[1]);
  var rawLength = raw.length;

  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

var isSended = false;
function getThumbnail(cb = null) {
  isSended = false;
  var mydiv = document.getElementById('main-editor');
  $('.btns').hide();
  const temp_thumbnail = cur_thumbnail;
  if (!isPreview) {
    html2canvas(mydiv, {}).then(function(canvas){
      document.getElementsByClassName("thumbnail-item")[temp_thumbnail].getElementsByTagName('img')[0].src = canvas.toDataURL('image/jpg');
      $('.btns').show();
      if (cb != null)
        cb();
    });
  }
}

var menu = "";
function changeCover() {
  menu = "cover";
  myAlert();
}

function changeOptions() {
  menu = "option";
  myAlert();
}

function myAlert() {
  $("body").addClass("loading-confirm");
}

function okAlert() {
  $('body').removeClass("loading-confirm");
  if (menu == "option") {
    sendPage(goOption);
  } else if (menu == "cover") {
    sendPage(goCover);
  }
}
function goOption() {
  location.href='option.html';
}
function goCover() {
  location.href='cover.html';
}

function cancelAlert() {
  $('body').removeClass("loading-confirm");
}

$body = $("body");

$(document).on({
    ajaxStart: function() { $body.addClass("loading"); },
    ajaxStop: function() { $body.removeClass("loading"); }
});

init();