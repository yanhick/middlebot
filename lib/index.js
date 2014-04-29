'use strict';

/**
 * Instantiate middleman
 */
module.exports = function () {

  //middleware stack
  var stack = [];

  //middleman instance
  var self;

  /**
   * Add a middleware in the stack for the given
   * type
   *
   * @param {string} type the handler type were to use
   * the middleware. If not provided, middleware is always
   * used
   * @param {function} cb the middleware handler
   * @return the middleman instance
   */
  function use(type, cb)  {

    //check if type not provided
    if ('string' !== typeof type) {
      cb = type;
      type = '';
    }

    stack.push({type: type, cb: cb});
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
      if (type !== middleware.type && middleware.type !== '') return next(err);

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

