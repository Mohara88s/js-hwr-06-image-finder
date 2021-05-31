import './sass/main.scss';
import '../node_modules/material-design-icons/iconfont/material-icons.css'

import galleryItemTemplate from './templates/gallery-item.hbs'

var debounce = require('lodash.debounce');
import PixabayApiService from './apiService'
const pixabayApiService = new PixabayApiService

const refs = {
    searchForm: document.querySelector('.search-form'),
    searchFormField: document.querySelector('.search-form input'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more-button')
}
refs.searchFormField.addEventListener('input', debounce(onSearchFormFieldInput, 700))
function onSearchFormFieldInput () {
    clearGallery()
    pixabayApiService.query = refs.searchFormField.value
    pixabayApiService.resetPage()
    pixabayApiService.fetchApiByQuery()
        .then(data => {
            markupGallery(data)
        })
        .then(() => {
        refs.loadMoreBtn.removeAttribute('hidden')
    })
    
}
function clearGallery() {
    refs.gallery.innerHTML=''
}
function markupGallery (data) {
    console.log(data)
    const markup = galleryItemTemplate(data)
    refs.gallery.insertAdjacentHTML('beforeend', markup)
}

refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick)

function onLoadMoreBtnClick () {
    pixabayApiService.incrementPage()
    pixabayApiService.fetchApiByQuery()
    .then(data => {
        markupGallery(data)
        console.log(`indexItem-${data[0].indexItem}`)
        const element = document.getElementById(`indexItem-${data[0].indexItem}`);
        console.log(data[0].indexItem)
        console.log(element)
        element.scrollIntoView({
  behavior: 'smooth',
  block: 'start',
});
    })
    
    

}