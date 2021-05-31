import './sass/main.scss';
import '../node_modules/material-design-icons/iconfont/material-icons.css'
// import pontyfy styles and js
import '../node_modules/@pnotify/core/dist/BrightTheme.css';
import '../node_modules/@pnotify/core/dist/PNotify.css';
import '../node_modules/@pnotify/mobile/dist/PNotifyMobile.css';
import { error } from '../node_modules/@pnotify/core/dist/PNotify.js';
function pontyfyMassage(message) {
    error({
            title: `${message}`,
            delay: 1500,
        });
}

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
            if (data === 404) {
                pontyfyMassage('Nothing was found for your query, or missing server!')
                return
            }
            markupGallery(data)
            if (data.length < 12) {
                return
            }
            refs.loadMoreBtn.removeAttribute('hidden')
        })
        
    
}
function clearGallery() {
    refs.gallery.innerHTML=''
}
function markupGallery (data) {
    const markup = galleryItemTemplate(data)
    refs.gallery.insertAdjacentHTML('beforeend', markup)
}

refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick)

function onLoadMoreBtnClick () {
    pixabayApiService.incrementPage()
    pixabayApiService.fetchApiByQuery()
        .then(data => {
            if (data === 404) {
                pontyfyMassage('Nothing was found for your query, or missing server!')
                return
            }
            markupGallery(data)
            const element = document.getElementById(`indexItem-${data[0].indexItem}`);
            element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            });
    })
}