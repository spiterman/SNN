// *** Globals ***
const canvas = $('#canvas');
var maxNeurons  = 30;
var neuronDistance = 3;
var neuronRadius = 25;
// var activeColor = 'yellow';
// var inactiveColor = 'red';


// To Do: Refactor to Use Simulation rather than assign globals
function Simulation(canvas) {
  this.canvas = $(canvas);
  // Neuron Properties
  this.maxNeurons = 30;
  this.neuronDistance = 3;
  this.neuronRadius = 25;
}

var simulation = new Simulation('#canvas');

// Neuron Constructor Function
// To Do: Pass in arguments from Simulation
function Neuron(x, y, n){
  this.x = x;
  this.y = y;
  this.groups = [n];
  this.dragGroups = [n];
  this.name = 'N' + n;
  this.num = n;
  this.strokeWidth = 4;
  this.strokeStyle = 'black';
  this.draggable = true;
  this.type = 'arc';
  this.radius = 25;
  this.fillStyle = 'red';
  this.dblclick = toggleNeuronState;
  this.dragstop = redrawConnections;
}

// Text
function Text(x, y, n){

  this.x = x;
  this.y = y;
  this.groups = [n];
  this.dragGroups = [n];
  this.text = n;
  this.strokeWidth = 3;
  this.strokeStyle = 'black';
  this.type = 'text';
  // Edge case where text is clicked instead
  this.dblclick = (layer) => toggleNeuronState(canvas.getLayer('N' + layer.text));
  this.dragstop = (layer) => redrawConnections(canvas.getLayer('N' + layer.text));
};

function toggleNeuronState(layer){
  var num = layer.name[1]
  if(graph.nodes[num].state === 1){
    graph.deactivateNode(num)
    // layer.data.state = 0;
    layer.fillStyle = 'red';
  } else {
    graph.activateNode(num)
    // layer.data.state = 1;
    layer.fillStyle = 'yellow';
  }
  canvas.drawLayers();
}


//Redraws connections after moving a node
function redrawConnections(layer){
  // Erase old connections
  canvas.getLayers((l) => {
    return l.start === layer.name || l.end === layer.name;
  })
  .forEach((item) => {
    canvas.removeLayer(item.name)
  });
  canvas.drawLayers()

  // Draw New Connections
  var neuron = graph.nodes[layer.num]
  for(var j in neuron.connectionsTo){
    drawConnection(layer.num, j)
  }
  for(var k in neuron.connectionsFrom){
    drawConnection(k, layer.num)
  }
}

// Spinners
function Spinner() {
  this.spinnerConcavity = 0.5;
  this.spinnerSides = 5;
  this.type = 'polygon';
};


// Connections
function Connection(endpoints){
  // Data
  this.x1 = endpoints.x1;
  this.x2 = endpoints.x2;
  this.y1 = endpoints.y1;
  this.y2 = endpoints.y2;
  this.name = endpoints.name;
  this.start = endpoints.start;
  this.end = endpoints.end;

  // Draw properties
  this.type = 'line';
  this.strokeStyle = 'black';
  this.strokeWidth = 4;
  this.endArrow = true;
  this.arrowRadius = 15;
  this.arrowAngle = 90;
};


// ** Control Panel
var currentNodeType = "connection";
var currentDblClickAction = "activateNodes";

// // ** Simulation
var simulationSpeed = 2000;
var isSimulationRunning = false;


// App Stuff

// Create a graph from newApp.js
var graph = new Graph();
// To Do: Refactor so graph is property on simuation

// Main Draw Neuron Function
canvas.click(drawNeuron);

function drawNeuron(e) {
  var x = e.offsetX;
  var y = e.offsetY;

  // Make sure neurons aren't too close
  if(isValidPosition(x, y)){
    var node = graph.addNode(); // Graph properties
    var neuron = new Neuron(x, y, node.num); // Drawing properties
    var text = new Text(x, y, node.num); // Add text

    // Draw to Canvas
    canvas.addLayer(neuron)
          .addLayer(text)
          .drawLayers();
  }
};

function drawNextState(){
  var neurons = canvas.getLayers((layer) => layer.type === 'arc');
  neurons.forEach((neuron) => {
    var num = neuron.name[1];
    if(graph.nodes[num].state === 1){
      neuron.fillStyle = 'yellow';
    } else {
      neuron.fillStyle = 'red';
    }
  });
  canvas.drawLayers();
}

function drawConnection(start, end){
  graph.connectNodes(start, end);
  var endpoints = generateEndpoints(start, end);
  var connection = new Connection(endpoints);
  canvas.addLayer(connection)
        .drawLayers();
}

function eraseConnection(start, end){
  // To Do:
  // Delete connection on graph
  // Find the layer
  // Error Handling
}

function updateConnections(str){
  var start = $('#startNode');
  var end = $('#endNode');
  // console.log(start.val(), end.val());
  if(str === 'connect'){
    drawConnection(start.val(), end.val());
  }
  if(str === 'disconnect'){
    // Disconnect Functionality;
    deleteConnection(start.val(), end.val());
  }

  start.val("");
  end.val("");
}




//***Simulation Functionality
function simulate() {
  if(isSimulationRunning){

    graph.updateState();
    drawNextState();

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


//***Control Panel Functions***
function setNodeType(str) {
  var nodeTypes = [$('#input'), $('#connection'), $('#output')];
  nodeTypes.forEach((item) => item.removeClass('active'));
  $('#' + str).addClass('active');
  currentNodeType = str;
}

setDblClickAction = function(str){
  var dblClickActions = [$('#activateNodes'), $('#deleteNodes')];
  dblClickActions.forEach( (item) => item.removeClass('active'));
  $('#' + str).addClass('active');
  currentDblClickAction = str;
}

//Activates the dropdown toggle
$(document).ready(function() {
    $(".dropdown-toggle").dropdown();
});
