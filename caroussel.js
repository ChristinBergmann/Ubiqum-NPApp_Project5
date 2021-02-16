///------------builds carousel and fills content-------------/////
let carousel = document.getElementById("carouselID");
for (let i = 0; i < result.data.length; i++) {
    for (let x = 0; x < result.data[i].images.length; x++) {
        let a = document.createElement("a");
        a.setAttribute("class", "carousel-item");
        let p = document.createElement("p");
        p.setAttribute("class", "nameImg");
        p.innerHTML = result.data[i].name;
        let img = document.createElement("img");
        img.src = result.data[i].images[x].url;

        a.appendChild(img)
        a.appendChild(p)
        carousel.appendChild(a)
    }
}
M.AutoInit();

// let div = document.getElementById('secondPage');
// while (div.firstChild && div.removeChild(div.firstChild));