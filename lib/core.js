
function slugify(name) {
  return name.trim()
    .toLowerCase()
    .replace(/[^\w\d]+/, '-');
}

exports.slugify = slugify;
