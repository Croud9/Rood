import Snap from "snapsvg-cjs"

import svgPanZoom from "svg-pan-zoom"

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
    var svg = Snap("#svg");
    // var panZoomTiger = svgPanZoom('#svg')
    

    draw_some()


    function onSVGLoaded( data ){ 
      svg.append( data );
    }

    function draw_some() {
      var height = svg.node.clientHeight;
      var width = svg.node.clientWidth;
      svg.attr({ viewBox: 0 + ' ' + 0 + ' ' + width + ' ' +  height });
      svg.clear()
      const tree = svg.group()
      const father = svg.rect((width / 3), 0, 400, 100, 10).attr({ fill: "#fc0", fillOpacity: 0.5 })
      const father_box = father.getBBox();
      const mother = svg.rect(father_box.x2 + 50, father_box.y, 400, 100, 10).attr({ fill: "#fc0", fillOpacity: 0.5 })
      const child1 = svg.rect(father_box.x - 50, father_box.y2 + 100, 400, 100, 10).attr({ fill: "#fc0", fillOpacity: 0.5 })

      const mother_box = mother.getBBox();
      const child1_box = child1.getBBox();

      console.log(father_box)
      const name = svg.text(father_box.x2 - 200, father_box.y2 - 50, "Snap");
      const path = svg.path(`M${ father_box.x2 - 200 } ${ father_box.y2 }L${ child1_box.x2 - 200} ${ child1_box.y }`).attr({ stroke: "#000", strokeWidth: 2 });
      const path2 = svg.path(`M${ mother_box.x2 - 200 } ${ mother_box.y2 }L${ child1_box.x2 - 200} ${ child1_box.y }`).attr({ stroke: "#000", strokeWidth: 2 });
      tree.add(father, mother, child1, path, name, path2)

      // tree.transform('s' + 0.75 + ' 0 0');

    };

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