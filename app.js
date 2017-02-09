var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require("mysql");

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: false }));
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "root",
    // database: "db1",
});

connection.connect(function(error){
    if(!error) {
        console.log("database is connected");
    } else {
        console.log("error while connecting to database");
    }
});

connection.query("use " + "db1");

app.post("/details",urlencodedParser, function(request,response){
        // response.write(request.body.fullName+"\n");

    count = 0;
  console.log(request.body.fullName);
  console.log(request.body.email);
  console.log(request.body.password);
  // response.end();
  connection.query("select * from registration",function(error,result,fields){
    if(error){
      throw error
     console.log("error while executing the query");
    }else{
        for(var i in result){
            var output = result[i];
            email = output.email ;
            console.log(email);
            if(email === request.body.email){
                            count = count+1; 
              console.log(count);
              
              // throw new Error("email is already registered");
               console.log("email is already registered try to login or sign up with new email");
              response.end("email is already registered try to login or sign up with new email");
              // response.end();
            }
        }
    }if(count == 0 ){
console.log(count);
  connection.query("insert into registration (fullName, email , pass) value('"+request.body.fullName+"','"+request.body.email+"','"+request.body.password+"')",function(err,result,fields){
    if(err) throw err
    else{
      console.log("registered successfully");
      response.writeHead(200,{'content-type':'text/html'});
  response.write(request.body.email+"\n");
  response.write("with the given details you have been successfully registered login to continue"+"\n");
  response.write("<a href='/login'>LOGIN</a>")
    }
    // connection.end();
    response.end();
  });
  }
  else {
    console.log("email");
  }

  });
  
});

app.post("/dashboard",urlencodedParser,function(request,response){
        // response.write(request.body.fullName+"\n");

  count = 0;
  emailEntered = request.body.email
  passwordEntered = request.body.password
   connection.query("select * from registration",function(error,result,fields){
    if(error){
      throw error
     console.log("error while executing the query");
    }else{
        for(var i in result){
            var output = result[i];
            email = output.email ;
            password = output.pass;
            name = output.fullName;
            console.log(email);
            if(email === emailEntered && password === passwordEntered){
                            count = count+1; 
              console.log(count);
              
              // throw new Error("email is already registered");
              //  console.log("email is already registered try to login or sign up with new email");
              // response.end("email is already registered try to login or sign up with new email");
              // response.end();
            }
        }
    }if(count == 1 ){
console.log(count);
  
          response.writeHead(200,{'content-type':'text/html'});

    response.write(name + "\n");
    response.write("welcome "+ name);
    response.end();
    // connection.end();
  // })
  }
  else {
    console.log("invalid credentials");
          response.writeHead(200,{'content-type':'text/html'});
    response.write("Invalid Credentials. Login again with correct details "+"\n");
    response.end("<a href='/login'>LOGIN</a>");
  }

  });
})

// connection.query("delete from registration where email = ?",["p.sandhyarani20@gmail.com"],function(err,result,fields){
//   if(err){
//     console.log("error in executing query");
//     throw err
//   }
//   else {
//     console.log("deleted successfully");
//   }
// })

app.listen(3000,function(){
  console.log("server is running");
})

module.exports = app;
