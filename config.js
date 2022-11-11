const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    port: process.env.PORT,
    apiurl: process.env.APIURL,
    apikey: process.env.APIKEY, 
    steamid: process.env.STEAMID,
    mongouri: process.env.MONGOURI,
    rawgkey: process.env.RAWGKEY,
    cookieKey: process.env.COOKIEKEY,
    adminPassword: process.env.ADMINPASSWORD
}


//COOKIEKEY=47069666
//ADMINPASSWORD="laks"
