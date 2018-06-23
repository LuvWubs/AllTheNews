module.exports = function(app) {


  // Database configuration
  var databaseUrl = "scraper";
  var collections = ["scrapedData"];

  console.log(__dirname);
  app.use('/public', express.static(path.join(__dirname, '/public')));

  // Hook mongojs configuration to the db variable
  var db = mongojs(databaseUrl, collections);
  db.on("error", function(error) {
    console.log("Database Error:", error);
  });

  app.get('/all', function(req, res) {
    console.log('getting all articles');

  })

      app.get("/scrape", function(req, res) {
        console.log('scrape requested from api-routes')
        // // Make a request for the news section of `ycombinator`
        request("https://www.bbc.com/news", function(error, response, body) {

        //   console.log('req obj in scrape route: ');
        //   // Load the html body from request into cheerio
        // console.log(error)
        // console.log(response)
        // console.log(body)
          // var $ = cheerio.load(html);

          // console.log(cheerio);
        //   // For each element with a "title" class
        //   $(".headlines").each(function(i, element) {
        //     // Save the text and href of each link enclosed in the current element
        //     var title = $(element).children("a").text();
        //     console.log('title of article: ', title);
        //     var link = $(element).children("a").attr("href");
        //     console.log('link of article: ', link);
        //     console.log('is this werking???');
        //     // If this found element had both a title and a link
        //     if (title && link) {
        //       // Insert the data in the scrapedData db
        //       db.scrapedData.insert({
        //         title: title,
        //         link: link
        //       },
        //       function(err, inserted) {
        //         if (err) {
        //           // Log the error if one is encountered during the query
        //           console.log(err);
        //         }
        //         else {
        //           // Otherwise, log the inserted data
        //           console.log(inserted);
        //         }
        //       });
        //     }
        //   });
        });

        // Send a "Scrape Complete" message
        res.json(res);
      });



  // Main route (simple Hello World Message)
  // app.get("/", function(req, res) {
  //   res.send("Hello world");
  // });

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

  app.get('/articles/:query', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/public/articles.html'))
  });

  /* -/-/-/-/-/-/-/-/-/-/-/-/- */


};
