//This view will display bookemarked recipes on its panel as a list
import View from './View.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage =
    'No bookmarks yet, Find your favorite recipes and bookmark them :)';
  _successMessage = '';

  addHandlerRenderBM(handler) {
    window.addEventListener('load', handler);
  }

  //This method generate the recieved data array that we need to loop over, then we return one string with joined array index data like a list
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
