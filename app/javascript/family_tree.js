import Snap from "snapsvg-cjs"

// var svg = Snap("#svg");

// var height = svg.node.clientHeight;
// var width = svg.node.clientWidth;
// svg.attr({ viewBox: '0 0' + ' ' + width + ' ' +  height});

// var l = Snap.load("familytree.svg", onSVGLoaded ) ;

// function onSVGLoaded( data ){ 
//   svg.append( data );
// }

var s = Snap("#svg");
var l = Snap.load("familytree.svg", onSVGLoaded ) ;

function onSVGLoaded( data ){ 
    s.append( data );
}