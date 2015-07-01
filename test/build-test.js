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
      results = results.map(function(cStr) {
        return JSON.parse(cStr);
      });
      stello = {};
      stello.getCards = sinon.stub();
      stello.getCards.withArgs('Pages').callsArgWith(1, null, results.slice(0,2));
      stello.getCards.withArgs('Posts').callsArgWith(1, null, results.slice(2));
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
    var indexP = fs.readFileAsync('index.html');
    expect(indexP).to.eventually.be.ok;
  });

  it('should create pages', function() {
    var firstP = fs.readFileAsync('first-page/index.html')
      , secondP = fs.readFileAsync('second-page/index.html');
    expect(firstP).to.eventually.be.ok;
    expect(secondP).to.eventually.be.ok;
  });

  it('should create posts', function() {
    var firstP = fs.readFileAsync('blog/MJhdP2pD/index.html')
      , secondP = fs.readFileAsync('blog/NJhdP2pD/index.html')
      , thirdP = fs.readFileAsync('blog/oJhdP2pD/index.html');
    expect(firstP).to.eventually.be.ok;
    expect(secondP).to.eventually.be.ok;
    expect(thirdP).to.eventually.be.ok;
  });

  it('should create a search page', function() {
    // ...
  });
});
