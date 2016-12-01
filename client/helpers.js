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

  var startNode = canvas.getLayer(start);
  var endNode = canvas.getLayer(end);

  var x1, x2, y1, y2;
  var ratio = ((end.y - start.y)/(end.x - start.x))
  var theta = Math.atan(ratio)
  if(end.x <= start.x) {
    x1 = start.x - Math.cos(theta) * neuronRadius;
    y1 = start.y - Math.sin(theta) * neuronRadius;
    x2 = end.x + Math.cos(theta) * neuronRadius;
    y2 = end.y + Math.sin(theta) * neuronRadius;
  } else {
    x1 = start.x + Math.cos(theta) * neuronRadius;
    y1 = start.y + Math.sin(theta) * neuronRadius;
    x2 = end.x - Math.cos(theta) * neuronRadius;
    y2 = end.y - Math.sin(theta) * neuronRadius;
  }

  return {
    x1: x1,
    x2: x2,
    y1: y1,
    y2: y2,
    name: (start + '-' + end)
  };
}
