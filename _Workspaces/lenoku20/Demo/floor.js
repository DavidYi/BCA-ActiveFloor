/*jslint browser: true*/
/*global $,  jQuery */
var myInterval;
var $item, ledsX, ledsY, sensorsX, sensorsY, ledPerSensorX, ledPerSensorY, xCenter, yCenter;
var dataHolderArray = [];
var charSearch = '*';
var charDivide = ',';
var canvas, context2D;
var refreshTime = 17;       // Run the loop  every 17 milliseconds

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function drawObj(type, xPos, yPos, size) {
    'use strict';
    context2D.fillStyle = 'blue';
    if (type == 'meme') {
        context2D.fillRect((yPos + (yCenter / size)), (xPos + (xCenter / size)), size, size);
        context2D.fillRect((xPos + (xCenter / size)), (xPos + (xCenter / size)), size, size);
        context2D.fillRect((yPos + (yCenter / size)), (yPos + (yCenter / size)), size, size);
        context2D.fillRect((xPos + (xCenter / size)), (yPos + (yCenter / size)), size, size);
    }
    if (type === 'square') {
        context2D.fillRect((xPos + (xCenter / size)), (yPos + (yCenter / size)), size, size);
    } else if (type === 'circle') {
        context2D.beginPath();
        context2D.arc((xPos + xCenter), (yPos + yCenter), size, 0, Math.PI * 2, true);
        context2D.closePath();
        context2D.fill();
    }
}
function randomDraw(arr) {
    context2D.fillStyle = 'red';
    var xPos = getRandomInt(0,ledsX);
    var yPos = getRandomInt(0, l-edsY);
    drawCanvas(arr)
}
function drawCanvas(arr) {
    'use strict';
    canvas = document.getElementById('floorCanvas');
    canvas.width = ledsX;
    canvas.height = ledsY;
    context2D = canvas.getContext('2d');
    
    var i, tempRow, p, srchStr, tempX, tempY;
    for (i = 0; i < arr.length; i += 1) {
        tempRow = arr[i];
        
        for (p = 0; p < tempRow.length; p += 1) {
            srchStr = tempRow.substring(p, p + 1);
            if (srchStr === charSearch) {
                tempX = p * ledPerSensorX;
                tempY = i * ledPerSensorY;
				drawObj('random', tempX, tempY, 5)
            }
        }
    }
}

function loop() {
    'use strict';
    $.get('http://168.229.104.77:8080/', function (data) {
        dataHolderArray = [];

        /* Assign the fields from the XML to Javascript variables. */
        $(data).find('BLFloor').each(function () {
            $item = $(this);
            ledsX = $item.attr('ledsX');
            ledsY = $item.attr('ledsY');
            sensorsX = $item.attr('sensorsX');
            sensorsY = $item.attr('sensorsY');
            ledPerSensorX = (ledsX / sensorsX);
            ledPerSensorY = (ledsY / sensorsY);
            xCenter = ledPerSensorX / 2;
            yCenter = ledPerSensorY / 2;
        });

        /* Load the data from the XML file into the dataHolderArray */
        $(data).find('Row').each(function () {
            var $row, rowNum, rowVal, n;
            $row = $(this);
            rowNum = $row.attr('rownum');
            rowVal = $row.attr('values');
            n = rowVal.split(charDivide).join('');
				
            dataHolderArray.push(n);
        });

        /* Redraw the screen based upon the data in the array. */
        drawCanvas(dataHolderArray);
        randomDraw(dataHolderArray);
    });
}

$(document).ready(function () {
    'use strict';
    
    // Start getting floor data automatically (assuming Floor Server is running).
    startRefresh();
    
    sendSemaphore(function() {
        // Clear spacing and borders.
        $("body").addClass("app");
        $("div").addClass("app");
        $("#floorCanvas").addClass("app");
        
    });
});

function startRefresh() {
    'use strict';
    myInterval = setInterval(function () {loop(); }, refreshTime);
}

function stopRefresh() {
    'use strict';
    clearInterval(myInterval);
}
