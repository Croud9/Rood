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
    var height = svg.node.clientHeight;
    var width = svg.node.clientWidth;
    svg.attr({ viewBox: 0 + ' ' + 0 + ' ' + width + ' ' +  height });
    svg.clear()

    // draw_some()
    const h_offset = 150
    const bbox1 = draw_box((width / 3), 50)
    const bbox4 = draw_box(bbox1.x2 + 100, bbox1.y + 20)
    const bbox2 = draw_box(bbox1.x - 100, bbox1.height + h_offset)
    const bbox3 = draw_box(bbox2.x2 + 100, bbox1.height + h_offset)
    draw_box(bbox3.x2 + 100, bbox1.height + h_offset)

    const path = svg.path(`M${ bbox1.x + bbox1.width / 2} ${ bbox1.y2 }L${  bbox2.x + bbox2.width / 2} ${ bbox2.y }`).attr({ stroke: "#000", strokeWidth: 2 });
    const path2 = svg.path(`M${ bbox1.x + bbox1.width / 2} ${ bbox1.y2 }L${  bbox3.x + bbox2.width / 2} ${ bbox3.y }`).attr({ stroke: "#000", strokeWidth: 2 });


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
      const name = svg.text(father_box.x2 - 200, father_box.y2 - 50, "Snap Snapovich Snapoff");
      const path = svg.path(`M${ father_box.x2 - 200 } ${ father_box.y2 }L${ child1_box.x2 - 200} ${ child1_box.y }`).attr({ stroke: "#000", strokeWidth: 2 });
      const path2 = svg.path(`M${ mother_box.x2 - 200 } ${ mother_box.y2 }L${ child1_box.x2 - 200} ${ child1_box.y }`).attr({ stroke: "#000", strokeWidth: 2 });
      tree.add(father, mother, child1, path, name, path2)

      // tree.transform('s' + 0.75 + ' 0 0');

    };

    function draw_box(x, y) {
      const all_text = svg.group()
      const text = svg.text(x, y, "Wnap Vnaprch Bnapoff");
      const bb_name = text.getBBox();
      const b_date = svg.text(bb_name.x - 60, bb_name.y + 60, "*01.01.1120");
      const d_date = svg.text(bb_name.x + 150, bb_name.y + 60, "†01.01.1200");
      all_text.add(text, b_date, d_date)

      const bb = all_text.getBBox();
      const rect_with_text = svg.rect(bb.x - 5, bb.y - 5, bb.width + 10, bb.height + 10, 10).attr({ fill: "#fc0", fillOpacity: 0.5 })
      return rect_with_text.getBBox()
    };

    function get_family() {
      if ($('#family:selected').text() != "Выберите") {
        $.ajax({
          url: "get_family",
          dataType: "json",
          data: { id: $("#family option:selected").val() },
          success: function(data) {
            // console.log(data)
            test2( data )
            // test2( data[1] )
          },
        });
      };
    };

    function test2( arr ) {

      const map = Object.assign({} , ...arr.map(v => 
        ({ [v.id]: Object.assign(v, { partner: null, children: [] }) })
      ))
      console.log(map)
    
      const tree = Object.values(map).filter(function(v) {
        // console.log('-+-')
        // console.log(!(v.parent && map[v.parent].children.push(v)))
        // console.log(v.parent)
        // console.log(map[v.parent])

        // console.log('---')
        return !(v.parent && map[v.parent].children.push(v) && v.mother && map[v.mother].children.push(v))
        // return !(v.parent && map[v.parent] && v.mother && map[v.mother])
      })

      // const tree2 = tree.filter(function(v) {
      //   const rr = v
      //   tree.map(function(f) {
      //     if (rr.parent.children == f.parent.children) return f
      //   } )
      // })
      // console.log(tree2)
      console.log(tree)
      return tree
    }

  }
});


[
  {
      "id": "649a93960da1553e8c6032ee",
      "name": "Иванов Иван Иванович",
      "parent": null,
      "mother": null,
      "partner": null,
      "children": [
          {
              "id": "649ab5290da15544959a5ed4",
              "name": "Ivanov Курля Иванович",
              "parent": "649a93960da1553e8c6032ee",
              "mother": "649a93ea0da1553e8c6032ef",
              "partner": null,
              "children": []
          },
          {
              "id": "649d983f0da155034c4eb2f1",
              "name": "Иванова Марья Карнизовна",
              "parent": "649a93960da1553e8c6032ee",
              "mother": "649a93ea0da1553e8c6032ef",
              "partner": null,
              "children": [
                  {
                      "id": "649d98c70da155034c4eb2f3",
                      "name": "Курунков Кирпес",
                      "parent": "649d98920da155034c4eb2f2",
                      "mother": "649d983f0da155034c4eb2f1",
                      "partner": null,
                      "children": []
                  },
                  {
                      "id": "649d98f20da155034c4eb2f4",
                      "name": "Курункова Гипера",
                      "parent": "649d98920da155034c4eb2f2",
                      "mother": "649d983f0da155034c4eb2f1",
                      "partner": null,
                      "children": []
                  }
              ]
          }
      ]
  },
  {
      "id": "649a93ea0da1553e8c6032ef",
      "name": "Иванова Ивана Ивановна",
      "parent": null,
      "mother": null,
      "partner": null,
      "children": [
          {
              "id": "649ab5290da15544959a5ed4",
              "name": "Ivanov Курля Иванович",
              "parent": "649a93960da1553e8c6032ee",
              "mother": "649a93ea0da1553e8c6032ef",
              "partner": null,
              "children": []
          },
          {
              "id": "649d983f0da155034c4eb2f1",
              "name": "Иванова Марья Карнизовна",
              "parent": "649a93960da1553e8c6032ee",
              "mother": "649a93ea0da1553e8c6032ef",
              "partner": null,
              "children": [
                  {
                      "id": "649d98c70da155034c4eb2f3",
                      "name": "Курунков Кирпес",
                      "parent": "649d98920da155034c4eb2f2",
                      "mother": "649d983f0da155034c4eb2f1",
                      "partner": null,
                      "children": []
                  },
                  {
                      "id": "649d98f20da155034c4eb2f4",
                      "name": "Курункова Гипера",
                      "parent": "649d98920da155034c4eb2f2",
                      "mother": "649d983f0da155034c4eb2f1",
                      "partner": null,
                      "children": []
                  }
              ]
          }
      ]
  },
  {
      "id": "649a94130da1553e8c6032f0",
      "name": "Иванов Иоан Иванович",
      "parent": null,
      "mother": null,
      "partner": null,
      "children": []
  },
  {
      "id": "649d98920da155034c4eb2f2",
      "name": "Курунков Павел",
      "parent": "",
      "mother": "",
      "partner": null,
      "children": [
          {
              "id": "649d98c70da155034c4eb2f3",
              "name": "Курунков Кирпес",
              "parent": "649d98920da155034c4eb2f2",
              "mother": "649d983f0da155034c4eb2f1",
              "partner": null,
              "children": []
          },
          {
              "id": "649d98f20da155034c4eb2f4",
              "name": "Курункова Гипера",
              "parent": "649d98920da155034c4eb2f2",
              "mother": "649d983f0da155034c4eb2f1",
              "partner": null,
              "children": []
          }
      ]
  }
][
  {
      "id": "649a93960da1553e8c6032ee",
      "name": "Иванов Иван Иванович",
      "parent": null,
      "mother": null,
      "partner": null,
      "children": [
          {
              "id": "649ab5290da15544959a5ed4",
              "name": "Ivanov Курля Иванович",
              "parent": "649a93960da1553e8c6032ee",
              "mother": "649a93ea0da1553e8c6032ef",
              "partner": null,
              "children": []
          },
          {
              "id": "649d983f0da155034c4eb2f1",
              "name": "Иванова Марья Карнизовна",
              "parent": "649a93960da1553e8c6032ee",
              "mother": "649a93ea0da1553e8c6032ef",
              "partner": null,
              "children": [
                  {
                      "id": "649d98c70da155034c4eb2f3",
                      "name": "Курунков Кирпес",
                      "parent": "649d98920da155034c4eb2f2",
                      "mother": "649d983f0da155034c4eb2f1",
                      "partner": null,
                      "children": []
                  },
                  {
                      "id": "649d98f20da155034c4eb2f4",
                      "name": "Курункова Гипера",
                      "parent": "649d98920da155034c4eb2f2",
                      "mother": "649d983f0da155034c4eb2f1",
                      "partner": null,
                      "children": []
                  }
              ]
          }
      ]
  },
  {
      "id": "649a93ea0da1553e8c6032ef",
      "name": "Иванова Ивана Ивановна",
      "parent": null,
      "mother": null,
      "partner": null,
      "children": [
          {
              "id": "649ab5290da15544959a5ed4",
              "name": "Ivanov Курля Иванович",
              "parent": "649a93960da1553e8c6032ee",
              "mother": "649a93ea0da1553e8c6032ef",
              "partner": null,
              "children": []
          },
          {
              "id": "649d983f0da155034c4eb2f1",
              "name": "Иванова Марья Карнизовна",
              "parent": "649a93960da1553e8c6032ee",
              "mother": "649a93ea0da1553e8c6032ef",
              "partner": null,
              "children": [
                  {
                      "id": "649d98c70da155034c4eb2f3",
                      "name": "Курунков Кирпес",
                      "parent": "649d98920da155034c4eb2f2",
                      "mother": "649d983f0da155034c4eb2f1",
                      "partner": null,
                      "children": []
                  },
                  {
                      "id": "649d98f20da155034c4eb2f4",
                      "name": "Курункова Гипера",
                      "parent": "649d98920da155034c4eb2f2",
                      "mother": "649d983f0da155034c4eb2f1",
                      "partner": null,
                      "children": []
                  }
              ]
          }
      ]
  },
  {
      "id": "649a94130da1553e8c6032f0",
      "name": "Иванов Иоан Иванович",
      "parent": null,
      "mother": null,
      "partner": null,
      "children": []
  },
  {
      "id": "649d98920da155034c4eb2f2",
      "name": "Курунков Павел",
      "parent": "",
      "mother": "",
      "partner": null,
      "children": [
          {
              "id": "649d98c70da155034c4eb2f3",
              "name": "Курунков Кирпес",
              "parent": "649d98920da155034c4eb2f2",
              "mother": "649d983f0da155034c4eb2f1",
              "partner": null,
              "children": []
          },
          {
              "id": "649d98f20da155034c4eb2f4",
              "name": "Курункова Гипера",
              "parent": "649d98920da155034c4eb2f2",
              "mother": "649d983f0da155034c4eb2f1",
              "partner": null,
              "children": []
          }
      ]
  }
]