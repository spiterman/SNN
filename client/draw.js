// Neuron Constructor Function
function Neuron(x, y, n, simulation){
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
  this.dblclick = dblClick(simulation);
  this.dragstop = redrawConnections(simulation);
}

// Spinners Constructor Function
function Spinner() {
  this.spinnerConcavity = 0.5;
  this.spinnerSides = 5;
  this.type = 'polygon';
};

// Text Constructor Function
function Text(x, y, n, simulation){
  this.x = x;
  this.y = y;
  this.groups = [n];
  this.dragGroups = [n];
  this.num = n;
  this.text = n;
  this.strokeWidth = 3;
  this.strokeStyle = 'black';
  this.type = 'text';
  // Edge case where text is clicked instead
  this.dblclick = (layer) => toggleNeuronState(simulation)(simulation.canvas.getLayer('N' + layer.text));
  this.dragstop = (layer) => redrawConnections(simulation)(simulation.canvas.getLayer('N' + layer.text));
};

// Connection Constructor Function
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

// Node Functionality
function dblClick(simulation) {
  var dblClickActions = {
    'activateNodes': toggleNeuronState(simulation),
    'deleteNodes': deleteNodes(simulation)
  }
  return function(layer){
    dblClickActions[simulation.currentDblClickAction](layer);
  }
}

// Toggle Neuron State w/ currying
function toggleNeuronState(simulation){
  return function(layer){
    var num = layer.num;
    if(simulation.graph.nodes[num].state === 1){
      simulation.graph.deactivateNode(num);
      layer.fillStyle = simulation.colors.inactive;
    } else {
      simulation.graph.activateNode(num);
      layer.fillStyle = simulation.colors.active;
    }
    simulation.canvas.drawLayers();
  }
}

// Delete Nodes + Connections w/ currying
function deleteNodes(simulation){
  return function(layer){
    var num = layer.num;
    simulation.graph.deleteNode(num);
    var canvas = simulation.canvas;

    // Remove Connections
    canvas.getLayers((l) => {
      return l.start === 'N' + num || l.end === 'N' + num;
    }).forEach((item) => {
      simulation.canvas.removeLayer(item.name)
    });

    canvas.getLayers((l) => {
      return l.num === num;
    }).forEach((item) => {
      simulation.canvas.removeLayer(item);
    });

    canvas.drawLayers();
  }
}

// Redraw Connections after Dragging w/ currying
function redrawConnections(simulation){
  return function(layer) {
    simulation.canvas.getLayers((l) => {
      return l.start === layer.name || l.end === layer.name;
    })
    .forEach((item) => {
      simulation.canvas.removeLayer(item.name)
    });
    simulation.canvas.drawLayers()

    // Draw New Connections
    var neuron = simulation.graph.nodes[layer.num]
    for(var j in neuron.connectionsTo){
      simulation.drawConnection(layer.num, j)
    }
    for(var k in neuron.connectionsFrom){
      simulation.drawConnection(k, layer.num)
    }
  }
}
