const {rawgkey} = require("../config.js");
const axios = require("axios");

async function getList(searchString) {
    let url = "https://api.rawg.io/api/games?search=" + searchString + "&page=1&page_size=10&key=" + rawgkey + "&search_precise=true";

    try {
        const response = await axios.get(url)
        return response.data.results
    } catch(error) {
        console.error(error)
    }
}

exports.getList = getList;

