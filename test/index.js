'use strict';

var middlebot = require('../lib');
var chai = require('chai');
var expect = chai.expect;

describe('app, middleware manager', function () {
  var app, req, res;
  beforeEach(function () {
    app = middlebot();
    req = {};
    res = {};
  });

  it('should be instantiated', function () {
    expect(app.use).to.exist;
    expect(app.handle).to.exist;
  });

  describe('#use', function() {
    it('should add middleware to use', function () {
      var self = app
      .use(testMiddleWare)
      .use(errorMiddleWare);
      expect(self).to.equal(app);
    });

    it('should add multiple type at once', function () {
      var self = app
      .use(['firstType', 'secondType'], testMiddleWare);
      expect(self).to.equal(app);
    });

    it('should add multiple middlewares at once', function () {
      var self = app
      .use(testMiddleWare, errorMiddleWare);
      expect(self).to.equal(app);
    });

    it('should add multiple middlewares at once and a type', function () {
      var self = app
      .use('test', testMiddleWare, errorMiddleWare);
      expect(self).to.equal(app);
    });
  });

  describe('#handle', function() {
    it('should handle middlewares with no type', function () {
      app
      .use(transformMiddleware)
      .handle('all', req, res, function (err, req, res) {
        expect(res.test).to.equal('test');
      });
    });

    it('should handle all middlewares of a type', function () {
      app
      .use('test', testMiddleWare)
      .use('test', testMiddleWare)
      .handle('test', {}, {}, function (err, req, res) {
        expect(err).not.to.exist;
      });
    });

    it('should handle modifing the response', function () {
      app
      .use('test', transformMiddleware)
      .handle('test', req, res, function(err, req, res) {
        expect(res.test).to.equal('test');
      });
    });

    it('should handle errors in middlewares', function () {
      app
      .use('test', errorMiddleWare)
      .handle('test', {}, {}, function (err, req, res) {
        expect(err).to.equal('oh no !');
      });
    });

    it('should handle exceptions', function() {
      app
      .use(exceptionMiddleware)
      .handle('all', req, res, function(err, req, res) {
        expect(err).to.equal('oups !');
      });
    });

    it('should handle multiple middlewares', function() {
      app
      .use(incMiddleware)
      .use(incMiddleware)
      .use(incMiddleware)
      .handle('', req, res, function(err, req, res) {
        expect(res.count).to.equal(3);
      });
    });

    it('should end middleware execution', function () {
      app
      .use(endMiddleware)
      .use(transformMiddleware)
      .handle('', req, res, function(err, req, res) {
        expect(res.test).to.not.exist;
      });
    });

    it('should handle multiple handling calls', function() {
      app
      .use(incMiddleware)
      .handle('', req, res);
      app
      .handle('', req, res, function(err, req, res) {
        expect(res.count).to.equal(2);
      });
    });

    it('should handle registering multiple types at once', function() {
      app
      .use(['test', 'test2'], incMiddleware)
      .handle('test', req, res);
      app
      .handle('test2', req, res, function(err, req, res) {
        expect(res.count).to.equal(2);
      });
    });

    it('should handle registering multiple middlewares at once', function() {
      app
      .use('test', incMiddleware, incMiddleware)
      .handle('test', req, res, function(err, req, res) {
        expect(res.count).to.equal(2);
      });
    });

    it('should call only error middlewares when an error occured', function() {
      app
      .use('test', exceptionMiddleware)
      .use('test', errorHandlingMiddleware)
      .use('test', transformMiddleware)
      .handle('test', req, res, function(err, req, res) {
        expect(err).to.equal('error handled');
        expect(res.test).to.not.exists;
      });
    });

    it('should not call error middlewares when no error', function () {
      app
      .use('test', transformMiddleware)
      .use('test', errorHandlingMiddleware)
      .handle('test', req, res, function(err, req, res) {
        expect(err).to.not.exists;
      });
    });

    it('should call all error middlewares error once an error occured', function () {
      app
      .use('test', exceptionMiddleware)
      .use('test', errorHandlingMiddleware)
      .use('test', anotherErrorHandlingMiddleware)
      .handle('test', req, res, function(err, req, res) {
        expect(err).to.equal('error also handled');
      });
    });

    it('should resume normal middleware execution if error handler ignores error', function () {
      app
      .use('test', exceptionMiddleware)
      .use('test', ignoreErrorHandler)
      .use('test', transformMiddleware)
      .handle('test', req, res, function(err, req, res) {
        expect(err).to.not.exists;
        expect(res.test).to.equal('test');
      });
    });

    it('should only execute middlewares with the exact handling type', function() {
      app
      .use('test', incMiddleware)
      .use('testSomethingElse', incMiddleware)
      .handle('test', req, res, function(err,req, res) {
        expect(res.count).to.equal(1);
      });
    });
  });
});

function testMiddleWare(req, res, next) {
  next();
}

function endMiddleware(req, res, next) {
  res.end();
}

function incMiddleware(req, res, next) {
  if (!res.count) res.count = 0;
  res.count++;
  next();
}

function transformMiddleware(req, res, next) {
  res.test = 'test';
  next();
}

function exceptionMiddleware(req, res, next) {
  throw 'oups !';
}

function errorMiddleWare(req, res, next) {
  next('oh no !');
}

function errorHandlingMiddleware(err, req, res, next) {
  next('error handled');
}

function anotherErrorHandlingMiddleware(err, req, res, next) {
  next('error also handled');
}

function ignoreErrorHandler(err, req, res, next) {
  next();
}
