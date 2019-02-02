// Initialize Firebase
var config = {
    apiKey: "AIzaSyBjVPoHKYuufGUJr88ccrVn5nyETfURdHk",
    authDomain: "train-schedule-4efc8.firebaseapp.com",
    databaseURL: "https://train-schedule-4efc8.firebaseio.com",
    projectId: "train-schedule-4efc8",
    storageBucket: "",
    messagingSenderId: "380557666937"
  };

firebase.initializeApp(config);
var database = firebase.database();

$(document).ready(function(){
    $("#submit-button").on("click", function(event){
        event.preventDefault();

        var trainName = $("#train-name-input").val().trim();
        var destination = $("#destination-input").val().trim();
        var firstTrainTime = $("#first-train-time-input").val().trim();
        var frequency = $("#frequency-input").val().trim();

        // Creates local "temporary" object for holding train data
        var newTrain = {
            nameData: trainName,
            destinationData: destination,
            firstTrainTimeData: firstTrainTime,
            frequencyData: frequency
        };
        // Pushes object to Firebase
        database.ref().push(newTrain);

        // Clears form input
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#first-train-time-input").val("");
        $("#frequency-input").val("");
    });
});

    // Creates Firebase event for adding train to database. 
    database.ref().on("child_added", function(childSnapshot) {
        
        var trainName = childSnapshot.val().nameData;
        var destination = childSnapshot.val().destinationData;
        var firstTrainTime = childSnapshot.val().firstTrainTimeData;
        var frequency = childSnapshot.val().frequencyData;

        // Conversions.
        var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
        
        // Difference between current time and first train.
        diffMinutes = moment().diff(moment(firstTimeConverted), "minutes");
        
        // Time apart (remainder)
        var remainder = diffMinutes % frequency;

        // Minute Until Train
        var minutesAway = frequency - remainder;
        
        // Next Train
        nextArrival = moment().add(minutesAway, "minutes");
        nextArrivalFormatted = moment(nextArrival).format('hh:mm A');


        var dataArray = [trainName, destination, frequency, nextArrivalFormatted, minutesAway]
        var newTr = $("<tr>");
        for (i = 0; i < dataArray.length; i++) {
            var newTd = $("<td>");
            newTd.text(dataArray[i]);
            newTr.append(newTd);
        }

        // Append new row to table body.
        $("#train-table").append(newTr);
    });

