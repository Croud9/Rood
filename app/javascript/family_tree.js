import Snap from "snapsvg-cjs"
import svgPanZoom from "svg-pan-zoom"
import { draw_tree } from "./draw_family_tree"

document.addEventListener("turbo:load", function() { 
  if (document.getElementById("svg") !== null) {
    $('#family').change(get_family);
    const svg = Snap('#svg');
    svg.attr({ viewBox: 0 + ' ' + 0 + ' ' + svg.node.clientWidth + ' ' +  svg.node.clientHeight });

    const pan_zoom = svgPanZoom('#svg', {
      zoomEnabled: true,
      zoomScaleSensitivity: 0.2,
      controlIconsEnabled: false,
      minZoom: -100,
    });
    
    window.addEventListener('resize', function(event) {
      pan_zoom.resize();
      pan_zoom.center();
    }, true);
    
    const group_panZoom = svg.selectAll('.svg-pan-zoom_viewport')
    
    function get_family() {
      $('#loader').fadeTo(500, 1);
      if ($('#family:selected').text() != "Выберите") {
        $.ajax({
          url: "get_family",
          dataType: "json",
          data: { id: $("#family option:selected").val() },
          success: function(data) {
            draw_tree( svg, data )
            const all_elm = svg.selectAll('.snap_elm')
            group_panZoom[0].add(all_elm)
            pan_zoom.updateBBox(); 
            pan_zoom.center(); 
            if (all_elm.length > 3) pan_zoom.fit(); 
            $('#loader').fadeTo(500, 0,function() {
              $('#loader').hide()
            });
          },
        });
      };
    };

  };
});
