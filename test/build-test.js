/*global expect, it, beforeEach, afterEach */

'use strict';

var chai = require('chai')
  , chaiAsPromised = require('chai-as-promised')
  , P = require('bluebird')
  , fs = P.promisifyAll(require('fs'))
  , sh = require('shelljs')
  , sinon = require('sinon')
  , cheerio = require('cheerio')
  , build = require('../index.js').build
  , utf8 = {encoding: 'utf8'};

chai.use(chaiAsPromised);

var expect = chai.expect;

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
      stello.getCards.withArgs('Pages').callsArgWith(1, results.slice(0,2));
      stello.getCards.withArgs('Posts').callsArgWith(1, results.slice(2));
      stello.getCards.callsArgWith(1, results);
      done();
    });
});

beforeEach(function(done) {
  build(stello, done);
});

afterEach(function() {
  sh.rm('-rf', __dirname + '/www');
  sh.cd(cwdSave);
});

describe('build', function() {
  it('should create a home page from first pages card', function() {
    // ...
  });

  it.only('should create pages', function() {
    var firstP = fs.existsAsync('first-page/index.html')
      , secondP = fs.existsAsync('second-page/index.html');
    expect(firstP).to.eventually.equal(true);
    expect(secondP).to.eventually.equal(true);
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
