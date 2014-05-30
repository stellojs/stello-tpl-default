'use strict';

var Metalsmith = require('metalsmith')
  , metalsmith = new Metalsmith(__dirname + '/../..');

var markdown = require('metalsmith-markdown')
  , permalinks = require('metalsmith-permalinks')
  , templates = require('metalsmith-permalinks')
  , collections = require('metalsmith-collections');

var async = require('async');

var registerHelpers = function() {
  // - find ../../templates/_*.hbs
  // - convert snake-case to camelCase
  // - register as helper

  //async.waterfall

};

var doBuild = function() {
  metalsmith
    .metadata({
      // Get metadata from .stellorc?
      title: 'My Stello Site',
      description: 'Made with <3'
    })
    .use(markdown())
    .use(collections({
      posts: {},
      pages: {}
    }))
    .use(permalinks({
      pattern: ':title'
    }))
    .use(templates('handlebars'))
    .build();
};

doBuild();
