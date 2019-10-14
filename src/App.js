import {
  html,
  Component
} from 'https://unpkg.com/htm/preact/standalone.module.js'

import Card from './Card.js'

const apiBaseUrl = 'https://newsapi.org/v2/'
const apiKey = '272afd9550db420d809a3903ee6e7bb8'
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
      ...this.state,
      loading: true,
      error: ''
    })

    fetch(
      searchTerm === ''
        ? `${apiBaseUrl}top-headlines?country=us&apiKey=${apiKey}`
        : `${apiBaseUrl}everything?q=${searchTerm}&from=${formattedDate}&sortBy=relevancy&apiKey=${apiKey}`
    )
      .then(res => res.json())
      .then(json => {
        this.setState({
          ...this.state,
          articles: json.articles,
          loading: false
        })
      })
      .catch(err => {
        this.setState({
          ...this.state,
          error: err,
          loading: false
        })
      })
  }

  renderHeader = () => html`
    <div class="header">
      <div class="header-logo-title">
        <object class="header-logo" data="../assets/newspaper.svg"></object>
        <h2 class="header-title">Tiny News</h2>
      </div>
      ${this.renderLinks()}
    </div>
  `

  renderLinks = () =>
    html`
      <p>
        Made with${` `}
        <a href="https://preactjs.com/" target="_blank" rel="noopener referrer">
          Preact</a
        >,${` `}
        <a href="https://milligram.io/" target="_blank" rel="noopener referrer">
          Milligram</a
        >, and${` `}
        <a href="https://newsapi.org/" target="_blank" rel="noopener referrer">
          News API</a
        >
      </p>
    `

  renderNews = () => {
    const { articles = [], loading, error } = this.state

    return loading
      ? html`
          <object data="../assets/loading.svg"></object>
        `
      : error !== ''
      ? html`
          <h4>Error: ${error}</h4>
        `
      : articles.length
      ? articles.map(
          article =>
            html`
              <${Card} ...${article} />
            `
        )
      : null
  }

  render() {
    return html`
      <div class="container">
        ${this.renderHeader()}
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
