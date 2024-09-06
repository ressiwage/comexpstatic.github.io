function deleteArchive(url, id) {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify({'archive_id':id}),
        headers: {
            'archives-token': JSON.parse(localStorage.getItem('comexp-token')),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
    )
}

function getArchiveToken(url, id) {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify({'allowed_archives':id}),
        headers: {
            'archives-token': JSON.parse(localStorage.getItem('comexp-token')),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
    )
}

function makeWidgetCode(token){
    return `
    <link href="https://ressiwage.github.io/web/bs.isolated.css" rel="stylesheet">
    <link rel="stylesheet" href="https://ressiwage.github.io/web/stylesheet.css">

    <div id="comexp-login"></div>
    <div id="comexp-body" data-key="${token}"></div>

    <script src="https://cdn.jsdelivr.net/npm/hash-wasm@4"></script>
    <script src="https://ressiwage.github.io/web/insertHtml.js"></script>
    <script src="https://ressiwage.github.io/web/setupArchivesMenu.js"></script>
    <script src="https://ressiwage.github.io/web/setupForms.js"></script>
    `
}