//This view is for the add new recipe form
import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _successMessage = 'Recipe was successfully uploaded!';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');

  _buttonOpen = document.querySelector('.nav__btn--add-recipe');
  _buttonClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    //take the overlay and window and remove/add hidden class
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._buttonOpen.addEventListener('click', this.toggleWindow.bind(this)); //bind setting this keyword points to current object not the attached button
  }

  _addHandlerHideWindow() {
    this._buttonClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  //Handling the form submission
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (event) {
      event.preventDefault();

      const dataArray = [...new FormData(this)]; // 'this' is a form--> FormData return an unusable object which will be spread into an array --> so it gives an array with all the fields and values

      const data = Object.fromEntries(dataArray); //original data is an object so this method takes the array of entries and convert it to an object
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
