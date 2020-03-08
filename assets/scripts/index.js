$(function(){
  var el = document.getElementById("main");
  Hammer(el).on('swiperight', openNav);
  Hammer(el).on('swipeleft', closeNav);
});

function openNav() {
  document.getElementById("mySidenav").style.width = "80%";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}
