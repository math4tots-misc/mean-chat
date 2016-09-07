// requires
const express = require('express');
const app = express();
const mongoose = require('mongoose');  // for mongodb
const morgan = require('morgan');  // log requests to console
const bodyParser = require('body-parser');  // parse HTML POST
const methodOverride = require('method-override');  // fake DELETE and PUT

const {asyncf} = require('./app/asyncutils.js');


// config
mongoose.Promise = Promise;
mongoose.connect('localhost:27017/mean-chat');
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));


// models
const Todo = mongoose.model('Todo', {
  text: String,
  done: Boolean,
});


// routes

function asyncRoute(res, generator) {
  return asyncf(generator)().catch(err => {
    res.status(500).send(err.toString());
  });
}

app.get('/api/v0/todos', (req, res) => {
  asyncRoute(res, function*() {
    res.json(yield Todo.find());
  });
});

app.post('/api/v0/todos', (req, res) => {
  asyncRoute(res, function*() {
    if (!req.body || req.get('Content-Type') !== 'application/json' ||
        !req.body.text) {
      console.error("req.body ->");
      console.error(req.body);
      res.status(400).send(
          "text must not be empty " +
          "(maybe make sure 'Content-Type: application/json' " +
          "is set in the header)");
    } else {
      yield Todo.create({text: req.body.text, done: false});
      res.json(yield Todo.find());
    }
  });
});

app.delete('/api/v0/todos/:todoId', (req, res) => {
  asyncRoute(res, function*() {
    yield Todo.remove({_id: req.params.todoId});
    res.json(yield Todo.find());
  });
});

app.get('/', (req, res) => {
  res.sendfile('./public/index.html');
});

// start app
app.listen(8080);
console.log("App listening on port 8080");
