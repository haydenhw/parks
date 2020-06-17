const API_BASE_URL = 'https://developer.nps.gov/api/v1/parks';
const API_KEY = '0Fx4pyynThvMZt1otMzPZI1YcafI7XY7gIeqzako';

class ParksService {
  constructor(){}

  _makeStatesParamStr(states) {
    return `stateCode=${states.join(',')}`;
  }

  _makeAPIParamStr(states, limit) {
    const statesParamStr = this._makeStatesParamStr(states);
    return `${statesParamStr}&limit=${limit}&api_key=${API_KEY}`
  }

  _callParksEndpoint(paramStr) {
    return axios(`${API_BASE_URL}?${paramStr}`)
  }

  async getParks(states, limit) {
    let paramStr = this._makeAPIParamStr(states, limit);
    let { data } = await this._callParksEndpoint(paramStr);
    return data.data;
  }
}

class View {
  _renderPark(park) {
    return $(`
     <li class="park-list-item">
         <h2>${park.name}</h2>
         <p>${park.description}</p>
         <a href="${park.url}">${park.url}</a>
     </li>
  `)
  }

  _renderParkList(parkData) {
    return parkData.map(p => this._renderPark(p))
  }

  _appendParkList(parksHtml) {
    $('.js-park-list').append(parksHtml)
  }

  displayParkSearchResutls(parkData) {
    const parksHtml = this._renderParkList(parkData);
    this._appendParkList(parksHtml);
  }

  bindParksSearchSubmit(handler) {
    $('.js-parks-form').submit((e) => {
      e.preventDefault();

      const states = $('.js-states').val();
      const limit = $('.js-limit').val();
      $('.js-park-list').empty();
      handler(states, limit);
    })
  }
}

class Controller {
  constructor() {
    this.view = new View();
    this.ps = new ParksService();
    this.view.bindParksSearchSubmit(this.fetchParksDataAndRenderResults.bind(this));
  }

  async fetchParksDataAndRenderResults(states, limit) {
    const parkData = await this.ps.getParks(states, limit);
    this.view.displayParkSearchResutls(parkData);
  }
}

$(() => {
  const app = new Controller();
});

