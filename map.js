function Maps() {
  // Name for the visualisation to appear in the menu bar.
  this.name = 'Map';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'map-covid';

  //var for center lattitude and longitude in the map
  var centerLat = 0;
  var centerLon = 0;

  const zoom = 1;

  //pre-loads the api map and csv file data
  this.preload = function () {
    var self = this;
    this.mapimg = loadImage(
      'https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/0,0,1,0/1024x512?access_token=pk.eyJ1IjoiZHlub3M4NCIsImEiOiJja3BiMm14dm8wNndiMnVycjNjMGdnMnJiIn0.K9PpNWUBqOn6fQUKTcF9Yg'
    );

    this.cases = loadStrings('./data/map/map-covid19-deaths-global.csv');
  };

  //projecting coordenates into the canvas x position
  this.mercX = function (long) {
    lon = radians(long);
    var a = (256 / PI) * pow(2, zoom);
    var b = lon + PI;
    return a * b;
  };

  //projecting coordenates into the canvas y position
  this.mercY = function (lat) {
    lat = radians(lat);
    var a = (256 / PI) * pow(2, zoom);
    var b = tan(PI / 4 + lat / 2);
    var c = PI - log(b);
    return a * c;
  };

  //map image with the set coordinates
  this.draw = function () {
    //centers and draws the map into the canvas
    translate(width / 2, height / 2);
    imageMode(CENTER);
    image(this.mapimg, 0, 0);
    fill(255, 0, 0);

    //variables to
    var cx = this.mercX(centerLon);
    var cy = this.mercY(centerLat);

    //retrieves data from csv file and converts each value into a circle
    for (let i = 0; i < this.cases.length; i++) {
      var data = this.cases[i].split(/,/);
      var countries = data[0];
      var lat = data[1];
      var long = data[2];
      var size = data[3];
      var x = this.mercX(long) - cx;
      var y = this.mercY(lat) - cy;

      //magnitude of the ellipse
      mag = pow(mag, 10);
      mag = sqrt(size);

      //reduces the scale of the ellipse
      var magmax = sqrt(pow(10, 10));

      //ellipse diameter
      var d = map(size, 0, magmax, 1.5, 10);

      //ellipse colour, location and diameter
      fill(255, 0, 255, 200);
      stroke(255, 0, 255);
      ellipse(x, y, d, d);

      //pointer location
      ellipse(mouseX - 512, mouseY - 288, 5, 5);

      //when mouse on top of country capital
      if (dist(mouseX - 512, mouseY - 288, x, y) <= d + 5) {
        // Start a new drawing state.
        push();
        fill('white');
        stroke(5);
        textSize(10);
        text(countries, x - 10, y - 10);

        // //Back to previous state.
        pop();
      }
    }
  };
}
