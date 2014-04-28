'use strict';

var MiddleMan = require('../lib/');
var chai = require('chai');
var expect = chai.expect;

describe('middleman, middleware manager', function () {
  var middleman, req, res;
  beforeEach(function () {
    middleman = new MiddleMan();
    req = {};
    res = {};
  });

  it('should be instantiated', function () {
    expect(middleman.use).to.exist;
    expect(middleman.handle).to.exist;
  });

  it('should add middleware to use', function () {
    middleman
    .use(testMiddleWare)
    .use(errorMiddleWare);

  });

  it('should handle middlewares with no type', function () {
    middleman
    .use(transformMiddleware)
    .handle('all', req, res, function () {
      expect(res.test).to.equal('test');
    });
  });

  it('should handle all middlewares of a type', function () {
    middleman
    .use('test', testMiddleWare)
    .use('test', testMiddleWare)
    .handle('test', {}, {}, function (err) {
      expect(err).not.to.exist;
    });
  });

  it('should handle modifing the response', function () {
    middleman
    .use('test', transformMiddleware)
    .handle('test', req, res, function() {
      expect(res.test).to.equal('test');
    });
  });

  it('should handle errors in middlewares', function () {
    middleman
    .use('test', errorMiddleWare)
    .handle('test', {}, {}, function (err) {
      expect(err).to.equal('oh no !');
    });
  });

  it('should handle exceptions', function() {
    middleman
    .use(exceptionMiddleware)
    .handle('all', req, res, function(err) {
      expect(err).to.equal('oups !');
    });
  });
});

function testMiddleWare(err, req, res, next) {
  next();
}

function transformMiddleware(err, req, res, next) {
  res.test = 'test';
  next();
}

function exceptionMiddleware(err, req, res, next) {
  throw 'oups !';
}

function errorMiddleWare(err, req, res, next) {
  next('oh no !');
}
