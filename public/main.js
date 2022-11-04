let games = [];
let gameTable = document.getElementById("gameTable");

fetch("/getGames")
    .then((res) => res.json())
    .then((res) => {
        for (let x of res) {
            games.push(x)
            console.log(x)
            let row = document.createElement("tr")
            let cellCheck = document.createElement("td")
            let cellName = document.createElement("td")
            let cellKey = document.createElement("td")
            let checkBox = document.createElement("input")
            
            checkBox.type = "checkbox";
            checkBox.name = "x.slug";

            cellCheck.appendChild(checkBox);
            row.appendChild(cellCheck)

            cellName.innerHTML = x.name;
            cellName.dataset.slug = x.slug;
            cellName.addEventListener("click", drawGame)
            row.appendChild(cellName)

            cellKey.innerHTML = x.keys[0];
            row.appendChild(cellKey);

            gameTable.appendChild(row)              
                             
            
        }
    })


function drawGame(evt) {
    slug = evt.target.dataset.slug
    fetch("/gameRawg?slug=" + slug)
    .then((res) => res.json())
    .then((res) => {
        console.log(res)
        
        let target = document.getElementsByTagName("article")[0]
        target.innerHTML = "";
        
        let heading = document.createElement("h1");
        heading.innerHTML = res.name;
        target.appendChild(heading);

        let infoPar = document.createElement("p");
        let released = document.createElement("span");
        let br = document.createElement("br");
        released.innerHTML = "Released: " + res.released;
        infoPar.appendChild(released);
        infoPar.appendChild(br);
        let metacritic = document.createElement("span");
        metacritic.innerHTML = "Metacritic score: " + String(res.metacritic);
        infoPar.appendChild(metacritic)
        target.appendChild(infoPar)
        
        let paragraph = document.createElement("p");
        paragraph.innerHTML = res.description;
        target.appendChild(paragraph);

        let imgContainer = document.querySelector("figure");
        imgContainer.innerHTML = "";
        if(res.screenshots[0] != null) {
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
    if(image.dataset.size === "small") {
        image.className = "fullSizeOverlay"
        image.dataset.size = "full";
        console.log(evt.target)
    }
}