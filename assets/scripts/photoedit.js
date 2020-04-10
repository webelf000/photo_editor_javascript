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

var max_thumbnail = 22;

function fileopen() {
    $('#openfile').trigger('click');
}

var filelist = [];
function afterfileopen() {
  document.body.classList.add("loading");
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
    figcaption.innerHTML = "내지" + (max_thumbnail + 1);
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
    
    document.body.classList.remove("loading");
    var mydiv = document.getElementById('main-editor');
    window.scrollTo(0, 0);
    html2canvas(mydiv).then(function(canvas){
      document.body.classList.add("loading");
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

var mainUrls = [];

function saveImages() {
  $(".btns").hide();
  
  $('body').addClass('loading-progress');
  $('#progress_bar div').attr('style', 'width:0%;');
  mainUrls = [];
  cbSendImages(0);
}

function cbSendImages(i) {
  if (i > max_thumbnail) {
    $(".btns").show();
    isSended = true;
    sessionStorage.setItem("isSended", 1);
    $('body').removeClass('loading-progress');
    goConfirm();
    return;
  }
  var progressing = i / max_thumbnail * 100;
  $('#progress_bar div').attr('style', 'width:' + progressing + '%;');
  $('#progress_bar div').html(Math.round(progressing) + "%");
  if (document.getElementsByClassName("image-workplace")[i].getElementsByTagName("img").length == 0) {
    cbSendImages(i + 1);
    return;
  }
  var fd = new FormData();
  fd.append('sidx', sidx);
  fd.append('page', i);
  fd.append('data', makeblob(document.getElementsByClassName("thumbnail-item")[i].getElementsByTagName("img")[0].src));
  fd.append('sdata', makeblob(document.getElementsByClassName("image-workplace")[i].getElementsByTagName("img")[0].src));
  $.ajax({
    url: IMAGE_SEND_URL,
    type: 'POST',
    processData: false,
    contentType: false,
    data: fd
  })
  .done(function(data) {
    data = JSON.parse(data);
    document.getElementsByClassName("image-workplace")[data.page].getElementsByTagName("img")[0].src = "http://thecamp.inity.co.kr/" + data.url;
    cbSendImages(i + 1);
  })
  .fail(function() {alert("이미지 저장중 오류가 발생하였습니다.");});
}

function init() {
  menu = "";
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
//        data = JSON.parse(data);
//        var temp = data.data.replace(/\\n/g, '').replace(/\\"/g, '"').replace(/^\"/, "").replace(/\"$/, "");
//			console.log(data);
			document.getElementsByClassName('save-content')[0].innerHTML = data;
			main_img_load(0);
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

function textArea(f){
	if(f == 's'){
	  $('.info-insert').attr('contenteditable', 'true');
	  $('.info-insert').addClass('text-area');

		$('.info-insert').each(function(){
			var valtxt = $(this).html();
			console.log(valtxt);
			if(valtxt == '')
				$(this).html('글을 입력하세요.');
		});

	  $('.info-insert').bind('click', function(){
			var valtxt = $(this).html();
			if(valtxt == '글을 입력하세요.')
				$(this).html('');
		});

	  $('.info-insert').blur(function(){
			var valtxt = $(this).html();
			if(valtxt == '')
				$(this).html('글을 입력하세요.');
		});	

	}
	else{
		$('.info-insert').removeClass('text-area');
		$('.info-insert').each(function(){
			var valtxt = $(this).html();
			if(valtxt == '글을 입력하세요.')
				$(this).html('');
		});
	}
}

function Commas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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
      img.src = "./assets/images/white.png";
      figcaption = document.createElement('figcaption');
      figcaption.innerHTML = "내지" + (i + 1);
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
    tag.innerHTML = Commas(val); // Photo_paper
    tag = document.getElementById('type');
    tag.innerHTML = (type == 0 ? "인화지" : "인쇄지");
    tag = document.getElementById('easy_cutting');
    tag.innerHTML = (easy_cutting == 1 ? "유" : "무");
    afterShowPage();

  }
  else {
    var div = document.getElementsByClassName('thumbnail-item');
    thumbnail_load(1);
    for (var i = 0; i < div.length - 1; i++) {
      div[i].addEventListener('click', selectItem);      
    }
    var tag = document.getElementById('value');
	$('#page').html(max_thumbnail);
    tag.innerHTML = Commas(val); // Photo_paper
    tag = document.getElementById('type');
    tag.innerHTML = (type == 0 ? "인화지" : "인쇄지");
    tag = document.getElementById('easy_cutting');
    tag.innerHTML = (easy_cutting == 1 ? "유" : "무");
  }
  defaultEditer = document.getElementsByClassName('paper-item')[3].cloneNode(true);
  defaultEditer.getElementsByClassName('image-workplace')[0].innerHTML = "";
  defaultEditer.getElementsByClassName('info-insert')[0].innerHTML = "";
}

function main_img_load(i) {
  if (i >= document.getElementsByClassName('thumbnail-item').length - 1) {
	if(i - 1 > max_thumbnail) max_thumbnail = i - 1;
    afterinit1(true);
    return;
  }
  var div = document.getElementsByClassName('image-workplace');
  if (document.getElementsByClassName("image-workplace")[i].getElementsByTagName("img").length != 0) {
    var img2 = new Image();
    img2.onload = function(){
      var canvas = document.createElement("canvas");
      canvas.width = img2.width;
      canvas.height = img2.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img2, 0, 0);
      defaultImage = canvas.toDataURL("image/png");
      div[i].getElementsByTagName("img")[0].src=defaultImage;
      main_img_load(i + 1);
    };
    img2.setAttribute('crossOrigin', 'anonymous');
    img2.src = div[i].getElementsByTagName("img")[0].src;
  }
  else {
    main_img_load(i + 1);
  }
}

function thumbnail_load(i) {
  if (i >= document.getElementsByClassName('thumbnail-item').length - 1) {
    afterShowPage();
    return;
  }
  var div = document.getElementsByClassName('thumbnail-item');
  if (document.getElementsByClassName("image-workplace")[i].getElementsByTagName("img").length != 0) {
    var img2 = new Image();
    img2.onload = function(){
      var canvas = document.createElement("canvas");
      canvas.width = img2.width;
      canvas.height = img2.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img2, 0, 0);
      defaultImage = canvas.toDataURL("image/png");
      div[i].getElementsByTagName("img")[0].src=defaultImage;
      thumbnail_load(i + 1);
    };
    img2.setAttribute('crossOrigin', 'anonymous');
    img2.src = div[i].getElementsByTagName("img")[0].src;
  }
  else {
    thumbnail_load(i + 1);
  }
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
    if (id == "main-paper-img")
      document.getElementsByClassName("thumbnail-item")[0].getElementsByTagName('img')[0].src=imgUrl;
    else if (id == "submain-paper-img")
      document.getElementsByClassName("thumbnail-item")[1].getElementsByTagName('img')[0].src=imgUrl;
  };
  img.setAttribute('crossOrigin', 'anonymous');
  img.src = imgUrl;
}

function afterShowPage() {
  console.log(cur_thumbnail);
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
  if (easy_cutting == 1 && cur_thumbnail > 2) {
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
    $('.preview-arrow').hide();
  }

  document.body.classList.remove("loading");
}

function showBtns() {
  document.getElementsByClassName('btns')[cur_thumbnail].setAttribute('style', '');
  document.getElementsByClassName('ctrl-btn-group')[cur_thumbnail].setAttribute('style', '');
}

function getCover(data) {
  data.coverinfo.forEach(element => {
    if (element.num == cover) {
      loadImg("main-paper-img", element.url);
      loadImg("submain-paper-img", element.page1);
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
  figcaption.innerHTML = "내지" + (max_thumbnail + 1);
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
  if (cur_thumbnail < 2) return;
  if (cur_thumbnail == 2) {
    $(".image-workplace .text").addClass("bordered");
    $(".image-workplace .text").attr("contenteditable", true);
    $(".image-workplace .text").eq(0).focus();
    return;
  }
  addText();
}

function addText() {
  document.getElementsByClassName('info-insert')[cur_thumbnail - 3].setAttribute('contenteditable', 'true');
  document.getElementsByClassName('info-insert')[cur_thumbnail - 3].focus();
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

function sendPage(){

  sessionStorage.setItem("pagesaved", 1);
  $('body').addClass('loading-progress');
  $('#progress_bar div').attr('style', 'width:0%;');
  $('#progress_bar div').html("0%");

  // 이미지 URL을 서버로부터 받아서 Base64데이터를 갱신시킨다.
  $.ajax({
    url: IMAGE_RECEIVE_URL,
    type: "GET",
    data: {
      sidx: sidx
    },
    success: function(data) {
      data = JSON.parse(data);
      var imgInfo = data.imginfo;
      imgInfo.forEach(element => {
        document.getElementsByClassName("thumbnail-item")[element.page].getElementsByTagName("img")[0].src = element.url;
      });

      
      var temp = document.getElementsByClassName('save-content')[0].innerHTML;
      // 이미지데이터를 URL로 갱신한 다음 페이지데이터를 전송한다.(통신량감소)
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
          data: temp
        },
        success: function(data){
          $('body').removeClass('loading-progress');
          goConfirm2();
        },
        error: function(data) {
          $('body').removeClass('loading-progress');
          alert("페이지 저장중 오류가 발생하였습니다.");
        }
      });

    },
    error: function(data) {
      $('body').removeClass('loading-progress');
    }
  });
}

function my_cart(num) {

 if(num == 0)
  	menu = "tmpsave";
 else
  	menu = "confirm";

  sessionStorage.setItem('page_add', max_thumbnail - 22);
  sessionStorage.setItem('page_count', max_thumbnail);
  sessionStorage.setItem('value', val);
  isSended = sessionStorage.getItem("isSended");

  saveImages();
/*
  if (isSended == undefined) isSended = 0;
  if (isSended == 0) {
    saveImages();
  } else {
    goConfirm2();
  }
*/
}

function goConfirm() {
  sendPage(); // 페이지 데이터를 업로드하려는 경우
}

function goConfirm2() {
  switch (menu) {
    case "confirm":
      location.href="BookMake.asp?SIdx=" + sidx;
      break;
    case "cover":
      location.href="cover.html";
      break;
    case "option":
      location.href="option.html";
      break;
    default:
      location.reload();
      break;
  }
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

var isSended = 0;
function getThumbnail(cb = null) {
  $('.btns').hide();
  $('.left-half').attr('style', 'border-right: 3px solid #808080 !important;');
  $('.image-workplace .text').removeAttr("contenteditable");
  $('.image-workplace .text').removeClass("bordered");
  if (cur_thumbnail!=2 && document.getElementsByClassName("image-workplace")[cur_thumbnail].getElementsByTagName("img").length == 0) {
    if (cb != null)
      cb();
    return;
  }

  isSended = 0;
  sessionStorage.setItem("isSended", 0);
  var mydiv = document.getElementById('main-editor');
  const temp_thumbnail = cur_thumbnail;
  if (!isPreview) {
    window.scrollTo(0, 0);
    html2canvas(mydiv).then(function(canvas){
      document.getElementsByClassName("thumbnail-item")[temp_thumbnail].getElementsByTagName('img')[0].src = canvas.toDataURL('image/jpg');
      $('.left-half').attr('style', '');
      if (cb != null)
        cb();
    });
  }
}

var menu = "";
function changeCover() {
  menu = "cover";
  isSended = sessionStorage.getItem("isSended");
  if (isSended == 0)
    myAlert();
  else
    okAlert();
}

function changeOptions() {
  menu = "option";
  isSended = sessionStorage.getItem("isSended");
  if (isSended == 0)
    myAlert();
  else
    okAlert();
}

function myAlert() {
  $("body").addClass("loading-confirm");
}

function okAlert() {
  $('body').removeClass("loading-confirm");
  isSended = sessionStorage.getItem("isSended");
  if (isSended == undefined) isSended = 0;
  if (isSended == 0) {
    saveImages();
  }
  else {
    goConfirm2();
  }
}
function cancelAlert() {
  $('body').removeClass("loading-confirm");
}

init();

window.addEventListener( "pageshow", function ( event ) {
  var historyTraversal = event.persisted || ( typeof window.performance != "undefined" && window.performance.navigation.type === 2 );
  if ( historyTraversal ) {
    window.location.reload();
  }
});