$(document).ready(function () {

    /*FireBase
    ==============================================================*/
    // Initialize Firebase
        var config = {
        apiKey: "AIzaSyBFDe30K1qzN5WpvUzFazHcYLqAr4F2CuI",
        authDomain: "train-8ba27.firebaseapp.com",
        databaseURL: "https://train-8ba27.firebaseio.com",
        projectId: "train-8ba27",
        storageBucket: "train-8ba27.appspot.com",
        messagingSenderId: "679169163903",
      };
      firebase.initializeApp(config);

    //Reference database
    database = firebase.database();

    /*Global Variables
    ==============================================================*/
    var trainName = '';
    var dest = '';
    var firstTrainTime = '';
    var freq = '';

    //Conversion Variable
    var firstTimeConverted = '';
    var diffTime = '';
    var tRemainder;
    var tMinutesTillTrain;
    var nextTrain;

    //Data reference
    var trainNameData = '';
    var destData = '';
    var arrivalData = '';
    var freqData = '';
    var minutesAwayData = '';

    /*Functions
    ==============================================================*/
    //When Submit button is clicked.....
    $('#submit').on('click', function (event) {
        event.preventDefault();
        //Get input info
        trainName = $('#trainName').val().trim();
        dest = $('#dest').val().trim();
        firstTrainTime = $('#firstTrainTime').val().trim();
        freq = $('#freq').val().trim();

        //Removed input info 
        $('#trainName').val('');
        $('#dest').val('');
        $('#firstTrainTime').val('');
        $('#freq').val('');

        //Conversion
        //Convert to HH:MM
        firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
        //Converts the firsTimeCover object into string

        // Current Time
        var currentTime = moment();
        diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        // Time apart (remainder)
        tRemainder = diffTime % freq;

        // Minute Until Train
        tMinutesTillTrain = freq - tRemainder;

        // Next Train
        nextTrain = moment().add(tMinutesTillTrain, "minutes");
        nextTrainFormat = moment(nextTrain).format('hh:mm');

        database.ref('/train').push({
            trainName: trainName,
            destination: dest,
            arrival: nextTrainFormat,
            minutesAway: tMinutesTillTrain,
            frequency: freq,
        });
    });

    database.ref('/train').on('child_added', function (snapshot) {
        //Testing
        trainNameData = snapshot.val().trainName;
        destData = snapshot.val().destination;
        arrivalData = snapshot.val().arrival;
        freqData = snapshot.val().frequency;
        minutesAwayData = snapshot.val().minutesAway;

        console.log(trainNameData);
        console.log(destData);
        console.log(arrivalData);
        console.log(freqData);
        console.log(minutesAwayData);

        //Data array
        var dataArray = [trainNameData, destData, freqData, arrivalData, minutesAwayData];
        var newTr = $('<tr>');
        for (var i = 0; i < dataArray.length; i++) {
            var newTd = $('<td>');
            newTd.text(dataArray[i]);
            newTd.appendTo(newTr);
        }
        $('.table').append(newTr);
    });
});// End of line