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
