import Snap from "snapsvg-cjs"

import svgPanZoom from "svg-pan-zoom"

document.addEventListener("turbo:load", function() { 
  if (document.getElementById("svg") !== null) {
    
    $('#family').change(get_family);
    var svg = Snap('#svg');

    var height = svg.node.clientHeight;
    var width = svg.node.clientWidth;
    svg.attr({ viewBox: 0 + ' ' + 0 + ' ' + width + ' ' +  height });
    var pan_zoom = svgPanZoom('#svg', {
      zoomEnabled: true,
      zoomScaleSensitivity: 0.2,
      controlIconsEnabled: false,
      minZoom: -100,
    });
    const group_panZoom = svg.selectAll('.svg-pan-zoom_viewport')

    window.addEventListener('resize', function(event) {
      pan_zoom.resize();
      pan_zoom.center(); // fit works as expected

    }, true);
    
    function onSVGLoaded( data ){ 
      svg.append( data );
    }

    function draw_box(x, y, name, birth, death) {
      birth = birth ? birth : '❓'
      death = death ? death : '❓'
      const rect_with_text = svg.rect(x, y, 300, 100, 10).attr({ fill: "#fc0", fillOpacity: 0.5 }).addClass('snap_elm')
      const bb_rect = rect_with_text.getBBox();
      const text = svg.text(bb_rect.x + 10, bb_rect.y + 20, name).addClass('snap_elm');
      const b_date = svg.text(bb_rect.x + 10, bb_rect.y2 - 10, "*" + birth + ' ' + "†" + death).addClass('snap_elm');
      return bb_rect
    };

    function draw_family(start_x, start_y, partner, partner2 = null, line_from_parents = null) {
      const bbox1 = draw_box(start_x, start_y, partner.name, partner.birth_date, partner.death_date)
      const bbox2 = partner2 ? draw_box(bbox1.x2 + 100, bbox1.y, partner2.name, partner2.birth_date, partner2.death_date) :
                                svg.text(bbox1.x2 + 100, bbox1.y + 55, '❌').addClass('snap_elm').getBBox();
      if (line_from_parents) svg.path(`M${ line_from_parents.x2} ${ line_from_parents.y2 }L${ bbox1.x + 150 } ${ bbox1.y }`)
          .attr({ stroke: "#000", strokeWidth: 2 })
          .addClass('snap_elm')
          .getBBox(); 
      const connect_partners = svg.path(`M${ bbox1.x2} ${ bbox1.y + 50 }L${  bbox2.x} ${ bbox2.y + bbox2.height / 2}`)
          .attr({ stroke: "#000", strokeWidth: 2 })
          .addClass('snap_elm')
          .getBBox();
      const connect_for_child = svg.path(`M${ connect_partners.x + connect_partners.width / 2} ${ connect_partners.y2 }v${ 100 }`)
          .attr({ stroke: "#000", strokeWidth: 2 })
          .addClass('snap_elm')
          .getBBox();
      const text = svg.text(connect_for_child.x - 8, connect_for_child.y + 7, '❤').addClass('snap_elm');
      // const text = svg.text(connect_partners.x + connect_partners.width / 2 - 11, connect_partners.y2 + 6, '◾').addClass('snap_elm');
      // ❤ ❌ ❎ ◯ ❓ ◾ ✍
      return [bbox1, connect_for_child]
    };

    function get_family() {
      if ($('#family:selected').text() != "Выберите") {
        $.ajax({
          url: "get_family",
          dataType: "json",
          data: { id: $("#family option:selected").val() },
          success: function(data) {
            draw_tree( data )
            const all_elm = svg.selectAll('.snap_elm')
            group_panZoom[0].add(all_elm)
            pan_zoom.updateBBox(); 
            pan_zoom.center(); 
            if (all_elm.length > 3) pan_zoom.fit(); 
          },
        });
      };
    };

    function draw_tree(data) {
      svg.selectAll('.snap_elm').remove()
      
      const [people, trees] = create_trees_json(data)
      const last_ids = []

      trees.forEach(tree => {
        if ( !last_ids.includes(tree.id) ) {
          let bbox_child_married = null
          const elements = svg.selectAll('.snap_elm').length != 0 ? svg.selectAll('.snap_elm').getBBox() : {x2: 0, y: 0}
          if ( tree.partners.length > 0 && tree.partners[0] ) {
            //Корень
            let num_partner = 0
            let v_line
            const start_size = 20
            const step_size = 8
            tree.partners.forEach(p => {
              const partner = people[p];
              let box_x = bbox_child_married ? svg.selectAll('.snap_elm').getBBox().x2 + 100 + 300 * partner.children.length : elements.x2 + 100 + 300 * partner.children.length
              last_ids.push(partner.id)
              if ( num_partner > 0 ) {
                const bbox_partner = draw_box(box_x, elements.y, partner.name, partner.birth_date, partner.death_date)
                const v_line_partner = svg.path(`M${ bbox_partner.x + bbox_partner.width / 2} ${ bbox_partner.y }v${ -start_size - step_size * num_partner }`)
                .attr({ stroke: "#000", strokeWidth: 2 })
                .addClass('snap_elm')
                .getBBox();
                const connect_partners = svg.path(`M${ v_line.x2} ${ v_line.y2 - start_size - step_size * num_partner}L${  v_line_partner.x} ${ v_line_partner.y}`)
                .attr({ stroke: "#000", strokeWidth: 2 })
                .addClass('snap_elm')
                .getBBox();
                const connect_for_child = svg.path(`M${ bbox_partner.x - 50} ${ connect_partners.y2 }v${ 200 - start_size }`)
                    .attr({ stroke: "#000", strokeWidth: 2 })
                    .addClass('snap_elm')
                    .getBBox();
                const text = svg.text(connect_for_child.x - 8, connect_for_child.y + 7, '❤').addClass('snap_elm');
                draw_child(partner, people, last_ids, bbox_partner, connect_for_child)
              } else {
                const [left_box, connect_for_child] = draw_family(box_x, elements.y, tree, partner)
                bbox_child_married = left_box
                draw_child(partner, people, last_ids, left_box, connect_for_child)
                if ( tree.partners.length > 1 ) {
                  v_line = svg.path(`M${ bbox_child_married.x + bbox_child_married.width / 2} ${ bbox_child_married.y }v${ -start_size - step_size * (tree.partners.length - 1)}`)
                      .attr({ stroke: "#000", strokeWidth: 2 })
                      .addClass('snap_elm')
                      .getBBox();
                }
              }
              num_partner++
            })
          } else if ( tree.partners.length == 0 && tree.children.length > 0 ) {
            //Без партнера
            const [left_box, connect_for_child] = draw_family(elements.x2 + 500, elements.y, tree)
            draw_child(tree, people, last_ids, left_box, connect_for_child)
          } else {
            //Без Родственников
            const bbox1 = draw_box(elements.x2 + 500, elements.y, tree.name, tree.birth_date, tree.death_date)
          };
        };
      })
    }

    function draw_child(partner, people, last_ids, box_parent, line_from_parents) {
      let bbox_child = null
      let bbox_child_married = null
      partner.children.sort((a, b) => parseFloat(a.partners.length) - parseFloat(b.partners.length));
      partner.children.forEach(child => {
        if (child.partners.length > 0 && child.partners[0] ) {
          //Родители
          let num_partner = 0
          let v_line
          const start_size = 20
          const step_size = 8
          child.partners.forEach(p => {
            const partner = people[p];
            let box_x = bbox_child_married ? svg.selectAll('.snap_elm').getBBox().x2 + 100 + 300 * partner.children.length : box_parent.x + 400
            last_ids.push(partner.id)
            if ( num_partner > 0 ) {
              const bbox_partner = draw_box(box_x, box_parent.y2 + 150, partner.name, partner.birth_date, partner.death_date)
              const v_line_partner = svg.path(`M${ bbox_partner.x + bbox_partner.width / 2} ${ bbox_partner.y }v${ -start_size - step_size * num_partner  }`)
              .attr({ stroke: "#000", strokeWidth: 2 })
              .addClass('snap_elm')
              .getBBox();
              const connect_partners = svg.path(`M${ v_line.x2} ${ v_line.y2 - start_size - step_size * num_partner }L${  v_line_partner.x} ${ v_line_partner.y}`)
              .attr({ stroke: "#000", strokeWidth: 2 })
              .addClass('snap_elm')
              .getBBox();
              const connect_for_child = svg.path(`M${ bbox_partner.x - 50} ${ connect_partners.y2 }v${ 200 - start_size }`)
                  .attr({ stroke: "#000", strokeWidth: 2 })
                  .addClass('snap_elm')
                  .getBBox();
              const text = svg.text(connect_for_child.x - 8, connect_for_child.y + 7, '❤').addClass('snap_elm');
              draw_child(partner, people, last_ids, bbox_partner, connect_for_child)
            } else {
              const [left_box, connect_for_child] = draw_family(box_x, box_parent.y2 + 150, child, partner, line_from_parents)
              bbox_child_married = left_box
              draw_child(partner, people, last_ids, left_box, connect_for_child)
              
              if ( child.partners.length > 1 ) {
                v_line = svg.path(`M${ bbox_child_married.x + bbox_child_married.width / 2} ${ bbox_child_married.y }v${ -start_size - step_size * (child.partners.length - 1) }`)
                    .attr({ stroke: "#000", strokeWidth: 2 })
                    .addClass('snap_elm')
                    .getBBox();
              }
            }
            num_partner++
          })
        } else if ( child.partners.length == 0 && child.children.length > 0 ) { 
          //Без партнера
          let box_x = bbox_child_married ? svg.selectAll('.snap_elm').getBBox().x2 + 100 + 300 * child.children.length : box_parent.x + 400
          const [left_box, connect_for_child] = draw_family(box_x, box_parent.y2 + 150, child, null, line_from_parents)
          bbox_child_married = left_box
          draw_child(child, people, last_ids, left_box, connect_for_child)
        } else { 
          //Ребенок
          let box_x = bbox_child ? bbox_child.x - 400 : box_parent.x
          bbox_child = draw_box(box_x, box_parent.y2 + 150, child.name, child.birth_date, child.death_date)
          svg.path(`M${ line_from_parents.x2} ${ line_from_parents.y2 }L${ bbox_child.x + 150 } ${ bbox_child.y }`)
              .attr({ stroke: "#000", strokeWidth: 2 })
              .addClass('snap_elm')
              .getBBox();
        }
      })
    }
    
    function create_trees_json(data) {
      // console.log(data)
      
      const people = Object.assign({} , ...data.map(v => 
        ({ [v.id]: Object.assign(v, { children: [] }) })
      ))
      console.log(people)

      const trees = Object.values(people).filter(function(v) {
        return !(v.parent && people[v.parent].children.push(v) && v.mother && people[v.mother].children.push(v) || v.parent && people[v.parent] || v.mother && people[v.mother].children.push(v))
      })
      console.log(trees)
      return [people, trees]
    }
  }
});

