export default class PixabayApiService {
    constructor() {
        this.KAY = '21847975-d0fb10f6989c918e9c55b7840'
        this.page = 1
        this.searchQuery =''
    }
    
    fetchApiByQuery () {
    return fetch(`https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${this.KAY}`)
    .then(r=>r.json())
    .then(data => data.hits)
    .catch(console.log)
    }

    incrementPage() {
        this.page +=1
    }
    resetPage() {
        this.page = 1
    }
    get query () {
        return this.searchQuery
    }
    set query(newQuery) {
        return this.searchQuery = newQuery
    }

}