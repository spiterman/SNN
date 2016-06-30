const canvas = $('#canvas');
const neuronRadius = 25;
const neuronStrokeWidth = 4;
const neuronDistance = 3;
const height = canvas.height();
const width = canvas.width();
const maxNeurons  = 30;
const activeColor = "yellow";
const inactiveColor = "red"
const simulationSpeed = 2000;

var counter = 0;
var isSimulationRunning = false;
var mouseIsMoving = false;
var clickOnCanvas = true;

//Connectivity Matrix Functions
var connectivityMatrix = {};

connectivityMatrix.values = [];

connectivityMatrix.addNode = function(){
  connectivityMatrix.values.forEach((item) => item.push(0));
  connectivityMatrix.values.push(new Array(counter + 1).fill(0));
}

connectivityMatrix.connectNodes = function(start, end) {
  connectivityMatrix.values[end][start] = 1;
}

//State Vector Function

var stateVector = {};
stateVector.values = [];
stateVector.addNode = function(){
  stateVector.values.push(0);
}
stateVector.clickUpdateState = function(layer){
  if(layer.data.active){
    stateVector.values[layer.data.index] = 1;
  } else {
    stateVector.values[layer.data.index] = 0;
  }
}

stateVector.moveToNextState = function(){
  var columnIndex = 0, rowIndex = 0;
  var newValues = new Array(connectivityMatrix.values.length).fill(0);

  //Matrix Multiplication
  stateVector.values.forEach((item) => {
    if(item){
      for(rowIndex; rowIndex < connectivityMatrix.values.length; rowIndex++){
        if(connectivityMatrix.values[rowIndex][columnIndex]){
          newValues[rowIndex] = 1;
        }
      }
    }
    rowIndex = 0;
    columnIndex++;
  })

  stateVector.values = newValues;
  drawUpdatedNodes();
}


//Drawing Helper Function

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


//Drawing Functions

//Draws a new node
function drawNewNode(e) {

    var x_coord = e.offsetX;
    var y_coord = e.offsetY;

      var n = 'N' + counter;
      canvas.addLayer({
        type: 'arc',
        draggable: true,
        strokeStyle: '#000',
        strokeWidth: neuronStrokeWidth,
        fillStyle: inactiveColor,
        groups: [n],
        dragGroups: [n],
        name: n,
        x: x_coord,
        y: y_coord,
        radius: neuronRadius,
        click: function(layer) {
          clickOnCanvas = false;
          toggleNodeColor(layer);
          stateVector.clickUpdateState(layer);
          clickOnCanvas = true;
        },
        data: {
          active: false,
          index: counter
        }
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

//Draws a connection between Nodes
function drawNewConnection(start, finish) {
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
    layer: true,
    strokeStyle: '#0000ff',
    strokeWidth: 4,
    endArrow: true,
    arrowRadius: 15,
    arrowAngle: 90,
    x1: x1, y1: y1,
    x2: x2, y2: y2
  })
}

//Used for clicking a node on or off
function toggleNodeColor(layer){
  if(!layer.data.active){
    canvas.setLayer(layer, {
      fillStyle: activeColor
    });
  } else {
    canvas.setLayer(layer, {
      fillStyle: inactiveColor
    });
  }
  canvas.drawLayers()
  layer.data.active = !layer.data.active;
}

//Sets a node color, and status
function setNodeColor(layer, status){
  if(status){
    canvas.setLayer(layer, {
      fillStyle: activeColor
    })
    layer.data.active = true;
  } else {
    canvas.setLayer(layer, {
      fillStyle: inactiveColor
    });
    layer.data.active = false;
  }
}

//Draws all the updated notes from the state vector
function drawUpdatedNodes(){
  for(var i = 0; i < stateVector.values.length; i++){
    var layer = canvas.getLayer('N' + i);
    setNodeColor(layer,stateVector.values[i]);
  }
  canvas.drawLayers();
}

//Main Functions

canvas.click(function(e) {
  var layers = canvas.getLayers();
  for(var i = 0; i < layers.length; i++){
    if(distance(e.offsetX, e.offsetY, layers[i].x, layers[i].y) < neuronRadius){
      return
      }
    }
    addNode(e)
})

function addNode(e) {
  if(counter <= maxNeurons ){
    connectivityMatrix.addNode();
    stateVector.addNode();
    drawNewNode(e);
  } else {
    alert('Maximum number of neurons reached!')
  }
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

  //Connectivity matrix update
  connectivityMatrix.connectNodes(startNode.val(), endNode.val())

  //Draw new connection
  drawNewConnection(start, finish);

  // Clear input fields
  startNode.val("");
  endNode.val("");
}

function simulate() {
  if(isSimulationRunning){
    stateVector.moveToNextState();
    setTimeout(function(){
      simulate();
    }, simulationSpeed)
  }
}

function runSimulation(){
  isSimulationRunning = true;
  simulate();
}

function endSimulation() {
  isSimulationRunning = false;
}

function printLayers(){
  console.log(canvas.getLayers());
}
