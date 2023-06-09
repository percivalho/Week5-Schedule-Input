// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
//$(function () {
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.
//});

// global variables
var timeEl = $('.time-block');
var messageEl = $('#message');

// mapping between id and the time
var hours = [
  { id: "hour-9", time: "9AM" },
  { id: "hour-10", time: "10AM" },
  { id: "hour-11", time: "11AM" }, 
  { id: "hour-12", time: "12PM" },
  { id: "hour-13", time: "1PM" },
  { id: "hour-14", time: "2PM" },
  { id: "hour-15", time: "3PM" },
  { id: "hour-16", time: "4PM" },
  { id: "hour-17", time: "5PM" },
  { id: "hour-18", time: "6PM" },
  { id: "hour-19", time: "7PM" },
  { id: "hour-20", time: "8PM" },
  { id: "hour-21", time: "9PM" },
  { id: "hour-22", time: "10PM" },
  { id: "hour-23", time: "11PM" }
];

/**
 * To update the TextArea showing which is past/present/future
 * @param None
 * @returns None
 */
function updateTextArea(){

  var container = $(".container-lg").children();
  //console.log(container);

  for (var i=0; i<container.length; i++){
    var nowHH =  parseInt(dayjs().format("HH"));
    //var nowHH =  parseInt(dayjs().format("ss"));
    //console.log(nowHH);  
    var timeEl = $(".container-lg").children().eq(i);
    var hourInt = parseInt(timeEl.attr("id").split('-')[1]);
    //console.log(hourInt);
    //console.log($(".container-lg").children().eq(i).children().eq(1));
    if (nowHH > hourInt){   //past 
      $(".container-lg").children().eq(i).children().eq(1).addClass('past');
      $(".container-lg").children().eq(i).children().eq(1).removeClass('present');
      $(".container-lg").children().eq(i).children().eq(1).removeClass('future');
      //console.log("past");
    } else if (nowHH == hourInt){ //present
      $(".container-lg").children().eq(i).children().eq(1).addClass('present');
      $(".container-lg").children().eq(i).children().eq(1).removeClass('past');
      $(".container-lg").children().eq(i).children().eq(1).removeClass('future');
      //console.log("present");
    } else if (nowHH < hourInt){  //future
      $(".container-lg").children().eq(i).children().eq(1).addClass('future');
      $(".container-lg").children().eq(i).children().eq(1).removeClass('past');
      $(".container-lg").children().eq(i).children().eq(1).removeClass('present');
      //console.log("future");
    }
  }
}

/**
 * To append all hours entries to display
 * @param None
 * @returns None
 */
function appendEntries(){

  hours.forEach(function(hour) {

    var hourInt = parseInt(hour.id.split('-')[1]);
    //console.log(hourInt);
    var nowHH =  parseInt(dayjs().format("HH"));
    //console.log(nowHH);

    var hoursDiv = $("<div>");
    hoursDiv.attr("id", hour.id);
    hoursDiv.addClass("row time-block");

    var hours2Div = $("<div>");
    hours2Div.addClass("col-2 col-md-1 hour text-center py-3")
    hours2Div.text(hour.time);

    var textarea = $("<textarea>");
    textarea.addClass("col-8 col-md-10 description text-dark");
    textarea.attr("rows", "3");
    textarea.attr("placeholder", "No task has been scheduled yet");

    // retrieve localStorage
    if (localStorage.getItem(hour.id) != null){
      textarea.val(localStorage.getItem(hour.id));
    }

    var saveButton = $("<button>");
    saveButton.addClass("btn saveBtn col-2 col-md-1");
    saveButton.attr("aria-label", "save");

    var saveIcon = $("<i>");
    saveIcon.addClass("fas fa-save");
    saveIcon.attr("aria-hidden", "true");

    // Append the elements to the timeBlock
    hoursDiv.append(hours2Div).append(textarea).append(saveButton.append(saveIcon));

    // Append the timeBlock to the container-lg
    $(".container-lg").append(hoursDiv);
  });
}

/**
 * To fade in the message on save button, and then fade out in 3s
 * @param None
 * @returns None
 */
function displayMessage() {
  messageEl.fadeIn();
  setTimeout(function() {
    messageEl.fadeOut();
  }, 3000);
}

/**
 * To save the text Input to local Storage
 * @param event : for event target, using this
 * @returns None
 */
function saveLocalStorage(event){
  var id = $(this).parent().attr("id");
  var textInput = $(this).parent().children().eq(1).val()
  //console.log(id);
  //console.log(textInput);

  // only save when there is entry to the schedule
  if (textInput != ''){
    localStorage.setItem(id, textInput);
    // display saved message after saved to local Storage
    displayMessage();
  }
}

/**
 * to update the time using DayJS
 * @param none
 * @returns None
 */
function updateTime() {
  //var b = dayjs().format();
  //console.log(b);
  //var a =  dayjs().format("MMMM D, YYYY HH:mm:ss");
  //console.log(a);
  $("#currentDay").text(dayjs().format("dddd, MMMM D, YYYY HH:mm:ss a"));  
}

// on document ready, perform the following functions
$(document).ready(function(){
  // update the time to display out
  updateTime();

  // update time on every 1s
  setInterval(updateTime, 1000);

  // update the textArea coloring every min 
  setInterval(updateTextArea, 60000); //updateTextArea on every 1min

  // add entry to div
  appendEntries();  

  // update TextArea coloring
  updateTextArea(); // need append Entries then update text area
  
  // Delegate event listener to the parent element, <div id="buttons">
  $(document).on('click', '.saveBtn', saveLocalStorage);

});
