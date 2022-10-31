const express = require("express");
const path = require("path");
const db = require("./src/db");
const rawg = require("./src/rawg")

const app = express();
const {port} = require("./config.js");

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(port, () => {
    console.log("Sørveren køyrer på http://localhost.com:" + port)
    db.checkConnection()
})


app.get("/getGames", async (req, res) => {
    res.send(await db.getDb("barter", "games"))
})

app.post("/submit", async (req, res) => {
    console.log(req.body)
    let name = req.body.name;
    let slug = req.body.slug;
    let key = [req.body.key];

    db.addGame("barter", "games", name, slug, key)
    res.redirect('back');
})

app.get("/searchRawg", async (req, res) => {
    let searchString = req.query.searchstring;
    let results = await rawg.getList(searchString)
    res.send(results)
})
