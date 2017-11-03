var i = 2;
var j = 30;
var speed = 1000;

var leftCars = ["#ob1", "#ob3", "#ob5", "#ob7"];
var rightCars = ["#ob2", "#ob4", "#ob6", "#ob8"];


$(document).ready(function() {
    var frog = $("#frog");


    window.setInterval(function() {
        collisionCheckerAll(frog);
    }, 100);


    startCars();



    $(document).keyup(function(e) {
        switch (e.which) {
            case 37:
                e.preventDefault();
                if (frog.position().left > 0) {
                    $(frog).animate({
                        left: '-=30'
                    }, {
                        duration: 100
                    }); //left arrow key
                }
                break;
            case 38:
                if (frog.position().top > 40) {

                    $(frog).animate({
                        top: '-=30'
                    }, {
                        duration: 100
                    }); //up arrow key
                } else {

                    updateLevel();

                }
                break;
            case 39:
                e.preventDefault();
                if (frog.position().left < 1090) {
                    $(frog).animate({
                        left: '+=30'
                    }, {
                        duration: 100
                    }); //right arrow key
                }
                break;
            case 40:
                if (frog.position().top < 400) {
                    $(frog).animate({
                        top: '+=30'
                    }, {
                        duration: 100
                    }); //bottom arrow key
                }
                break;
        }
    });
});



//https://stackoverflow.com/questions/4822524/continuous-movement-animation-with-jquery

var animateRight = function(targetElement, speed) {

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

var stopAnimation = function(targetElement) {
    $(targetElement).stop();
}



var startCars = function() {
    var n = 0;

    jQuery.each(rightCars, function(i, val) {
        n = Math.floor(Math.random() * 9) + 5;
        animateRight($(val), (speed * n));
    });

    jQuery.each(leftCars, function(i, val) {
        n = Math.floor(Math.random() * 9) + 5;
        animateLeft($(val), (speed * n));
    });
}

var stopCars = function() {

    jQuery.each(rightCars, function(i, val) {
        stopAnimation($(val));
    });

    jQuery.each(leftCars, function(i, val) {
        stopAnimation($(val));
    });
}



//https://stackoverflow.com/questions/4230029/jquery-javascript-collision-detection
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
        console.log("wreck");


        blinkBad()

        resetPosition();


    }
}
var collisionCheckerAll = function(frog) {
    for (var i = 1; i < 9; i++) {
        collideChecker($(frog), $("#ob" + i));
    }

}
var blinkBad = function() {
    var interval;

    interval = setInterval(function() {
        $("#board").toggleClass("board-flash-red");
    }, 100)
    setTimeout(function() {
        clearInterval(interval);
    }, 1000);
}
var blinkGood = function() {
    var interval;

    interval = setInterval(function() {
        $("#board").toggleClass("board-flash-white");
    }, 100)

    setTimeout(function() {
        clearInterval(interval);
    }, 1000);
}

var updateLevel = function() {
    $("#level").replaceWith("<h4 id=level>Level: " + i + "</h4>");
    i++;

    $("#points").replaceWith("<h4 id=points>Points: " + j + "</h4>");
    j += j;

    stopCars();
    blinkGood();
    resetPosition();
    increaseDifficulty();
    startCars();


    console.log(speed);
}

var resetPosition = function() {
    $(frog).css({ top: "400px", left: "550px" });
}

var increaseDifficulty = function() {
    speed -= 100;

    $('#street-left').each(function() {
        //add new car 
    });

}

//create info sequence