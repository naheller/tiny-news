import {
  html,
  Component
} from 'https://unpkg.com/htm/preact/standalone.module.js'

export default class Image extends Component {
  state = {
    src: '',
    dataSrc: false,
    loaded: false
  }

  componentDidMount() {
    this.setState({
      dataSrc: this.props.src,
      loaded: false
    })

    const observer = new IntersectionObserver(this.inview)

    observer.observe(this.element)
  }

  inview = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.intersectionRatio) {
        entry.target.addEventListener('load', this.loading)
        entry.target.src = entry.target.getAttribute('data-src')
        observer.unobserve(entry.target)
      }
    })
  }

  loading = event => {
    if (event.target.complete)
      this.setState({
        loaded: true
      })
  }

  render() {
    const loaderHidden = this.state.loaded ? 'hidden' : ''

    return html`
      <div class="image-container">
        <div class=${`loader ${loaderHidden}`}>
          <img src="../assets/placeholder.jpg" />
        </div>
        <img
          src=${this.state.src}
          data-src=${this.state.dataSrc}
          ref=${element => (this.element = element)}
        />
      </div>
    `
  }
}
