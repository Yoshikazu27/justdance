const difficulties = [
    "EASY",
    "NORMAL",
    "HARD",
    "EXPERT"
];

const songs = [];

const btnSearch = document.getElementById("btnSearch");
const txtFilter = document.getElementById("txtFilter");
const container = document.getElementById('main-container');

const initialize = () => {
    fetch('./assets/files/songs-list.json')
        .then(response => response.json())
        .then(list => {
            list.forEach((element) => {
                if (element.available) songs.push(element);
            });
            songs.sort((a, b) =>
                a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
            );
            showSongs(songs);
        })
        .catch(err => console.error(err));
}

const showSongs = (list) => {
    container.innerHTML = "";

    list.forEach((element) => {
        const songDiv = createElement("div", "songDiv");
        const descriptionDiv = createElement("div", "descriptionDiv");
        const songName = createElement("p", "songName", element.name);
        const songArtist = createElement("p", "songArtist", element.artist);
        const songDifficulty = createElement("p", "songDifficulty", difficulties[element.difficulty - 1]);
        const btnCopy = createElement("button", "btnCopy", "Copy Song");

        const songImg = document.createElement('img');
        songImg.src = element.image;

        btnCopy.addEventListener("click", () => {
            const text = `${element.name}`;
            copyText(text, btnCopy);
        });

        songDiv.append(songImg);
        songDiv.append(descriptionDiv);
        descriptionDiv.append(songName);
        descriptionDiv.append(songArtist);
        descriptionDiv.append(songDifficulty);
        descriptionDiv.append(btnCopy);
        container.append(songDiv);
    });
}

const copyText = (text, btn) => {
    navigator.clipboard.writeText(text)
        .then(() => {
            const original = btn.innerHTML;
            btn.innerHTML = "Copied";
            setTimeout(() => btn.innerHTML = original, 1500);
        })
        .catch(err => console.error(err));
};

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
    if (event.key === "Enter") filterSongs();
});
btnSearch.addEventListener("click", filterSongs);