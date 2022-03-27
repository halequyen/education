const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const handlebars  = require('express-handlebars');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');

db = low(adapter);

db.defaults({ n1: [], n2: [], result: [] })
  .write();

const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('combined'));

app.engine('hbs',handlebars.engine({
  extname: '.hbs'
})
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

app.get('/', (req, res) => {
  res.render('home', {
    result: db.get('result').value()
  });
});

app.post('/', (req, res) => {
  db.get('result').push(req.body).write();
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});