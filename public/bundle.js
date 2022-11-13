const url = window.location.search;
const params = new URLSearchParams(url);
const id = params.get("id");
const navList = document.querySelector("#navList");
const main = document.querySelector("main");
const article = document.querySelector("article");
const figure = document.querySelector("figure");
const header = document.querySelector("header");

const games = [];
const info = {
    title: null,
    message: null,
    recepient: null
}

async function drawSite() {
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
                    metacriticURL: "https://www.metacritic.com/game/pc/" + res.slug[x],
                    info: null
                }

                fetch("/gameRawg?slug=" + res.slug[x])
                    .then((res) => res.json())
                    .then((res) => {
                        game.info = res
                    })

                games.push(game);

                let index = games.findIndex(x => x.name === game.name);

                console.log(index);

                let navPunkt = lag("li");
                navPunkt.innerHTML = game.name;
                navPunkt.dataset.index = index;
                navPunkt.addEventListener("click", () => {
                    drawGame(index);
                })

                navList.appendChild(navPunkt);


            }
            let title = lag("h1");
            title.innerText = res.title;
            header.appendChild(title);
            let recepient = lag("p");
            recepient.innerHTML = res.recepient + "!";
            header.appendChild(recepient);
            let message = lag("p");
            message.innerHTML = res.message;
            header.appendChild(message);

        })
}

drawSite();

function lag(type) {
    let element = document.createElement(type);
    return element;
}

function drawGame(index) {
    header.innerHTML = "";

    let game = games[index];
    console.log(game)
    article.innerHTML = "";
    figure.innerHTML = "";

    let heading = lag("h1");
    heading.innerText = game.name;
    article.appendChild(heading);

    let activateButton = lag("button");
    activateButton.addEventListener("click", () => {
        window.open("https://store.steampowered.com/account/registerkey?key=" + game.key, "_blank")
    })
    activateButton.innerHTML = "Activate game";
    article.appendChild(activateButton);

    let released = lag("span");
    released.innerHTML = "<b>Released:</b> " + game.info.released;
    article.appendChild(released)



    if (game.info.metacritic != null) {
        let metacritic = lag("span");
        metacritic.innerHTML = "<a href=" + game.metacriticURL + "><b>Metacritic:</b> " + game.info.metacritic;
        article.appendChild(metacritic);
    }

    let info = lag("p");
    info.innerHTML = game.info.description;

    article.appendChild(info);



    for (let screen of game.info.screenshots) {
        let image = lag("img");
        image.src = screen;
        image.className = "thumbnail"
        image.dataset.size = "small";
        image.addEventListener("click", fullSizeToggle)
        figure.appendChild(image)
    }


}

function fullSizeToggle(evt) {
    let image = evt.target
    if (image.dataset.size === "small") {
        image.className = "fullSizeOverlay"
        image.dataset.size = "full";
    } else {
        image.className = "thumbnail";
        image.dataset.size = "small";
    }
}