const canvas = $('#canvas');
const neuronRadius = 25;
const neuronStrokeWidth = 4;
const neuronDistance = 3;
const height = canvas.height();
const width = canvas.width();
const maxNeurons  = 30;
const activeColor = "yellow";
const inactiveColor = "red"

var counter = 0;

//Establish Matrix
var connectivityMatrix = {};

connectivityMatrix.values = [];

connectivityMatrix.addNode = function(){
  connectivityMatrix.values.forEach((item) => item.push(0));
  connectivityMatrix.values.push(new Array(counter + 1).fill(0));
  console.log(connectivityMatrix.values)
}

connectivityMatrix.connectNodes = function(start, end) {
  console.log(connectivityMatrix.values)
  connectivityMatrix.values[end][start] = 1;
  console.log(connectivityMatrix.values);
}


//Helper Function

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

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

    connectivityMatrix.addNode();

    var x_coord = neuronRadius + Math.floor(Math.random() * (width - 2*neuronRadius - neuronStrokeWidth));
    var y_coord = neuronRadius + Math.floor(Math.random() * (height - 2*neuronRadius - neuronStrokeWidth));

    if(isValidPosition(x_coord, y_coord)){
      var n = 'N' + counter;
      canvas.addLayer({
        type: 'arc',
        // draggable: true,
        strokeStyle: '#000',
        strokeWidth: neuronStrokeWidth,
        fillStyle: inactiveColor,
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
    return (l.name === 'N' + startNode.val());
  })[0];
  var finish = canvas.getLayers(function(l){
    return (l.name === 'N' + endNode.val());
  })[0];

  if(!start || !finish){
    startNode.val("");
    endNode.val("");
    alert("Invalid Nodes!");
    return
  }

  //Connectivity matrix
  // console.log(start)
  // console.log(finish)
  connectivityMatrix.connectNodes(startNode.val(), endNode.val())

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




