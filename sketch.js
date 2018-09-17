//////////////////////////////////////////////////////////////////
// Mapping_Earthquake_Data
// https://youtu.be/ZiYdOwOrGyc
// Coding Challenge #57: Mapping Earthquake Data
//
// Map Projection: https://en.wikipedia.org/wiki/Web_Mercator
//////////////////////////////////////////////////////////////////

// API Key, it's called access token for Mapbox
var url = 'https://api.mapbox.com/styles/v1/mapbox/navigation-preview-night-v2/static/0,0,1/1024x512?access_token=';
var access_token = 'pk.eyJ1IjoiYWxsZ3VpdGFycyIsImEiOiJjamd6NzF1cmQwMHRpMnFxcmNyN2lvY3luIn0.6-vGt1uAiklcZ6GhuPl6_g';
var curl = url + access_token;
var zoom = 1;
var worldMapImage;
var earthquakes;

var centerLongitude = 0;
var centerLatitude = 0;
// Shanghai: Lat 31.22222, Lon 121.45806  (lat N, lon E) -- positive numbers mean North and East
// Vancouvor: Lat 49.246292, Lon -123.116226	
var longitude = -123.116226;
var latitude = 49.246292;

function preload() {
    worldMapImage = loadImage(curl);
    earthquakes = loadStrings('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv');
}


function setup() {
    var canvas = createCanvas(1024, 512);

    // you need to use the "id" for parent()
    canvas.parent('map-area');

    translate(width / 2, height / 2);  // move the origin to the center of the canvas
    imageMode(CENTER);              // rect(center of rect, width and height)
    /* Above two commands make the canvas an x-y plane where (0,0) is at the center.
       The map that Dan retrieves are based on the longitude and latitude as (0, 0).
       In the real world, all longitude and latitude values (positive/negative) 
       are referred based on location (0, 0).
       That's why Dan wanted to "map" the map to the real world's perspective */
    /* imageMode(CENTER) interprets the second and third parameters of image() 
       as the image's center point. If two additional parameters are specified, 
       they are used to set the image's width and height. */

    image(worldMapImage, 0, 0);
    /* Because of CENTER mode, the (0, 0) indicates the center of the image.
       And due to translate(width/2, height/2), (0, 0) is at the center of the Canvas. */

    // $.get(curl).done(gotData);

    var centerX = mercatorX(centerLongitude);
    var centerY = mercatorY(centerLatitude);
    console.log('centerX: ' + centerX);
    console.log('centerY: ' + centerY);

    // Draw the universal center location (0, 0).
    fill(255);
    ellipse(centerLongitude, centerLatitude, 8, 8);
    fill(230);
    textAlign(CENTER, TOP);
    text('Universal Center', 6, 0);

    // // EXP: x2 , y2 will be the same results
    // var x2 = mercatorX(longitude) - mercatorX(centerLongitude);
    // var y2 = mercatorY(latitude) - mercatorY(centerLatitude);
    // console.log('x2: ' + x2);
    // console.log('y2: ' + y2);

    // // Draw a target coordinate
    // fill(255, 0, 255, 160);
    // ellipse(x, y, 8, 8);

    for(var i = 1; i < earthquakes.length; i++) {
        var data = earthquakes[i].split(/,/);
        longitude = data[2];
        latitude = data[1];
        
        // Ritcher Magnitude is the result of log(amplitude).
        var mag = data[4];  
        
        // reverse of logarithm
        var amplitude = pow(10, mag);

        // Area of the circle(PI*r^2) is directly proportional to the Amplitude,
        // so Radius of the circle(r) is directly proportional to sqrt(Amplitude)
        var ratio = 0.1;
        var radius = sqrt(amplitude) * ratio;

        // Transform the max of Magnitude (say 9) to the max of Radius (directly proportional)
        // This process is similar to the one above
        // From what I saw in the csv file, the smallest one is -0.33.
        var minMag = -0.5;
        var maxMag = 9;  // very rare
        var radiusMin = sqrt(pow(10, minMag)) * ratio;
        var radiusMax = sqrt(pow(10, maxMag)) * ratio;
        
        // map the radius to the diameter of the circle drawn
        var diameter = map(radius, radiusMin, radiusMax, 0, 600);

        // Get the projected coordinate
        var x = mercatorX(longitude) - centerX;
        var y = mercatorY(latitude) - centerY;

        // Draw the locations with earthquakes
        stroke(255, 255, 255, 75);
        fill(255, 0, 255, 130);
        ellipse(x, y, diameter, diameter);
    }

}

function gotData(mapImage) {

    var newImage = $('<img>');
    newImage.attr('src', curl);
    newImage.attr('alt', 'Image missing!');
    newImage.attr('id', 'map-image');
    $('.map-area').append(newImage);
}

// https://en.wikipedia.org/wiki/Web_Mercator
function mercatorX(longitude) {
    longitude = radians(longitude);
    var a = (256 / Math.PI) * Math.pow(2, zoom);
    var b = longitude + Math.PI;
    return a * b;
}

function mercatorY(latitude) {
    latitude = radians(latitude);
    var a = (256 / Math.PI) * Math.pow(2, zoom);
    var b = Math.tan(Math.PI / 4 + latitude / 2);
    var c = (Math.PI - Math.log(b));
    return a * c;
}
