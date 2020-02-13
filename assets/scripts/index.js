function fileopen() {
    $('#openfile').trigger('click');
}

function afterfileopen() {
    var input = document.getElementById("openfile");
    var fReader = new FileReader();
    fReader.readAsDataURL(input.files[0]);
    fReader.onloadend = function(event){
        var canvas = document.getElementById('main_canvas');
        var context = canvas.getContext('2d');
        var imgPath = event.target.result;
        var imgObj = new Image();
        imgObj.src = imgPath;
        var x = 0;
        var y = 0;
        imgObj.onload = function(){
            if (imgObj.width / imgObj.height > canvas.width / canvas.height)
                context.drawImage(imgObj, x, y, canvas.width, canvas.width * imgObj.height / imgObj.width);
            else
                context.drawImage(imgObj, x, y, canvas.height * imgObj.width / imgObj.height, canvas.height);
        }
    }

}