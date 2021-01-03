'use strict';
'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var dotEnv = require('dotenv');
var cors = require('cors');
var url = require("url");
var bodyParser = require('body-parser');
const dns = require('dns');

var Schema = mongoose.Schema;

var app = express();
dotEnv.config();
// Basic Configuration 
var port = process.env.PORT || 4000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGOLAB_URI, {
    useNewUrlParser: true
});

var db = mongoose.connection; 
db.on('error', console.error.bind(console, 'connection error:'));
 
//Define Schema
var testSchema = new Schema({
    original_url: String,
    short_url: Number
});

const myModel = mongoose.model('saveddata', testSchema);
//const DataModel = new myModel;

app.use(cors());
/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){

    var result = url.parse('http://www.google.com/');
   // console.log(result.hostname);
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl/new-', function(req, res){
   
    let postParams = req.body.url;
    //console.log(postParams + " *********** \n\n");
    console.log('Connected ');

    //Get my total
    myModel.find({}).then((docs) => {

        // Set your Data Sli
        let myData = new myModel({ //Use the model
            original_url: postParams,
            short_url: docs.length+1
        });

        myData.save(function (err, doc) {
        if (err) return console.error(err);
        console.log(doc.original_url + " =>  saved to collection");
            res.send(myData);
        });
        console.log(docs.length);
    });
      
    //res.redirect('http://www.google.com');
  // res.send('Done Saving');
});

app.get('/api/shorturl/21', function(req, res){

    let params = req.params.ToDo;
    console.log(params);

    myModel.find({short_url: params}).then((docs)=>{
        let myUrl = docs.original_url;
        res.send('Hy');
        res.redirect(myUrl);

        }).catch((e) => res.status(400).send({error: 'Short URL not found'}));;

  
});

app.get('/api/urls', (req, res) => {
    Url.find().then((docs) => { 
      res.send({docs});
    }).catch((e) => res.status(400).send(e));
  });
  
  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});