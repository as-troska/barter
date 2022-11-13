const url = window.location.search;
const params = new URLSearchParams(url);
const id = params.get("id");

const games = [];
const info = {
    title: null,
    message: null,
    recepient: null
}

async function populateGames() {
    fetch("/viewBundle?id=" + id)
        .then((res) => res.json())
        .then((res) => {
            info.title = res.title;
            info.message = res.message;
            info.recepient = res.recepient;

            for (let x = 0; x < res.name.length; x++) {
                let game = {
                    name: res.name[x],
                    slug: res.slug[x],
                    key: res.keys[x],
                    info: null
                }

                fetch("/gameRawg?slug=" + res.slug[x])
                    .then((res) => res.json())
                    .then((res) => {
                        game.info = res
                    })
                games.push(game);
            }
        })
}

async function drawSite() {
    await populateGames();

    document.title = info.title;


    for (let game of games) {
        
    }
}

drawSite();