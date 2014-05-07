# middlebot

[![Build Status](https://travis-ci.org/yanhick/middlebot.svg?branch=master)](https://travis-ci.org/yanhick/middlebot)
[![Dependency Status](https://david-dm.org/yanhick/middlebot.svg?theme=shields.io)](https://david-dm.org/yanhick/middlebot)
[![devDependency Status](https://david-dm.org/yanhick/middlebot/dev-status.svg?theme=shields.io)](https://david-dm.org/yanhick/middlebot#info=devDependencies)

A generic middleware manager, inspired by Connect. Instead of using routes, you can use any category you need.

## Install

```sh
npm install middlebot
```

## Use

```js
  // Instantiate middlebot.
  var app = require('middlebot')();

  // Middleware example.
  var middleware = function(err, req, res, next) {
    // Do stuff here...
    next();

    // If there was an error call next with an error object.
    next(err);

    // Middlewares execution can be stop this way.
    res.end();
  }

  // Register middleware to be called when ‘myMiddlewares’ is handled.
  app.use('myMiddlewares', middleware);

  // Middleware can be registered for mutiple types at once.
  app.use(['myMiddleWares, myOtherMiddlewares'], middleware);

  // Multiple middlewares can be registered at once.
  app.use('myMiddleWares', middleware, anotherMiddleware);

  // Request and response objects.
  var req = {};
  var res = {};

  // Called once all middlewares are handled.
  var done = function (err, req, res) {
    if (err) console.log('error in one of the middleware');

    console.log('middleware executed correctly');
  }

  // Handle all middlewares registered for ‘myMiddleWares’ with req and res.
  app.handle('myMiddleWares', req, res, done);
```

## Test

```sh
npm test
```

## License

MIT