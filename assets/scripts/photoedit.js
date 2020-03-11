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
    $('#openfile').trigger('click');
}

var filelist = [];
function afterfileopen() {
    var input = document.getElementById("openfile");
    if (input.files.length == 0)
      return;
    for (var i = 0; i < input.files.length; i++) {
      filelist.push(input.files[i]);
    }

    imageFileOpen(0);
    initCrop();
}

function imageFileOpen(i) {
  if (i >= filelist.length) {
    filelist = [];
    var input = document.getElementById("openfile");
    input.value = "";
    afterShowPage();
    return;
  }

  if (cur_thumbnail > max_thumbnail - i) {
    if (max_thumbnail == 50) {
      filelist = [];
      var input = document.getElementById("openfile");
      input.value = "";
      afterShowPage();
      return;
    }
    var thumbnail_item = document.getElementsByClassName('thumbnail-item');
    img = document.createElement('img');
    figcaption = document.createElement('figcaption');
    img.src = defaultImage;
    figcaption.innerHTML = "속지" + (max_thumbnail + 1);
    var div = document.createElement('div');
    div.classList.add('thumbnail-item');
    div.appendChild(img);
    div.appendChild(figcaption);
    div.setAttribute('page', (max_thumbnail + 1));
    div.addEventListener('click', selectItem);
    max_thumbnail++;
    thumbnail_item[max_thumbnail].setAttribute('page', (max_thumbnail + 1));
    thumbnail_item[max_thumbnail].parentNode.insertBefore(div, thumbnail_item[max_thumbnail]);
    thumbnail_item[Number(cur_thumbnail) + Number(i)].scrollIntoView();
    var value = document.getElementById('value');
    val = Number(value.innerHTML.replace(',', '')) + (type==0 ? 500 : 250); // Photo_paper
    value.innerHTML = formatMoney(val, 0, 3, ',');
    var page = document.getElementById('page');
    page.innerHTML = Number(page.innerHTML) + 1;
    
    defaultEditer.setAttribute('page', Number(cur_thumbnail) + Number(i));
    tempHTML = defaultEditer.outerHTML;
    document.getElementById('main-paper').innerHTML += tempHTML;
  }

  var fReader = new FileReader();
  fReader.readAsDataURL(filelist[i]);
  fReader.onloadend = function (event) {
    var imgPath = event.target.result;
    document.getElementsByClassName('image-workplace')[Number(cur_thumbnail) + Number(i)].innerHTML="";
    var imgElement = document.createElement('img');
    imgElement.setAttribute('class', 'image');
    imgElement.setAttribute('src', imgPath);
    document.getElementsByClassName('image-workplace')[Number(cur_thumbnail) + Number(i)].appendChild(imgElement);
    document.getElementsByClassName('paper-item')[Number(cur_thumbnail) + (i)].getElementsByClassName('image')[0].addEventListener('click', showBtns);
    $('.paper-item').hide();
    $('.paper-item').eq(Number(cur_thumbnail) + Number(i)).show();
    $('.btns').hide();
    $('.left-half').attr('style', 'border-right: 3px solid #808080 !important;');
    var mydiv = document.getElementById('main-editor');
    window.scrollTo(0, 0);
    html2canvas(mydiv).then(function(canvas){
      document.getElementsByClassName("thumbnail-item")[Number(cur_thumbnail) + Number(i)].getElementsByTagName('img')[0].src = canvas.toDataURL('image/jpg');
      $('.left-half').attr('style', '');
      imageFileOpen(Number(i) + 1);
    });
  }
}

var cropping;
var cropper;

function initCrop() {
  cropper = null;
  cropping = false;
  var input = document.getElementById("openfile");
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
  afterShowPage();
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
  getThumbnail(btnsAfterEdit);
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
  getThumbnail(btnsAfterEdit);
}

function btnsAfterEdit() {
  document.getElementsByClassName('btns')[cur_thumbnail].setAttribute("style", "");
  document.getElementsByClassName('ctrl-btn-group')[cur_thumbnail].setAttribute("style", "");
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
  getThumbnail(btnsAfterDel);
}

function btnsAfterDel() {
  document.getElementsByClassName('btns')[cur_thumbnail].setAttribute("style", "");
  document.getElementsByClassName('ctrl-btn-group')[cur_thumbnail].setAttribute("style", "display:none;");
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

function saveImages(cb = null) {
  $(".btns").hide();
  
  $('body').addClass('loading-progress');
  $('#progress_bar div').attr('style', 'width:0%;');
  cbSendImages(0, cb);
}

function cbSendImages(i, cb=null) {
  if (i > max_thumbnail) {
    $(".btns").show();
    isSended = true;
    $('body').removeClass('loading-progress');
    if (cb != null) cb();
    return;
  }
  var progressing = i / max_thumbnail * 100;
  $('#progress_bar div').attr('style', 'width:' + progressing + '%;');
  $('#progress_bar div').html(Math.round(progressing) + "%");
  var fd = new FormData();
  fd.append('sidx', sidx);
  fd.append('page', i);
  fd.append('data', makeblob(document.getElementsByClassName("thumbnail-item")[i].getElementsByTagName("img")[0].src));
  // console.log(fd);
  for (var pair of fd.entries()) {
    console.log(pair);
  }
  // return;
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
}

function init() {
  sessionStorage.setItem("editing", 1);
  sidx = sessionStorage.getItem("sidx");
  var pagesaved = sessionStorage.getItem("pagesaved");
  if (pagesaved == 1) {
    $('body').addClass('loading-progress');
    $('#progress_bar div').attr('style', 'width:0%;');
    $('#progress_bar div').html("0%");

    $.ajax({
      xhr: function(){
        var xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function(evt){
        }, false);
        xhr.addEventListener("progress", function(evt){
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total * 100;
            $('#progress_bar div').attr('style', 'width:' + percentComplete + '%;');
            $('#progress_bar div').html(Math.round(percentComplete) + "%");
          }
        }, false);
        return xhr;
      },
      type: 'GET',
      url: "http://thecamp.inity.co.kr/Book/pageGetData.asp",
      data: {
        sidx: sidx,
        page: 0
      },
      success: function(data){
        $('body').removeClass('loading-progress');
        data = JSON.parse(data);
        var temp = data.data.replace(/\\n/g, '').replace(/\\"/g, '"').replace(/^\"/, "").replace(/\"$/, "");
        document.getElementsByClassName('save-content')[0].innerHTML = temp;
        afterinit1(true);
      },
      error: function(data) {
        $('body').removeClass('loading-progress');
        afterinit1(false);
      }
    });
  }
  else {
    afterinit1(false);
  }
}

var max_thumbnail = 20;
function afterinit1(isSaved) {
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
      // img.src = "./assets/images/white.png";
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

var defaultImage = "";

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
    document.getElementsByClassName("thumbnail-item")[0].getElementsByTagName('img')[0].src=dataURL;
  };
  img.setAttribute('crossOrigin', 'anonymous');
  img.src = imgUrl;
  var img2 = new Image();
  img2.onload = function(){
    var canvas = document.createElement("canvas");
    canvas.width = img2.width;
    canvas.height = img2.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img2, 0, 0);
    defaultImage = canvas.toDataURL("image/png");
    for (var i = 1; i <= max_thumbnail; i++) {
      document.getElementsByClassName("thumbnail-item")[i].getElementsByTagName('img')[0].src=defaultImage;
    }
  };
  img2.setAttribute('crossOrigin', 'anonymous');
  img2.src = "http://thecamp.inity.co.kr/assets/images/white.png";
}

function afterShowPage() {
  if (document.getElementsByClassName('paper-item')[cur_thumbnail].getElementsByClassName('image')[0] == undefined) {
    $('.btns').show();
    document.getElementsByClassName('ctrl-btn-group')[cur_thumbnail].setAttribute('style', 'display:none;');
  } else {
    document.getElementsByClassName('paper-item')[cur_thumbnail].getElementsByClassName('image')[0].addEventListener('click', showBtns);
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

  document.getElementById("openfile").addEventListener('change', afterfileopen);
  document.getElementsByClassName('preview-arrow-prev')[0].addEventListener('click', preview_prev);
  document.getElementsByClassName('preview-arrow-next')[0].addEventListener('click', preview_next);

  document.getElementById('thumbnail_prev').addEventListener('click', thumbnail_prev);
  document.getElementById('thumbnail_next').addEventListener('click', thumbnail_next);
  document.getElementById('thumbnail_add').addEventListener('click', thumbnail_add);
  if (easy_cutting == 1 && cur_thumbnail != 0) {
    document.getElementsByClassName('left-cutting-line')[cur_thumbnail - 1].setAttribute('style', 'border-left: 1px dashed #FF0000;');
  }
  $('.thumbnail-item').removeClass('current-item');
  $('.thumbnail-item').eq(cur_thumbnail).addClass('current-item');
  $('.paper-item').hide();
  $('.paper-item').eq(cur_thumbnail).show();
  if (isPreview) {
    $('.btns').hide();
    $('.preview-arrow').show();
  }
  else {
    // $('.btns').show();
    $('.preview-arrow').hide();
  }
}

function showBtns() {
  document.getElementsByClassName('btns')[cur_thumbnail].setAttribute('style', '');
  document.getElementsByClassName('ctrl-btn-group')[cur_thumbnail].setAttribute('style', '');
  // $('.btns').show();
  // $('.ctrl-btn-group').show();
}

function getCover(data) {
  data.coverinfo.forEach(element => {
    if (element.num == cover) {
      // document.getElementsByClassName("thumbnail-list")[0].getElementsByTagName('img')[0].src = element.url;
      loadImg("main-paper-img", element.url);
      // document.getElementById("main-paper-img").setAttribute("width", 1280);
      // document.getElementById("main-paper-img").setAttribute("height", 360);
    }
  });
}

var selectItem = function() {
  cancelCrop();
  getThumbnail();

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
  img.src = defaultImage;
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
  var img2 = new Image();
  img2.onload = function(){
    var canvas = document.createElement("canvas");
    canvas.width = img2.width;
    canvas.height = img2.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img2, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    defaultImage = dataURL;
    document.getElementsByClassName("thumbnail-item")[max_thumbnail].getElementsByTagName('img')[0].src=dataURL;
  };
  img2.setAttribute('crossOrigin', 'anonymous');
  img2.src = "http://thecamp.inity.co.kr/assets/images/white.png";
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
    $('.nav-div').toggle();
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
    $('.nav-div').toggle();
    afterShowPage();
  }
}

function sendPage(callback=undefined){
  // var tempinput = document.createElement("input");
  // tempinput.setAttribute('type', 'hidden');
  // tempinput.setAttribute('id', 'tempinput');
  // document.body.appendChild(tempinput);
  // tempinput.value = JSON.stringify(document.getElementsByClassName('save-content')[0].innerHTML);
  var temp = document.getElementsByClassName('save-content')[0].innerHTML;
  sessionStorage.setItem("pagesaved", 1);
  $('body').addClass('loading-progress');
  $('#progress_bar div').attr('style', 'width:0%;');
  $('#progress_bar div').html("0%");
  $.ajax({
      xhr: function(){
        var xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function(evt){
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total * 100;
            $('#progress_bar div').attr('style', 'width:' + percentComplete + '%;');
            $('#progress_bar div').html(Math.round(percentComplete) + "%");
          }
        }, false);
        xhr.addEventListener("progress", function(evt){
        }, false);
        return xhr;
      },
      type: 'POST',
      url: PAGE_SEND_URL,
      data: {
        sidx: sidx,
        page: 0,
        data: temp//tempinput.value
      },
      success: function(data){
        $('body').removeClass('loading-progress');
        if (callback != undefined)
          callback();
      },
      error: function(data) {
        $('body').removeClass('loading-progress');
        alert("페지보관중 오류가 발생하였습니다.");
      }
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
  sendPage(goConfirm2); // 페지 데이터를 업로드하려는 경우
}

function goConfirm2() {
  location.href = "temp_cart.html";
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
  $('.left-half').attr('style', 'border-right: 3px solid #808080 !important;');
  const temp_thumbnail = cur_thumbnail;
  if (!isPreview) {
    window.scrollTo(0, 0);
    html2canvas(mydiv).then(function(canvas){
      document.getElementsByClassName("thumbnail-item")[temp_thumbnail].getElementsByTagName('img')[0].src = canvas.toDataURL('image/jpg');
      $('.left-half').attr('style', '');
      // $('.btns').show();
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

init();