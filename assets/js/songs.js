(() => {
    'use strict'
    
    const difficulties = [
        "EASY",
        "NORMAL",
        "HARD",
        "EXPERT"
    ];

    const songs = [];

    const btnSearch = document.getElementById("btn-search");
    const txtFilter = document.getElementById("txt-filter");
    const container = document.getElementById("main-container");
    const previewModal = document.getElementById("preview-modal");
    const nameTitle = document.getElementById("name-title");
    const artistTitle = document.getElementById("artist-title");
    const videoPreview = document.getElementById("video-preview");
    const modalButtonDiv = document.getElementById("modal-button-div");
    const closeButton = document.getElementById("btn-close");

    const initialize = async () => {
        try {
            const response = await fetch('https://justdance-api.onrender.com/api/songs');

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const list = await response.json();

            songs.push(...list
                .filter(song => song.available)
                .sort((a, b) =>
                    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
                )
            );

            showSongs(songs);
        } catch (error) {
            console.error(`Error loading songs: ${error}`);
        }
    }

    const showSongs = (list) => {
        container.innerHTML = "";

        list.forEach((element) => {
            const songDiv = createElement("div", "song-div");
            const descriptionDiv = createElement("div", "description-div");
            const songName = createElement("p", "song-name", element.name);
            const songArtist = createElement("p", "song-artist", element.artist);
            const songDifficulty = createElement("p", "song-difficulty", difficulties[element.difficulty - 1]);
            const btnCopy = createElement("button", "btn-copy", "Copy Song");
            const btnPreview = createElement("button", "btn-preview", "Preview");

            const songImg = document.createElement('img');
            songImg.src = element.image;

            btnCopy.addEventListener("click", () => copyText(`${element.name}`, btnCopy));

            btnPreview.addEventListener("click", () => setVideo(element.name, element.artist, element.preview));

            songDiv.append(songImg);
            songDiv.append(descriptionDiv);
            descriptionDiv.append(songName);
            descriptionDiv.append(songArtist);
            descriptionDiv.append(songDifficulty);
            descriptionDiv.append(btnCopy);
            descriptionDiv.append(btnPreview);
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

    const setVideo = (name, artist, url) => {
        nameTitle.textContent = name;
        artistTitle.textContent = artist;

        videoPreview.src = url;
        videoPreview.controls = false;
        videoPreview.loop = true;
        videoPreview.volume = 0.2;
        videoPreview.autoplay = true;
        videoPreview.muted = false;
        videoPreview.currentTime = 0;

        const btnCopy = createElement("button", "btn-copy", "Copy Song");
        btnCopy.addEventListener("click", () => copyText(name, btnCopy));
        modalButtonDiv.append(btnCopy);

        previewModal.style.display = "flex";
    }

    const closeModal = () => {
        videoPreview.pause();
        videoPreview.currentTime = 0;
        videoPreview.src = "";
        previewModal.style.display = "none";
        nameTitle.textContent = "";
        artistTitle.textContent = "";
        modalButtonDiv.removeChild(modalButtonDiv.querySelector(".btn-copy"));
    }

    const filterSongs = () => {
        const textValue = txtFilter.value.toLowerCase();
        const newList = songs.filter(song => [song.name, song.artist].some(y => y.toLowerCase().includes(textValue)));
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
    closeButton.addEventListener("click", closeModal);
})();