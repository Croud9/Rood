import Snap from "snapsvg-cjs"

import svgPanZoom from "svg-pan-zoom"

document.addEventListener("turbo:load", function() { 
  if (document.getElementById("svg") !== null) {
    
    $('#family').change(get_family);
    var svg = Snap('#svg');
    // var panZoomTiger = svgPanZoom('#svg')
    var height = svg.node.clientHeight;
    var width = svg.node.clientWidth;
    svg.attr({ viewBox: 0 + ' ' + 0 + ' ' + width + ' ' +  height });
    svg.clear()
    // var all_elements = svg.g()
    // var svgElement = document.querySelector('#svg')
    // var panZoomTiger = svgPanZoom(svgElement)
    // var panZoomTiger = svgPanZoom('#svg');

    function onSVGLoaded( data ){ 
      svg.append( data );
    }

    function draw_box(x, y, name, birth, death) {
      const rect_with_text = svg.rect(x, y, 300, 100, 10).attr({ fill: "#fc0", fillOpacity: 0.5 })
      const bb_rect = rect_with_text.getBBox();
      const text = svg.text(bb_rect.x + 10, bb_rect.y + 20, name);
      const b_date = svg.text(bb_rect.x + 10, bb_rect.y2 - 10, "*" + birth + ' ' + "†" + death);
      // all_elements.add(rect_with_text, text, b_date)
      return bb_rect
    };

    function draw_family(start_x, start_y, partner, partner2, line_from_parents = null) {
      const h_offset = 150
      const bbox1 = draw_box(start_x, start_y, partner.name, partner.birth_date, partner.death_date)
      const bbox2 = draw_box(bbox1.x2 + 100, bbox1.y, partner2.name, partner2.birth_date, partner2.death_date)
      if (line_from_parents) svg.path(`M${ line_from_parents.x2} ${ line_from_parents.y2 }L${ bbox1.x + 150 } ${ bbox1.y }`).attr({ stroke: "#000", strokeWidth: 2 }).getBBox(); 
      const connect_partners = svg.path(`M${ bbox1.x2} ${ bbox1.y + 50 }L${  bbox2.x} ${ bbox2.y + 50 }`).attr({ stroke: "#000", strokeWidth: 2 }).getBBox();
      const connect_for_child = svg.path(`M${ connect_partners.x + connect_partners.width / 2} ${ connect_partners.y2 }v${ 100 }`).attr({ stroke: "#000", strokeWidth: 2 }).getBBox();
      // all_elements.add(bbox1, bbox2, connect_partners, connect_for_child)
      return [bbox1, connect_for_child]
    };

    function get_family() {
      if ($('#family:selected').text() != "Выберите") {
        $.ajax({
          url: "get_family",
          dataType: "json",
          data: { id: $("#family option:selected").val() },
          success: function(data) {
            test2( data )
            // var panZoomTiger = svgPanZoom('#svg');
            // svg.transform('s' + 0.75 + ' 0 0');
            // svg.g(svg.selectAll())
            var svgElement = document.getElementById('svg')
            var panZoomTiger = svgPanZoom(svgElement)
            console.log(svg.selectAll())
          },
        });
      };
    };

    function test2( arr ) {
      svg.clear()

      const people = Object.assign({} , ...arr.map(v => 
        ({ [v.id]: Object.assign(v, { children: [] }) })
      ))
      console.log(people)

      const trees = Object.values(people).filter(function(v) {
        return !(v.parent && people[v.parent].children.push(v) && v.mother && people[v.mother].children.push(v))
      })
      console.log(trees)

      const last_ids = []
      trees.forEach(tree => {
        
        if ( tree.partners.length != 0 && !last_ids.includes(tree.id) ) {
          if ( tree.partners.length == 1 ) {
            const partner = people[tree.partners[0]];
            if (partner.children.length == tree.children.length) {
              last_ids.push(partner.id)
              console.log('-Родитель ' + tree.name)
              console.log('-Родитель ' + partner.name)
              const [left_box, connect_for_child] = draw_family((width / 4), 50, tree, partner)
              draw_child(partner, people, last_ids, left_box, connect_for_child)
              console.log('-------')
            }
          } else {
            'pass'
          };
        } else if ( !last_ids.includes(tree.id) ) {
          console.log('Одиночка ' + tree.name)
          const bbox1 = draw_box(-25 , 50, tree.name, tree.birth_date, tree.death_date)
        }
      })
      return trees
    }

    function draw_child(partner, people, last_ids, box, line_from_parents) {
      partner.children.forEach(child => {
        if (child.partners.length > 0 ) {
          const partner = people[child.partners[0]];
          if (partner.children.length == child.children.length) {
            last_ids.push(partner.id)
            console.log('--Родитель ' + child.name)
            console.log('---Родитель ' + partner.name)
            const [left_box, connect_for_child] = draw_family(box.x, box.y2 + 150, child, partner, line_from_parents)
            draw_child(partner, people, last_ids, left_box, connect_for_child)
          }
        } else {
          console.log('--Ребенок ' + child.name)
          const bbox1 = draw_box(box.x - 425 , box.y2 + 150, child.name, child.birth_date, child.death_date)
          svg.path(`M${ line_from_parents.x2} ${ line_from_parents.y2 }L${ bbox1.x + 150 } ${ bbox1.y }`).attr({ stroke: "#000", strokeWidth: 2 }).getBBox();
        }
      })
    }

  }
});

