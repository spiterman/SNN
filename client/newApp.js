//**** Node ***
function Node(num, currentNodeType){
  this.num = num;
  this.state = 0;
  this.type = currentNodeType;
  this.connectionsTo = {}; //All nodes downstream
  this.connectionsFrom = {}; //All nodes upstream
};

// *** Graph ***
function Graph() {
  this.nodes = {};
  this.counter = 0;
  this.isSimulating = false;
};


// **** Graph Methods ***
Graph.prototype.addNode = function(){
  var graph = this;
  var node = new Node(graph.counter, graph.currentNodeType);
  graph.nodes[graph.counter] = node;
  graph.counter++;
  return node;
};

Graph.prototype.deleteNode = function(num){
  // O(C(n_i)), where C(n) is # of connections to and from for a given node "i"
  var graph = this;
  var node = graph.nodes[num];

  // Delete all nodes upstream
  for(var n in node.connectionsFrom) {
    var upstreamNode = node.connectionsFrom[n];
    delete upstreamNode.connectionsTo[num];
  }

  // Delete all nodes downstream
  for(var n in node.connectionsTo) {
    var downstreamNode = node.connectionsTo[n];
    delete downstreamNode.connectionsFrom[num];
  }

  // Delete this node (with all its connections)
  delete this.nodes[num];

};

Graph.prototype.connectNodes = function(start, end){
  var graph = this;
  if(graph.nodes[start] !== undefined && graph.nodes[end] !== undefined){
    graph.nodes[start].connectionsTo[end] = graph.nodes[end];
    graph.nodes[end].connectionsFrom[start] = graph.nodes[start];
    return true;
  }
  return false;
};

Graph.prototype.disconnectNodes = function(start, end){
  var graph = this;
  if(graph.nodes[start] !== undefined && graph.nodes[end] !== undefined){
  delete graph.nodes[start].connectionsTo[end];
  delete graph.nodes[end].connectionsFrom[start];
  return true;
  }
  return false;
};

Graph.prototype.activateNode = function(num) {
  this.nodes[num].state = 1;
};

Graph.prototype.deactivateNode = function(num){
  this.nodes[num].state = 0;
};

Graph.prototype.updateState = function(){
  var graph = this;
  var newActiveNodes = {};
  // Find All new nodes to be activated: O(n)
  for(var n in graph.nodes){
    var node = graph.nodes[n];
    if(node.state === 1){
      for(var connection in node.connectionsTo){
        newActiveNodes[connection] = 1;
      }
    }
    graph.deactivateNode(n); // Deactivates the node
  }

  // Activate all nodes in newActiveNodes: O(n)
  for(var num in newActiveNodes){
    graph.activateNode(num);
  }
};

Graph.prototype.simulate = function() {
  var graph = this;
  setInterval(() => {
    graph.updateState();
    console.log(graph);
  }, graph.simulationSpeed);
}


// Utility Functions

Graph.prototype.setSimulationSpeed = function(num) {
  // Makes sure input fits within certain range
  var correction = num;
  if(num < 0.2) {
    alert("That's too fast!")
    correction = 0.2;
  }
  if(num > 30) {
    correction = 30;
    alert("That's too slow!")
  }
  this.simulationSpeed = 1000 * correction;
}

