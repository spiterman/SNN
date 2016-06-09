const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(__dirname + "/../client"));
app.use(express.static(__dirname + "/../node_modules"));

app.listen(port);
console.log('Server listening on ' + port);
