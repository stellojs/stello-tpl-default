'use strict';

var Metalsmith = require('metalsmith')
  , metalsmith = new Metalsmith(__dirname + '/../..');

var markdown = require('metalsmith-markdown')
  , permalinks = require('metalsmith-permalinks')
  , templates = require('metalsmith-permalinks')
  , collections = require('metalsmith-collections');

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
