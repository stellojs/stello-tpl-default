# Stello Template Starter

> A basic starter template for [Stello][stello-repo].

 
## Workspace Layout

Running `stello init` will add the following files and folders to your working
directory. Note that if you already have a `./src` folder in your working
directory it will be silently replaced.

```
+-- src/
|   +-- helpers/
|   |   +-- eachCard.js
|   |   +-- eachCardInList.js
|   |   +-- eachList.js
|   +-- partials/
|   +-- index-board.html.hbs
|   +-- index-card.html.hbs
|   +-- index-list.html.hbs
```

#### Breakdown

- `./src` - This is where all your stello working files live.
- `./src/helpers` - Stello will look in this folder for handlebars helpers. Each
  `*.js` file should be a node module that exports a single function. The
  function will be passed two arrays, the first containing a reference to each
  card on your board and the second containing a reference to each list.
- `./src/helpers/eachCard.js` - A block helper that will be registered as
  `eachCard`, use this helper to iterate through the cards on your board.  E.g.
  `{{#eachCard}} {{this.name}} {{/eachCard}}`. Note that this helper can be used
  from any context in your templates. 
- `./src/helpers/eachCardInList.js` - A block helper registered as
  `eachCardInList`, use this helper to iterate through the cards on a specific
  list of your board. You can ask for lists by name or id. E.g.
  `{{#eachCardInList 'Blog'}} {{markdown this.desc}} {{/eachCardInList}}`. Note
  that this helper can be used from any context in your templates.
- `./src/helpers/eachList.js` -  A block helper registered as `eachList`, use
  this helper to iterate through the lists on your board. Note that this helper
  can be used from any context in your templates. E.g. `{{#eachList}}
  {{this.name}} {{/eachList}}`.
- `./src/partials` - Stello looks in this folder for `*.hbs` files and creates a
  handlebars partial for each file it finds. The partial name will be the name
  of the file without an extension, the partial itself will just be the file
  contents.
- `./src/fancyCard.hbs` - A silly demo partial used by the list template.
- `./src/index-board.html.hbs` - Your board template, if Stello sees a file
  called `./src/index-board.*.hbs` it will use it as a handlebars template and
  provide it with all your board's data. This file contains a nice cheat sheet
  demonstrating what data and helpers are available.
- `./src/index-card.html.hbs` - Your card template, one file per card on your
  board will be created using this template.
- `./src/index-list.html.hbs` - Your list template, one file per list on your
  board will be created using this template.

## License

MIT

[stello-repo]: https://github.com/stellojs/stello
