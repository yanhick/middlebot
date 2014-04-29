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
    }

    //register middleware to be called when ‘mymiddlewares’ is handled
    middleman.use('myMiddleWares', middleware);

    //request and response objects
    var req = {};
    var res = {};

    //called once all middlewares are handled
    var done = function (err) {
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

