var express =   require("express");
var bodyParser =    require("body-parser");
var multer  =   require('multer');
var app =   express();
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://dbUser1:admin123@cluster0-shard-00-00.irla6.mongodb.net:27017,cluster0-shard-00-01.irla6.mongodb.net:27017,cluster0-shard-00-02.irla6.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-neflbj-shard-0&authSource=admin&retryWrites=true&w=majority";
app.use(bodyParser.json());

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now()+'.jpg');
    //  callback(null, file.originalname + '-' + Date.now()+'.jpg');
 
  }
});

var upload = multer({ storage : storage }).array('userPhoto');

app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
      
    //    MongoClient.connect(url, function(err, db) {
    //   if (err) throw err;
    //   var dbo = db.db("mydb");
    //   var myobj = {
    //     upload : req.files.path
    //       };
    //   dbo.collection("images").insertOne(myobj, function(err, res) {
    //     if (err) throw err;
    //     console.log("1 document inserted");
    //       db.close();
    //   });
      
    // }); 
});

app.post('/photo',function(req,res){
    upload(req,res,function(err) {
        console.log(req.body);
imgCount=Object.keys(req.files).length;
console.log(Object.keys(req.files).length);

        console.log(req.files);
        
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
        
    });
    
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("scan_images");
      var myobj = {
        path : req.files,
        
          };
      dbo.collection("images").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
          db.close();
      });
      
    }); 
});



app.listen(8081,function(){
    console.log("Working on port 8081");
});