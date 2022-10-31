const {MongoClient} = require("mongodb");
const {mongouri} = require("./config");
const client = new MongoClient(mongouri);

const database = "barter";
const collection = "games";


async function refreshKeys(req, res) {


}

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
        console.log(allGames)
        return allGames;
    }
}

/**
 * Adds a game to MongoDB. If game exists, only adds keys to key-array
 * 
 * @param {String} database The database to use
 * @param {String} collection The collection to insert the game into
 * @param {String} name Name of the game
 * @param {String} slug Slug from gameDB (evt forandre til SteamID)
 * @param {[String]} keys Array of keys. Note to use array, even if only one key exists.
 */

async function addGame(database, collection, name, slug, keys) {
    let doc = {
        name: name,
        slug: slug,
        keys: keys
    }

    try {
        await client.connect();
        const find = await client.db(database).collection(collection).findOne({
            name: name
        })

        if (find != null) {
            const update = {
                $push: {
                    keys: {
                        $each: keys
                    }
                }
            }
            const addKeys = await client.db(database).collection(collection).updateOne({
                name: name
            }, update)
            console.log("Keys added to existing game")
        } else {
            const add = await client.db(database).collection(collection).insertOne(doc);
            console.log("Data added");
            console.table(doc);
            console.log("Data has id: " + add.insertedId);
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

//addGame(database, collection, "Monkey Island", "monkey-island", ["key1", "key2"])
//addGame(database, collection, "Monkey Island 2", "monkey-island2", ["key1", "key2"])
//addGame(database, collection, "Doom II", "doom-ii", "sldfn2.-234-23")
//getDb("barter", "games");


exports.refreshKeys = refreshKeys;
exports.checkConnection = checkConnection;
exports.getDb = getDb;
exports.addGame = addGame;