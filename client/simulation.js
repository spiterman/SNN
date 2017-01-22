// Simulation Constructor Function
function Simulation(graph, canvas) {
  var sim = this;
  this.canvas = canvas;
  this.graph = graph;

  // Neuron Properties
  var maxNeurons = 30;
  this.neuronDistance = 3;
  this.neuronRadius = 25;
  this.spinnerRadius = 45;
  this.colors = {
    'active': 'yellow',
    'inactive': 'red',
    'spinner': 'purple'
  };

  // Drawing Functions
  this.drawNeuron = function(e) {
    var x = e.offsetX;
    var y = e.offsetY;

    // Make sure neurons aren't too close
    if(isValidPosition(x, y, sim)){
      var node = sim.graph.addNode(); // Graph properties
      var nodeConstructor = selectNeuronType(sim);
      var neuron = new nodeConstructor(x, y, node.num, sim); // Drawing properties
      var text = new Text(x, y, node.num, sim); // Add text

      // Draw to Canvas
      sim.canvas.addLayer(neuron)
            .addLayer(text)
            .drawLayers();
    }
  };

  // Add Canvas Click Handlers
  this.canvas.click(sim.drawNeuron);

  // Manage Connections

  this.updateConnections = function (str){
    var start = $('#startNode');
    var end = $('#endNode');
    if(str === 'connect'){
      sim.drawConnection(start.val(), end.val());
    }
    if(str === 'disconnect'){
      // Disconnect Functionality;
      sim.deleteConnection(start.val(), end.val());
    }
    start.val("");
    end.val("");
  }

  this.drawConnection = function(start, end){
    if(sim.graph.connectNodes(start, end)){
      var endpoints = generateEndpoints(start, end, sim);
      var connection = new Connection(endpoints);
      sim.canvas.addLayer(connection)
                 .drawLayers();
    }
  }

  this.deleteConnection = function(start, end){
    if(sim.graph.disconnectNodes(start, end)){
      sim.canvas.removeLayer('N' + start + 'N' + end)
                .drawLayers();
    }
  }

// Updating State
  this.drawNextState = function(){
    var neurons = sim.canvas.getLayers((layer) => layer.type === 'arc' || layer.type === 'polygon');
    neurons.forEach((neuron) => {
      var num = neuron.num;
      if(sim.graph.nodes[num].state === 1){
        neuron.fillStyle = 'yellow';
        if(neuron.type === 'polygon'){
          sim.canvas.animateLayer(neuron.name, {
            rotate: '+=180'
          });
        }
      } else {
        neuron.fillStyle = 'red';
      }
    });
    sim.canvas.drawLayers();
  }

  // Simulation Parameters
  this.isSimulationRunning = false;
  this.simulationSpeed = 2000;

  // Simulation Functionality
  this.simulate = function() {
    if(sim.isSimulationRunning){
      sim.graph.updateState();
      sim.drawNextState();
      setTimeout(function(){
        sim.simulate();
      }, sim.simulationSpeed)
    }
  }

  this.runSimulation = function(){
    sim.isSimulationRunning = true;
    sim.simulate();
  }

  this.endSimulation = function(){
    sim.isSimulationRunning = false;
  }

// Control Panel
  // Node Types
  this.currentNodeType = 'connection';
  this.nodeTypes = {
    'connection': $('#connection'),
    'spinner': $('#spinner')
  }

  this.setNodeType = function(str){
    objEach(sim.dblClickActions, (item) => item.removeClass('active'));
    $('#' + str).addClass('active');
    sim.currentNodeType = str;
  }

  // Set Double Click Action
  this.currentDblClickAction = 'activateNodes';
  this.dblClickActions = {
    'activateNodes': $('#activateNodes'),
    'deleteNodes': $('#deleteNodes')
  };

  this.setDblClickAction = function(str){
    objEach(sim.dblClickActions, (item) => item.removeClass('active'));
    $('#' + str).addClass('active');
    sim.currentDblClickAction = str;
  };
}

// Initialize Simulation
var simulation = new Simulation(new Graph(), $('#canvas'));

//Activates the dropdown toggle
$(document).ready(function() {
    $(".dropdown-toggle").dropdown();
});
