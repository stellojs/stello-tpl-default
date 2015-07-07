
/**
 * The build routine
 *
 * Invoked by the stello harness when `stello build` is run
 *
 * @param {StelloCore} stello A stello instance
 * @param {Function} cb The callback
 */
exports.build = function build(stello, cb) {
  var P = require('bluebird')
    , fs = P.promisifyAll(require('fs'))
    , stelloP = P.promisifyAll(stello)
    , core = require('./lib/core.js')
    , initHbs = require('./lib/init-hbs.js');

  initHbs()
  .then(function(hbsTpl) {
    var writeCards = function(allCards) {
      return P.all([].concat(
        // Index page
        [
          (function(c) {
            c.$$gutsPartial = 'page';
            return fs.writeFileAsync(
              'index.html',
              hbsTpl(c)
            );
          }(allCards.pages[0]))
        ],
        // All pages
        allCards.pages.map(function(c) {
          c.$$gutsPartial = 'page';
          return fs
            .mkdirAsync(core.slugify(c.name)) // page fs-safe handle
            .then(function() {
              return fs.writeFileAsync(
                core.slugify(c.name) + '/index.html',
                hbsTpl(c)
              );
            });
        }),
        // Blog home
        [
          (function(posts) {
            var data = {
              $$gutsPartial: 'blog',
              title: 'Blog',
              posts: posts
            };
            return fs.writeFileAsync(
              'blog/index.html',
              hbsTpl(data)
            );
          }(allCards.posts))
        ],
        // All posts
        allCards.posts.map(function(c) {
          c.$$gutsPartial = 'post';
          return fs
            .mkdirAsync('blog/' + c.shortLink)
            .then(function() {
              return fs.writeFileAsync(
                'blog/' + c.shortLink + '/index.html',
                hbsTpl(c)
              );
            });
        })
      ));
    };

    var makeBlogDir = function(args) {
      return fs
        .mkdirAsync('blog')
        .then(function() {
          return args;
        });
    };

    P.props({
      pages: stelloP.getCardsAsync('Pages'),
      posts: stelloP.getCardsAsync('Posts')
    })
    .then(makeBlogDir)
    .then(writeCards)
    .finally(cb);
  });
};
