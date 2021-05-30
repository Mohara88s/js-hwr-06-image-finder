import './sass/main.scss';

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
    console.log(pixabayApiService.page)
    console.log(pixabayApiService.query)
    pixabayApiService.fetchApiByQuery()
    .then (data => {
        markupGallery(data)})
    
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
    console.log(pixabayApiService.page)
    pixabayApiService.fetchApiByQuery()
    .then (data => markupGallery(data))

}
