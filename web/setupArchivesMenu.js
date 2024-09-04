const PLEASE_LOGIN = document.getElementById('please-login');
const ARCHIVE_SECTION = document.getElementById('archives');
const VIDEO_SECTION = document.getElementById('videos');
const ARCHIVES_CONTAINER = document.getElementById('archives-container');
const VIDEO_CONTAINER = document.getElementById('videos-container');

async function loadArchives() {
    let tokenLocalstorage = JSON.parse(localStorage.getItem("comexp-token"));
    let tokenHtml = document.getElementById("comexp-body")===null?null:JSON.parse(document.getElementById("comexp-body").dataset.key);
    let token;
    if (tokenHtml===null){
        token=tokenLocalstorage;
    }else{
        token=tokenHtml
    }
    if (token === null) { return }
    ARCHIVE_SECTION.classList.remove('d-none');
    PLEASE_LOGIN.classList.add('d-none')
    let response = await fetch('http://127.0.0.1:9999/get_archives', {
        headers: { 'archives-token': token }
    });
    if (response.ok) {
        const archives = [];
        const archives_js = (await response.json())['archives'];
        console.log(archives_js);
        for (let archive of archives_js) {
            const a_div = document.createElement('div');
            a_div.className = 'w700 border border-dark mx-1 c-pointer minimal-hover'
            const a_title = document.createElement('h1');
            a_title.innerHTML = `архив ${archive.name}`
            const a_par = document.createElement('p');
            a_par.innerHTML = `ид: ${archive.id}`;
            [a_title, a_par].forEach((e) => a_div.appendChild(e));

            a_div.addEventListener('click', () => {
                loadVideos(archive.videos);
                VIDEO_SECTION.classList.remove('d-none');
                document.getElementById('archive-id').value = archive.id;
            })

            archives.push(
                a_div
            )
        }
        for (const archive of archives) {
            ARCHIVES_CONTAINER.appendChild(archive)
        }

    } else {
        console.log('not ok')
    }
}
async function loadVideos(videos_json) {
    const videos = [];
    VIDEO_CONTAINER.innerHTML = '';

    for (let video of videos_json) {
        const a_div = document.createElement('div');
        a_div.className = 'w700 border border-dark mx-1 minimal-hover'
        const a_title = document.createElement('h1');
        a_title.className = 'text-wrap text-break'
        a_title.innerHTML = `видео ${video.name}`
        const a_par = document.createElement('p');
        a_par.innerHTML = `путь: ${video.path}`;
        [a_title, a_par].forEach((e) => a_div.appendChild(e));


        videos.push(
            a_div
        )
    }
    for (const video of videos) {
        VIDEO_CONTAINER.appendChild(video)
    }
}


document.addEventListener('DOMContentLoaded', async () => { await loadArchives() })