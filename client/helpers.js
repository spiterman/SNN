// Math Helpers

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

function isValidPosition(x1, y1){
  var layers = canvas.getLayers((layer) => layer.type === 'arc');

  for(var i = 0; i < layers.length; i++){
    if(distance(x1, y1, layers[i].x, layers[i].y) < neuronDistance + 2 * neuronRadius){
      return false;
    }
  }
  return true;
}

function generateEndpoints(start, end){

  var startNode = canvas.getLayer('N' + start);
  var endNode = canvas.getLayer('N' + end);

  var x1, x2, y1, y2;
  var ratio = ((endNode.y - startNode.y)/(endNode.x - startNode.x))
  var theta = Math.atan(ratio)
  if(endNode.x <= startNode.x) {
    x1 = startNode.x - Math.cos(theta) * neuronRadius;
    y1 = startNode.y - Math.sin(theta) * neuronRadius;
    x2 = endNode.x + Math.cos(theta) * neuronRadius;
    y2 = endNode.y + Math.sin(theta) * neuronRadius;
  } else {
    x1 = startNode.x + Math.cos(theta) * neuronRadius;
    y1 = startNode.y + Math.sin(theta) * neuronRadius;
    x2 = endNode.x - Math.cos(theta) * neuronRadius;
    y2 = endNode.y - Math.sin(theta) * neuronRadius;
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
