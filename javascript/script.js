// Global

const api = 'http://127.0.0.1:5000'; // Change This
// const api = 'https://teradl-api.dapuntaratya.com'; // Change This

let buffer = '';
let list_file;
let params;
let mode = 3;
let currentMode = 3;

// Get initial config when page loads
async function initializeApp() {
    try {
        const response = await fetch(`${api}/get_config`);
        const config = await response.json();
        if (config.status === 'success') {
            currentMode = config.mode;
            updateStatusIndicator(currentMode);
        }
    } catch (error) {
        console.error('Failed to initialize app:', error);
    }
}

// Status indicator update
function updateStatusIndicator(mode) {
    const indicator = document.getElementById('status-mode');
    if (indicator) {
        indicator.style.backgroundColor = mode === 2 ? '#77ff7e' : '#ff7777';
    }
}

// Handle file URL submission
async function handleURLSubmit(url) {
    try {
        // Show loading state
        const submitButton = document.getElementById('download-btn');
        submitButton.disabled = true;
        submitButton.innerHTML = '<div class="spinner"></div>';

        // Call generate_file endpoint
        const fileResponse = await fetch(`${api}/generate_file`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: url,
                mode: currentMode
            })
        });

        const fileData = await fileResponse.json();
        if (fileData.status === 'success') {
            // Display file information
            displayFileDetails(fileData);
        } else {
            showError('Failed to fetch file details');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('An error occurred while processing your request');
    } finally {
        // Reset button state
        const submitButton = document.getElementById('download-btn');
        submitButton.disabled = false;
        submitButton.innerHTML = 'Download Now <i data-feather="download"></i>';
        feather.replace();
    }
}

// Display file information
function displayFileDetails(data) {
    const detailsSection = document.getElementById('video-details');
    const videoInfoContainer = document.querySelector('.video-info');
    
    if (data.list && data.list.length > 0) {
        data.list.forEach(file => {
            const fileElement = createFileElement(file, data);
            videoInfoContainer.appendChild(fileElement);
        });
        detailsSection.classList.remove('hidden');
    }
}

// Create file element
function createFileElement(file, data) {
    const fileDiv = document.createElement('div');
    fileDiv.className = 'file-item';
    
    const downloadButton = document.createElement('button');
    downloadButton.className = 'download-video-btn';
    downloadButton.innerHTML = `<i data-feather="download"></i> Download ${file.name}`;
    
    downloadButton.onclick = async () => {
        try {
            downloadButton.disabled = true;
            downloadButton.innerHTML = '<div class="spinner"></div>';
            
            const linkResponse = await fetch(`${api}/generate_link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mode: currentMode,
                    shareid: data.shareid,
                    uk: data.uk,
                    sign: data.sign,
                    timestamp: data.timestamp,
                    fs_id: file.fs_id,
                    js_token: data.js_token,
                    cookie: data.cookie
                })
            });
            
            const linkData = await linkResponse.json();
            if (linkData.status === 'success' && linkData.download_link) {
                // Create download links for each available quality
                Object.entries(linkData.download_link).forEach(([key, url]) => {
                    const link = document.createElement('a');
                    link.href = url;
                    link.target = '_blank';
                    link.click();
                });
            }
        } catch (error) {
            console.error('Error generating download link:', error);
            showError('Failed to generate download link');
        } finally {
            downloadButton.disabled = false;
            downloadButton.innerHTML = `<i data-feather="download"></i> Download ${file.name}`;
            feather.replace();
        }
    };
    
    fileDiv.appendChild(downloadButton);
    return fileDiv;
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.hero-content').appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    
    const urlForm = document.getElementById('url-form');
    urlForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const url = document.getElementById('video-url').value.trim();
        if (url) {
            handleURLSubmit(url);
        }
    });
});

// Add Event Listener Input
const inputForm = document.getElementById('terabox_url');
inputForm.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const url = inputForm.value;
        readInput(url);
    }
});

// Add Event Listener Submit Button
const submitButton = document.getElementById('submit_button');
submitButton.addEventListener('click', (event) => {
    const url = inputForm.value;
    readInput(url);
});

// Loading Spinner 1
function loading(element_id, active) {
    const loadingBox = document.getElementById(element_id);
    if (active)  {
        loadingBox.innerHTML = `<div id="loading-spinner" class="spinner-container"><div class="spinner"></div></div>`;
        loadingBox.style.pointerEvents = 'none';
    }
    else {
        loadingBox.innerHTML = `<i class="fa-solid fa-arrow-right"></i>`;
        loadingBox.style.pointerEvents = 'auto';
    }
}

// Loading Spinner 2
function loading2(element_id, active) {
    const loadingBox = document.getElementById(element_id);
    if (active)  {
        loadingBox.innerHTML = `<div id="loading-spinner" class="spinner-container"><div class="spinner2"></div></div>`;
        loadingBox.style.pointerEvents = 'none';
    }
    else {
        loadingBox.innerHTML = `Failed`;
        loadingBox.style.pointerEvents = 'auto';
    }
}

// Loading Spinner 3
function loading3(element_id, active) {
    const loadingBox = document.getElementById(element_id);
    if (active)  {
        loadingBox.innerHTML = `<div id="loading-spinner" class="spinner-container"><div class="spinner2"></div></div>`;
        loadingBox.style.pointerEvents = 'none';
    }
    else {
        loadingBox.innerHTML = `<i class="fa-solid fa-play"></i>`;
        loadingBox.style.pointerEvents = 'auto';
    }
}

// Loading Spinner 
function loading4(element_id, active) {
    const loadingBox = document.getElementById(element_id);
    if (active)  {
        loadingBox.innerHTML = `<div id="loading-spinner" class="spinner-container4"><div class="spinner4"></div></div>`;
        loadingBox.style.pointerEvents = 'none';
    }
    else {
        loadingBox.innerHTML = ``;
        loadingBox.style.pointerEvents = 'auto';
    }
}

// Time Sleep
function sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s*1000));
}

// Get App Config

async function getConfig() {
    const url = `${api}/get_config`;
    const headers = {'Content-Type':'application/json'};
    const data = {
        'method'  : 'GET',
        'mode'    : 'cors',
        'headers' : headers
    };
    const req = await fetch(url, data);
    const response = await req.json();
    return(response.mode);
}

// Read Input
async function readInput(raw_url) {

    const url = raw_url.replace(/\s/g, '') === '' ? null : raw_url;

    if (url) {
        list_file = [];
        params = {};

        const stream_box = document.getElementById(`stream-video`);
        stream_box.innerHTML = '';
        stream_box.className = 'stream-video-section inactive'

        document.getElementById('result').innerHTML = '';
        loading('submit_button', true);
        await fetchURL(url);
        loading('submit_button', false);
        inputForm.value = '';
    }

    else {
        loading('submit_button', false);
        inputForm.value = '';
    }
}

// Fetch URL
async function fetchURL(url) {

    mode = await getConfig();
    changeStatus(mode);

    const get_file_url = `${api}/generate_file`;
    const headers = {'Content-Type':'application/json'};
    const data = {
        'method'  : 'POST',
        'mode'    : 'cors',
        'headers' : headers,
        'body'    : JSON.stringify({'url':url, 'mode':mode})
    };

    const req = await fetch(get_file_url, data);
    const response = await req.json();

    if (response.status == 'success') {
        params = {uk:response.uk, shareid:response.shareid, timestamp:response.timestamp, sign:response.sign, js_token:response.js_token, cookie:response.cookie};
        await sortFile(response.list);
    }

    else {
        loading('submit_button', false);
        inputForm.value = '';
        errorFetch();
    }
}

// Error Fetch
function errorFetch() {
    const box_result = document.getElementById('result');
    box_result.innerHTML = `
        <div class="container-failed">
            <span>Fetch Failed</span>
        </div>`;
}

// Sort File Recursively
async function sortFile(list_file) {
    list_file.forEach((item) => {
        if (item.is_dir == 1) {sortFile(item.list);}
        else {printItem(item);}
    });
}

// Show Item
async function printItem(item) {
    const box_result = document.getElementById('result');
    const new_element = document.createElement('div');
    new_element.id = `file-${item.fs_id}`;
    new_element.className = 'container-item';
    new_element.innerHTML = `
        <div class="container-item-default">
            <div id="image-${item.fs_id}" class="container-image"><img src="${item.image}" onclick="zoom(this)"></div>
            <div class="container-info">
                <span id="title-${item.fs_id}" class="title">${item.name}</span>
                <div class="container-button">
                    <div id="container-download-${item.fs_id}" class="container-download-button">
                        <button id="get-download-${item.fs_id}" type="button" class="download-button">Download ${convertToMB(item.size)} MB</button>
                    </div>
                    <div class="${item.type == 'video' ? 'container-stream-button-valid' : 'container-stream-button-invalid'}">
                        <button id="stream-${item.fs_id}" type="button" class="stream-button"><i class="fa-solid fa-play"></i></button>
                    </div>
                </div>
            </div>
        </div>`;
    box_result.appendChild(new_element);

    const downloadButton = new_element.querySelector(`#get-download-${item.fs_id}`);
    downloadButton.addEventListener('click', () => {
        if (mode == 1) initDownload(item.fs_id);
        else if (mode == 2) initDownload(item.fs_id, item.link);
        else if (mode == 3) initDownload(item.fs_id);
    });

    const streamButton = new_element.querySelector(`#stream-${item.fs_id}`);
    streamButton.addEventListener('click', () => {
        if (mode == 1) initStream(item.fs_id);
        else if (mode == 2) initStream(item.fs_id, item.link);
        else if (mode == 3) initStream(item.fs_id);
    });
}

// Convert Bytes To MegaBytes
function convertToMB(bytes) {
    const MB = bytes / (1024 * 1024);
    return MB.toFixed(0);
}

// Initialization for download
async function initDownload(fs_id, dlink=null) {

    loading2(`get-download-${fs_id}`, true);

    let param;
    if (dlink) {param = {'url':dlink, 'mode':mode};}
    else {param = {...params, 'fs_id':fs_id, 'mode':mode};}

    const get_link_url = `${api}/generate_link`;
    const headers = {'Content-Type':'application/json'};
    const data = {
        'method'  : 'POST',
        'mode'    : 'cors',
        'headers' : headers,
        'body'    : JSON.stringify(param)
    };

    const req = await fetch(get_link_url, data);
    const response = await req.json();

    if (response.status == 'success') {
        const box_button = document.getElementById(`container-download-${fs_id}`);
        box_button.innerHTML = '';
        const downloadLinks = response.download_link;
        Object.entries(downloadLinks).forEach(([key, value], index) => {

            const new_element = document.createElement('button');
            new_element.id = `download-${index+1}-${fs_id}`;
            new_element.innerText = index+1;
            new_element.className = 'download-button';
            new_element.setAttribute('value',value);
            box_button.appendChild(new_element);

            new_element.addEventListener('click', () => startDownload(new_element.value));
        });
    }

    else {
        loading2(`get-download-${fs_id}`, false);
    }
}

// Start Download
function startDownload(url) {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    // JANGAN gunakan anchor.download di sini!
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

// Initialization for stream
async function initStream(fs_id, dlink=null) {

    const stream_box = document.getElementById(`stream-video`);
    loading3(`stream-${fs_id}`, true);

    const url_stream = await getURLStream(fs_id, dlink);
    stream_box.className = 'stream-video-section';
    stream_box.innerHTML = '';
    stream_box.innerHTML = `
        <video controls>
            <source id="stream-video-${fs_id}" src="${url_stream}" type="video/mp4">
            Your browser does not support the video tag.
        </video>`;
    loading3(`stream-${fs_id}`, false);
    
}

// Get URL Stream
async function getURLStream(fs_id, dlink=null) {

    let param;

    try {
        if (dlink) {param = {'url':dlink, 'mode':mode};}
        else {param = {...params, 'fs_id':fs_id, 'mode':mode};}

        const get_link_url = `${api}/generate_link`;
        const headers = {'Content-Type':'application/json'};
        const data = {
            'method'  : 'POST',
            'mode'    : 'cors',
            'headers' : headers,
            'body'    : JSON.stringify(param)
        };

        const req = await fetch(get_link_url, data);
        const response = await req.json();

        if (response.status == 'success') {
            // const old_url = response['download_link']['url_2'];
            // const old_domain = old_url.match(/:\/\/(.*?)\./)[1];
            // const stream_url = old_url.replace(old_domain, 'kul-ddata').replace('by=themis', 'by=dapunta');
            const stream_url = response['download_link']['url_2'];
            return(stream_url);
        }
        else return('');
    }
    catch {return('');}
}

// Change status color
function changeStatus(mode) {
    const status_box = document.getElementById('status-mode');
    status_box.style.backgroundColor = (mode == 2) ? '#77ff7e' : '#ff7777';
}

// Initialization
async function main() {
    loading4('status-mode', true);
    const mode = await getConfig();
    loading4('status-mode', false);
    changeStatus(mode);
}

main();