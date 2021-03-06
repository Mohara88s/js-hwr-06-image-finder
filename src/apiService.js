export default class PixabayApiService {
    constructor() {
        this.KEY = '21847975-d0fb10f6989c918e9c55b7840'
        this.page = 1
        this.searchQuery = ''
        this.indexItem = 0
    }
    
    fetchApiByQuery () {
    return fetch(`https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${this.KEY}`)
    .then(r=>r.json())
        .then(data => data.hits)
        .then(data => {
            return data.map(element => {
                this.indexItem +=1
                element.indexItem = this.indexItem
                return element
            })
            })
        .catch((error) => {
            console.log(error)
            return 404
        })
    }

    incrementPage() {
        this.page +=1
    }
    resetPage() {
        this.page = 1
        this.indexItem = 0
    }
    get query () {
        return this.searchQuery
    }
    set query(newQuery) {
        return this.searchQuery = newQuery
    }

}