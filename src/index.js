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
    loadMoreBtn: document.querySelector('.load-more-button'),
    itemForObserve: document.querySelector('.item-for-observe')
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
            
            if (scrollCheckbox.checked) {
                observer.observe(refs.itemForObserve)
                return
            }
            refs.loadMoreBtn.removeAttribute('hidden')
            refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick)
            })
}

function clearGallery() {
    refs.gallery.innerHTML = ''
}
function markupGallery (data) {
    const markup = galleryItemTemplate(data)
    refs.gallery.insertAdjacentHTML('beforeend', markup)
}

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

// lightbox
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


// observer
const observer = new IntersectionObserver(observerCollback, {threshold:0.1})
function observerCollback ([entrie], observerRef) {
    if (!entrie.isIntersecting) {return}
    pixabayApiService.incrementPage()
    pixabayApiService.fetchApiByQuery()
        .then(data => {
            if (data === 404) {
                pontyfyMassage('Missing server!')
                return
            }
            markupGallery(data)
            if (data.length < 12) {
                observerRef.unobserve(refs.itemForObserve)
            }
    })
}



// local storage & infinity scroll vs load more button
const scrollCheckbox = document.querySelector('.scroll-switch__toggle')

const SCROLL_KEY = 'scroll-checkbox'
const checkboxSaved = localStorage.getItem(SCROLL_KEY)
if (checkboxSaved==='checked') {
    scrollCheckbox.checked = 'true'
}

scrollCheckbox.addEventListener('change', onCheckboxChange)
function onCheckboxChange () {
    location.reload()
    if (scrollCheckbox.checked) {
        localStorage.setItem(SCROLL_KEY, 'checked')
        return;
    }
    
    localStorage.setItem(SCROLL_KEY, 'unchecked')
}