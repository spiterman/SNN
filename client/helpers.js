// Math Helpers
function objEach(obj, cb){
  for(var key in obj){
    cb(obj[key], key, obj);
  }
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

function isValidPosition(x1, y1, simulation){
  var layers = simulation.canvas.getLayers((layer) => layer.type === 'arc');

  for(var i = 0; i < layers.length; i++){
    if(distance(x1, y1, layers[i].x, layers[i].y) < simulation.neuronDistance + 2 * simulation.neuronRadius){
      return false;
    }
  }
  return true;
}

function generateEndpoints(start, end, simulation){

  var startNode = simulation.canvas.getLayer('N' + start);
  var endNode = simulation.canvas.getLayer('N' + end);

  var x1, x2, y1, y2;
  var ratio = ((endNode.y - startNode.y)/(endNode.x - startNode.x))
  var theta = Math.atan(ratio)
  if(endNode.x <= startNode.x) {
    x1 = startNode.x - Math.cos(theta) * simulation.neuronRadius;
    y1 = startNode.y - Math.sin(theta) * simulation.neuronRadius;
    x2 = endNode.x + Math.cos(theta) * simulation.neuronRadius;
    y2 = endNode.y + Math.sin(theta) * simulation.neuronRadius;
  } else {
    x1 = startNode.x + Math.cos(theta) * simulation.neuronRadius;
    y1 = startNode.y + Math.sin(theta) * simulation.neuronRadius;
    x2 = endNode.x - Math.cos(theta) * simulation.neuronRadius;
    y2 = endNode.y - Math.sin(theta) * simulation.neuronRadius;
  }

  return {
    x1: x1,
    x2: x2,
    y1: y1,
    y2: y2,
    name: ('N' + start + 'N' + end),
    start: 'N' + start,
    end: 'N' + end
  };
}
