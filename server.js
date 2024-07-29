const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');

const app = express();

// setup handlebars view engine
app.engine('handlebars', 
    handlebars({defaultLayout: 'main_logo'}));
app.set('view engine', 'handlebars');

// static resources
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set up session middleware
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure to true if using HTTPS
}));

// Routing
const routes = require('./routes/index');
app.use('/', routes);

app.use(function(req, res) {
    res.status(404);
    res.render('404');
});

app.listen(3000, function(){
  console.log('http://localhost:3000');
});

