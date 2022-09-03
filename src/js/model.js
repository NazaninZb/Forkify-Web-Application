//This is a module so we export parts that we wanna use in other files

import { async } from 'regenerator-runtime';
import { API_URL, RESULT_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

//This is an object which holds the app state
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULT_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const recipe = data.data.recipe;
  //This is gonna manipulate the recipe in the state object while calling:
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), //add key property conditionally
  };
};

//This function is responsible for fetching recipe data from API

//Get 1 specific recipe
// Note : fetch function yek promise barmigardoone az oonjaei ke tooye yek tabe anync hatim ba await execution code ro stop mikonim ama block nemishe o moshkeli pish nemiyad chon async dar background run mishe
// vaghti result(object response) ro gereftim bayad be json tabdilesh konim ke dobare promise barmigardoone o bayad await konim
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

    //check if there's a recipe with the same ID in the bookmark state-->mark the current recipe bookmarked=true
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (err) {
    console.error(`${err} this is model error`);
    throw err;
  }
};

//Implementing the search functionality
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1; //reseting the page number after each search
  } catch (err) {
    throw err;
  }
};

//Showing 10 results in one page
export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;

  const startR = (page - 1) * state.search.resultsPerPage; //start from 0
  const endR = page * state.search.resultsPerPage; //ends with 9 because slice method doesn't consider the last argumant
  return state.search.results.slice(startR, endR);
};

//Update number of servings --> change the quantity in each ingredient in recipe
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    //Formula : new quantity = old quantity * new servings / old servings
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

//Saving bookmarks into localStorage
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks)); //stringify converts object to string
};

//Bookmarking the recipes--> recieves a recipe object and set that as a bookmark
export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark the current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Finding index if the id in bookmarks array and then remove it
  const index = state.bookmarks.findIndex(element => element.id === id);

  state.bookmarks.splice(index, 1);

  // Marking the cueent recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  //Get data from local storge
  const storage = localStorage.getItem('bookmarks');
  //if there were any data, convert from string to object and set it to state.bookmarks
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearAllBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearAllBookmarks();

//This function make a request to the API
export const uploadNewRecipe = async function (newRecipe) {
  // Transform raw data to the same format as API data:

  //Array of ingredients => 1)converting newRecipe object into arrays and by filtering it, we take out entries that their first element starts with 'ingredient' and the second element should not be empty. 2)then mapping it foreach entry replace all whitespaces with empty string and splitting each one by ',' so that it returns an array of 3 elements
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingArray = ing[1].replaceAll(' ', '').split(',');
        const ingArray = ing[1].split(',').map(el => el.trim());
        //test fot the array actually has the length of 3
        if (ingArray.length !== 3)
          throw new Error(
            'Wrong ingredient format, Please follow the correct format! '
          );

        const [quantity, unit, description] = ingArray;
        //if there's a quantity convert that to a number and if not [or its epmty string] return null
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    console.log(ingredients);

    //Create new recipe object that is ready to be uploaded
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe);

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe); //data is out returned recipe that sent to API
    state.recipe = createRecipeObject(data); //converting again to our format for load and display
    addBookmark(state.recipe); //bookmarking it
  } catch (err) {
    throw err;
  }
};
