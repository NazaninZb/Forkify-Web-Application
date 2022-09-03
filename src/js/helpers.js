//This module contains functions that will reuse over and over in app
import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

//This function will return a new promise which will reject after a number of seconds
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

//Refactoring getJSON and sendJSON into one function=> uploadData is by default undefind son when we dont have data, it is getJSON and when we have uploadData it's sendJSON
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPromise = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }, // headers are some text information about request itself
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    return data;
  } catch (err) {
    //re-throwing the err object to handle it in loadRecipe function in model.js
    throw err;
  }
};

////////////////////////////////////////////////////////

//This fuction do the fetching and converting to json
/*
export const getJSON = async function (url) {
  try {
    const fetchPromise = fetch(url);

    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    return data;
  } catch (err) {
    //re-throwing the err object to handle it in loadRecipe function in model.js
    throw err;
  }
};

//This function is sending JSON
export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPromise = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }, // headers are some text information about request itself
      body: JSON.stringify(uploadData),
    });

    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await response.json(); //API return the data that we sent

    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    return data;
  } catch (err) {
    //re-throwing the err object to handle it in loadRecipe function in model.js
    throw err;
  }
};
*/
