const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const urlencodeParser = bodyParser.urlencoded({extended: false});


/*connect to the database*/
mongoose.connect('mongodb://test:test@ds261929.mlab.com:61929/todolist');

/* create a schema - this is like a blueprint */
let todoSchema = new mongoose.Schema({
  item: String
});

let Todo = mongoose.model('Todo', todoSchema);

module.exports = function(app) {
  /*get data from mongodb and pass it to view*/
  app.get('/todo', function(req, res){
    Todo.find({}, function(err, data){
      if(err) throw err;
      res.render('todo', {todos: data});
    })
  });

  app.post('/todo', urlencodeParser, function(req, res){
    /*get data from the view and add it to mongodb*/
    let newTodo = Todo(req.body).save(function(err, data){
      if(err) throw err;
      res.json(data);
    });
  });

  app.delete('/todo/:item', function(req, res){
    /*delete the requested item from mongodb*/
    Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err, data) {
      if(err) throw err;
      res.json(data);
    });
  });

};
