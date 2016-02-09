
'use strict';

/**
 * Get the path to our template files
 *
 * Should return an absolute path
 *
 * @return {String} The path
 */
exports.getTemplateDirectoryPath = function() {
  var path = require('path');
  return path.normalize(__dirname + '/templates');
};
