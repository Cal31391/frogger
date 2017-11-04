/*  Caroline Lee
    11-4-2017
    JS for Lab6
*/

//globals for various calculations//
var inc = 2; //level increment
var j = 15; //points increment
var speed = 1000; //car base speed
var num = 9; //number of car objects

var leftCars = ["#ob1", "#ob3", "#ob5", "#ob7"]; //array of car objects traveling left
var rightCars = ["#ob2", "#ob4", "#ob6", "#ob8"]; //array of car objects traveling right
var carColors = ["graycar", "bluecar", "pinkcar", "tancar", "redcar"]; //array of car color selectors

//main//
$(document).ready(function() {
    var frog = $("#frog");
    var modal = $("#info-modal");

    //maintains check for car-frog collision
    window.setInterval(function() {
        collisionCheckerAll(frog);
    }, 100);

    //removes info-modal from board
    $(modal).click(function() {
        $(modal).css({ display: "none" });
    });

    //initialize car movements
    startCars();

    //maps frog movements to arrow keys
    $(document).keyup(function(e) {
        switch (e.which) {
            case 37: //left arrow key
                e.preventDefault();
                if (frog.position().left > 0) {
                    $(frog).animate({
                        left: '-=30'
                    }, {
                        duration: 100
                    });
                }
                break;
            case 38: //up arrow key
                if (frog.position().top > 40) {

                    $(frog).animate({
                        top: '-=30'
                    }, {
                        duration: 100
                    });
                } else {
                    //update level if frog reaches top of board
                    updateLevel();
                }
                break;
            case 39: //right arrow key
                e.preventDefault();
                if (frog.position().left < 1090) {
                    $(frog).animate({
                        left: '+=30'
                    }, {
                        duration: 100
                    });
                }
                break;
            case 40: //bottom arrow key
                if (frog.position().top < 400) {
                    $(frog).animate({
                        top: '+=30'
                    }, {
                        duration: 100
                    });
                }
                break;
        }
    });
});

//functions to move cars across board
//source: https://stackoverflow.com/questions/4822524/continuous-movement-animation-with-jquery
var animateRight = function(targetElement, speed) {
    //moves cars to the right
    $(targetElement).css({ left: '-100%' });
    $(targetElement).animate({
        'left': $(document).width() + 200
    }, {
        duration: speed,
        complete: function() {
            animateRight(this, speed);
        }
    });
};
var animateLeft = function(targetElement, speed) {
    //moves cars to the left
    $(targetElement).css({ right: '-120%' });
    $(targetElement).animate({
        'right': $(document).width() + 200
    }, {
        duration: speed,
        complete: function() {
            animateLeft(this, speed);
        }
    });
};

//stop the cars
var stopCars = function() {
    //use array of car names to stop each car
    jQuery.each(rightCars, function(i, val) {
        stopAnimation($(val));
    });

    jQuery.each(leftCars, function(i, val) {
        stopAnimation($(val));
    });
}

//base function to stop cars
var stopAnimation = function(targetElement) {
    $(targetElement).stop();
}

//start the cars
var startCars = function() {
    var n = 0;
    //use array of car names to start each car
    jQuery.each(rightCars, function(i, val) {
        n = Math.floor(Math.random() * 5) + 5; //random speed
        animateRight($(val), (speed * n));
    });

    jQuery.each(leftCars, function(i, val) {
        n = Math.floor(Math.random() * 5) + 5;
        animateLeft($(val), (speed * n));
    });
}

//checks for collision between frog and any car
var collisionCheckerAll = function(frog) {
    for (var i = 1; i < num; i++) {
        collideChecker($(frog), $("#ob" + i));
    }
}

//checks each car position against frog position
//source: https://stackoverflow.com/questions/4230029/jquery-javascript-collision-detection
var collideChecker = function(frog, car) {

    var Frog = {};
    var Car = {};

    Frog.top = $(frog).offset().top;
    Frog.left = $(frog).offset().left;
    Frog.right = Number($(frog).offset().left) + Number($(frog).width());
    Frog.bottom = Number($(frog).offset().top) + Number($(frog).height());

    Car.top = $(car).offset().top;
    Car.left = $(car).offset().left;
    Car.right = Number($(car).offset().left) + Number($(car).width());
    Car.bottom = Number($(car).offset().top) + Number($(car).height());

    if (Frog.right > Car.left && Frog.left < Car.right && Frog.top < Car.bottom && Frog.bottom > Car.top) {
        //console.log("wreck");

        blinkBad() //blink border red
        resetPosition(); //put frog back at bottom sidewalk
        decreaseScore(); //decrease the score
    }
}

//updates level when frog reaches top sidewalk
var updateLevel = function() {
    //increase level
    $("#level").replaceWith("<h4 id=level>Level: " + inc + "</h4>");

    //increase points
    j += j; //configure to increase points added each time
    $("#points").replaceWith("<h4 id=points>Points: " + j + "</h4>");

    //stop the cars to reset speeds(for speed increases and new cars added)
    stopCars();

    //if player hasn't reached level 20
    if (inc <= 20) {
        //if level is multiple of 5, add some cars
        if (inc % 5 == 0) {
            addCars();
        }
        //if level is multiple of 2, increase speeds
        if (inc % 2 == 0) {
            increaseSpeed();
        }
        inc++;
    } else {
        //if player has reached level 20, end game or restart
        $("#done-modal").css({ display: "block" });
    }

    blinkGood(); //blink border white
    resetPosition(); //reset frog for new level
    startCars(); //start the cars again
}

//blinks the border red
var blinkBad = function() {
    var interval;

    interval = setInterval(function() {
        $("#board").toggleClass("board-flash-red");
    }, 100)
    setTimeout(function() {
        clearInterval(interval);
    }, 1000);
}

//blinks the border white
var blinkGood = function() {
    var interval;

    interval = setInterval(function() {
        $("#board").toggleClass("board-flash-white");
    }, 100)

    setTimeout(function() {
        clearInterval(interval);
    }, 1000);
}

//decreases the score by 20%
var decreaseScore = function() {
    if (j > 30) {
        j -= Math.floor(j / 5);
        $("#points").replaceWith("<h4 id=points>Points: " + j + "</h4>");
    }
}

//resets the frog to bottom sidewalk
var resetPosition = function() {
    $(frog).css({ top: "400px", left: "550px" });
}

//adds cars to board
var addCars = function() {
    //var streetleft = "";
    //var streetright = "";
    var newCarCode = ""; //holds html for new car
    var $streetL = $(".street-left"); //all left streets
    var $streetR = $(".street-right"); //all right streets

    var carLCSS = { //css for new left cars
        "right": "-120%",
        "z-index": "10",
        "height": "30px",
        "width": "60px",
        "display": "inline-block",
        "position": "relative"
    };
    var carRCSS = { //css for new right cars
        "left": "-100%",
        "z-index": "10",
        "height": "30px",
        "width": "60px",
        "display": "inline-block",
        "position": "relative"
    };

    $streetL.each(function() {
        var colorNum = Math.floor(Math.random() * 3) + 2; //picks color for new car
        newCarCode = '<div id="ob' + num + '"><img src="./images/' +
            carColors[colorNum] + '.png"></div>'; //html for new car
        $(this).append(newCarCode); //add car to street
        $("#ob" + num).css(carLCSS); //add css to car
        leftCars.push("#ob" + num); //add new car object to leftCars array
        num++;
    });

    $streetR.each(function() { //same as above, but for right streets/cars
        var colorNum = Math.floor(Math.random() * 2);
        newCarCode = '<div id="ob' + num + '"><img src="./images/' +
            carColors[colorNum] + '.png"></div>';
        $(this).append(newCarCode);
        $("#ob" + num).css(carRCSS);
        rightCars.push("#ob" + num);
        num++;
    });
}

//increase car speed
var increaseSpeed = function() {
    speed -= 30;
}

//reload the game with confirmation
var reloadGame = function() {
    if (confirm("Are you sure you want to start a new game?")) {
        location.reload();
    }
}

//reloard the game without confirmation
var restartGame = function() {
    location.reload();
}

//quit the game, leave page
var exitGame = function() {
    if (confirm("Close Window?")) {

        window.open('about:blank', '_self', '');
        window.close();
    }
}

//load the info modal
var loadInfo = function() {
    $("#info-modal").css({ display: "block" });
}