let svg 

function create_trees_json( data ) {
  const people = Object.assign({} , ...data.map(v => 
    ({ [v.id]: Object.assign(v, { children: [] }) })
  ))

  const trees = Object.values(people).filter(function(v) {
    return !(v.parent && people[v.parent].children.push(v) 
            && v.mother && people[v.mother].children.push(v) 
            || v.parent && people[v.parent] || v.mother && people[v.mother].children.push(v))
  })
  return [people, trees]
};

function draw_tree( svgSnap, data ) {
  svg = svgSnap
  svg.selectAll('.snap_elm').remove()
  
  const [people, trees] = create_trees_json(data)
  const last_ids = []
  trees.forEach(tree => {
    if ( !last_ids.includes(tree.id) ) {
      let bbox_child_married = null
      const elements = svg.selectAll('.snap_elm').length != 0 ? svg.selectAll('.snap_elm').getBBox() : {x2: 0, y: 0}
      
      if ( tree.partners.length > 0 && tree.partners[0] ) {
        //Корень
        bbox_child_married = draw_person_with_partner(tree, people, last_ids, elements, null, bbox_child_married)
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
};

function draw_child( partner, people, last_ids, box_parent, line_from_parents ) {
  let bbox_child = null
  let bbox_child_married = null
  partner.children.sort((a, b) => parseFloat(a.partners.length) - parseFloat(b.partners.length));
  partner.children.forEach(child => {
    if (child.partners.length > 0 && child.partners[0] ) {
      //C партнером
      bbox_child_married = draw_person_with_partner(child, people, last_ids, box_parent, line_from_parents, bbox_child_married)
    } else if ( child.partners.length == 0 && child.children.length > 0 ) { 
      //Без партнера
      let box_x = bbox_child_married ? svg.selectAll('.snap_elm').getBBox().x2 + 100 + 300 * child.children.length : box_parent.x + 400
      const [left_box, connect_for_child] = draw_family(box_x, box_parent.y2 + 150, child, null, line_from_parents)
      draw_child(child, people, last_ids, left_box, connect_for_child)
      bbox_child_married = left_box
    } else { 
      //Ребенок
      let box_x = bbox_child ? bbox_child.x - 400 : box_parent.x
      bbox_child = draw_box(box_x, box_parent.y2 + 150, child.name, child.birth_date, child.death_date)
      line({ type: 'path', x: line_from_parents.x2, y: line_from_parents.y2, x2: bbox_child.x + 150, y2: bbox_child.y })
    }
  })
};

function draw_box( x, y, name, birth, death ) {
  birth = birth ? birth : '❓'
  death = death ? death : '❓'
  const rect_with_text = svg.rect(x, y, 300, 100, 10).attr({ fill: "#fc0", fillOpacity: 0.5 }).addClass('snap_elm')
  const bb_rect = rect_with_text.getBBox();
  svg.text(bb_rect.x + 10, bb_rect.y + 20, name).addClass('snap_elm');
  svg.text(bb_rect.x + 10, bb_rect.y2 - 10, "*" + birth + ' ' + "†" + death).addClass('snap_elm');
  return bb_rect
};

function draw_family( start_x, start_y, partner, partner2 = null, line_from_parents = null ) {
  const bbox1 = draw_box(start_x, start_y, partner.name, partner.birth_date, partner.death_date)
  const bbox2 = partner2 ? draw_box(bbox1.x2 + 100, bbox1.y, partner2.name, partner2.birth_date, partner2.death_date) :
                            svg.text(bbox1.x2 + 100, bbox1.y + 55, '❌').addClass('snap_elm').getBBox();
  if (line_from_parents) line({ type: 'path', x: line_from_parents.x2, y: line_from_parents.y2, x2: bbox1.x + 150, y2: bbox1.y })
  const connect_partners = line({ type: 'path', x: bbox1.x2, y: bbox1.y + 50, x2: bbox2.x, y2: bbox2.y + bbox2.height / 2 })
  const connect_for_child = line({ type: 'v', x: connect_partners.x + connect_partners.width / 2, y: connect_partners.y2, len: 100 })
  svg.text(connect_for_child.x - 8, connect_for_child.y + 7, '❤').addClass('snap_elm');
  return [bbox1, connect_for_child]
};

function line( params ) {
  let line
  if (params.type == 'path') line = `M${ params.x } ${ params.y }L${ params.x2 } ${ params.y2 }`
  if (params.type == 'v') line = `M${ params.x } ${ params.y }v${ params.len }`
  line = svg.path(line).attr({ stroke: "#000", strokeWidth: 2 }).addClass('snap_elm').getBBox();
  return line
};

function connect_partners( box, v_line_p, num_partner, start_size ) {
  num_partner -= 1
  const step_size = 8
  const v_line = line({ type: 'v', x: v_line_p.x, y: v_line_p.y - step_size * num_partner, len: - step_size })
  const v_line_partner = line({ type: 'path', x: box.x + box.width / 2, y: box.y, x2: box.x + box.width / 2, y2: v_line.y })
  const connect_partners = line({ type: 'path', x: v_line.x, y: v_line.y, x2: v_line_partner.x, y2: v_line_partner.y })
  const connect_for_child = line({ type: 'v', x: box.x - 50, y: connect_partners.y2, len: 200 - start_size + step_size * num_partner })
  svg.text(connect_for_child.x - 8, connect_for_child.y + 7, '❤').attr({ fill: "#680303" }).addClass('snap_elm');
  return connect_for_child
};

function diff_arrays( arr1, arr2 ) { return arr1.filter(x => !arr2.includes(x)) };

function offest_x( bbox_child_married, person, box_parent ) { 
  return bbox_child_married ? 
          svg.selectAll('.snap_elm').getBBox().x2 + 100 + 300 * person.children.length : 
          box_parent.x2 + 400 
};

function draw_person_with_partner( person, people, last_ids, box_parent, line_from_parents, bbox_child_married ) {
  let num_partner = 0
  let v_line
  let difference = person.children
  const start_size = 20
  const y_parent_box = line_from_parents ? box_parent.y2 + 150 : box_parent.y
  person.partners.forEach(p => {
    const partner = people[p];
    const box_x = offest_x( bbox_child_married, partner, box_parent )
    last_ids.push(partner.id)
    if ( num_partner > 0 ) {
      const bbox_partner = draw_box(box_x, y_parent_box, partner.name, partner.birth_date, partner.death_date)
      const connect_for_child = connect_partners(bbox_partner, v_line, num_partner, start_size);
      draw_child(partner, people, last_ids, bbox_partner, connect_for_child)
      difference = diff_arrays(difference, partner.children);
      if (num_partner == person.partners.length - 1) {
        if (difference.length != 0) {
          num_partner++
          person.children = difference
          const box_x = offest_x( bbox_child_married, person, box_parent ) 
          const bboxx = svg.text(box_x, bbox_child_married.y2, '❌').addClass('snap_elm').getBBox()
          const connect_for_child = connect_partners(bboxx, v_line, num_partner, start_size);
          draw_child(person, people, last_ids, bboxx, connect_for_child)
        };
      };
    } else {
      const [left_box, connect_for_child] = draw_family(box_x, y_parent_box, person, partner, line_from_parents)
      draw_child(partner, people, last_ids, left_box, connect_for_child)
      bbox_child_married = left_box
      difference = diff_arrays(difference, partner.children);
      if ( person.partners.length > 1 ) {
        v_line = line({ type: 'v', x: bbox_child_married.x + bbox_child_married.width / 2, y: bbox_child_married.y, len: - start_size })
      };
    };
    num_partner++
  })
  return bbox_child_married
};

export { draw_tree }