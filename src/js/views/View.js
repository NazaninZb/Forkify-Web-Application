//This will only be used as a parent class, so there would be no instance of this class--> we export the class itself
import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  render(data, render = true) {
    //Check for existing data and also if the recieved data array is empty
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup; //render on previewView in bookmarkView trigger this so instead of rendering markup itself into DOM, it will return it as string

    this._clear();

    //inserting the markup to the container as the first child
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //This method updates only parts of UI
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup(); // create new markup but not render it, we generate this markup and compare new html to the current html

    const newDOM = document.createRange().createContextualFragment(newMarkup); //this will convert markup string into real DOM node objects --> newDOM is somehow virtual so like a DOM that is not really living on the page but lives in memory

    const newElements = Array.from(newDOM.querySelectorAll('*')); //returns a Nodelist --> convert to array
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );
    // Compare elements
    newElements.forEach((newEl, i) => {
      const curEl = currentElements[i];

      //isEqualNode compares content of elements, we want to only change the one with text, so select the firstChild that return a node because the child node contains the text --> take nodeValue and if it's a text it should not be empty(trim a whitespace)
      //Updates changes text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        //change the text content of currentEl to the content of newEl
        curEl.textContent = newEl.textContent;
      }

      //Updates changed attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(att =>
          curEl.setAttribute(att.name, att.value)
        );
        //explanation : newEl.attributes return an object of changed attributes, then it will convert to array and for each changed attribute, we get the name and set it to the value in the curEl
      }
    });
  }

  _clear() {
    //clearing the section from previous html code
    this._parentElement.innerHTML = '';
  }

  //Loading a spinner while getting response
  renderSpinner = function () {
    const markup = `
        <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
        </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  //This will display error message
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
          <div>
             <svg>
                <use href="${icons}#icon-alert-triangle"></use>
             </svg>
          </div>
          <p>${message}</p>
      </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //This will display success message
  renderMessage(message = this._successMessage) {
    const markup = `
      <div class="message">
          <div>
             <svg>
                <use href="${icons}#icon-smile"></use>
             </svg>
          </div>
          <p>${message}</p>
      </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
