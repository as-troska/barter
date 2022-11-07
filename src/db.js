const {
    MongoClient
} = require("mongodb");
const {
    mongouri
} = require("./config");
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
async function getDb(database, collection) {
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
exports.addGame = addGame;
exports.addTrade = addTrade;