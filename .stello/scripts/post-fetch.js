'use strict';

var posts, pages;

try {
  posts = require('../../.stello/trello/posts.json');
  pages = require('../../.stello/trello/pages.json');
} catch(err) {
  console.log('Whoops, where is the trello data?');
  process.exit();
}

var fs = require('fs')
  , join = require('path').join
  , after = require('lodash.after')
  , yaml = require('js-yaml');

var numFilesToWrite = posts.length + pages.length;

var cleanup = after(numFilesToWrite, function() {
  console.log('Done');
});

var makeFile = function(type, data) {
  var fileName = type + '-' + data.id + '.md';

  var metaDoc = {
    id: data.id,
    title: data.name,
    collection: type,
    labels: data.labels,
    position: data.pos,
    trello: {
      url: data.url
    }
  };

  var content = data.description;

  /**
   * @todo Write combined contents to file
   */

  cleanup();
};

var makePost = function(data) {
  makeFile('post', data);
};

var makePage = function(data) {
  makeFile('page', data);
};

/**
 * @todo Clean src folder
 */

posts.forEach(makePost);
pages.forEach(makePage);

