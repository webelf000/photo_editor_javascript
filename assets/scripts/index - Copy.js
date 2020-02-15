function fileopen() {
    $('#openfile').trigger('click');
}

function afterfileopen() {
    // var input = document.getElementById("openfile");
    // var fReader = new FileReader();
    // fReader.readAsDataURL(input.files[0]);
    // fReader.onloadend = function(event){
    //     var canvas = document.getElementById('main_canvas');
    //     var context = canvas.getContext('2d');
    //     var imgPath = event.target.result;
    //     var imgObj = new Image();
    //     imgObj.src = imgPath;
    //     var x = 0;
    //     var y = 0;
    //     imgObj.onload = function(){
    //         context.clearRect(0, 0, canvas.width, canvas.height);
    //         if (imgObj.width / imgObj.height > canvas.width / canvas.height)
    //             context.drawImage(imgObj, x, y, canvas.width, canvas.width * imgObj.height / imgObj.width);
    //         else
    //             context.drawImage(imgObj, x, y, canvas.height * imgObj.width / imgObj.height, canvas.height);
    //     }
    // }
    var canvas = new fabric.Canvas('main_canvas');
    var input = document.getElementById("openfile");
    var fReader = new FileReader();
    fReader.readAsDataURL(input.files[0]);
    fReader.onloadend = function(event){
        var imgPath = event.target.result;
        document.getElementById('image-workplace').innerHTML="";
        var imgElement = document.createElement('img');
        imgElement.setAttribute('id', 'target');
        imgElement.setAttribute('src', imgPath);
        document.getElementById('image-workplace').appendChild(imgElement);
        init();
    }
    
}

function scale(){
    console.log(dkrm);
    dkrm.canvas.renderAll();
}
var dkrm;
function init () {
dkrm = new Darkroom('#target', {
    // Size options
    // minWidth: 100,
    // minHeight: 100,
    // maxWidth: 472.5,
    // maxHeight: 360,
    backgroundColor: '#ffffff',

    // Plugins options
    plugins: {
      save: false,
      crop: {
        // quickCropKey: 67, //key "c"
        //minHeight: 50,
        //minWidth: 50,
        //ratio: 4/3
      }
    },

    // Post initialize script
    // initialize: function() {
    //   var cropPlugin = this.plugins['crop'];
    //   // cropPlugin.selectZone(170, 25, 300, 300);
    //   cropPlugin.requireFocus();
    // }
  });
}

function rotate() {
  //dkrm.applyTransformation(new Rotation(90));
  // console.log(dkrm.plugins.rotate);
  /*var i = 0;
  $('button.darkroom-button').each(
    function(){if (i == 3) {
      this.click();
    }
    i++
    });*/
}