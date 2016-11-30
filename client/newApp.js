// Global Variables
var counter = 0;
var currentNodeType = undefined;

//**** Node ***
function Node(num){
  this.num = num;
  this.state = 0;
  this.type = currentNodeType;
  this.connectionsTo = {}; //All nodes downstream
  this.connectionsFrom = {}; //All nodes upstream
};

// *** Graph ***
function Graph() {
  this.nodes = {};
};

Graph.prototype.addNode = function(){
  var node = new Node(counter);
  this.nodes[counter] = node;
  counter++;
  return node;
};

Graph.prototype.deleteNode = function(num){
  delete this.nodes[num];
  //TO DO: Delete all the connections too.
};


Graph.prototype.connectNodes = function(start, end){
  var graph = this;
  graph.nodes[start].connectionsTo[end] = graph.nodes[end];
  graph.nodes[end].connectionsFrom[start] = graph.nodes[start];
};

Graph.prototype.disconnectNodes = function(start, end){
  var graph = this;
  delete graph.nodes[start].connectionsTo[end];
  delete graph.nodes[end].connectionsFrom[start];
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
    // console.log(node)
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

