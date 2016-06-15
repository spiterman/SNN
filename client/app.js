const canvas = $('#canvas');
var counter = 0;
var connectionStarted = false;
const neuronRadius = 25;

function addNode() {
  var x_coord = Math.floor(Math.random() * 500);
  var y_coord = Math.floor(Math.random() * 250);
  var n = 'N' + counter;
  canvas.addLayer({
    type: 'arc',
    draggable: true,
    strokeStyle: '#000',
    strokeWidth: 5,
    fillStyle: 'red',
    // bringToFront: true,
    groups: [n],
    dragGroups: [n],
    name: 'N' + counter,
    x: x_coord,
    y: y_coord,
    radius: neuronRadius
  })
  .addLayer({
    type: 'text',
    draggable: true,
    groups: [n],
    dragGroups: [n],
    // bringToFront: true,
    strokeStyle: "#000",
    strokeWidth: 3,
    text: n,
    x: x_coord ,
    y: y_coord
  })
  .drawLayers();
  counter++;
  console.log(canvas.getLayers())
}

function printLayers(){
  console.log(canvas.getLayers());
}

function connectNodes(){
  var start = canvas.getLayers(function(l){
    return (l.name === 'N0');
  })[0];
  var finish = canvas.getLayers(function(l){
    return (l.name === 'N1')
  })[0];

  var theta = Math.atan((finish.y - start.y)/(finish.x - start.x))
  if(theta >= 0) {
    var x1 = start.x + Math.cos(theta) * neuronRadius;
    var y1 = start.y + Math.sin(theta) * neuronRadius;
    var x2 = finish.x - Math.cos(theta) * neuronRadius;
    var y2 = finish.y - Math.sin(theta) * neuronRadius;
  } else {
    var x1 = start.x - Math.cos(theta) * neuronRadius;
    var y1 = start.y - Math.sin(theta) * neuronRadius;
    var x2 = finish.x + Math.cos(theta) * neuronRadius;
    var y2 = finish.y + Math.sin(theta) * neuronRadius;
  }

  canvas.drawLine({
    draggable: true,
    layer: true,
    groups: ['N0','N1'],
    strokeStyle: '#0000ff',
    strokeWidth: 4,
    endArrow: true,
    arrowRadius: 15,
    arrowAngle: 90,
    x1: x1, y1: y1,
    x2: x2, y2: y2
  })
  // console.log(start.x)

}

// var connectNodes =
// function () {
//   return function(startNode){
//     return function(endNode){

//     }
//   }
// }
