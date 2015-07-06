
/**
 * Build routine helper to register handlebars helpers and partials
 *
 * @return {Promise} Resolves to compiled template
 */
module.exports = function() {
  var P = require('bluebird')
    , fs = P.promisifyAll(require('fs'))
    , Handlebars = require('handlebars')
    , kramed = require('kramed')
    , path = require('path')
    , utf8 = {encoding: 'utf8'};

  Handlebars.registerHelper('md', function(markup) {
    var html = kramed(markup);
    return new Handlebars.SafeString(html);
  });

  var tpl = function(p) {
    return path.join(__dirname, '../templates', p);
  };

  return P.props({
    layout: fs.readFileAsync(tpl('layouts/default.hbs'), utf8),
    page: fs.readFileAsync(tpl('partials/page.hbs'), utf8),
    post: fs.readFileAsync(tpl('partials/post.hbs'), utf8),
    blog: fs.readFileAsync(tpl('partials/blog.hbs'), utf8)
  })
  .then(function(results) {
    var layout = results.layout;
    Handlebars.registerPartial('page', results.page);
    Handlebars.registerPartial('post', results.post);
    Handlebars.registerPartial('blog', results.blog);
    return Handlebars.compile(layout);
  });
};
