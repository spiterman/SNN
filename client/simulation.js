// To Do: Refactor to Use Simulation rather than assign globals
// To Do: Use parameters in defining new neuron
function Simulation(graph, canvas) {
  var sim = this;
  this.canvas = canvas;
  this.graph = graph;

  // Neuron Properties
  var maxNeurons = 30;
  this.neuronDistance = 3;
  this.neuronRadius = 25;
  this.neuronCount = 0;
  this.colors = {
    'active': 'yellow',
    'inactive': 'red'
  };



  // Drawing Functions
  this.drawNeuron = function(e) {
    var x = e.offsetX;
    var y = e.offsetY;

    // Make sure neurons aren't too close
    if(isValidPosition(x, y, sim)){
      var node = sim.graph.addNode(); // Graph properties
      var neuron = new Neuron(x, y, node.num, sim); // Drawing properties
      var text = new Text(x, y, node.num, sim); // Add text

      // Draw to Canvas
      sim.canvas.addLayer(neuron)
            .addLayer(text)
            .drawLayers();
    }
  };

  // Add Canvas Click Handlers
  this.canvas.click(sim.drawNeuron);


  // this.toggleNeuronState = function(layer){
  //   console.log(layer.name)
  //   var num = layer.name[1]
  //   if(graph.nodes[num].state === 1){
  //     graph.deactivateNode(num)
  //     layer.fillStyle = 'red';
  //   } else {
  //     graph.activateNode(num)
  //     layer.fillStyle = 'yellow';
  //   }
  //   canvas.drawLayers();
  // }

  this.drawNextState = function(){
    var neurons = sim.canvas.getLayers((layer) => layer.type === 'arc');
  neurons.forEach((neuron) => {
    var num = neuron.name[1];
    if(sim.graph.nodes[num].state === 1){
      neuron.fillStyle = 'yellow';
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

  // Manage Connections

  this.updateConnections = function (str){
    var start = $('#startNode');
    var end = $('#endNode');
    // console.log(start.val(), end.val());
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
    sim.graph.connectNodes(start, end);
    var endpoints = generateEndpoints(start, end, sim);
    var connection = new Connection(endpoints);
    sim.canvas.addLayer(connection)
               .drawLayers();
  }

  this.deleteConnection = function(start, end){
    sim.graph.disconnectNodes(start, end);
    sim.canvas.removeLayer('N' + start + 'N' + end)
              .drawLayers();
  }

  // this.redrawConnections = function(layer) {
  //   // Erase old connections
  //   sim.canvas.getLayers((l) => {
  //     return l.start === layer.name || l.end === layer.name;
  //   })
  //   .forEach((item) => {
  //     sim.canvas.removeLayer(item.name);
  //   });
  //   sim.canvas.drawLayers();

  //   // Draw New Connections
  //   var neuron = sim.graph.nodes[layer.num];
  //   for(var j in neuron.connectionsTo){
  //     sim.drawConnection(layer.num, j);
  //   }
  //   for(var k in neuron.connectionsFrom){
  //     sim.drawConnection(k, layer.num);
  //   }
  // }

  // Control Panel
    // Node Types
  this.nodeTypes = [$('#connection'), $('#spinner')];
  this.currentNodeType = 'connection';

  this.setNodeType = function(str){
    sim.nodeTypes.forEach((item) => item.removeClass('active'));
    $('#' + str).addClass('active');
    sim.currentNodeType = str;
  }

    // Double Click Action
  // this.dblClickActions = [$('#activateNodes'), $('#deleteNodes')];
  this.currentDblClickAction = 'activateNodes';

  this.dblClickActions = {
    'activateNodes': $('#activateNodes'),
    'deleteNodes': $('#deleteNodes')
  };


  this.setDblClickAction = function(str){
    // sim.dblClickActions.forEach((item) => item.removeClass('active'));
    objEach(sim.dblClickActions, (item) => item.removeClass('active'));
    $('#' + str).addClass('active');
    sim.currentDblClickAction = str;
  }

}

// Initialize Simulation
var simulation = new Simulation(new Graph(), $('#canvas'));

//Activates the dropdown toggle
$(document).ready(function() {
    $(".dropdown-toggle").dropdown();
});
