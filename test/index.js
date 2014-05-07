'use strict';

var Middlebot = require('../lib/');
var chai = require('chai');
var expect = chai.expect;

describe('middlebot, middleware manager', function () {
  var middlebot, req, res;
  beforeEach(function () {
    middlebot = new Middlebot();
    req = {};
    res = {};
  });

  it('should be instantiated', function () {
    expect(middlebot.use).to.exist;
    expect(middlebot.handle).to.exist;
  });

  describe('#use', function() {
    it('should add middleware to use', function () {
      var self = middlebot
      .use(testMiddleWare)
      .use(errorMiddleWare);
      expect(self).to.equal(middlebot);
    });

    it('should add multiple type at once', function () {
      var self = middlebot
      .use(['firstType', 'secondType'], testMiddleWare);
      expect(self).to.equal(middlebot);
    });

    it('should add multiple middlewares at once', function () {
      var self = middlebot
      .use(testMiddleWare, errorMiddleWare);
      expect(self).to.equal(middlebot);
    });

    it('should add multiple middlewares at once and a type', function () {
      var self = middlebot
      .use('test', testMiddleWare, errorMiddleWare);
      expect(self).to.equal(middlebot);
    });
  });

  describe('#handle', function() {
    it('should handle middlewares with no type', function () {
      middlebot
      .use(transformMiddleware)
      .handle('all', req, res, function (err, req, res) {
        expect(res.test).to.equal('test');
      });
    });

    it('should handle all middlewares of a type', function () {
      middlebot
      .use('test', testMiddleWare)
      .use('test', testMiddleWare)
      .handle('test', {}, {}, function (err, req, res) {
        expect(err).not.to.exist;
      });
    });

    it('should handle modifing the response', function () {
      middlebot
      .use('test', transformMiddleware)
      .handle('test', req, res, function(err, req, res) {
        expect(res.test).to.equal('test');
      });
    });

    it('should handle errors in middlewares', function () {
      middlebot
      .use('test', errorMiddleWare)
      .handle('test', {}, {}, function (err, req, res) {
        expect(err).to.equal('oh no !');
      });
    });

    it('should handle exceptions', function() {
      middlebot
      .use(exceptionMiddleware)
      .handle('all', req, res, function(err, req, res) {
        expect(err).to.equal('oups !');
      });
    });

    it('should handle multiple middlewares', function() {
      middlebot
      .use(incMiddleware)
      .use(incMiddleware)
      .use(incMiddleware)
      .handle('', req, res, function(err, req, res) {
        expect(res.count).to.equal(3);
      });
    });

    it('should end middleware execution', function () {
      middlebot
      .use(endMiddleware)
      .use(transformMiddleware)
      .handle('', req, res, function(err, req, res) {
        expect(res.test).to.not.exist;
      });
    });

    it('should handle multiple handling calls', function() {
      middlebot
      .use(incMiddleware)
      .handle('', req, res);
      middlebot
      .handle('', req, res, function(err, req, res) {
        expect(res.count).to.equal(2);
      });
    });

    it('should handle registering multiple types at once', function() {
      middlebot
      .use(['test', 'test2'], incMiddleware)
      .handle('test', req, res);
      middlebot
      .handle('test2', req, res, function(err, req, res) {
        expect(res.count).to.equal(2);
      });
    });

    it('should handle registering multiple middlewares at once', function() {
      middlebot
      .use('test', incMiddleware, incMiddleware)
      .handle('test', req, res, function(err, req, res) {
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
