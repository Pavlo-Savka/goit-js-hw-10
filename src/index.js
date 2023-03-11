import './css/styles.css';
import API from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

const debounsedFetchCountries = debounce(() => {
  const trimInput = input.value.trim();
  API.fetchCountries(trimInput)
    .then(render)
    .catch(error => {
      clearMarkup();
      if (trimInput) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
    });
}, DEBOUNCE_DELAY);
input.addEventListener('input', debounsedFetchCountries);

function renderInfo(data) {
  const markupInfo = data.map(element => {
    return `<img width = "60" src="${element.flags.svg}"
     alt="${element.name.official} flag">
     <span class="country-info-name">${element.name.official}</span>
    <ul class='country-info-list'>
      <li><span class="info-list">Capital: </span>${element.capital}</li>
      <li><span class="info-list">Population: </span>${element.population}</li>
      <li><span class="info-list">Languages: </span>${Object.values(
        element.languages
      ).join(', ')}</li>
    </ul>`;
  });
  countryInfo.innerHTML = markupInfo;
  const countryInfoList = document.querySelector('.country-info-list');
  const countryInfoName = document.querySelector('.country-info-name');
  countryInfoList.style.listStyleType = 'none';
  countryInfoList.style.lineHeight = '2.5';
  countryInfoList.style.fontWeight = '600';
  countryInfoName.style.fontSize = '36px';
}

function renderList(data) {
  countryList.style.listStyleType = 'none';
  const markupList = data
    .map(element => {
      return `<li><img width = "30" src="${element.flags.svg}"
     alt="${element.name.official} flag">
     <span>${element.name.official}</span></li>`;
    })
    .join('');
  countryList.innerHTML = markupList;
}
function render(data) {
clearMarkup();
  if (data.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (data.length === 1) {
    renderInfo(data);
  }
    else {
      renderList(data);
    }
  }
function clearMarkup() {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}
