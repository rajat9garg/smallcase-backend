const express 		= require('express');
const logger 	    = require('morgan');
const bodyParser 	= require('body-parser');
const passport      = require('passport');
const pe            = require('parse-error');
const cors          = require('cors');
const expressValidator  = require('express-validator');

const v1 = require('./routes/v1');

const app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false,limit: '5mb' }));

const models = require("./database");

// CORS
app.use(cors());

// console.log('hlo') ;

app.use(expressValidator({
    customValidators: {
        isValidMongoId: function(value) {
            var regex = /^[0-9a-f]{24}$/;
            return regex.test(value);
        },
        isValidEmail: function(value) {
            if (!value) return false;
            var value = value.trim();
            var email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return email_regex.test(value);
        },
    }
}));

app.use('/v1', v1);

app.get('/', function(req, res){
	res.statusCode = 200;//send the appropriate status code
	res.json({status:"success", message:"Mongo API", data:{}})
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;

process.on('unhandledRejection', error => {
    console.error('Uncaught Error', pe(error));
});
