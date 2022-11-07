const express = require("express");
const path = require("path");
const db = require("./src/db");
const rawg = require("./src/rawg")
const {port} = require("./config.js");

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(port, () => {
    console.log("Server up at http://localhost.com:" + port)
    db.checkConnection()
})

app.get("/getGames", async (req, res) => {
    res.send(await db.getDb("barter", "games"))
})

app.post("/submit", async (req, res) => {
    let name = req.body.name;
    let slug = req.body.slug;
    let key = req.body.key;

    await db.addGame("barter", "games", name, slug, key)
    res.redirect('back');
})

app.post("/addTrade", async (req, res) => {
    db.addTrade(req.body.names, req.body.slugs, req.body.keys, req.body.ids)
    res.redirect('back');
})

app.get("/searchRawg", async (req, res) => {
    let searchString = req.query.searchstring;
    let results = await rawg.getList(searchString)
    res.send(results)
})

app.get("/gameRawg", async (req, res) => {
    let slug = req.query.slug;
    let result = await rawg.getGame(slug)
    res.send(result)
})

