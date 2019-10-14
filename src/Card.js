import {
  html,
  Component
} from 'https://unpkg.com/htm/preact/standalone.module.js'

import Image from './Image.js'

const getFormattedDate = date => {
  const now = new Date()
  const then = new Date(date)

  const seconds = Math.floor((now - then) / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  const daysMsg = `${days} days`
  const hoursMsg = `${`${hours} hours`}`

  return `${days > 1 ? daysMsg : hoursMsg} ago`
}

export default class Card extends Component {
  renderImage = () =>
    this.props.urlToImage
      ? html`
          <${Image} src=${this.props.urlToImage} />
        `
      : null

  render() {
    return html`
      <div class="card">
        <div class="card-header">
          ${this.renderImage()}
          <h4>
            <a href=${this.props.url} target="_blank" rel="noopener noreferrer"
              >${this.props.title}</a
            >
          </h4>
        </div>
        <hr />
        <div class="card-body">
          <p>${this.props.description}</p>
          <div class="card-body-footer">
            <small><em>${getFormattedDate(this.props.publishedAt)}</em></small>
            <small><em>${this.props.source.name}</em></small>
          </div>
        </div>
      </div>
    `
  }
}
