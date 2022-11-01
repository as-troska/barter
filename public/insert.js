let search = document.getElementById("inpSearch");
let btnSearch = document.getElementById("btnSearch");
let results = document.getElementById("results");
let imgLoading = document.getElementById("imgLoading");

imgLoading.style.visibility = "hidden";
imgLoading.src = "/img/loading.gif";
imgLoading.style.width = "40px";

btnSearch.style.visibility = "hidden";
btnSearch.addEventListener("click", searching)
search.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        btnSearch.click()
    }
})

function searching() {
    imgLoading.style.visibility = "visible";
    results.innerHTML = "";
    let searchTerm = search.value;
    let list = document.getElementById("list");        
    
    let url = "/searchRawg?searchstring=" + searchTerm;
    
    fetch(url)
    .then(response => response.json())
    .then(response => {
        imgLoading.style.visibility = "hidden";
        for(let x of response) {                    
            let element = document.createElement("li");
            element.innerText = x.name;
            element.className = "game";
            element.dataset.slug = x.slug;
            element.addEventListener("click", chooseGame)
            results.appendChild(element)
        }
    })
}

function chooseGame(evt) {
    let game = evt.target;
    let gameSlug = game.dataset.slug;
    let gameName = game.innerText;
    console.log(evt)
    console.log(game.innerText)
    console.log(game.dataset.slug)

    let form = document.getElementById("gameForm");
    form.innerHTML = "";

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
