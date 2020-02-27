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

function afterfileopen() {
  console.log('fileopen');
    var input = document.getElementById("openfile");
    var fReader = new FileReader();
    fReader.readAsDataURL(input.files[0]);
    fReader.onloadend = function(event){
        var imgPath = event.target.result;
        document.getElementById('image-workplace').innerHTML="";
        var imgElement = document.createElement('img');
        imgElement.setAttribute('id', 'image');
        imgElement.setAttribute('src', imgPath);
        document.getElementById('image-workplace').appendChild(imgElement);
        initCrop();
    }
}
var cropping;
var cropper;


function initCrop () {
  cropper = null;
  cropping = false;
  var input = document.getElementById("openfile");
  input.value = "";
}

var imgTempSrc;
function crop() {
  if (cropping = ! cropping){
  var image = document.querySelector('#image');
  imgTempSrc = image.src;
  cropper = new Cropper(image, {
    movable: false,
    zoomable: true,
    rotatable: false,
    scalable: false
  });
  } else {
    document.getElementById('image-workplace').innerHTML="";
    var canvas = cropper.getCroppedCanvas();
    var img = document.createElement("img");
    img.src = canvas.toDataURL("image/png");
    img.setAttribute('id', 'image');
    document.getElementById('image-workplace').appendChild(img);
  }
  $('.ctrl-btn').toggleClass('btn-hidden');
}

function rotateR() {
  var img = document.getElementById("image");
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
}

function rotateL() {
  var img = document.getElementById("image");
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
  document.getElementById('image-workplace').innerHTML="";
  initCrop();
}

function cancelCrop() {
  document.getElementById('image-workplace').innerHTML="";
  var img = document.createElement("img");
  img.src = imgTempSrc;
  img.setAttribute('id', 'image');
  document.getElementById('image-workplace').appendChild(img);
  cropping = false;
  $('.ctrl-btn').toggleClass('btn-hidden');
}

function savePage() {
  $("#btns").hide();
  html2canvas(document.getElementById('main-editor'), {dpi: 300}).then(function(canvas){
    var img = canvas.toDataURL('image/jpg');

    sendImage(img);
  });
}

var max_thumbnail = 20;
function init() {
  sessionStorage.setItem("editing", 1);
  sidx = sessionStorage.getItem("sidx");

  type = sessionStorage.getItem("type");
  if (type == null) type = 0;
  easy_cutting = sessionStorage.getItem("easy_cutting");
  if (easy_cutting == null) easy_cutting = 0;
  cover = sessionStorage.getItem("cover");
  if (cover == null) cover = 0;
  
  var div = document.createElement('div');
  div.classList.add('thumbnail-item');
  var img = document.createElement('img');
  img.src = "./assets/images/white.png";
  div.appendChild(img);
  var figcaption = document.createElement('figcaption');
  figcaption.innerHTML = "커버";
  div.appendChild(figcaption);
  div.setAttribute('page', 0);
  document.getElementsByClassName('thumbnail-list')[0].appendChild(div);

  const url = "http://thecamp.inity.co.kr/Book/CoverInfo.asp";
  $.get(
    url,
    {},
    function(data, status){
      if (status=="success") {
        getCover(JSON.parse(data), img);
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

  thumbnailSet();
    
  div = document.createElement('div');
  div.classList.add('thumbnail-item');

  document.getElementsByClassName('thumbnail-list')[0].appendChild(div);

  var tag = document.getElementById('value');
  tag.innerHTML = "9,900"; // Photo_paper
  tag = document.getElementById('type');
  tag.innerHTML = (type == 0 ? "인화지" : "인쇄지");
  tag = document.getElementById('easy_cutting');
  tag.innerHTML = (easy_cutting == 1 ? "유" : "무");
  document.getElementById('add-photo').addEventListener('click', fileopen);
  document.getElementById('btn-rotate-r').addEventListener('click', rotateR);
  document.getElementById('btn-rotate-l').addEventListener('click', rotateL);
  document.getElementById('btn-cropstart').addEventListener('click', crop);
  document.getElementById('btn-del').addEventListener('click', del);
  document.getElementById('btn-scaleup').addEventListener('click', scaleUp);
  document.getElementById('btn-cropsave').addEventListener('click', crop);
  document.getElementById('btn-cropcancel').addEventListener('click', cancelCrop);
  document.getElementById('btn-scaledown').addEventListener('click', scaleDown);
  document.getElementById('openfile').addEventListener('change', afterfileopen);
  if (isPreview) {
    $('#btns').hide();
  }
  else {
    $('#btns').show();
  }
  if (easy_cutting == 1) {
    document.getElementsByClassName('left-cutting-line')[0].setAttribute('style', 'border-left: 1px dashed #FF0000;');
  }
  defaultEditer = document.getElementById('main-editor').innerHTML;
}

thumbnailSet = function () {
  
  const img_get_url = "http://thecamp.inity.co.kr/Book/ImageGetUrl.asp";
  $.get(
    img_get_url,
    {
       sidx: sidx
     },
    function(data, status){
      if (status=="success") {
        try{
          setThumbnails(JSON.parse(data));
        }
        catch(e){

        }
      }
    }
  );
}

function getCover(data, img) {
  data.coverinfo.forEach(element => {
    if (element.num == cover) {
      document.getElementsByClassName("thumbnail-list")[0].getElementsByTagName('img')[0].src = element.url;
    }
  });
}

function setThumbnails(data) {
  var urlArray = [];
  data.imginfo.forEach(element => {
    urlArray[element.page] = element.url;
  });
  var object = document.getElementsByClassName('thumbnail-list')[0].children;
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      var element = object[key];
      if (urlArray[key] != null) {
        element.getElementsByTagName('img')[0].src = urlArray[key];
      }
    }
  }
} 

var selectItem = function() {
  $("#btns").hide();
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


  const url = "http://thecamp.inity.co.kr/Book/pageGetData.asp";
    $.ajax({
      url: url,
      type: 'GET',
      data: {
        sidx: sidx,
        page: cur_thumbnail
      }
    })
    .done(function(data) {
      showPage(JSON.parse(data));
    })
    .fail(function() {
      document.getElementById('main-editor').innerHTML = defaultEditer;
      document.getElementById('add-photo').addEventListener('click', fileopen);
      document.getElementById('btn-rotate-r').addEventListener('click', rotateR);
      document.getElementById('btn-rotate-l').addEventListener('click', rotateL);
      document.getElementById('btn-cropstart').addEventListener('click', crop);
      document.getElementById('btn-del').addEventListener('click', del);
      document.getElementById('btn-scaleup').addEventListener('click', scaleUp);
      document.getElementById('btn-cropsave').addEventListener('click', crop);
      document.getElementById('btn-cropcancel').addEventListener('click', cancelCrop);
      document.getElementById('btn-scaledown').addEventListener('click', scaleDown);
      document.getElementById('openfile').addEventListener('change', afterfileopen);
      if (isPreview) {
        $('#btns').hide();
      }
      else {
        $('#btns').show();
      }
    });
}

function showPage(data) {
  var temp = data.data.replace(/\\n/g, '').replace(/\\"/g, '"').replace(/^\"/, "").replace(/\"$/, "");
  document.getElementById('main-editor').innerHTML = temp;
  document.getElementById('add-photo').addEventListener('click', fileopen);
  document.getElementById('btn-rotate-r').addEventListener('click', rotateR);
  document.getElementById('btn-rotate-l').addEventListener('click', rotateL);
  document.getElementById('btn-cropstart').addEventListener('click', crop);
  document.getElementById('btn-del').addEventListener('click', del);
  document.getElementById('btn-scaleup').addEventListener('click', scaleUp);
  document.getElementById('btn-cropsave').addEventListener('click', crop);
  document.getElementById('btn-cropcancel').addEventListener('click', cancelCrop);
  document.getElementById('btn-scaledown').addEventListener('click', scaleDown);
  document.getElementById('openfile').addEventListener('change', afterfileopen);
  if (isPreview) {
    $('#btns').hide();
  }
  else {
    $('#btns').show();
  }
}

var cur_thumbnail = 1;

function thumbnail_prev() {
  if (cur_thumbnail == undefined || cur_thumbnail == 1) {
    cur_thumbnail = 1;
  }
  else {
    cur_thumbnail--;
  }
  var thumbnail_item = document.getElementsByClassName('thumbnail-item');

  for (const key in thumbnail_item) {

    if (thumbnail_item.hasOwnProperty(key)) {
      if (key == cur_thumbnail) {
        thumbnail_item[key].classList.add("current-item");
        thumbnail_item[key].scrollIntoView();

        const url = "http://thecamp.inity.co.kr/Book/pageGetData.asp";
        $.ajax({
          url: url,
          type: 'GET',
          data: {
            sidx: sidx,
            page: cur_thumbnail
          }
        })
        .done(function(data) {
          showPage(JSON.parse(data));
        })
        .fail(function() {
          document.getElementById('main-editor').innerHTML = defaultEditer;
          document.getElementById('add-photo').addEventListener('click', fileopen);
          document.getElementById('btn-rotate-r').addEventListener('click', rotateR);
          document.getElementById('btn-rotate-l').addEventListener('click', rotateL);
          document.getElementById('btn-cropstart').addEventListener('click', crop);
          document.getElementById('btn-del').addEventListener('click', del);
          document.getElementById('btn-scaleup').addEventListener('click', scaleUp);
          document.getElementById('btn-cropsave').addEventListener('click', crop);
          document.getElementById('btn-cropcancel').addEventListener('click', cancelCrop);
          document.getElementById('btn-scaledown').addEventListener('click', scaleDown);
          document.getElementById('openfile').addEventListener('change', afterfileopen);
          if (isPreview) {
            $('#btns').hide();
          }
          else {
            $('#btns').show();
          }
        });
      }
      else if (key >= 0 && key <= max_thumbnail + 1)
      {
        thumbnail_item[key].classList.remove("current-item");
      }
    }
  }

}

function thumbnail_next() {
  if (cur_thumbnail == undefined) {
    cur_thumbnail = 1;
  }
  else if (cur_thumbnail < max_thumbnail) {
    cur_thumbnail ++;
  }
  var thumbnail_item = document.getElementsByClassName('thumbnail-item');

  for (const key in thumbnail_item) {

    if (thumbnail_item.hasOwnProperty(key)) {
      if (key == cur_thumbnail) {
        thumbnail_item[key].classList.add("current-item");
        thumbnail_item[key].scrollIntoView();

        const url = "http://thecamp.inity.co.kr/Book/pageGetData.asp";
            $.ajax({
              url: url,
              type: 'GET',
              data: {
                sidx: sidx,
                page: cur_thumbnail
              }
            })
            .done(function(data) {
              showPage(JSON.parse(data));
            })
            .fail(function() {
              document.getElementById('main-editor').innerHTML = defaultEditer;
              document.getElementById('add-photo').addEventListener('click', fileopen);
              document.getElementById('btn-rotate-r').addEventListener('click', rotateR);
              document.getElementById('btn-rotate-l').addEventListener('click', rotateL);
              document.getElementById('btn-cropstart').addEventListener('click', crop);
              document.getElementById('btn-del').addEventListener('click', del);
              document.getElementById('btn-scaleup').addEventListener('click', scaleUp);
              document.getElementById('btn-cropsave').addEventListener('click', crop);
              document.getElementById('btn-cropcancel').addEventListener('click', cancelCrop);
              document.getElementById('btn-scaledown').addEventListener('click', scaleDown);
              document.getElementById('openfile').addEventListener('change', afterfileopen);
              if (isPreview) {
                $('#btns').hide();
              }
              else {
                $('#btns').show();
              }
            });
      }
      else if (key >= 0 && key <= max_thumbnail + 1)
      {
        thumbnail_item[key].classList.remove("current-item");
      }
    }
  }

}

function thumbnail_add() {
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
  cur_thumbnail = max_thumbnail;
  max_thumbnail++;
  thumbnail_item[max_thumbnail].setAttribute('page', (max_thumbnail + 1));
  thumbnail_item[max_thumbnail].parentNode.insertBefore(div, thumbnail_item[max_thumbnail]);
  selectDirectItem();
  cur_thumbnail = max_thumbnail;
  // change value
  var value = document.getElementById('value');
  val = Number(value.innerHTML.replace(',', '')) + (type==0 ? 500 : 250); // Photo_paper
  value.innerHTML = formatMoney(val, 0, 3, ',');
  // change page
  var page = document.getElementById('page');
  page.innerHTML = Number(page.innerHTML) + 1;
  document.getElementById('main-editor').innerHTML = defaultEditer;
  document.getElementById('add-photo').addEventListener('click', fileopen);
  document.getElementById('btn-rotate-r').addEventListener('click', rotateR);
  document.getElementById('btn-rotate-l').addEventListener('click', rotateL);
  document.getElementById('btn-cropstart').addEventListener('click', crop);
  document.getElementById('btn-del').addEventListener('click', del);
  document.getElementById('btn-scaleup').addEventListener('click', scaleUp);
  document.getElementById('btn-cropsave').addEventListener('click', crop);
  document.getElementById('btn-cropcancel').addEventListener('click', cancelCrop);
  document.getElementById('btn-scaledown').addEventListener('click', scaleDown);
  document.getElementById('openfile').addEventListener('change', afterfileopen);
  if (isPreview) {
    $('#btns').hide();
  }
  else {
    $('#btns').show();
  }
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

function selectDirectItem() {
  var items = document.getElementsByClassName('thumbnail-item');
  for (const key in items) {
    if (items.hasOwnProperty(key)) {
      if (items[key].getAttribute('page') != cur_thumbnail + 1)
        items[key].classList.remove('current-item');
      else {
        items[key].classList.add("current-item");
        items[key].scrollIntoView();
      }
    }
  }
}

function addSideText() {
  addText();
}

function addText() {
  document.getElementById('info-insert').setAttribute('contenteditable', 'true');
  document.getElementById('info-insert').focus();
}

function preview() {
  if (isPreview == 0) {
    var el = document.getElementById('main-editor');
    $("#btns").hide();
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
    var el = document.getElementById('main-editor');
    $("#btns").show();
    $("#nav-div").attr('style', 'visibility:visible;');
    $('.thumbnail-region').attr('style', 'visibility:visible;');
    isPreview = 0;
  }
}

function sendImage(data){
  var fd = new FormData();
  fd.append('sidx', sidx);
  fd.append('page', cur_thumbnail);
  fd.append('data', makeblob(data));
  
  $.ajax({
    url: IMAGE_SEND_URL,
    type: 'POST',
    processData: false,
    contentType: false,
    data: fd
  })
  .done(function(data) {
    console.log("화상이 보관되였습니다.");
    var page = document.getElementById('main-editor').innerHTML;
    page = JSON.stringify(page);
    sendPage(page);
  })
  .fail(function() {alert("화상보관중 오유가 발생하였습니다.");});
}

function sendPage(data){
  $.post(PAGE_SEND_URL,
  {
    sidx: sidx,
    page: cur_thumbnail,
    data: data
  },
  function(data, status){
    if (status == "success")
    {
      $("#btns").show();
      thumbnailSet();
    }
    else
      alert("페지보관중 오유가 발생하였습니다.");
  });
}

function my_cart() {
  sessionStorage.setItem('page_add', max_thumbnail - 20);
  sessionStorage.setItem('page_count', max_thumbnail);
  sessionStorage.setItem('value', val);
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

$body = $("body");

$(document).on({
    ajaxStart: function() { $body.addClass("loading"); },
    ajaxStop: function() { $body.removeClass("loading"); }
});

init();