
'use strict';

var expect = require('chai').expect
  , P = require('bluebird')
  , fs = P.promisifyAll(require('fs'))
  , sh = require('shelljs')
  , sinon = require('sinon')
  , cheerio = require('cheerio')
  , build = require('../index.js').build
  , utf8 = {encoding: 'utf8'};

var cwdSave = sh.pwd()
  , stello;

beforeEach(function(done) {
  // Stello templates should expect cwd to be the doc root
  sh.mkdir(__dirname + '/www');
  sh.cd(__dirname + '/www');

  // Only build the stello stub once
  return stello ? done() :
    P.all([
      fs.readFileAsync('../data/pages/1.json', utf8),
      fs.readFileAsync('../data/pages/2.json', utf8),
      fs.readFileAsync('../data/posts/1.json', utf8),
      fs.readFileAsync('../data/posts/2.json', utf8),
      fs.readFileAsync('../data/posts/3.json', utf8)
    ])
    .then(function(results) {
      stello = {};
      stello.getCards = sinon.stub();
      stello.getCards.withArgs('Pages').returns(results.slice(0,2));
      stello.getCards.withArgs('Posts').returns(results.slice(2));
      stello.getCards.returns(results);
      done();
    });
});

afterEach(function() {
  sh.rm('-rf', __dirname + '/www');
  sh.cd(cwdSave);
});

describe('build', function() {
  it('should create create a home page from first pages card', function() {
    // ...
  });

  it('should create single pages for all pages cards', function() {
    // ...
  });

  it('should create posts', function() {
    // ...
  });

  it('should create a search page', function() {
    // ...
  });

  it('should overwrite existing files', function() {
    // ...
  });
});
