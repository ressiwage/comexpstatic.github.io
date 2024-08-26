function handle_login_js(json) {
    localStorage.setItem('comexp-token', JSON.stringify(json['token']));
    location.reload();
}

//настраиваем логин
if (document.forms['loginform'] !== undefined) {
    document.forms['loginform'].addEventListener('submit', (event) => {
        event.preventDefault();
        fetch(event.target.action, {
            method: 'POST',
            body: new URLSearchParams(new FormData(event.target)), // event.target is the form
        }).then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // or response.text() or whatever the server sends
        }).then((json) => {
            handle_login_js(json);
        }).catch((error) => {
            console.log(error);
        });
    });
}

//настраиваем потоковую загрузку видео
if (document.forms['upload-video-form'] !== undefined) {
    document.forms['upload-video-form'].addEventListener('submit', (event) => {
        event.preventDefault();
        let token = JSON.parse(localStorage.getItem("comexp-token"));
        console.log(token);
        var fd = new FormData();
        fd.append('file', document.getElementById('upload-file').files[0])
        fetch(event.target.action, {
            method: 'POST',
            body: document.getElementById('upload-file').files[0], // event.target is the form
            headers: {
                'archives-token': token,
                'md5': document.getElementById('md5').value,
                'archive-id': document.getElementById('archive-id').value,
                'filename': document.getElementById('upload-file').files[0].name
            }
        }).then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // or response.text() or whatever the server sends
        }).then((json) => {
            // handle_login_js(json);
        }).catch((error) => {
            console.log(error);
        });
    });
}


//md5 calculation
const chunkSize = 64 * 1024 * 1024;
const fileReader = new FileReader();
let hasher = null;

function hashChunk(chunk) {
    return new Promise((resolve, reject) => {
        fileReader.onload = async (e) => {
            const view = new Uint8Array(e.target.result);
            hasher.update(view);
            resolve();
        };

        fileReader.readAsArrayBuffer(chunk);
    });
}

const readFile = async (file) => {
    if (hasher) {
        hasher.init();
    } else {
        hasher = await hashwasm.createMD5();
    }

    const chunkNumber = Math.floor(file.size / chunkSize);

    for (let i = 0; i <= chunkNumber; i++) {
        const chunk = file.slice(
            chunkSize * i,
            Math.min(chunkSize * (i + 1), file.size)
        );
        await hashChunk(chunk);
    }

    const hash = hasher.digest();
    return Promise.resolve(hash);
};


//вычисляем md5 хэш файла при его загрузке
if (document.getElementById('upload-file') !== null) {
    document.getElementById('upload-file').addEventListener("change", async (event) => {
        const file = event.target.files[0];
        const uploadBtn = document.getElementById("submit-upload")
        uploadBtn.disabled = true;
        const oldValue = uploadBtn.value;
        uploadBtn.value = "вычисляется хэш...";
        const hash = await readFile(file);
        uploadBtn.disabled = false;
        uploadBtn.value = oldValue;
        document.getElementById("md5").value = hash;
    });
}