import {
  html,
  Component
} from 'https://unpkg.com/htm/preact/standalone.module.js'

import Card from './Card.js'

const apiBaseUrl = 'https://newsapi.org/v2/'
const apiKey = process.env.NEWS_API_KEY
const MS_PER_DAY = 1000 * 60 * 60 * 24

export default class App extends Component {
  state = {
    searchTerm: '',
    articles: [],
    loading: false,
    error: ''
  }

  componentDidMount() {
    this.fetchNews()
  }

  setSearchTerm = e => {
    this.setState({ searchTerm: e.target.value })
  }

  resetSearchTerm = () => {
    this.setState({ searchTerm: '' })
    this.fetchNews()
  }

  getFormattedDate = date =>
    `${date.getYear() + 1900}-${date.getMonth() + 1}-${date.getDate()}`

  fetchNews = () => {
    const { searchTerm } = this.state

    const today = new Date()
    const twoWeeksAgo = new Date(today - MS_PER_DAY * 14)
    const formattedDate = this.getFormattedDate(twoWeeksAgo)

    this.setState({
      loading: true,
      error: ''
    })

    fetch(
      searchTerm === ''
        ? `${apiBaseUrl}top-headlines?country=us&apiKey=${apiKey}`
        : `${apiBaseUrl}everything?q=${searchTerm}&from=${formattedDate}&sortBy=popularity&apiKey=${apiKey}`
    )
      .then(res => res.json())
      .then(json => {
        this.setState({
          articles: json.articles,
          loading: false
        })
      })
      .catch(err => {
        this.setState({
          error: err,
          loading: false
        })
      })
  }

  renderNews = () => {
    const { articles, loading, error } = this.state

    return loading
      ? html`
          <object data="../assets/loading.svg"></object>
        `
      : error !== ''
      ? html`
          <h4>Error: ${error}</h4>
        `
      : articles.map(
          article =>
            html`
              <${Card} ...${article} />
            `
        )
  }

  render() {
    return html`
      <div class="container">
        <h2>Tiny News</h2>
        <p>
          Made with Preact, Milligram, and News API
        </p>
        <input
          type="text"
          placeholder="Enter a topic"
          onChange=${this.setSearchTerm}
          value=${this.state.searchTerm}
        />
        <button class="search-button" onClick=${this.fetchNews}>
          Get headlines
        </button>
        <button class="button-outline reset" onClick=${this.resetSearchTerm}>
          Reset
        </button>
        <hr />
        <div class="news-list">
          ${this.renderNews()}
        </div>
      </div>
    `
  }
}
