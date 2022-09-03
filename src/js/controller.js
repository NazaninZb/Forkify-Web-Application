import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime'; //this+corejs helps polifiling or helping old browsers understand this code
import { async } from 'regenerator-runtime';

//This comes from parcel (not really js), helps maintaining the state of the page, if we change something in modules, it rebuild without reloading the page (the changes automatically injected to the page)
// if (module.hot) {
//   module.hot.accept();
// }
//API documentation that used for the project:
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); //getting recipe id from url after # sign

    if (!id) return; //if there is no id in url we dont get any error as alert, first page show-up

    recipeView.renderSpinner();

    // 1.Update results view to mark selected search result
    resultsView.update(model.getSearchResultPage());

    // 2.Updating bookmarks panel (each time we display a recipe) so it can highlight the current recipe not the previous chosen one
    bookmarksView.update(model.state.bookmarks);

    // 3.Loading recipe
    await model.loadRecipe(id);

    // 4.Rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Laod search results
    await model.loadSearchResults(query);

    // 3. Render results
    resultsView.render(model.getSearchResultPage(1));

    // 4. Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1- Render new results --> render will overwrite markup that was there previously
  resultsView.render(model.getSearchResultPage(goToPage));

  // 2- Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update recipe servings in state (in model)
  model.updateServings(newServings);

  // Update recipe view based on changes
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

//Controller for adding the bookmark
const controlAddBookmark = function () {
  // Add or Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update recipe view(bookmark icon)
  recipeView.update(model.state.recipe);

  //Render bookmarks on panel
  bookmarksView.render(model.state.bookmarks);
};

//We need to render bookmarks in the beginning when we load the page, so in the init method of model, bookmarks load from localStorage and as app starts, this below method renders to load previous bookmarks
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

//Adding new recipe is a new API call, this conroller is the handler of doing that
const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner for uploading
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadNewRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe in the recipeView
    recipeView.render(model.state.recipe);

    //Display success message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change the ID in the URL by history API : pushState changes URL without reloading page, 1st argument is state, 2nd is title that not relevant, 3rd is url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close the form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    //Reset add new recipe form
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
};

//Program Starts : This will call the handler method in Views and pass the controlRecipes,... as subscriber that react to event
const init = function () {
  bookmarksView.addHandlerRenderBM(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
