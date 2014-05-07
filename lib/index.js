'use strict';

/**
 * Instantiate middlebot
 */
module.exports = function () {

  //middleware stack
  var stack = [];

  //middlebot instance
  var self;

  /**
   * Add a middleware in the stack for the given
   * type
   *
   * @param {any} type the handler type where to use
   * the middleware. If not provided, middleware is always
   * used. Can be either a string or an array of string
   * @param {function} middlewares
   * @return the middlebot instance
   */
  function use(type)  {
    var args = Array.prototype.slice.call(arguments);

    //check if type not provided
    if ('string' !== typeof type && type instanceof Array === false) {
      type = [];
    } else {
      args.shift();
    }

    args.forEach(function(arg){
        stack.push({type: type, cb: arg})
    });
    return self;
  }

  /**
   * handle all middlewares of the provided
   * type
   *
   * @param {string} type the middleware type to
   * handle
   * @param {Object} req request object
   * @param {Object} res response object
   * @param {function} out optional function to
   * be called once all middleware have been
   * handled
   */
  function handle(type, req, res, out) {
    var index = 0;
    var ended = false;

    //when called stop middlewares execution
    res.end = end;

    //handle next middleware in stack
    function next(err) {
      var middleware = stack[index++];

      //no more middlewares or early end
      if (!middleware || ended) {
        if (out) out(err, req, res);
        return;
      }

      //check if middleware type matches or if it has no type
      if (middleware.type.indexOf(type) === -1 && middleware.type.length > 0) return next(err);

      try {
        middleware.cb(err, req, res, next);
      }
      catch (e) {
        next(e);
      }
    }

    //stop middlewares execution
    function end() {
      ended = true;
    }

    //start handling
    next();
  }

  self = {
    use: use,
    handle: handle
  };
  return self;
};

