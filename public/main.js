let games = [];
let tradeButton = document.querySelector("#btnTrade");
let bundleButton = document.querySelector("#btnBundle");
let gameTable = document.getElementById("gameTable");
let navHome = document.getElementById("navHome").addEventListener("click", drawMain);
let navAdd = document.getElementById("navAdd").addEventListener("click", drawInsert);
let navBundles = document.getElementById("navBundles").addEventListener("click", drawBundles);
tradeButton.addEventListener("click", createTrade);
bundleButton.addEventListener("click", createBundle);
drawMain();


//*******************************************
// FUNCTIONS RELATED TO THE MAIN VIEW
//*******************************************

/**
 * A function to draw the main game table. Removes everything else first, and redraws.
 */
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

/**
 * Function for fetching game info from rawg.io and rendering it in the right hand view.
 * @param {*} evt Click event. Needed to figure out which game was clicked
 */
function drawGame(evt) {
    let target = document.getElementsByTagName("article")[1]
    target.innerHTML = "";
    let imgContainer = document.querySelector("figure");
    imgContainer.innerHTML = "";
    let imgLoading = document.createElement("img");
    imgLoading.id = "imgLoading";
    //imgLoading.style.visibility = "hidden";
    imgLoading.src = "/img/loading.gif";
    imgLoading.style.width = "40px";
    document.getElementsByTagName("article")[1].appendChild(imgLoading)

    let figimgLoading = document.createElement("img");
    figimgLoading.id = "figimgLoading";
    //figimgLoading.style.figvisibility = "hidden";
    figimgLoading.src = "/img/loading.gif";
    figimgLoading.style.width = "40px";
    document.querySelector("figure").appendChild(figimgLoading)

    slug = evt.target.dataset.slug

    fetch("/gameRawg?slug=" + slug)
        .then((res) => res.json())
        .then((res) => {
            imgLoading.style.display = "none";
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

/**
 * Function for toggling fullsize/thumbnail screenshots 
 * @param {*} evt Click event needed to figure out which screenshot was clicked
 */
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

/**
 * Function for looping through the checkboxes and adding checked games to a trade. Eventlistener added to button, that once clicked saves the trade to db, and then removes games db.
 */
function createTrade() {
    let checkboxes = document.querySelectorAll("input[type=checkbox]")
    let output = document.querySelector("details")
    output.innerHTML = "";
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
        }).then(res => {
            location.reload();
        });
    })
    buttonFinish.innerHTML = "Finish trade";
    output.appendChild(buttonFinish)
    output.open = true;
}
/**
 * Function for looping through the checkboxes and adding the checked keys to a hidden form. Two input fields are then generated, where the user may put the name of recepient, as well as a message.
 */
function createBundle() {
    let checkboxes = document.querySelectorAll("input[type=checkbox]");
    let container = document.querySelector("details");
    container.innerHTML = ""
    let output = document.createElement("form");
    output.innerHTML = "";
    output.method = "POST";
    output.action = "/addBundle"
    let bundleText = document.createElement("p");
    bundleText.innerHTML = "";
    bundleText.innerHTML = "The following games will be added to your custom bundle. Please fill inn recepient of bundle, as well as a short message to be displayed"
    output.appendChild(bundleText);
    let tradeList = document.createElement("ul");

    let tradeObject = {
        recepient: "",
        message: "",
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
                    let formName = document.createElement("input");
                    formName.value = lookup.name
                    formName.type = "hidden";
                    formName.name = "names[]";
                    output.appendChild(formName);
                    let formSlug = document.createElement("input");
                    formSlug.value = lookup.slug
                    formSlug.type = "hidden";
                    formSlug.name = "slugs[]";
                    output.appendChild(formSlug);
                    let formKey = document.createElement("input");
                    formKey.value = lookup.key
                    formKey.type = "hidden";
                    formKey.name = "keys[]";
                    output.appendChild(formKey);
                    let formIds = document.createElement("input");
                    formIds.value = lookup._id
                    formIds.type = "hidden";
                    formIds.name = "oldIds[]";
                    output.appendChild(formIds);
                }
            }
        }
    }
    container.appendChild(tradeList);

    let inpTitle = document.createElement("input");
    inpTitle.type = "text";
    inpTitle.name = "title";
    inpTitle.required = "true";
    inpTitle.value = "Title of bundle"
    output.appendChild(inpTitle)

    let break1 = document.createElement("br");
    output.appendChild(break1);

    let inpRecepient = document.createElement("input");
    inpRecepient.type = "text";
    inpRecepient.name = "recepient";
    inpRecepient.required = "true";
    inpRecepient.value = "Recepient of bundle"
    output.appendChild(inpRecepient)

    let break2 = document.createElement("br");
    output.appendChild(break2);

    let inpMessage = document.createElement("input");
    inpMessage.type = "text";
    inpMessage.name = "message"
    inpMessage.value = "Message to the recepient (Optional)"
    output.appendChild(inpMessage);

    let break3 = document.createElement("br");
    output.appendChild(break3);

    let buttonFinish = document.createElement("input");
    buttonFinish.type = "Submit";
    buttonFinish.value = "Create bundle"
    output.appendChild(buttonFinish)

    container.appendChild(output);

    container.open = true;
}



//***************************************************
// FUNCTIONS FOR DRAWING THE ADD-KEY VIEW
//***************************************************

/**
 * Function for drawing the first inputfield, used for searching the rawg.io database.
 */
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

/**
 * Function for actually searching the rawg.io database. Displays loading gif while waiting.
 */
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

/**
 * Function for adding the fetched game info to the newly displayed insert fields.
 * @param {*} evt Needed to figure out which search-result was clicked.
 */
function gameResults(evt) {
    let game = evt.target;
    let gameSlug = game.dataset.slug;
    let gameName = game.innerText;

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

//***************************************************
// FUNCTIONS FOR DRAWING THE BUNDLES VIEW
//***************************************************

function drawBundles() {
    let container = document.querySelectorAll("article")[1];
    container.innerHTML = "";
    let figure = document.querySelector("figure");
    figure.innerHTML = "";

    fetch("/getBundles")
    .then((res) => res.json())
    .then((res) => {
        res.reverse();
        console.log(res);

        for (let x of res) {
            let bundle = document.createElement("fieldset");
            let bundleName = document.createElement("legend");
            bundleName.innerText = '"' + x.title + '" - A bundle for ' + x.recepient;
            
            let games = document.createElement("ul");
            
            for (let y of x.name) {
                let game = document.createElement("li");
                game.innerText = y;
                games.appendChild(game);
            
            }

            let link = document.createElement("a");
            link.href = "/bundle?id=" + x._id;
            link.target = "_blank";
            link.innerText = "Link to bundle";

            
            bundle.appendChild(bundleName);
            bundle.appendChild(games);            
            bundle.appendChild(link);
            container.appendChild(bundle);          

        }
    })

}