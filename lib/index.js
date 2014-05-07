'use strict';

/**
 * Instantiate middlebot.
 */

module.exports = function () {

  // Middleware stack.
  var stack = [];

  // Middlebot instance.
  var middlebot = {
    use: use,
    handle: handle
  };

  /**
   * Add a middleware in the stack for the given
   * type.
   *
   * @param {*} type the handler type where to use
   * the middleware. If not provided, middleware is always
   * used. Can be either a string or an array of string
   * @param {function} middlewares
   * @returns the middlebot instance
   */

  function use(type) {
    // Convert args to array.
    var args = Array.prototype.slice.call(arguments);

    // Check if type not provided.
    if ('string' !== typeof type && type instanceof Array === false) {
      type = [];
    } else {
      args.shift();
    }

    args.forEach(function(arg){
      stack.push({type: type, cb: arg});
    });

    return middlebot;
  }

  /**
   * Handle all middlewares of the provided
   * type.
   *
   * @param {string} type the middleware type to
   * handle
   * @param {Object} req request object
   * @param {Object} res response object
   * @param {function} out optional function to
   * be called once all middleware have been
   * handled
   * @returns the middlebot instance
   */

  function handle(type, req, res, out) {
    var index = 0;
    var ended = false;

    // When called stop middlewares execution.
    res.end = end;

    // Handle next middleware in stack.
    function next(err) {
      var middleware = stack[index++];

      // No more middlewares or early end.
      if (!middleware || ended) {
        if (out) out(err, req, res);
        return;
      }

      // Check if middleware type matches or if it has no type.
      if (middleware.type.indexOf(type) === -1 && middleware.type.length > 0)
        return next(err);

      try {
        middleware.cb(err, req, res, next);
      }
      catch (e) {
        next(e);
      }
    }

    // Stop middlewares execution.
    function end() {
      ended = true;
    }

    // Start handling.
    next();
  }

  return middlebot;
};

