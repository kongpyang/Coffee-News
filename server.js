const express = require("express");
const exphbs = require('express-handlebars');
var mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
const db = require("./models");

const PORT = process.env.PORT || 3000;

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Hook mongoose configuration to the db variable
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//ROUTES

// Main route (simple Hello World Message)
app.get("/", function (req, res) {
    res.render("index");
})

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function (req, res) {

    // Make a request via axios for the news section of `ycombinator`
    axios.get("https://news.ycombinator.com/").then(function (response) {

        // Load the html body from axios into cheerio
        var $ = cheerio.load(response.data);

        var results = [];

        // For each element with a "title" class
        $(".title").each(function (i, element) {

            // Save the text and href of each link enclosed in the current element
            var title = $(element).children("a").text();
            var link = $(element).children("a").attr("href");
            // var summary = $(element).children("a").text();


            // If this found element had both a title and a link
            if (title && link) {

                // Insert the data in the Article db
                db.Article.create({
                    title: title,
                    link: link
                    // summary: summary
                })
                    .then(res.send("Scrape completed!!!"))
                    .catch(err => console.log(err))
            }
        });
    });
    // console.log(results);
});

app.get("/all", function (req, res) {
    db.Article.find({}, function (err, found) {
        if (err) {
            // Log the error if one is encountered during the query
            console.log(err);
        }
        else {
            // Otherwise, log the inserted data
            res.json(found);
        }
    })
});



// Server Listening
app.listen(PORT, function () {
    console.log("App running on port " + PORT);
});