'use strict';

var posts, pages;

try {
  posts = require('../trello/posts.json');
  pages = require('../trello/pages.json');
} catch(err) {
  console.log('Whoops, where is the trello data?');
  process.exit();
}

var srcDir = __dirname + '/../../src';

var EOL = '\n' // We could use os.EOL but AFAIK js-yaml just uses '\n'
  , fs = require('fs')
  , join = require('path').join
  , after = require('lodash.after')
  , rimraf = require('rimraf')
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

  var content = data.desc;

  fs.writeFile(join(srcDir, fileName), [
    '---',
    yaml.dump(metaDoc),
    '---',
    content
  ].join(EOL), function(err) {
    /**
     * @todo Handle err better
     */
    if(err) { throw err; }
    cleanup();
  });
};

var makePost = function(data) {
  makeFile('post', data);
};

var makePage = function(data) {
  makeFile('page', data);
};


// Clean the source dir then make our pages/posts
rimraf(srcDir, function(err) {
  /**
   * @todo Handle err better?
   */
  if(err) { throw err; }
  fs.mkdir(srcDir, function(err) {
    /**
     * @todo Handle err better?
     */
    if(err) { throw err; }
    posts.forEach(makePost);
    pages.forEach(makePage);
  });
});
