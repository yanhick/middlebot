[![Build Status](https://travis-ci.org/yanhick/middleman.svg?branch=master)](https://travis-ci.org/yanhick/middleman)

#MiddleMan

A generic middleware manager, inspired by Connect. Instead of using routes, you can use any category you need.

## Use

```Javascript

    //instantiate middleman
    var middleman = require('middleman')();

    //middleware example
    var middleware = function(err, req, res, next) {
      //do stuff here...
      next();
      
      //if there was an error call next with an error object
      next(err);

      //middlewares execution can be stop this way
      res.end();
    }

    //register middleware to be called when ‘myMiddlewares’ is handled
    middleman.use('myMiddlewares', middleware);

    //middleware can be registered for mutiple types at once
    middleman.use(['myMiddleWares, myOtherMiddlewares'], middleware);

    //multiple middlewares can be registered at once
    middleman.use('myMiddleWares', middleware, anotherMiddleware);

    //request and response objects
    var req = {};
    var res = {};

    //called once all middlewares are handled
    var done = function (err, req, res) {
      if (err) console.log('error in one of the middleware');

      console.log('middleware executed correctly');
    }

    //handle all middlewares registered for ‘myMiddleWares’ with
    //req and res.
    middleman.handle('myMiddleWares', req, res, done);
```


## Test

To run the tests:

    npm test

