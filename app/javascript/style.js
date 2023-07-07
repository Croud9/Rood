
document.addEventListener("turbo:load", function() { 
  $("textarea").on("keyup", function(event) {
    event.target.style.height = "20px";
    event.target.style.height = (event.target.scrollHeight)+"px";
  } );
})