//This view is for getting query and search results to use and listen for the click event on the button

class SearchView {
  _parentElement = document.querySelector('.search');

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  //Clearing input field after search
  _clearInput() {
    return (this._parentElement.querySelector('.search__field').value = '');
  }

  addHandlerSearch(handler) {
    //we add the event listener to the entire form so we can listen for the submit event -->  user clicks the submit button or hits the Enter
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
