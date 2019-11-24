//array of movies
var seriesArray = ["Brooklyn99", "Arrested Development", "VEEP", "The Good Place", "Family Guy", "New Girl", "Parks and Rec", "Seinfeld", "Rick and Morty", "Big Bang Theory"];

//appending buttons to the page
function renderButtons() {
    $("#buttonsGoHere").empty();
    //looping through the array of buttons
    for (var i = 0; i < seriesArray.length; i++) {
        //creates the button
        var button = $("<button>");
        //adds a class to the a
        button.addClass("btn btn-primary btn-lg");
        //adds the "still to gif"
        button.attr("data-series", seriesArray[i]);
        //adding text to the array
        button.text(seriesArray[i]);
        //adding the buttons to the html
        $("#buttonsGoHere").append(button);
    }
};

// Event listener for all button elements
$("#add-button").on("click", function () {
    event.preventDefault();
    //takes the text from the user input
    var newButton = $("#series-input").val().trim();
    // The show from the textbox is then added to our array
    seriesArray.push(newButton);
    //call the adding buttons function    
    renderButtons();
});

function settingQueryURL(info) {
    var series = $(info).attr("data-series");

    // Constructing a URL to search Giphy for the name of the show the user typed in
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        series + "&api_key=sGDottdSQjNdy0oPpehnSY6FIv2nKUTx&limit=10";
    
    // Performing our AJAX GET request
    $.ajax({
            url: queryURL,
            method: "GET"
        })
        // After the data comes back from the API
        .then(function (response) {
            // Storing an array of results in the results variable
            var results = response.data;

            // Looping over every result item
            for (var i = 0; i < results.length; i++) {

                // Only taking action if the photo has an appropriate rating
                if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
                    // Creating variables
                    var gifDiv = $("<div>");
                    var rating = results[i].rating;
                    var p = $("<p>").text("Rating: " + rating);
                    var showImage = $("<img>");
                    // Make sure to grab the still images so you can unpause on click
                    showImage.attr("src", results[i].images.fixed_height_still.url);
                    showImage.attr("data-still", results[i].images.fixed_height_still.url);
                    showImage.attr("data-animate", results[i].images.fixed_height.url)
                    showImage.attr("data-state", "still")
                    showImage.addClass("gif");
                    
                    // Appending the paragraph and showImage we created to the "gifDiv" div we created gifDiv.append(p);
                    gifDiv.append(showImage);
                    gifDiv.append(p);
                    // Prepending the gifDiv to the div in the HTML
                    $("#seriesGifs").prepend(gifDiv);
                }
            }
        });
} 

$(document).on("click", ".gif", function() {
    // set an attribute to my gif
    var state = $(this).attr("data-state");
    // If the clicked image's state is still, update its src attribute to what its data-animate value is.
    // Then, set the image's data-state to animate
    // Else set src to the data-still value
    if (state === "still") {
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");
    } else {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
    }
    });


$(document).on("click", ".btn", function(){
    var oldButton = this;
    event.preventDefault();
    //setting the url to the button
    settingQueryURL(oldButton);
    });

//calling renderButtons funciton
renderButtons();