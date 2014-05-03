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

  describe('#use', function() {
    it('should add middleware to use', function () {
      var self = middleman
      .use(testMiddleWare)
      .use(errorMiddleWare);
      expect(self).to.equal(middleman);
    });

    it('should add multiple type at once', function () {
      var self = middleman
      .use(['firstType', 'secondType'], testMiddleWare);
      expect(self).to.equal(middleman);
    });
  });

  describe('#handle', function() {
    it('should handle middlewares with no type', function () {
      middleman
      .use(transformMiddleware)
      .handle('all', req, res, function (err, req, res) {
        expect(res.test).to.equal('test');
      });
    });

    it('should handle all middlewares of a type', function () {
      middleman
      .use('test', testMiddleWare)
      .use('test', testMiddleWare)
      .handle('test', {}, {}, function (err, req, res) {
        expect(err).not.to.exist;
      });
    });

    it('should handle modifing the response', function () {
      middleman
      .use('test', transformMiddleware)
      .handle('test', req, res, function(err, req, res) {
        expect(res.test).to.equal('test');
      });
    });

    it('should handle errors in middlewares', function () {
      middleman
      .use('test', errorMiddleWare)
      .handle('test', {}, {}, function (err, req, res) {
        expect(err).to.equal('oh no !');
      });
    });

    it('should handle exceptions', function() {
      middleman
      .use(exceptionMiddleware)
      .handle('all', req, res, function(err, req, res) {
        expect(err).to.equal('oups !');
      });
    });

    it('should handle multiple middlewares', function() {
      middleman
      .use(incMiddleware)
      .use(incMiddleware)
      .use(incMiddleware)
      .handle('', req, res, function(err, req, res) {
        expect(res.count).to.equal(3);
      });
    });

    it('should end middleware execution', function () {
      middleman
      .use(endMiddleware)
      .use(transformMiddleware)
      .handle('', req, res, function(err, req, res) {
        expect(res.test).to.not.exist;
      });
    });

    it('should handle multiple handling calls', function() {
      middleman
      .use(incMiddleware)
      .handle('', req, res);
      middleman
      .handle('', req, res, function(err, req, res) {
        expect(res.count).to.equal(2);
      });
    });

    it('should handle registering multiple types at once', function() {
      middleman
      .use(['test', 'test2'], incMiddleware)
      .handle('test', req, res);
      middleman
      .handle('test2', req, res, function(err, req, res) {
        expect(res.count).to.equal(2);
      });
    });
  });
});

function testMiddleWare(err, req, res, next) {
  next();
}

function endMiddleware(err, req, res, next) {
  res.end();
}

function incMiddleware(err, req, res, next) {
  if (!res.count) res.count = 0;
  res.count++;
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
