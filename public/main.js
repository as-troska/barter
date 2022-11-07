let games = [];
let tradeButton = document.querySelector("#btnTrade");
let gameTable = document.getElementById("gameTable");

tradeButton.addEventListener("click", createTrade)

function drawMain() {
    let main = document.querySelector("main");
    main.style.display = "flex";
    let wrapper = document.querySelector("#insertWrapper");
    wrapper.style.display = "none";
    games = [];

    fetch("/getGames")
        .then((res) => res.json())
        .then((res) => {
            res.sort((a, b) => {
                a = a.name.toLowerCase()
                b = b.name.toLowerCase();

                if (a < b) {
                    return -1;
                }
                if (a > b) {
                    return 1;
                }
                return 0;
            });

            gameTable.innerHTML = "";
            for (let x of res) {
                games.push(x)
                console.log(x)
                let row = document.createElement("tr")
                let cellCheck = document.createElement("td")
                let cellName = document.createElement("td")
                let cellKey = document.createElement("td")
                let checkBox = document.createElement("input")

                checkBox.type = "checkbox";
                checkBox.name = x._id;

                cellCheck.appendChild(checkBox);
                row.appendChild(cellCheck)

                cellName.innerHTML = x.name;
                cellName.dataset.slug = x.slug;
                cellName.addEventListener("click", drawGame)
                row.appendChild(cellName)

                cellKey.innerHTML = x.key;
                row.appendChild(cellKey);

                gameTable.appendChild(row)
            }
        })
}

function drawInsert() {
    let oldMain = document.querySelector("main");
    oldMain.style.display = "none";
    let wrapper = document.querySelector("#insertWrapper");
    wrapper.style.display = "flex"
    wrapper.innerHTML = "";
    let main = document.createElement("main")
    main.className = ".mainInsert";
    wrapper.appendChild(main);

    let search = document.createElement("input");
    search.id = "inpSearch";
    search.className = "inputInsert";
    main.appendChild(search);

    let btnSearch = document.createElement("button");
    btnSearch.id = "btnSearch";
    btnSearch.innerHTML = "Search";
    btnSearch.style.visibility = "hidden";
    btnSearch.addEventListener("click", searching)
    search.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            btnSearch.click()
        }
    })
    main.appendChild(btnSearch)

    let results = document.createElement("ul");
    results.className = "inputUL";
    results.id = "results";
    main.appendChild(results)

    let imgLoading = document.createElement("img");
    imgLoading.id = "imgLoading";
    imgLoading.style.visibility = "hidden";
    imgLoading.src = "/img/loading.gif";
    imgLoading.style.width = "40px";
    main.appendChild(imgLoading)

    let form = document.createElement("form");
    form.class = "inputForm";
    form.method = "POST";
    form.action = "/submit";
    form.id = "gameForm";
    main.appendChild(form)
}

function searching() {
    let imgLoading = document.getElementById("imgLoading")
    let results = document.getElementById("results");
    let search = document.getElementById("inpSearch");

    imgLoading.style.visibility = "visible";
    results.innerHTML = "";

    let searchTerm = search.value;
    //let list = document.getElementById("list");        

    let url = "/searchRawg?searchstring=" + searchTerm;

    fetch(url)
        .then(response => response.json())
        .then(response => {
            imgLoading.style.visibility = "hidden";
            for (let x of response) {
                let element = document.createElement("li");
                element.innerText = x.name;
                element.className = "game";
                element.dataset.slug = x.slug;
                element.addEventListener("click", gameResults)
                results.appendChild(element)
            }
        })
}

function gameResults(evt) {
    let game = evt.target;
    let gameSlug = game.dataset.slug;
    let gameName = game.innerText;
    console.log(evt)
    console.log(game.innerText)
    console.log(game.dataset.slug)

    let form = document.getElementById("gameForm");
    form.innerHTML = "";
    form.className = "inputForm";


    let name = document.createElement("input");
    name.value = gameName;
    name.type = "text";
    name.name = "name";
    name.className = "addInput";
    name.readOnly = true;
    form.appendChild(name);

    form.appendChild(document.createElement("br"))

    let slug = document.createElement("input");
    slug.value = gameSlug;
    slug.type = "text";
    slug.name = "slug";
    slug.className = "addInput";
    slug.readOnly = true;
    form.appendChild(slug);

    form.appendChild(document.createElement("br"))

    let key = document.createElement("input");
    key.type = "text";
    key.name = "key";
    key.className = "addInput";
    form.appendChild(key)

    form.appendChild(document.createElement("br"))

    let submit = document.createElement("input");
    submit.type = "submit";
    submit.value = "Submit";
    submit.id = "btnSubmit"
    form.appendChild(submit)
}




function drawGame(evt) {
    slug = evt.target.dataset.slug
    fetch("/gameRawg?slug=" + slug)
        .then((res) => res.json())
        .then((res) => {
            let target = document.getElementsByTagName("article")[1]
            target.innerHTML = "";

            let heading = document.createElement("h1");
            heading.innerHTML = res.name;
            target.appendChild(heading);

            let infoPar = document.createElement("p");
            let released = document.createElement("span");
            let br = document.createElement("br");
            released.innerHTML = "<b>Released:</b> " + res.released;
            infoPar.appendChild(released);
            infoPar.appendChild(br);
            let metacritic = document.createElement("span");
            metacritic.innerHTML = "<b>Metacritic score:</b> " + String(res.metacritic);
            infoPar.appendChild(metacritic)
            target.appendChild(infoPar)

            let paragraph = document.createElement("p");
            paragraph.innerHTML = res.description;
            target.appendChild(paragraph);

            let imgContainer = document.querySelector("figure");
            imgContainer.innerHTML = "";
            if (res.screenshots[0] != null) {
                for (let x of res.screenshots) {
                    let image = document.createElement("img");
                    image.src = x;
                    image.className = "thumbnail"
                    image.dataset.size = "small";
                    image.addEventListener("click", fullSizeToggle)
                    imgContainer.appendChild(image)
                }
            }
        })
}


function fullSizeToggle(evt) {
    let image = evt.target
    if (image.dataset.size === "small") {
        image.className = "fullSizeOverlay"
        image.dataset.size = "full";
        console.log(evt.target)
    } else {
        image.className = "thumbnail";
        image.dataset.size = "small";
    }
}

function createTrade() {
    let checkboxes = document.querySelectorAll("input[type=checkbox]")
    let output = document.querySelector("details")
    let tradeText = document.createElement("p");
    tradeText.innerHTML = "This is an automated message: Here are my keys. If you haven't yet sent yours, just drop them here when you have the time. Please let me know if you have any issues, and we will work something out. I will close the trade and add +rep once your keys pass. Thanks for trading!"
    output.appendChild(tradeText);
    let tradeList = document.createElement("ul");

    let tradeObject = {
        names: [],
        slugs: [],
        keys: [],
        ids: []
    }

    for (let box of checkboxes) {
        if (box.checked) {
            for (let lookup of games) {
                if (box.name === lookup._id) {
                    let tradeGame = document.createElement("li")
                    tradeGame.innerHTML = lookup.name + ": " + lookup.key;
                    tradeList.appendChild(tradeGame);
                    tradeObject.names.push(lookup.name);
                    tradeObject.slugs.push(lookup.slug);
                    tradeObject.keys.push(lookup.key);
                    tradeObject.ids.push(lookup._id)
                }
            }
        }
    }

    console.log(tradeObject)
    output.appendChild(tradeList);

    let buttonFinish = document.createElement("button");
    buttonFinish.addEventListener("click", async () => {
        fetch("/addTrade", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tradeObject)
        }).then(res => {
            console.log("Request complete! response:", res);
        });
    })
    buttonFinish.innerHTML = "Finish trade";
    output.appendChild(buttonFinish)
    output.open = true;
}



let navHome = document.getElementById("navHome").addEventListener("click", drawMain)
let navAdd = document.getElementById("navAdd").addEventListener("click", drawInsert)

drawMain();