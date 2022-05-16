"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  const hostName = story.getHostName();
  const showStar = Boolean(currentUser)
  return $(`
      <li id="${story.storyId}">
        ${showDeleteBtn ? deleteBtnHTML() : ""}
        ${showStar ? favoriteHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/**Delete story button */
function deleteBtnHTML() {
  return `
    <span class="trash-can">
      <i class="fas fa-trash-alt">
      </i>
    </span>`;
}
/**Favorites button */
function favoriteHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/**Remove stories from page */
$ownStories.on('click', ".trash-can", deleteStory)

async function deleteStory(evt) {
  console.debug("deleteStory", evt)

  const $evt = $(evt.target)
  const $clostestLi = $evt.closest('li') // get closest listed <li> to click
  const storyId = $clostestLi.attr('id') // get storyId

  // remove story instance from storyList 
  await storyList.removeStory(currentUser, storyId)

  await putUserStoriesOnPage()
}


/** Submitting new story form **************/
$submitForm.on('submit', submitStory)

async function submitStory(evt) {
  evt.preventDefault()

  const username = currentUser.username
  const author = $('#create-author').val()
  const title = $('#create-title').val()
  const url = $('#create-url').val()

  const storyData = { username, title, author, url }

  const story = await storyList.addStory(currentUser, storyData)

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  $submitForm.trigger('reset')
}

/** Save user stories to $ownStories */
function putUserStoriesOnPage() {
  console.debug('putUserStoriesOnPage')
  $ownStories.empty()

  if (currentUser.ownStories.length === 0) {
    $ownStories.append('<h5>No user stories added!</h5>')
  }
  else {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true)
      $ownStories.append($story)
    }
  }
  $ownStories.show()
}

/**Favorites ****************/
async function handleFavoriteStories(evt) {
  const $evt = $(evt.target)

  const $clostestLi = $evt.closest('li') // get closest listed <li> to click
  const storyId = $clostestLi.attr('id') // get storyId
  const story = storyList.stories.find(arr => arr.storyId === storyId)

  //if favorited already -> removeFavorite/toggle <i> clas to far
  if ($evt.hasClass("fas")) {
    await currentUser.removeFavoriteStory(story)
    $evt.closest('i').toggleClass("fas far")
  }
  // else -> addFavorite/toggle <i> class to fas
  else {
    await currentUser.addFavoriteStory(story)
    $evt.closest('i').toggleClass("fas far")
  }
}

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage")

  $favoriteStoriesList.empty()

  // loop thru favorites to make $story into HTML using generateStoryMarkup() - adds <li>
  if (currentUser.favorites.length === 0) {
    $favoriteStoriesList.append("<h5>No favorites added!</h5>")
  }
  else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story)
      $favoriteStoriesList.append($story)
    }
  }
  /** Change favorite-stories from hidden to showing */
  $favoriteStoriesList.show()
}

$storiesList.on('click', ".star", handleFavoriteStories)