const {
    MongoClient
} = require("mongodb");
const {
    mongouri
} = require("../config");
const client = new MongoClient(mongouri);

const mongoObjectId = require("mongodb").ObjectId

const database = "barter";
const collection = "games";

/**
 * Gets all games from database and returns as object
 * @param {String} database Database to fetch from
 * @param {String} collection Collection to fetch from
 * @returns {[Object]} Returns array with objects of all games
 */
async function getDb() {
    try {
        await client.connect()
        const cursor = await client.db("barter").collection("games").find({});
        var allGames = await cursor.toArray()
    } catch (error) {
        console.log(error);
    } finally {
        await client.close();

        return allGames;
    }
}

/**
 * Gets all bundles from database and returns as object
 * @returns {[Object]} Returns array with objects of all games
 */
 async function getBundles() {
    try {
        await client.connect()
        const cursor = await client.db("barter").collection("bundle").find({});
        var allGames = await cursor.toArray()
    } catch (error) {
        console.log(error);
    } finally {
        await client.close();

        return allGames;
    }
}
/**
 * Get a single bundle and returns as object
 * @param {String} id id of bundle
 * @returns {Object} Returns the bundle
 */
 async function getBundle(id) {
    ids = new mongoObjectId(id)
    let doc = {
        _id: ids
    }
    try {        
        await client.connect()
        var bundle = await client.db("barter").collection("bundle").findOne(doc);                        
    } catch (error) {
        console.log(error);
    } finally {
        await client.close();

        return bundle;
    }
}

/**
 * Adds a game to MongoDB. 
 * 
 * @param {String} database The database to use
 * @param {String} collection The collection to insert the game into
 * @param {String} name Name of the game
 * @param {String} slug Slug from gameDB (evt forandre til SteamID)
 * @param {String} key Key
 */
async function addGame(database, collection, name, slug, key) {
    let doc = {
        name: name,
        slug: slug,
        key: key
    }
    try {
        await client.connect();
        const add = await client.db(database).collection(collection).insertOne(doc);
        console.log("Data added");
        console.table(doc);
        console.log("Data has id: " + add.insertedId);
    } catch (error) {
        console.log(error);
    } finally {
        await client.close();
    }
}
/**
 * Creates a new trade with all selected games, then removes those games from game collection
 * @param {Array} names Array of all game names
 * @param {Array} slugs Array of all game slugs
 * @param {Array} keys Array of all game keys
 * @param {Array} ids Array of all game IDs. These are used for deleting from game collection
 */
async function addTrade(names, slugs, keys, ids) {
    let doc = {
        name: names,
        slug: slugs,
        keys: keys,
        oldIds: ids
    }
    try {
        await client.connect();
        const add = await client.db("barter").collection("trade").insertOne(doc);
        console.log("Data added");
        console.table(doc);
        console.log("Data has id: " + add.insertedId);
        for (let x of doc.oldIds) {
            let deldoc = {
                _id: new mongoObjectId(String(x))
            }
            const remove = await client.db("barter").collection("games").deleteOne(deldoc)
            console.log("Game removed")
        }
    } catch (error) {
        console.log(error);
    } finally {
        await client.close();
    }
}
/**
 * Creates a new trade with all selected games, then removes those games from game collection
 * @param {String} title Title of the bundle
 * @param {String} recepient String of bundle-recepient
 * @param {String} message Optional message to recepient of bundle
 * @param {Array} names Array of all game names 
 * @param {Array} slugs Array of all game slugs
 * @param {Array} keys Array of all game keys
 * @param {Array} ids Array of all game IDs. These are used for deleting from game collection
 */
async function addBundle(title, recepient, message, names, slugs, keys, ids) {
    let doc = {
        title: title,
        recepient: recepient,
        message: message,
        name: names,
        slug: slugs,
        keys: keys,
        oldIds: ids
    }

    console.log(doc);
    
    try {
        await client.connect();
        const add = await client.db("barter").collection("bundle").insertOne(doc);
        console.log("Data added");
        console.table(doc);
        console.log("Data has id: " + add.insertedId);
        for (let x of doc.oldIds) {
            let deldoc = {
                _id: new mongoObjectId(String(x))
            }
            const remove = await client.db("barter").collection("games").deleteOne(deldoc)
            console.log("Game removed")
        }
    } catch (error) {
        console.log(error);
    } finally {
        await client.close();
    }
}

async function checkConnection() {
    try {
        await client.connect();
        await client.db(collection).command({
            ping: 1
        });
        console.log("Connected to mongoDB: " + collection);
    } catch (error) {
        console.log("Something went wrong: " + error);
    } finally {
        await client.close();
    }
}

exports.checkConnection = checkConnection;
exports.getDb = getDb;
exports.getBundles = getBundles;
exports.addGame = addGame;
exports.addTrade = addTrade;
exports.addBundle = addBundle;
exports.getBundle = getBundle;
