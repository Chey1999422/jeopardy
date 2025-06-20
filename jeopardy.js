// You only need to touch comments with the todo of this file to complete the assignment!

/*
=== How to build on top of the starter code? ===

Problems have multiple solutions.
We have created a structure to help you on solving this problem.
On top of the structure, we created a flow shaped via the below functions.
We left descriptions, hints, and to-do sections in between.
If you want to use this code, fill in the to-do sections.
However, if you're going to solve this problem yourself in different ways, you can ignore this starter code.
 */

/*
=== Terminology for the API ===

Clue: The name given to the structure that contains the question and the answer together.
Category: The name given to the structure containing clues on the same topic.
 */

/*
=== Data Structure of Request the API Endpoints ===

/categories:
[
  {
    "id": <category ID>,
    "title": <category name>,
    "clues_count": <number of clues in the category where each clue has a question, an answer, and a value>
  },
  ... more categories
]

/category:
{
  "id": <category ID>,
  "title": <category name>,
  "clues_count": <number of clues in the category>,
  "clues": [
    {
      "id": <clue ID>,
      "answer": <answer to the question>,
      "question": <question>,
      "value": <value of the question (be careful not all questions have values) (Hint: you can assign your own value such as 200 or skip)>,
      ... more properties
    },
    ... more clues
  ]
 */
document.addEventListener("DOMContentLoaded", () => {
  // This event listener ensures that the code runs after the DOM is fully loaded.
  $("#play").on("click", handleClickOfPlay); // Sets up the click event for the play button.

});

// Initial setup for the game.
$("#play").on("click", handleClickOfPlay); // Sets up the click event for the play button.
const API_URL = "https://rithm-jeopardy.herokuapp.com/api/"; // The URL of the API.
const NUMBER_OF_CATEGORIES = 6; // The number of categories you will be fetching. You can change this number.
const NUMBER_OF_CLUES_PER_CATEGORY = 5; // The number of clues you will be displaying per category. You can change this number.

let categories = [5]; // The categories with clues fetched from the API.


function getCategories (){
  return res.data; // This will return the categories fetched from the API.
}
// NOTICE WE HAVE PROVIDED THE VALUE 100 FOR THE <count> query
// what is in our res variable?
// checking out res.data will produce the following result //

/*
[
  {
    "id": <category ID>,
    "title": <category name>,
    "clues": [
      {
        "id": <clue ID>,
        "value": <value (e.g. $200)>,
        "question": <question>,
        "answer": <answer>
      },
      ... more categories
    ]
  },
  ... more categories
]
 */

let activeClue = null; // Currently selected clue data.
let activeClueMode = 0; // Controls the flow of #active-clue element while selecting a clue, displaying the question of selected clue, and displaying the answer to the question.
/*
0: Empty. Waiting to be filled. If a clue is clicked, it shows the question (transits to 1).
1: Showing a question. If the question is clicked, it shows the answer (transits to 2).
2: Showing an answer. If the answer is clicked, it empties (transits back to 0).
 */

let isPlayButtonClickable = true; // Only clickable when the game haven't started yet or ended. Prevents the button to be clicked during the game.

$("#play").on("click", handleClickOfPlay);


/**
 * Manages the behavior of the play button (start or restart) when clicked.
 * Sets up the game.
 *
 * Hints:
 * - Sets up the game when the play button is clickable.
 */
function handleClickOfPlay (clickEvent)
{
  if (isPlayButtonClickable)
  {
    isPlayButtonClickable = false; // Prevents the button from being clicked again until the game is set up.
    $("#play").text("Loading..."); // Changes the button text to indicate loading.
    setupTheGame(); // Calls the function to set up the game.
  }}
  
/**
 * Sets up the game.
 *
 * 1. Cleans the game since the user can be restarting the game.
 * 2. Get category IDs
 * 3. For each category ID, get the category with clues.
 * 4. Fill the HTML table with the game data.
 *
 * Hints:
 * - The game play is managed via events.
 */
async function setupTheGame ()
{
  // 1. Cleans the game since the user can be restarting the game.
  categories = [];
  activeClue = null;
  activeClueMode = 0;
  isPlayButtonClickable = false;
  $("#play").text("Loading...");

  // 2. Get category IDs
  const categoryIds = await getCategoryIds();
 
  // 3. For each category ID, get the category with clues.
  for (const categoryId of categoryIds)
  {
    const id= categoryId.id;
    const title= categoryId.title;
    const categoryData = await getCategoryData(id, title);
    categories.push(categoryData);
  }

  // 4. Fill the HTML table with the game data.
  fillTable(categories);

  $("#play").text("Restart the Game!"); // Changes the button text to indicate restart.
}

/**
 * Gets as many category IDs as in the `NUMBER_OF_CATEGORIES` constant.
 * Returns an array of numbers where each number is a category ID.
 *
 * Hints:
 * - Use /categories endpoint of the API.
 * - Request as many categories as possible, such as 100. Randomly pick as many categories as given in the `NUMBER_OF_CATEGORIES` constant, if the number of clues in the category is enough (<= `NUMBER_OF_CLUES` constant).
 */
async function getCategoryIds (){ 
  const response = await fetch(`${API_URL}categories?count=100`); // Fetches categories from the API.
  const shuffledCategories = await response.json(); // Parses the response as JSON.
 

  // Gets the categories from the response.
  // Filters categories to get only those with enough clues (>= NUMBER_OF_CLUES_PER_CATEGORY) and randomly selects the required number of categories.
  // Only categories with at least NUMBER_OF_CLUES_PER_CATEGORY clues are included.
  // Filter first, then shuffle to avoid unnecessary work on large arrays
  const filteredCategories = shuffledCategories.filter(category => category.clues_count >= NUMBER_OF_CLUES_PER_CATEGORY);
  // Fisher-Yates shuffle
  // First filter, then shuffle the filtered categories using Fisher-Yates shuffle
  const filteredCategoriesCopy = filteredCategories.slice();
  for (let i = filteredCategoriesCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filteredCategoriesCopy[i], filteredCategoriesCopy[j]] = [filteredCategoriesCopy[j], filteredCategoriesCopy[i]];
  }
  return shuffledCategories; // Returns the IDs of the selected categories.
}
 /*    "id": <category ID>
 *    "title": <category name>
 *    "clues": [
 *      {
 *        "id": <clue ID>,
 *        "value": <value of the question>,
 *        "question": <question>,
 *        "answer": <answer to the question>
 *      },
 *      ... more clues
 *    ]
 *  }
 *
 * Hints:
 * - You need to call this function for each category ID returned from the `getCategoryIds` function.
 * - Use /category endpoint of the API.
 * - In the API, not all clues have a value. You can assign your own value or skip that clue.
 */

async function getCategoryData (categoryId, title)
{ 
  const categoryWithClues = {
    id: categoryId,
    title: title, // todo set after fetching
    clues: [] 
    // todo set after fetching
  };

  // todo fetch the category with NUMBER_OF_CLUES_PER_CATEGORY amount of clues
let response = await axios.get(`https://rithm-jeopardy.herokuapp.com/api/category?
id=${categoryId}`)
  //const data = await response.json(); // Parses the response as JSON.
 
  const responseClues= response.data.clues
  categoryWithClues.clues= responseClues
  return categoryWithClues;
}
 
/**
 * Fills the HTML table using category data.
 *
 * Hints:
 * - You need to call this function using an array of categories where each element comes from the `getCategoryData` function.
 * - Table head (thead) has a row (#categories).
 *   For each category, you should create a cell element (th) and append that to it.
 * - Table body (tbody) has a row (#clues).
 *   For each category, you should create a cell element (td) and append that to it.
 *   Besides, for each clue in a category, you should create a row element (tr) and append it to the corresponding previously created and appended cell element (td).
 * - To this row elements (tr) should add an event listener (handled by the `handleClickOfClue` function) and set their IDs with category and clue IDs. This will enable you to detect which clue is clicked.
 */
function fillTable (categories)
{
  // Clear the table first
  $("#categories").empty();
  $("#clues").empty();

  // Fill the table head with categories
  for (const category of categories)
  {
    const th = $("<th>").text(category.title).attr("id", `category-${category.id}`);
    $("#categories").append(th);
  }

  // Fill the table body with clues
  for (const category of categories)
  {
    const td = $("<td>").attr("id", `clue-${category.id}`);
    $("#clues").append(td);

    for (const clue of category.clues)
    {
      const tr = $("<tr>")
        .addClass("clue")
        .attr("id", `clue-${category.id}-${clue.id}`)
        .data("categoryId", category.id)
        .data("clueId", clue.id)
        .append($("<td>").text(clue.value || "No Value"))
        .append($("<td>").text(clue.question || "No Question"));

      td.append(tr);
    }
  }
}


  // Attach click handler to all clue cells
  $(".clue").on("click", handleClickOfClue);

/**
 * Manages the behavior when a clue is clicked.
 * Displays the question if there is no active question.
 *
 * Hints:
 * - Control the behavior using the `activeClueMode` variable.
 * - Identify the category and clue IDs using the clicked element's ID.
 * - Remove the clicked clue from categories since each clue should be clickable only once. Don't forget to remove the category if all the clues are removed.
 * - Don't forget to update the `activeClueMode` variable.
 *
 */
addEventListener("click", handleClickOfClue);
function handleClickOfClue (event) {
  const clickedElement = $(event.currentTarget); // Get the clicked element
  const categoryId = clickedElement.data("categoryId"); // Get the category ID from the clicked element
  const clueId = clickedElement.data("clueId"); // Get the clue ID from the clicked element

  // Find the category and clue in the categories array
  const category = categories.find(cat => cat.id === categoryId);
  if (!category) return; // If no category found, exit

  const clueIndex = category.clues.findIndex(clue => clue.id === clueId);
  if (clueIndex === -1) return; // If no clue found, exit

  // If activeClueMode is 0, display the question
  if (activeClueMode === 0)
  {
    activeClueMode = 1; // Set mode to displaying question
    activeClue = category.clues[clueIndex]; // Set the active clue
    $("#active-clue").html(activeClue.question); // Display the question in #active-clue

    // Remove the clicked clue from the category
    category.clues.splice(clueIndex, 1);

    // If no clues left in the category, remove the category
    if (category.clues.length === 0)
    {
      categories = categories.filter(cat => cat.id !== categoryId);
      $(`#category-${categoryId}`).remove(); // Remove the category header
      $(`#clue-${categoryId}`).remove(); // Remove the clues cell
    }
  }
}


$("#active-clue").on("click", handleClickOfActiveClue);

/**
 * Manages the behavior when a displayed question or answer is clicked.
 * Displays the answer if currently displaying a question.
 * Clears if currently displaying an answer.
 *
 * Hints:
 * - Control the behavior using the `activeClueMode` variable.
 * - After clearing, check the categories array to see if it is empty to decide to end the game.
 * - Don't forget to update the `activeClueMode` variable.
 */
addEventListener("click", handleClickOfActiveClue);
function handleClickOfActiveClue (event){
  if (activeClueMode === 0)
  {
    // If no active clue, do nothing
    return;
}
  if (activeClueMode === 1)
  {
    activeClueMode = 2;
    $("#active-clue").html(activeClue.answer);
  }
  else if (activeClueMode === 2)
  {
    activeClueMode = 0;
    $("#active-clue").html(null);

    if (categories.length === 0)
    {
      isPlayButtonClickable = true;
      $("#play").text("Restart the Game!");
      $("#active-clue").html("The End!");
    }
  }
}
function handleResetGame () {
  // Reset the game state

  categories = [];
  activeClue = null;
  activeClueMode = 0;
  isPlayButtonClickable = true;
  $("#play").text("Start the Game!");
  $("#active-clue").html("");
  $("#categories").empty();
  $("#clues").empty();
}