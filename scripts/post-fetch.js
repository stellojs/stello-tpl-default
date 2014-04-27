'use strict';

var posts, pages;

try {
  posts = require('../.stello/trello/posts.json');
  pages = require('../.stello/trello/pages.json');
} catch(err) {
  console.log('Whoops, where is the trello data?');
  process.exit();
}

var fs = require('fs')
  , join = require('path').join
  , after = require('lodash.after');

var numFilesToWrite = posts.length + pages.length;

var cleanup = after(numFilesToWrite, function() {
  console.log('Done');
});

var makePost = function(pData) {
  var postFile = 'post-' + pData.id + '.md';
  /*code*/
  cleanup();
};

var makePage = function(pData) {
  var pageFile = 'page-' + pData.id + '.md';
  /*code*/
  cleanup();
};

posts.forEach(makePost);
pages.forEach(makePage);
