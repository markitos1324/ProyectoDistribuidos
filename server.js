var express = require('express');
var axios = require('axios');
var path = require('path');
var multer = require('multer');
var fs = require('fs');
var upload = multer({dest: 'uploads/'});
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var Jimp = require('jimp');
//mongoose.connect('mongodb://localhost:27017/Distribuidos');

var Schema = mongoose.Schema;

var newsSchema = new Schema({
    title: String,
    description: String,
    image: String
});

var News = mongoose.model('news', newsSchema);

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization, sid");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
    next();
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// open a file called "lenna.png"
app.post('/r', upload.any(), function(req, res, next) {
    if (req.files) {
        req.files.forEach(function (file) {

            let filename = (new Date).valueOf() + "-" + file.originalname;
            Jimp.read(filename, (err, lenna) => {
                if (err) throw err;
                lenna
                    .resize(256, 256) // resize
                    .quality(60) // set JPEG quality
                    .greyscale() // set greyscale
                    .write(file.path + filename); // save
            });
        })
    }
});

app.post('/', upload.any(), function(req, res, next) {
    console.log("llega");
    if (req.files) {
        req.files.forEach(function (file) {

            var filename = (new Date).valueOf() + "-" + file.originalname;
            fs.rename(file.path, 'imagenes/' + filename, function (err) {
                if (err) throw err;
                //save

                var news = new News({
                    title: req.body.title,
                    description: req.body.description,
                    image: filename
                });

                news.save(function (err, result) {
                    if (err){

                    }
                    console.log("termina...");
                    res.json(result);
                });
                Jimp.read(filename, (err, lenna) => {
                    if (err) throw err;
                    lenna
                        .resize(256, 256) // resize
                        .quality(60) // set JPEG quality
                        .greyscale() // set greyscale
                        .write(filename); // save
                });
            })
        });
    }
});

app.get('/hola', function (req, res) {
	res.send("Hola Mundo Mensaje o algo asi");
});

app.get('/pag', function (req, res) {
    res.sendFile(path.join(__dirname + '/web/index.html'));
});

app.post('/', function(req, res, next) {
    console.log(req.body);
    res.send("ok");
});

// a carai
const Storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, './images')
    },
    filename(req, file, callback) {
        callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
    },
})

app.post('/foto', upload.array('photo', 3), (req, res) => {
    console.log('file', req.files)
    console.log('body', req.body)
    res.status(200).json({
        message: 'success!',
    })
    console.log("termina");
})

app.listen(3000, function () {
  console.log('Server on port ' + 3000);
});
