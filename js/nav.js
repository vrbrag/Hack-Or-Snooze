"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show story submitted form once "submit" is clicked */
$navSubmitStory.on('click', navSubmitStoryClick)

function navSubmitStoryClick(evt) {
  console.debug("navSubmitStoryClick", evt)
  hidePageComponents()
  $allStoriesList.show()
  $submitForm.show()
}

/**Show my stories list once click on "My Stories" */
$navMyStories.on('click', navMyStoriesClick)

function navMyStoriesClick(evt) {
  console.debug("navMyStoriesClick", evt)
  hidePageComponents()
  putUserStoriesOnPage()
  $ownStories.show()
}

/**On click, show list of favorites */
$navFavorites.on('click', navFavoritesClick)

function navFavoritesClick(evt) {
  console.debug('navFavoritesClick')
  hidePageComponents()
  putFavoritesOnPage()
  $favoriteStoriesList.show()
}