const IMAGE_SEND_URL = "http://thecamp.inity.co.kr/Book/ImageSave.asp";
const IMAGE_RECEIVE_URL = "http://thecamp.inity.co.kr/Book/ImageGetUrl.asp";
const PAGE_SEND_URL = "http://thecamp.inity.co.kr/Book/pageSave.asp";
const PAGE_RECEIVE_URL = "http://thecamp.inity.co.kr/Book/pageGetData.asp";

var defaultEditer;
var type = 0;
var easy_cutting = 0;
var cover = 0;
var sidx;

function fileopen() {
    $('#openfile').trigger('click');
}

function afterfileopen() {
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
    // var context = canvas.getContext("2d");
    // var data = context.getImageData(0, 0, canvas.width, canvas.height);
    // console.log(data);
  }
  $('.ctrl-btn').toggleClass('btn-hidden');
}

function rotate() {
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
    var page = document.getElementById('main-editor').innerHTML;
    // img = JSON.stringify(img);
    page = JSON.stringify(page);
    sendImage(img);
    sendPage(page);
    $("#btns").show();
  });
}

var max_thumbnail = 20;
function init() {
  sidx = sessionStorage.getItem("sidx");
  defaultEditer = document.getElementById('main-editor').innerHTML;
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
  
  // data = {};
  // getCover(data, img);
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
    
  // data = {};
  // setThumbnails(data);

  // img = document.createElement('img');
  // img.src = "./assets/images/white.png";
  // figcaption = document.createElement('figcaption');
  // figcaption.innerHTML = "뒤커버";
  div = document.createElement('div');
  div.classList.add('thumbnail-item');
  // div.appendChild(img);
  // div.appendChild(figcaption);
  // div.setAttribute('page', number + 1);
  document.getElementsByClassName('thumbnail-list')[0].appendChild(div);

  var tag = document.getElementById('value');
  tag.innerHTML = "9,900"; // Photo_paper
  tag = document.getElementById('type');
  tag.innerHTML = (type == 0 ? "인화지" : "인쇄지");
  tag = document.getElementById('easy_cutting');
  tag.innerHTML = (easy_cutting == 0 ? "유" : "무");
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
  // data = {
  //   "coverinfo": [
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
  
  data.coverinfo.forEach(element => {
    if (element.num == cover) {
      document.getElementsByClassName("thumbnail-list")[0].getElementsByTagName('img')[0].src = element.url;
      // img.src = element.url;
    }
  });
}

function setThumbnails(data) {
  // data = {
  //   "imginfo":[
  //     {
  //       "page":1,
  //       "url":"http://thecamp.inity.co.kr/Storage/data/20200221/126671358257230571e32a9497bc9ce85a05dda04543fd6.jpg"
  //     }
  //   ]
  // };
  
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
  $("#btns").show();

  const url = "http://thecamp.inity.co.kr/Book/pageGetData.asp";
    // $.get(
    //   url,
    //   {
    //      sidx: sidx,
    //      page: cur_thumbnail
    //    },
    //   function(data, status){
    //     console.log(status);
    //     if (status=="success") {
    //       try{
    //       showPage(JSON.parse(data));
    //       } catch(e) {
    //         document.getElementById('main-editor').innerHTML = "";
    //       }
    //     }
    //   },
    //   function(data, status) {
    //     console.log(data);
    //   }
    // );

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
    .fail(function() {document.getElementById('main-editor').innerHTML = defaultEditer;});
    // data = {};
  // showPage(data);
  // alert(cur_thumbnail+"번째 항목 선택됨...");
}

function showPage(data) {
  // data = {
  //   data : '<div>OK</div>'
  // }
  console.log(data);
  var temp = data.data.replace(/\\n/g, '').replace(/\\"/g, '"').replace(/^\"+|\"+$/, "");

  document.getElementById('main-editor').innerHTML = temp;
  $("#btns").show();
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
        .fail(function() {document.getElementById('main-editor').innerHTML = defaultEditer;});
          // data = {};
          // showPage(data);


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
            .fail(function() {document.getElementById('main-editor').innerHTML = defaultEditer;});
          // data = {};
          // showPage(data);



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
  document.getElementById('info-insert').setAttribute('style', 'border-left: 1px dashed #FF0000;');
}

function addText() {
  document.getElementById('info-insert').setAttribute('contenteditable', 'true');
  document.getElementById('info-insert').focus();
}

function preview() {
  $("#btns").toggle();
}
// U page: 페지번호, data: 화상2진자료
// D status : 200 정상 기타 오유
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
    console.log(data);
  })
  .fail(function() {alert("error");});
}

// U 없음
// D data: [imageURL]
function receiveImage() {
  $.get(IMAGE_RECEIVE_URL,
  {
    sidx: sidx
  },
  function(data, status){
    if (status == 200) {
      /*접수자료처리*/data.data;
    }
    else
      alert("오유가 발생하였습니다.");
  });
}

// U page: 페지번호, data: HTML자료
// D status: 200 정상 기타 오유
function sendPage(data){
  $.post(PAGE_SEND_URL,
  {
    sidx: sidx,
    page: cur_thumbnail,
    data: data
  },
  function(data, status){
    // console.log(data);
    if (status == "success")
    {
      console.log("페지가 보관되였습니다.");
      thumbnailSet();
    }
    else
      alert("오유가 발생하였습니다.");
  });
}

// U page: 페지번호
// D status: 200 정상 기타 오유, data: HTML자료
function receivePage(page) {
  $.get(PAGE_RECEIVE_URL,
  {
    sidx: sidx,
    page: page
  },
  function(data, status){
    if (status == 200) {
      // console.log(JSON.parse(data.data));
    }
    else
      alert("오유가 발생하였습니다.");
  });
}

function my_cart() {
  if (!confirm("아래의 내용으로 주문하시겠습니까?")) return;
  const url = "";
  $.post(
    url,
    {
      sidx: sidx
    },
    function(data, status) {
      if (status == "success") {
        alert("주문되였습니다.");
        location.href = "cover.html";
      }
      else {
        alert("오유가 발생하였습니다.");
      }
    }
  );
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


init();