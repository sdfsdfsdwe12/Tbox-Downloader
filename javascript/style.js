// Version
const version = 'Versi 1.5.5';
document.getElementById('app-version').innerText = version;

// Open Information Menu
document.getElementById('information-button-open').addEventListener('click', () => {
    console.log('test');
    document.getElementById('information-container').className = 'container-overlay-active poppins';
});

// Close Information Menu
document.getElementById('information-button-close').addEventListener('click', () => {
    document.getElementById('information-container').className = 'container-overlay-inactive poppins';
});

// Add Information

const list_qna = [
    {'question':'Apa itu TeraDL?', 'answer':'TeraDL adalah platform untuk streaming atau mengunduh file Terabox secara gratis dan cepat'},
    {'question':'Bagaimana cara menggunakannya?', 'answer':'Cukup masukkan URL Terabox yang ingin kamu download, tekan submit, tunggu hingga muncul daftar file, kemudian pilih opsi Download atau Play Streaming'},
    {'question':'Apa perbedaan download 1, 2, dan 3?', 'answer':'Opsi 1 adalah download URL dengan kecepatan pelan tapi pasti<div class="divisor-spacing"></div>Opsi 2 adalah download URL dengan kecepatan medium<div class="divisor-spacing"></div>Opsi 3 adalah download URL dengan kecepatan tinggi namun sering error'},
    {'question':'Apakah platform ini resmi?', 'answer':'Platform ini dibuat secara mandiri dan tidak memiliki asosiasi dengan Terabox. Segala tindakan adalah tanggung jawab pengguna'},
];

function addInfo() {
    const box_info = document.getElementById('container-qna');
    list_qna.forEach((item) => {
        const new_element = document.createElement('div');
        new_element.className = 'box-qna';
        new_element.innerHTML = `
            <span class="question">${item.question}</span>
            <span class="answer">${item.answer}</span>`;
        box_info.appendChild(new_element);
    });
}

addInfo();

// Add Contact

const list_contact = [
    {'href':'https://www.facebook.com/Dapunta.Khurayra.X', 'icon':'<i class="fa-brands fa-square-facebook"></i>', 'text':'Dapunta Khurayra X'},
    {'href':'https://www.instagram.com/dapunta.ratya/#', 'icon':'<i class="fa-brands fa-square-instagram"></i>', 'text':'Dapunta Ratya'},
    {'href':'https://github.com/dapunta', 'icon':'<i class="fa-brands fa-square-github"></i>', 'text':'Dapunta'},
];

function AddContact() {
    const box_contact = document.getElementById('container-contact');
    list_contact.forEach((item) => {
        const new_element = document.createElement('a');
        Object.assign(new_element, { href: item.href, target: '_blank', rel: 'noopener' });
        new_element.innerHTML = `${item.icon}<span>${item.text}</span>`;
        box_contact.appendChild(new_element);
    });
}

AddContact();

// Zoom Image

function zoom(element) {
    const overlay_zoom = document.getElementById('zoom-container');
    overlay_zoom.className = 'container-zoom-active poppins';
    overlay_zoom.innerHTML = `<img src="${element.src}">`;
}

function unzoom(element) {
    const overlay_zoom = document.getElementById('zoom-container');
    overlay_zoom.innerHTML = '';
    overlay_zoom.className = 'container-zoom-inactive poppins';
}