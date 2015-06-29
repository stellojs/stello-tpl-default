
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
    , path = require('path')
    , utf8 = {encoding: 'utf8'};

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
        allCards.pages.map(function(c) {
          c.$$gutsPartial = 'page';
          return fs
            .mkdirAsync('...') // page fs-safe handle
            .then(function() {
              return fs.writeFileAsync('...'); // `dir`/index.html
            });
        }),
        allCards.posts.map(function(c) {
          c.$$gutsPartial = 'post';
          // return promise...
        })));
    };

    P.props({
      pages: stelloP.getCardsAsync('Pages'),
      posts: stelloP.getCardsAsync('Posts')
    })
    .then(writeCards);
  });
};
