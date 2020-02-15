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
        screenShot();
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
    screenShot();
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
  // roate the canvas by +90% (==Math.PI/2)
  ctx.rotate(Math.PI/2);
  // draw the signature
  // since images draw from top-left offset the draw by 1/2 width & height
  ctx.drawImage(img,-img.naturalWidth/2,-img.naturalHeight/2);
  // un-rotate the canvas by -90% (== -Math.PI/2)
  ctx.rotate(-Math.PI/2);
  // un-translate the canvas back to origin==top-left canvas
  ctx.translate(-rotationCanvas.width/2,-rotationCanvas.height/2);

  img.src = rotationCanvas.toDataURL();
  screenShot();
}

function scaleUp(){
  cropper.zoom(0.1);
  screenShot();
}

function scaleDown(){
  cropper.zoom(-0.1);
  screenShot();
}

function del() {
  document.getElementById('image-workplace').innerHTML="";
  initCrop();
  screenShot();
}

function cancelCrop() {
  document.getElementById('image-workplace').innerHTML="";
  var img = document.createElement("img");
  img.src = imgTempSrc;
  img.setAttribute('id', 'image');
  document.getElementById('image-workplace').appendChild(img);
  cropping = false;
  $('.ctrl-btn').toggleClass('btn-hidden');
  screenShot();
}

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
  var div = document.createElement('div');
  div.classList.add('thumbnail-item');
  var img = document.createElement('img');
  img.src = "./assets/images/photos/cover1.png";
  div.appendChild(img);
  var figcaption = document.createElement('figcaption');
  figcaption.innerHTML = "앞커버";
  div.appendChild(figcaption);
  div.setAttribute('page', 0);
  div.addEventListener('click', selectItem);
  document.getElementsByClassName('thumbnail-list')[0].appendChild(div);
  var number = max_thumbnail;
  for (var i = 0; i < number; i++) {
    img = document.createElement('img');
    figcaption = document.createElement('figcaption');
    img.src = "./assets/images/photos/" + (i + 1) + ".png";
    figcaption.innerHTML = "속지" + (i + 1);
    div = document.createElement('div');
    div.classList.add('thumbnail-item');
    div.appendChild(img);
    div.appendChild(figcaption);
    div.setAttribute('page', i + 1);
    div.addEventListener('click', selectItem);
    document.getElementsByClassName('thumbnail-list')[0].appendChild(div);
  }
  img = document.createElement('img');
  figcaption = document.createElement('figcaption');
  img.src = "./assets/images/photos/cover2.png";
  figcaption.innerHTML = "뒤커버";
  div = document.createElement('div');
  div.classList.add('thumbnail-item');
  div.appendChild(img);
  div.appendChild(figcaption);
  div.setAttribute('page', number + 1);
  div.addEventListener('click', selectItem);
  document.getElementsByClassName('thumbnail-list')[0].appendChild(div);

  var value = document.getElementById('value');
  value.innerHTML = "9,900"; // Photo_paper
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
}

var cur_thumbnail;

function thumbnail_prev() {
  if (cur_thumbnail == undefined || cur_thumbnail == 0) {
    cur_thumbnail = 0;
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
    cur_thumbnail = 0;
  }
  else if (cur_thumbnail <= max_thumbnail) {
    cur_thumbnail ++;
  }
  var thumbnail_item = document.getElementsByClassName('thumbnail-item');

  for (const key in thumbnail_item) {

    if (thumbnail_item.hasOwnProperty(key)) {
      if (key == cur_thumbnail) {
        thumbnail_item[key].classList.add("current-item");
        thumbnail_item[key].scrollIntoView();
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
  img.src = "./assets/images/photos/add.png";
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
  val = Number(value.innerHTML.replace(',', '')) + 250; // Print_paper
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

function addText() {
  document.getElementById('info-insert').setAttribute('contenteditable', 'true');
  document.getElementById('info-insert').focus();
}

init();