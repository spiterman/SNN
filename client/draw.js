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
  this.strokeWidth = 4;
  this.strokeStyle = 'black';
  this.draggable = true;
  this.type = 'arc';
  this.radius = 25;
  this.fillStyle = 'red';
  this.data = null;
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
  // this.neuron = canvas.getLayer('N' + txt.text);

  // Edge case where text is clicked instead
  this.dblclick = (layer) => toggleNeuronState(canvas.getLayer('N' + layer.text));
  this.dragstop = (layer) => redrawConnections(canvas.getLayer('N' + layer.text));
};

function toggleNeuronState(layer){
  if(layer.data.state === 1){
    layer.data.state = 0;
    layer.fillStyle = 'red';
  } else {
    layer.data.state = 1;
    layer.fillStyle = 'yellow';
  }
  canvas.drawLayers();
}


//Redraws connections after moving a node
function redrawConnections(layer){
  // Erase old connections
  // To Do: Refactor To Erase Connections
  canvas.getLayers((l) => {
    return l.start === layer.name || l.end === layer.name;
  })
  .forEach((item) => {
    canvas.removeLayer(item.name)
  });
  canvas.drawLayers()

  // Draw New Connections
  for(var key in layer.data.connectionsTo){
    drawConnection(layer.data.num, key)
  }
  for(var key in layer.data.connectionsFrom){
    drawConnection(key, layer.data.num)
  }
}


// Default Neurons
// Neuron.prototype = Object.create({
// });

// Neuron.prototype.dragstop = redrawConnections; //
// Neuron.prototype.dblclick = dblClickFunction; //Maybe switch assignment based on optino


// Spinners
// function Spinner(){};

// Spinner.prototype = Object.create(Neuron.prototype, {
//   spinnerConcavity: 0.5,
//   spinnerSides: 5,
//   type: 'polygon'
// });


// Text.prototype = Object.create({
// });

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

// Connection.prototype = Object.create({
// });


// ** Control Panel
var currentNodeType = "connection";
var currentDblClickAction = "activateNodes";

// // ** Simulation
// var simulationSpeed = 2000;
// var isSimulationRunning = false;


// App Stuff

// Create a graph from newApp.js
var graph = new Graph();


//Main Functions
// canvas.click(function(e) {

//   var x = e.offsetX;
//   var y = e.offsetY;
//   if(isValidPosition(x, y)){
//     addNeuron(x, y);
//   }
// });



// Main Draw Neuron Function
canvas.click(drawNeuron);

function drawNeuron(e) {
  var x = e.offsetX;
  var y = e.offsetY;

  // Make sure neurons aren't too close
  if(isValidPosition(x, y)){
    var node = graph.addNode(); // Graph properties
    var neuron = new Neuron(x, y, node.num); // Drawing properties
    neuron.data = node; // Binds neuron drawing to node data
    var text = new Text(x, y, node.num); // Add text

    // Draw to Canvas
    canvas.addLayer(neuron)
          .addLayer(text)
          .drawLayers();
  }
};

// function addNeuron(x, y, n){
//   var node = graph.addNode();
//   var neuron = new Neuron(x, y, n);
//   console.log(neuron.name);
//   var text = new Text(x, y, n);
//   $.extend(neuron, Neuron.prototype);
//   $.extend(text, Text.prototype);
//   canvas.addLayer(neuron)
//         .addLayer(text)
//         .drawLayers();
// };

function drawConnection(start, end){
  graph.connectNodes(start, end);
  var endpoints = generateEndpoints(start, end);
  var connection = new Connection(endpoints);
  // $.extend(connection, Connection.prototype);
  // console.log(connection);

  canvas.addLayer(connection)
        .drawLayers();
}

function deleteConnection(start, end){
  // Find the layer

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



// function addNode() {
//   if(counter <= maxNeurons ){
//     graph.addNode();
//     drawNeuron();
//   } else {
//     alert('Maximum number of neurons reached!')
//   }
// }



//***Simulation Functionality
function simulate() {
  if(isSimulationRunning){
    // stateVector.moveToNextState();
    graph.updateState();
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
