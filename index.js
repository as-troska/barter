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
})

app.post("/addTrade", async (req, res) => {
    await db.addTrade(req.body.names, req.body.slugs, req.body.keys, req.body.ids)    
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

app.get("/viewBundle", async (req, res) => {

})

app.get("/getBundles", async (req, res) => {

})

app.post("/addBundle", async (req, res) => {
    console.log(req.body)

    await db.addBundle(req.body.recepient, req.body.message, req.body.names, req.body.slugs, req.body.keys, req.body.oldIds)
    res.redirect("back");
})
