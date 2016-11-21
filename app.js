var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var pgp = require('pg-promise')();
var db = pgp('postgres://localhost:5432/generator');

//have form action = "/users/new" for html

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

app.use( function( req, res, next ) {
  if (req.query._method == 'DELETE') {
    req.method = 'DELETE';
    req.url = req.path;
  }
  next();
});

app.set('view engine', 'ejs');
app.set('views', __dirname);

//get users
app.get('/', function(req,res,next){
  db.any('SELECT * FROM users')
    .then(function(data){
      return res.render('index', {data: data})
    })
    .catch(function(err){
      return next(err);
    });
});

//edit users
app.get('/users/:id/edit', function(req,res,next){
  var id = parseInt(req.params.id);
  db.one('select * from users where id = $1', id)
    .then(function(user){
      res.render('edit', {user: user})
    })
    .catch(function(err) {
      return next(err);
    });
});

app.post('/users/:id/edit', function(req, res, next){
  db.none('update users set name = $1, email = $2, password = $s3 where id = $4',
    [req.body.name, req.body.email, req.body.password, parseInt(req.params.id)])
    .then(function() {
      res.redirect('/');
    })
    .catch(function (err) {
      return next(err);
    });
});

app.delete('/users/:id', function(req, res, next){
  var id = parseInt(req.params.id);
  db.results('delete from users where id = $1', id)
    .then(function(result) {
      res.redirect('/');
    })
    .catch(function(err) {
      return next(err);
    });
});

app.listen(3000, function () {
  console.log('App listening on port 3000!')
});
