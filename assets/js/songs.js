(() => {
    'use strict'

    const difficulties = [
        "EASY",
        "NORMAL",
        "HARD",
        "EXPERT"
    ];

    let songs = [];
    const paginator = [];

    const songsPerPage = 100;

    const btnSearch = document.getElementById("btn-search");
    const txtFilter = document.getElementById("txt-filter");
    const container = document.getElementById("main-container");
    const previewModal = document.getElementById("preview-modal");
    const nameTitle = document.getElementById("name-title");
    const artistTitle = document.getElementById("artist-title");
    const videoPreview = document.getElementById("video-preview");
    const modalButtonDiv = document.getElementById("modal-button-div");
    const closeButton = document.getElementById("btn-close");
    const paginatorDiv = document.getElementById("paginator");

    const allSongsUrl = 'https://justdance-api.onrender.com/api/songs';
    const filterUrl = 'https://justdance-api.onrender.com/api/songs/filter/';

    const initialize = async () => {
        try {
            await getSongs();
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

        // setPages(list);
    }

    // const setPages = (list) => {
    //     const pages = Math.ceil(list.length / songsPerPage);

    //     paginatorDiv.innerHTML = "";

    //     for (let i = 0; i < pages; i++) {
    //         const content = list.slice(i * songsPerPage, (i + 1) * songsPerPage);

    //         paginator.push({
    //             page: i + 1,
    //             songs: content
    //         });

    //         const pageButton = document.createElement('button');
    //         pageButton.classList.add('page');
    //         pageButton.innerText = i + 1;
    //         paginatorDiv.append(pageButton);
    //     }
    // }

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

    const filterSongs = async () => {
        const textValue = txtFilter.value.toLowerCase();
        await getSongs(textValue);
        showSongs(songs);
    }

    const getSongs = async (filter) => {
        songs = [];

        const response = await fetch((filter !== undefined && filter.length > 0)
            ? `${filterUrl}${filter}` : allSongsUrl);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const list = await response.json();

        songs.push(...list
            .sort((a, b) =>
                a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
            )
        );
    }

    const createElement = (element, className, htmlText = null) => {
        const newElement = document.createElement(element);
        newElement.classList.add(className);
        if (htmlText != null) newElement.innerHTML = htmlText;
        return newElement;
    }

    initialize();

    txtFilter.addEventListener("keydown", async (event) => {
        if (event.key === "Enter") await filterSongs();
    });
    btnSearch.addEventListener("click", filterSongs);
    closeButton.addEventListener("click", closeModal);
})();