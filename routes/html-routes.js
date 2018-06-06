var path = require('path');

module.exports = function(app) {

  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../assets/public/main.html'));
  });

  app.get('/articles/saved', function(req, res) {
    res.sendFile(path.join(__dirname, '../assets/public/articles.html'))
  });

};
