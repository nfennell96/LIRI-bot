require("dotenv").config();

const keys = require('./keys.js');
const Spotify = require('node-spotify-api');
const request = require('request');
const moment = require('moment');
const fs = require('fs');
const inquirer = require("inquirer");

const spotify = new Spotify(keys.spotify);

inquirer.prompt([

    {
        type: "list",
        name: "firstCommand",
        message: "What do you want to do?",
        choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
    },

    {
        type: "input",
        name: "secondCommand",
        message: "What do you want to Search?",
    },

]).then(function (command) {

    let firstCommand = command.firstCommand;
    let secondCommand = command.secondCommand;

    function mainSwitch() {
        switch (firstCommand) {
    
            case 'concert-this':
                conertThis();
                break;
    
            case 'spotify-this-song':
                spotifyFind();
                break;
    
            case 'movie-this':
                movieThis();
                break;
    
            case 'do-what-it-says':
                doWhatItSays();
                break;
    
        }
    }

    function spotifyFind() {
        console.log(`Starting Spotify Search`);

        if (secondCommand === undefined) {
            secondCommand = "The Sign Ace of Base";
        }

        spotify.search({ type: 'track', query: `${secondCommand}` }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Song: " + data.tracks.items[0].name);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Preview Here: " + data.tracks.items[0].preview_url);

        });
    }

    function conertThis() {
        console.log(`Starting Concert Search`);
        const searchConcert = `https://rest.bandsintown.com/artists/${secondCommand}/events?app_id=codingbootcamp`

        request(searchConcert, function (err, response, data) {
            if (!err && response.statusCode == 200) {
                const obj = JSON.parse(data);
                const formatDate = moment(obj[0].datetime).format('LLL')

                console.log(`Venue Name: ${obj[0].venue.name}`);
                console.log(`Venue City: ${obj[0].venue.city}`);
                console.log(`Event Date: ${formatDate}`);
            }
        })

    }

    function movieThis() {
        console.log(`Starting Movie Search`);
        if (secondCommand === undefined) {
            secondCommand = "Mr. Nobody";
        }

        var movieSearch = `http://www.omdbapi.com/?apikey=trilogy&t=${secondCommand}&r=json`;

        request(movieSearch, function (err, response, data) {
            if (!err && response.statusCode == 200) {
                const rottenTomatoes = JSON.parse(data)['Ratings'];

                console.log(`Title: ${JSON.parse(data)['Title']}`);
                console.log(`Year: ${JSON.parse(data)['Year']}`);
                console.log(`IMDB Rating: ${JSON.parse(data)['imdbRating']}`);
                console.log(`Rotten Tomatoes Rating: ${rottenTomatoes[1].Value}`);
                console.log(`Country: ${JSON.parse(data)['Country']}`);
                console.log(`Language: ${JSON.parse(data)['Language']}`);
                console.log(`Actors : ${JSON.parse(data)['Actors']}`);
            }
        })

    }

    function doWhatItSays() {
        console.log(`Starting Random Search`);
        fs.readFile("random.txt", "utf8", function (err, data) {
            if (err) {
                console.log(err);
            } else {
                const dataArray = data.split(',');
                firstCommand = dataArray[0];
                secondCommand = dataArray[1];

                for (i = 2; i < dataArray.length; i++) {
                    secondCommand = secondCommand + "+" + dataArray[i];
                }

                mainSwitch();
            }
        })
    }

    mainSwitch();


});

