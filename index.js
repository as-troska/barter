const express = require("express");
const path = require("path");
const db = require("./src/db");
const rawg = require("./src/rawg")
const {port} = require("./config.js");
const {cookieKey} = require("./config.js");
const {adminPassword} = require("./config.js");
const session = require('express-session');


const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
        secret:cookieKey,
        name:'bartering',
        saveUninitialized:false,
        resave:true
    })
); 

function securityCheck(req, res, next) {
    if(req.session.loggedIn) {
        next()
    } else {
        res.redirect("/login.html")
    }
}

app.listen(port, () => {
    console.log("Server up at http://localhost.com:" + port)
    db.checkConnection()
})

app.get("/", securityCheck, (req, res) => {
    res.redirect("main.html")
}) 

app.get("/getGames", securityCheck, async (req, res) => {
    res.send(await db.getDb("barter", "games"))
})

app.post("/submit", securityCheck, async (req, res) => {
    let name = req.body.name;
    let slug = req.body.slug;
    let key = req.body.key;

    await db.addGame("barter", "games", name, slug, key)   
})

app.post("/addTrade", securityCheck, async (req, res) => {
    await db.addTrade(req.body.names, req.body.slugs, req.body.keys, req.body.ids);
    res.redirect("back");
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
    let id = req.query.id;
    res.send(await db.getBundle(id))    
})

app.get("/bundle", async (req, res) => {
    const id = req.query.id;    
    res.redirect("bundle.html?id=" + id)    
})

app.get("/getBundles", securityCheck, async (req, res) => {
    let bundles = await db.getBundles()
    res.send(bundles)
})

app.post("/addBundle", securityCheck, async (req, res) => {
    console.log(req.body)

    await db.addBundle(req.body.title, req.body.recepient, req.body.message, req.body.names, req.body.slugs, req.body.keys, req.body.oldIds)
    res.redirect("back");
})

app.post("/login", (req, res) => {
    let password = req.body.password;

    if (password === adminPassword) {
        req.session.loggedIn = true;
        res.redirect("/main.html");
    }
})
