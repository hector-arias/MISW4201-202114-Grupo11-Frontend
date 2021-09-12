const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname + '/dist/tutorial-canciones'));

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
 });

app.get('/*', function(req,res) {
res.sendFile(path.join(__dirname+'/dist/tutorial-canciones/index.html'));
});

app.listen(process.env.PORT || 5000);
