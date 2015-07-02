
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
    , Handlebars = require('handlebars')
    , kramed = require('kramed')
    , path = require('path')
    , core = require('./lib/core.js')
    , utf8 = {encoding: 'utf8'};

  Handlebars.registerHelper('md', function(markup) {
    var html = kramed(markup);
    return new Handlebars.SafeString(html);
  });

  var tpl = function(p) {
    return path.join(__dirname, 'templates', p);
  };

  P.props({
    layout: fs.readFileAsync(tpl('layouts/default.hbs'), utf8),
    page: fs.readFileAsync(tpl('partials/page.hbs'), utf8),
    post: fs.readFileAsync(tpl('partials/post.hbs'), utf8)
  })
  .then(function(results) {
    var layout = results.layout;
    Handlebars.registerPartial('page', results.page);
    Handlebars.registerPartial('post', results.post);

    var hbsTpl = Handlebars.compile(layout);

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
