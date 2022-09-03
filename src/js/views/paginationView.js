//This view is for implementing the pagination for displaying searh results
import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  //listens for click on the next or previous button
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      //the clicked element is e.target and we want to find and select the closest button element to it
      const buttonEl = e.target.closest('.btn--inline');
      console.log(buttonEl);

      if (!buttonEl) return;
      const goToPage = +buttonEl.dataset.goto; //convert to number
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numberOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    ); //rounding the number,too

    // 1. We are at page 1, and there are other pages
    if (currentPage === 1 && numberOfPages > 1) {
      return `
        <button data-goto="${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${currentPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>`;
    }

    // 2. We are on the last page
    if (currentPage === numberOfPages && numberOfPages > 1) {
      return `
        <button data-goto="${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>`;
    }

    // 3. We are on other page
    if (currentPage < numberOfPages) {
      return `
        <button data-goto="${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
              </svg>
              <span>Page ${currentPage - 1}</span>
        </button>

        <button data-goto="${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
        `;
    }

    // 4. We are on page 1, and there are No other pages
    return '';
  }
}

export default new PaginationView();
