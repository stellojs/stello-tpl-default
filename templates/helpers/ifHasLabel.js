'use strict';

module.exports = function() {
  return function(str, options) {
    var labels = this.labels
      , idLabels = this.idLabels
      , ix;

    for(ix = labels.length; ix--;) {
      if(labels[ix].name === str) {
        if(~idLabels.indexOf(labels[ix].id)) {
          return options.fn(this);
        }
      }
    }

    return '';
  };
};
