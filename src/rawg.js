const {rawgkey} = require("../config.js");
const axios = require("axios");

/**
 * Function for getting up to ten matching results for search string from rawg.io
 * @param {string} searchString String to search for. May contain spaces
 * @returns JSON-data for up to ten games matching search string
 */
async function getList(searchString) {
    let url = "https://api.rawg.io/api/games?search=" + searchString + "&page=1&page_size=10&key=" + rawgkey + "&search_precise=true";

    try {
        const response = await axios.get(url)
        return response.data.results
    } catch(error) {
        console.error(error)
    }
}
/**
 * Function that gets gameInfo for a game from rawg.io, and then populates an object with said info and returns the object.
 * Also gets screenshots and adds these to screenshot array in object
 * @param {String} slug 
 * @returns {Object} Returns object with game info
 */
async function getGame(slug) {
    let url = "https://api.rawg.io/api/games/" + slug + "?key=" + rawgkey;

    let gameInfo = {};

    try {
        const response = await axios.get(url)        
        gameInfo.name = response.data.name;
        gameInfo.description = response.data.description;
        gameInfo.metacritic = response.data.metacritic;
        gameInfo.released = response.data.released;
        gameInfo.website = response.data.website;
        gameInfo.screenshots = [response.data.background_image];
        gameInfo.clip = response.data.clip;
        
        let screenUrl = "https://api.rawg.io/api/games/" + slug + "/screenshots?key=" + rawgkey;
        try {
            const response = await axios.get(screenUrl)
            console.log(response.data.results)
            for (let x of response.data.results) {
                gameInfo.screenshots.push(x.image)
            }
        }catch(error) {
            console.error(error)
        }
        return gameInfo

    } catch(error) {
        console.error(error)
    }  
}

exports.getList = getList;
exports.getGame = getGame;

