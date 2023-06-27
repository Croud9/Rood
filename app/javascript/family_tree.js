import Snap from "snapsvg-cjs"

// var svg = Snap("#svg");

// var height = svg.node.clientHeight;
// var width = svg.node.clientWidth;
// svg.attr({ viewBox: '0 0' + ' ' + width + ' ' +  height});

// var l = Snap.load("familytree.svg", onSVGLoaded ) ;

// function onSVGLoaded( data ){ 
//   svg.append( data );
// }
document.addEventListener("turbo:load", function() { 
  if (document.getElementById("svg") !== null) {
    $('#family').change(get_family);

    var s = Snap("#svg");
    var l = Snap.load("familytree.svg", onSVGLoaded ) ;

    function onSVGLoaded( data ){ 
        s.append( data );
    }

    function get_family() {
      if ($('#family:selected').text() != "Выберите") {
        $.ajax({
          url: "get_family",
          data: { id: $("#family option:selected").val() },
          success: function(data) {
            // alert('Данные получены!')
          },
        });
      };
    };


  }
});