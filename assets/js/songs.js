const difficulties = [
    "EASY",
    "NORMAL",
    "HARD",
    "EXPERT"
];

const FADE_TIME = 3000;
const PAUSE_TIME = 1000;

const songs = [];

const btnSearch = document.getElementById("btnSearch");
const txtFilter = document.getElementById("txtFilter");
const container = document.getElementById('main-container');

const initialize = () => {
    fetch('../assets/files/songs-list.json')
        .then(response => response.json())
        .then(list => {
            list.forEach((element) => {
                songs.push(element);
            });
            showSongs(songs);
        })
        .catch(err => console.error(err));
}

const showSongs = (list) => {
    container.innerHTML = "";

    list.forEach((element) => {
        if (element.available) {
            const songDiv = createElement("div", "songDiv");
            const descriptionDiv = createElement("div", "descriptionDiv");
            const songName = createElement("p", "songName", element.name);
            const songArtist = createElement("p", "songArtist", element.artist);
            const songDifficulty = createElement("p", "songDifficulty", difficulties[element.difficulty - 1]);

            const songImg = document.createElement('img');
            songImg.src = element.image;

            songDiv.append(songImg);
            songDiv.append(descriptionDiv);
            descriptionDiv.append(songName);
            descriptionDiv.append(songArtist);
            descriptionDiv.append(songDifficulty);
            container.append(songDiv);
        }
    });
}

const filterSongs = () => {
    const textValue = txtFilter.value.toLowerCase();
    const newList = songs.filter(x => x.name.toLowerCase().includes(textValue) || x.artist.toLowerCase().includes(textValue));
    showSongs(newList);
}

const createElement = (element, className, htmlText = null) => {
    const newElement = document.createElement(element);
    newElement.classList.add(className);
    if (htmlText != null) newElement.innerHTML = htmlText;
    return newElement;
}

initialize();

txtFilter.addEventListener("keydown", (event) => {
    if(event.key === "Enter") filterSongs();
})
btnSearch.addEventListener("click", filterSongs);