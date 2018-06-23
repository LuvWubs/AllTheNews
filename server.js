// Using the tools and techniques you learned so far,
// you will scrape a website of your choice, then place the data
// in a MongoDB database. Be sure to make the database and collection
// before running this exercise.

// Consult the assignment files from earlier in class
// if you need a refresher on Cheerio.

// Dependencies
var express = require("express");
// var mongojs = require("mongojs");
// var logger = require("morgan");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
var axios = require("axios");
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");

// Require all models
// var db = require("./models");
var PORT = 3080;

// Initialize Express
var app = express();

// Use morgan logger for logging requests
// app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
// Connect to the Mongo DB

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


// // Database configuration
// var databaseUrl = "allTheNews";
// var collections = ["Articles"];

console.log(__dirname);
app.use('/public', express.static(path.join(__dirname, '/public')));
// app.use("models");

// Hook mongojs configuration to the db variable
// var db = mongojs(databaseUrl, collections);
// db.on("error", function(error) {
//   console.log("Database Error:", error);
// });
// Require all models
var db = require("./models");


app.get("/articles", function(req, res) {
  console.log('scrape requested from server')
  // // Make a request for the news section of `ycombinator`
  request("https://futurism.com/robotsmachines/", function(error, response, body) {

      var $ = cheerio.load(response.body);
      // console.log('response.body: ', response.body);
      // Now, we grab every h2 within an article tag, and do the following:
      $("h3 a").each(function(i, element) {

        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.number = i + 1;
        result.title = element.attribs.title;
        result.link = element.attribs.href;
        console.log('result obj: ', result);

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {

            // View the added result in the console
            // console.log('these are the scraped articles: ', dbArticle);
            console.log('these are the results: ', result);
            $('#articles').append(result);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
      });

    // Send a "Scrape Complete" message
    res.send('scrape completed');
  });
});

// TODO: make two more routes
app.get("/all", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.scrapedData.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});

// Route 1
// =======
// This route will retrieve all of the data
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, './public/views/main.html'));
});

app.use(express.static('public'));

// Route 2
// =======
// When you visit this route, the server will
// scrape data from the site of your choice, and save it to
// MongoDB.
// TIP: Think back to how you pushed website data
// into an empty array in the last class. How do you
// push it into a MongoDB collection instead?

app.get('/articles/saved', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/public/articles.html'))
});
//
// app.get('/articles/:query', function(req, res) {
//   res.sendFile(path.join(__dirname, '../public/public/articles.html'))
// });

/* -/-/-/-/-/-/-/-/-/-/-/-/- */

// Listen on port 3000
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
