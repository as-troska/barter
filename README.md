BARTERDB
========

Barterdb is a simple steam key organizer, for keeping track of the spare keys that keep accumulating after spending way to much money on bundles. 
It lets you create trades, for simple and fast trading on barter.vg (No api integration, though [yet...])
As a bonus feature, the application also has as bundle generator, for generating bundles for your friends.

Tech
----
The app is mainly built as a learning project, where I set out to get better with Node.js, Express and MongoDB. I've used the rawg.io-api for fetching game information and screenshots.

Installation
------------
You need a .env file with the following fields:
MONGOURI= "Your mongo connection string"
PORT= Port number for the app
RAWGKEY= "Your rawg.io api key"
COOKIEKEY= "Just some random numbers for generating your cookies" (I'm not even sure I use this anymore ;)
ADMINPASSWORD=" "A password for getting a session"

Dockerfile is included

Disclaimer
----------
As mentioned, this is a learning project, so there probably are some security flaws. In other words: Don't blame me if all your keys are stolen!
