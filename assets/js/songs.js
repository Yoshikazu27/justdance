(() => {
    'use strict'

    const difficulties = [
        'EASY',
        'NORMAL',
        'HARD',
        'EXPERT'
    ];

    let paginator = [];
    let currentPage = 1;

    const songsPerPage = 100;
    const visiblePages = 3;

    const btnSearch = document.getElementById('btn-search');
    const txtFilter = document.getElementById('txt-filter');
    const container = document.getElementById('main-container');
    const previewModal = document.getElementById('preview-modal');
    const nameTitle = document.getElementById('name-title');
    const artistTitle = document.getElementById('artist-title');
    const videoPreview = document.getElementById('video-preview');
    const modalButtonDiv = document.getElementById('modal-button-div');
    const closeButton = document.getElementById('btn-close');
    const paginatorDiv = document.getElementById('paginator');

    const allSongsUrl = 'https://justdance-api.onrender.com/api/songs';
    const filterUrl = 'https://justdance-api.onrender.com/api/songs/filter/';

    const initialize = async () => {
        try {
            await getSongs();
        } catch (error) {
            console.error(`Error loading songs: ${error}`);
        }
    }

    const showSongs = (list) => {
        const fragment = document.createDocumentFragment();

        container.innerHTML = '';

        list.forEach((element) => {
            const songDiv = createElement('div', 'song-div');
            const descriptionDiv = createElement('div', 'description-div');
            const songName = createElement('p', 'song-name', element.name);
            const songArtist = createElement('p', 'song-artist', element.artist);
            const songDifficulty = createElement('p', 'song-difficulty', difficulties[element.difficulty - 1]);
            const btnCopy = createElement('button', 'btn-copy', 'Copy Song');
            const btnPreview = createElement('button', 'btn-preview', 'Preview');

            const songImg = document.createElement('img');
            songImg.src = element.image;

            btnCopy.addEventListener('click', () => copyText(`${element.name}`, btnCopy));

            btnPreview.addEventListener('click', () => setVideo(element.name, element.artist, element.preview));

            songDiv.append(songImg);
            songDiv.append(descriptionDiv);
            descriptionDiv.append(songName);
            descriptionDiv.append(songArtist);
            descriptionDiv.append(songDifficulty);
            descriptionDiv.append(btnCopy);
            descriptionDiv.append(btnPreview);
            fragment.append(songDiv);
        });

        container.append(fragment);
        container.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const setPages = (list) => {
        const pages = Math.ceil(list.length / songsPerPage);

        paginatorDiv.innerHTML = '';
        paginator = [];

        for (let i = 0; i < pages; i++) {
            const content = list.slice(i * songsPerPage, (i + 1) * songsPerPage);

            paginator.push({
                page: i + 1,
                songs: content
            });
        }

        currentPage = 1;

        if (paginator.length > 0) {
            showSongs(paginator[0].songs);
        }
        else {
            container.innerHTML = '';
            paginatorDiv.innerHTML = '';
        }

        renderPaginator();
    }

    const createPageButton = (page) => {
        const btn = createElement('button', 'page', page);

        if (page === currentPage) {
            btn.classList.add('selected');
        }

        btn.addEventListener('click', () => {
            currentPage = page;
            showSongs(paginator[page - 1].songs);
            renderPaginator();
        });

        return btn;
    };

    const renderPaginator = () => {
        paginatorDiv.innerHTML = '';

        const total = paginator.length;
        const half = Math.floor(visiblePages / 2);

        let start = currentPage - half;
        let end = currentPage + half;

        if (start < 1) {
            start = 1;
            end = Math.min(total, visiblePages);
        }

        if (end > total) {
            end = total;
            start = Math.max(1, total - visiblePages + 1);
        }

        if (start > 1) {
            paginatorDiv.append(createPageButton(1));

            if (start > 2) {
                const dots = document.createElement('span');
                dots.textContent = '…';
                paginatorDiv.append(dots);
            }
        }

        for (let i = start; i <= end; i++) {
            paginatorDiv.append(createPageButton(i));
        }

        if (end < total) {
            if (end < total - 1) {
                const dots = document.createElement('span');
                dots.textContent = '…';
                paginatorDiv.append(dots);
            }

            paginatorDiv.append(createPageButton(total));
        }
    };

    const copyText = (text, btn) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                const original = btn.textContent;
                btn.textContent = 'Copied';
                setTimeout(() => btn.textContent = original, 1500);
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

        const btnCopy = createElement('button', 'btn-copy', 'Copy Song');
        btnCopy.addEventListener('click', () => copyText(name, btnCopy));
        modalButtonDiv.append(btnCopy);

        previewModal.style.display = 'flex';
    }

    const closeModal = () => {
        videoPreview.pause();
        videoPreview.currentTime = 0;
        videoPreview.src = '';
        previewModal.style.display = 'none';
        nameTitle.textContent = '';
        artistTitle.textContent = '';
        modalButtonDiv.removeChild(modalButtonDiv.querySelector('.btn-copy'));
    }

    const filterSongs = async () => {
        const textValue = txtFilter.value.toLowerCase();
        await getSongs(textValue);
    }

    const getSongs = async (filter) => {
        const response = await fetch((filter !== undefined && filter.length > 0)
            ? `${filterUrl}${filter}` : allSongsUrl);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const list = await response.json();

        const sortedSongs = list.sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        );

        setPages(sortedSongs);
    }

    const createElement = (element, className, htmlText = null) => {
        const newElement = document.createElement(element);
        newElement.classList.add(className);
        if (htmlText != null) newElement.textContent = htmlText;
        return newElement;
    }

    initialize();

    txtFilter.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') await filterSongs();
    });
    btnSearch.addEventListener('click', filterSongs);
    closeButton.addEventListener('click', closeModal);
})();