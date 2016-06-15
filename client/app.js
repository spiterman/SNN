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
    strokeStyle: "#000",
    strokeWidth: 3,
    text: n,
    x: x_coord ,
    y: y_coord
  })
  .drawLayers();
  counter++;
}

function printLayers(){
  console.log(canvas.getLayers());
}

function connectNodes(){
  //Retrive Nodes to connect
  const startNode = $('#startNode');
  const endNode = $('#endNode');

  //Selects the Node layers
  var start = canvas.getLayers(function(l){
    return (l.name === startNode.val());
  })[0];
  var finish = canvas.getLayers(function(l){
    return (l.name === endNode.val());
  })[0];

  if(!start || !finish){
    startNode.val("");
    endNode.val("");
    alert("Invalid Nodes!");
    return
  }
  //Account for Neuron Radius
  //Needs fixing again
  var ratio = ((finish.y - start.y)/(finish.x - start.x))
  var theta = Math.atan(ratio)
  if(finish.x <= start.x) {
    var x1 = start.x - Math.cos(theta) * neuronRadius;
    var y1 = start.y - Math.sin(theta) * neuronRadius;
    var x2 = finish.x + Math.cos(theta) * neuronRadius;
    var y2 = finish.y + Math.sin(theta) * neuronRadius;
  } else {
    var x1 = start.x + Math.cos(theta) * neuronRadius;
    var y1 = start.y + Math.sin(theta) * neuronRadius;
    var x2 = finish.x - Math.cos(theta) * neuronRadius;
    var y2 = finish.y - Math.sin(theta) * neuronRadius;
  }

  //Draws the arrow between
  canvas.drawLine({
    draggable: true,
    layer: true,
    // groups: ['N0','N1'],
    strokeStyle: '#0000ff',
    strokeWidth: 4,
    endArrow: true,
    arrowRadius: 15,
    arrowAngle: 90,
    x1: x1, y1: y1,
    x2: x2, y2: y2
  })

  // Clear input fields
  startNode.val("");
  endNode.val("");
}



