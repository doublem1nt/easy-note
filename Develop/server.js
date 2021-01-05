// dependencies
const express = require("express");
const fs = require("fs");
const path = require("path");
const database = require("./db/db.json");

// Express Application Set up
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.static("public"));


// data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// ================== // ROUTES // ================== //

// homepage or "index.html" displays on page load
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});


// Notes 
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"))
})

// ================== // API functionality // ================== //
// ==================== (GET, POST, DELETE) ==================== //

app.route("/api/notes").get(function(req,res) {
    res.json(database)
});

app.route("/api/notes").post(function(req, res) {
    
    let jsObj = path.join(__dirname, "/db/db.json");
    let userNote = req.body;

    let leadId = 1;
        // loops through all JSON objects to grab largest ID and resets it to leadID
        for (let i = 0; i < database.length; i++) {
            let currentNote = database[i];

            if (currentNote.id > leadId) {
               
               leadId = currentNote.id;
            }
        }
    // Sets new ID of users newly submitted note
    userNote.id = leadId + 1;
    // Push into our database array
    database.push(userNote);
    
    // writes newly updated database and consoles out success
    fs.writeFile(jsObj, JSON.stringify(database), function(err){

        if (err) {
            return console.log(err);
        }
        console.log("Note received & saved.")

    })
    res.json(userNote);

});

// ID dictates the path for note deletion
app.delete("/api/notes/:id", function (req, res) {
    let jsObj = path.join(__dirname, "/db/db.json");
    // 
    for (let i = 0; i < database.length; i++) {

        // loops through all database JSON objects to locate the matching ID
        if (database[i].id == req.params.id) {
            // Once database
            database.splice(i, 1);
            break;
        }
    }

    fs.writeFileSync(jsObj, JSON.stringify(database), function (err) {

        if (err) {
            return console.log(err);
        } else {
            console.log("Your note was deleted!");
        }
    });
    res.json(database);
});


// server listener set up
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
