const canvas = $('#canvas');
var counter = 0;
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
    radius: 25
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

function connectNodes(n1, n2){

}
