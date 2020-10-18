import test from './projects/k_means.js'

const page_1 = document.getElementById('page_1');
const page_2 = document.getElementById('page_2');
const page_3 = document.getElementById('page_3');
const pages = [page_1, page_2, page_3];

const card_title = document.getElementsByClassName('card-title')[0];
const card_text = document.getElementsByClassName('card-text')[0];

const canvas = document.getElementById('canvas');
let selected_page = null;

page_1.addEventListener('click', () => {
    pages.map(p => {p.classList.remove('active')})
    page_1.classList.add('active');

    card_title.textContent = "În curs de dezvoltare..."
    card_text.textContent = ""

    if (selected_page != null){
        selected_page.remove()
    }
});

page_2.addEventListener('click', () => {
    pages.map(p => {p.classList.remove('active')})
    page_2.classList.add('active')

    card_title.textContent = "Invatare nesupervizata K-means"
    card_text.textContent = "Hello world"

    if (selected_page != null){
        selected_page.remove()
    }
    selected_page = new p5(new test().scetch, canvas);
});

page_3.addEventListener('click', () => {
    pages.map(p => {p.classList.remove('active')})
    page_3.classList.add('active')

    card_title.textContent = "În curs de dezvoltare..."
    card_text.textContent = ""

    if (selected_page != null){
        selected_page.remove()
    }
});