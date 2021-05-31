import './sass/main.scss';
import '../node_modules/material-design-icons/iconfont/material-icons.css'

import pontyfyMassage from'./pontify-message'
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
    refs.loadMoreBtn.setAttribute('hidden', true)
    pixabayApiService.query = refs.searchFormField.value
    pixabayApiService.resetPage()
    pixabayApiService.fetchApiByQuery()
        .then(data => {
            if (data === 404) {
                pontyfyMassage('Missing server!')
                return
            }
            if (data.length === 0) {
                pontyfyMassage('Nothing was found for your query!')
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
    refs.gallery.innerHTML = ''
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
                pontyfyMassage('Missing server!')
                return
            }
            markupGallery(data)
            const element = document.getElementById(`indexItem-${data[0].indexItem}`);
            element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            })
            if (data.length < 12) {
                refs.loadMoreBtn.setAttribute('hidden', true)
            }
    })
}


import * as basicLightbox from 'basiclightbox'

refs.gallery.addEventListener('click', onGalleryClick)

function onGalleryClick(event) {
    if (!event.target.hasAttribute('largeimageurl')) { return }
murkupLightbox(event.target.getAttribute('largeimageurl')) 
}

function murkupLightbox(URL) {
    const instance = basicLightbox.create(`
    <img class='img__large' src="${URL}" width="800" height="600">
    `)
    instance.show()
}