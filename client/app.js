const canvas = $('#canvas');
const neuronRadius = 25;
const neuronStrokeWidth = 4;
const neuronDistance = 3;
const height = canvas.height();
const width = canvas.width();
const maxNeurons  = 30;
const activeColor = "yellow";
const inactiveColor = "red";
const simulationSpeed = 2000;

var counter = 0;
var isSimulationRunning = false;
var mouseIsMoving = false;
var clickOnCanvas = true;
var currentNodeType = "connection";
var currentDblClickAction = "activateNodes";



//Connectivity Matrix Functions
var connectivityMatrix = {};

connectivityMatrix.values = [];

connectivityMatrix.addNode = function(){
  connectivityMatrix.values.forEach((item) => item.push(0));
  connectivityMatrix.values.push(new Array(counter + 1).fill(0));
}

connectivityMatrix.deleteNode = function(n) {
  // Stub
  for(var i = 0; i < connectivityMatrix.values.length; i++){
    connectivityMatrix.values[i][n] = 0;
  }
  for(var j = 0; j < connectivityMatrix.values.length; i++){
    connectivityMatrix.values[n][i] = 0;
  }
}

connectivityMatrix.connectNodes = function(start, end) {
  connectivityMatrix.values[end][start] = 1;
}

connectivityMatrix.disconnectNodes = function(start, end){
  connectivityMatrix.values[end][start] = 0;
}


//State Vector Function

var stateVector = {};
stateVector.values = [];
stateVector.addNode = function(){
  stateVector.values.push({
    value: 0,
    type: currentNodeType
  });
}
stateVector.deleteNode = function(n){
  stateVector.values[n].value = 0;
}
stateVector.clickUpdateState = function(layer){
  if(layer.data.active){
    stateVector.values[layer.data.index].value = 1;
  } else {
    stateVector.values[layer.data.index].value = 0;
  }
}

stateVector.moveToNextState = function(){
  var columnIndex = 0, rowIndex = 0;
  var newValues = new Array(connectivityMatrix.values.length).fill(0);

  //Matrix Multiplication
  stateVector.values.forEach((item) => {
    if(item.value){
      for(rowIndex; rowIndex < connectivityMatrix.values.length; rowIndex++){
        if(connectivityMatrix.values[rowIndex][columnIndex]){
          newValues[rowIndex] = 1;
        }
      }
    }
    rowIndex = 0;
    columnIndex++;
  })

  for(var i = 0; i < newValues.length; i++){
    stateVector.values[i].value = newValues[i];
  }

  runAnimations();

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

    var type, sides, concavity, radius, fillStyle;

      var n = 'N' + counter;
      if(currentNodeType === 'connection'){
        type = 'arc';
        radius = neuronRadius;
        fillStyle = inactiveColor;
      }
      if(currentNodeType === 'output'){
        type = 'polygon';
        sides = 5;
        concavity = 0.5;
        radius = 2 * neuronRadius;
        fillStyle = 'purple';

      }
      canvas.addLayer({
        type: type,
        draggable: true,
        strokeStyle: '#000',
        strokeWidth: neuronStrokeWidth,
        fillStyle: fillStyle,
        groups: [n],
        dragGroups: [n],
        name: n,
        x: x_coord,
        y: y_coord,
        radius: radius,
        concavity: concavity,
        sides: sides,
        dblclick: function(layer) {
          console.log(layer)
          if(currentDblClickAction === "activateNodes"){
            toggleNodeColor(layer);
            stateVector.clickUpdateState(layer);
          }
          if(currentDblClickAction === "deleteNodes"){
            var nodeText = canvas.getLayers((l) => l.type === 'text' && l.text === layer.name)[0];
            canvas.removeLayer(layer).removeLayer(nodeText)

            var connectionsToDelete = canvas.getLayers((l) => l.type === "line" && (l.data.start === layer.name || l.data.finish === layer.name))

            connectionsToDelete.forEach((item) => canvas.removeLayer(item));
            connectionsToDelete.forEach((item) => connectivityMatrix.disconnectNodes(Number(item.data.colIndex), Number(item.data.rowIndex)))

            canvas.drawLayers();

          }
        },
        dragstop: function(layer){
          redrawConnections(layer);
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
        y: y_coord,
        dblclick: function(layer){
          var node = canvas.getLayers((l) => l.name  === layer.text)[0];
          if(currentDblClickAction === 'activateNodes'){
            toggleNodeColor(node);
            stateVector.clickUpdateState(node);
          }
          if(currentDblClickAction === 'deleteNodes'){
            canvas.removeLayer(layer).removeLayer(node)

            var connectionsToDelete = canvas.getLayers((l) => l.type === "line" && (l.data.start === layer.text || l.data.finish === layer.text))

            connectionsToDelete.forEach((item) => canvas.removeLayer(item));
            connectionsToDelete.forEach((item) => connectivityMatrix.disconnectNodes(Number(item.data.colIndex), Number(item.data.rowIndex)))

            canvas.drawLayers();
          }
        },
        dragstop: function(layer){
          redrawConnections(canvas.getLayer(layer.text));
        }
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
  canvas.addLayer({
    type: 'line',
    strokeStyle: '#0000ff',
    strokeWidth: 4,
    endArrow: true,
    arrowRadius: 15,
    arrowAngle: 90,
    x1: x1, y1: y1,
    x2: x2, y2: y2,
    name: start.name + finish.name,
    data: {
      start: start.name,
      finish: finish.name,
      colIndex: start.name[1],
      rowIndex: finish.name[1]
    }
  }).drawLayers();
}

function redrawConnections(layer){
  //Find all lines where start or finish is the layer
  //Erases those lines
  canvas
    .getLayers((l) => l.data.start === layer.name ||
                      l.data.finish === layer.name)
    .forEach((item) => canvas.removeLayer(item.name));
  canvas.drawLayers();

  //Using connectivity matrix, redraw nodes
  var ind = layer.data.index

  //Redraws all vectors leaving the dragged node
  for(var i = 0; i < connectivityMatrix.values.length; i++) {
    if(connectivityMatrix.values[i][ind]) {
      drawNewConnection(canvas.getLayer('N' + ind), canvas.getLayer('N' + i))
    }
  }

  //Redraws all vectors arriving at the dragged node
  for(var j = 0; j < connectivityMatrix.values.length; j++) {
    if(connectivityMatrix.values[ind][j]){
      drawNewConnection(canvas.getLayer('N' + j), canvas.getLayer('N' + ind))
    }
  }
  canvas.drawLayers();
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

//Draws all the updated nodes from the state vector
function drawUpdatedNodes(){
  for(var i = 0; i < stateVector.values.length; i++){
    var layer = canvas.getLayer('N' + i);
    if(layer){
      setNodeColor(layer,stateVector.values[i].value);
    }
  }
  canvas.drawLayers();
}

//Performs all the animations

function runAnimations(){
  stateVector.values.forEach((item, index) => {
    if(item.type === "output" && item.value === 1){
      canvas.animateLayer('N' + index, {
        rotate: '+=180'
      })
    }
  })
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

function updateConnections(str){
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

  if(str === "connect"){
  //Connectivity Matrix Update
    connectivityMatrix.connectNodes(startNode.val(), endNode.val());
  //Draw new connection
    drawNewConnection(start, finish);
  }
  if(str === "disconnect"){
  //Connectivity Matrix Update
    connectivityMatrix.disconnectNodes(startNode.val(), endNode.val());
  //Erase connection
  var arrowToDelete = (canvas.getLayers((layer)=> layer.name === start.name + finish.name))[0];
  // canvas.deleteLayer(arrowToDelete)
  canvas
    .removeLayer(arrowToDelete)
    .drawLayers()
  }

  // Clear input fields
  startNode.val("");
  endNode.val("");
}

// Simulation Functionality
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
