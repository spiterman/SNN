const canvas = $('#canvas');
var counter = 0;
var connectionStarted = false;
const neuronRadius = 25;
const neuronStrokeWidth = 4;
const neuronDistance = 3;
const height = canvas.height();
const width = canvas.width();
const maxNeurons  = 30;

//Helper Function

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

console.log(distance(0, 0, 3, 4))

function isValidPosition(x1, y1){
  var layers = canvas.getLayers((layer) => layer.type === 'arc');

  for(var i = 0; i < layers.length; i++){
    if(distance(x1, y1, layers[i].x, layers[i].y) < neuronDistance * neuronRadius){
      return false;
    }
  }
  return true;
}

//Main Functions

function addNode() {
  if(counter <= maxNeurons ){
    var x_coord = neuronRadius + Math.floor(Math.random() * (width - 2*neuronRadius - neuronStrokeWidth));
    var y_coord = neuronRadius + Math.floor(Math.random() * (height - 2*neuronRadius - neuronStrokeWidth));

    if(isValidPosition(x_coord, y_coord)){
      var n = 'N' + counter;
      canvas.addLayer({
        type: 'arc',
        // draggable: true,
        strokeStyle: '#000',
        strokeWidth: neuronStrokeWidth,
        fillStyle: 'red',
        groups: [n],
        // dragGroups: [n],
        name: n,
        x: x_coord,
        y: y_coord,
        radius: neuronRadius
      })
      .addLayer({
        type: 'text',
        // draggable: true,
        groups: [n],
        // dragGroups: [n],
        strokeStyle: "#000",
        strokeWidth: 3,
        text: n,
        x: x_coord ,
        y: y_coord
      })
      .drawLayers();
      counter++;
    } else {
      addNode();
    }
  } else {
    alert('Maximum number of neurons reached!')
  }
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
    // draggable: true,
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



