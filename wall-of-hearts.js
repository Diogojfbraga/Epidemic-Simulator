function WallOfHearts() {
  // Name for the visualisation to appear in the menu bar.
  this.name = 'Wall Of Hearts';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'wall-of-hearts';

  // Title to display above the plot.
  this.title = 'Wall of Hearts - Covid Deaths in UK per Week';

  // Names for each axis.
  this.xAxisLabel = 'Weeks';
  this.yAxisLabel = 'Deaths';

  var marginSize = 35;

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    marginSize: marginSize,

    // Locations of margin positions. Left and bottom have double margin
    // size due to axis and tick labels.
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize,
    bottomMargin: height - marginSize * 2,
    pad: 5,

    plotWidth: function () {
      return this.rightMargin - this.leftMargin;
    },

    plotHeight: function () {
      return this.bottomMargin - this.topMargin;
    },

    // Boolean to enable/disable background grid.
    grid: false,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 30,
  };

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function () {
    this.img = loadImage('assets/covid-wall.jpeg');
    var self = this;
    this.data = loadTable(
      './data/wall-of-hearts/wall-of-hearts.csv',
      'csv',
      'header',
      // Callback function to set the value
      // this.loaded to true.
      function (table) {
        self.loaded = true;
      }
    );
  };

  this.setup = function () {
    // Font defaults.
    textSize(16);

    // Set min and max weekss: assumes data is sorted by date.
    this.startWeeks = this.data.getNum(0, 'weeks');
    this.endWeeks = this.data.getNum(this.data.getRowCount() - 1, 'weeks');

    // Find min and max deaths for mapping to canvas height.
    this.minDeaths = 0; // Pay equality (zero deaths).
    this.maxDeaths = max(this.data.getColumn('deaths'));
  };

  this.destroy = function () {};

  this.draw = function () {
    //inserted picture of wall of hearts
    imageMode(CORNER);
    image(this.img, 0, 0, width, height);

    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Draw the title above the plot.
    this.drawTitle();

    // Draw all y-axis labels.
    drawYAxisTickLabels(
      this.minDeaths,
      this.maxDeaths,
      this.layout,
      this.mapDeathsToHeight.bind(this),
      0
    );

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel, this.yAxisLabel, this.layout);

    // Plot all deathss between startWeeks and endWeeks using the width
    // of the canvas minus margins.
    var previous;
    var numWeeks = this.endWeeks - this.startWeeks;

    // Loop over all rows and draw a line from the previous value to
    // the current.
    for (var i = 0; i < this.data.getRowCount(); i++) {
      // Create an object to store data for the current weeks.
      var current = {
        // Convert strings to numbers.
        weeks: this.data.getNum(i, 'weeks'),
        deaths: this.data.getNum(i, 'deaths'),
      };

      if (previous != null) {
        // Draw line segment connecting previous weeks to current
        // weeks deaths.

        stroke(0);
        fill(255, 0, 0);

        var x = this.mapWeeksToWidth(current.weeks);
        var y = this.mapDeathsToHeight(current.deaths);
        var size = this.data.getNum(i, 'deaths') / 200;

        beginShape();
        vertex(x, y);
        bezierVertex(
          x - size / 2,
          y - size / 2,
          x - size,
          y + size / 3,
          x,
          y + size
        );
        bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
        endShape(CLOSE);

        //organise text showing text
        // try to make heart do something like change collour or increase size

        // shows details when mouse is on top of the heart
        if (
          dist(mouseX, mouseY, x, y) < size &&
          mouseX < width / 2 &&
          mouseY < width / 2
        ) {
          // Start a new drawing state.
          push();
          fill('black');
          stroke(5);
          textSize(10);
          text('Deaths: ' + current.deaths, mouseX + 50, mouseY);

          // text('Number of job: ' + numJobs[i], this.pad, height - this.pad * 2);
          //Back to previous state.
          pop();
        }
        if (
          dist(mouseX, mouseY, x, y) < size / 2 &&
          mouseX >= width / 2 &&
          mouseY < height / 2
        ) {
          // Start a new drawing state.
          push();
          fill('black');
          stroke(5);
          textSize(10);
          text('Deaths: ' + current.deaths, mouseX - 50, mouseY);

          // text('Number of job: ' + numJobs[i], this.pad, height - this.pad * 2);
          //Back to previous state.
          pop();
        }
        if (
          dist(mouseX, mouseY, x, y) < size + 5 &&
          mouseY > height / 2 &&
          mouseX < width / 2
        ) {
          // Start a new drawing state.
          push();
          fill('black');
          stroke(5);
          textSize(10);
          text('Deaths: ' + current.deaths, mouseX + 50, mouseY);

          // text('Number of job: ' + numJobs[i], this.pad, height - this.pad * 2);
          //Back to previous state.
          pop();
        }
        if (
          dist(mouseX, mouseY, x, y) < size * 3.5 &&
          mouseX > width / 2 &&
          mouseY >= height / 2
        ) {
          // Start a new drawing state.
          push();
          fill('black');
          stroke(5);
          textSize(10);
          text('Deaths: ' + current.deaths, mouseX - 50, mouseY);

          // text('Number of job: ' + numJobs[i], this.pad, height - this.pad * 2);
          //Back to previous state.
          pop();
        }

        // The number of x-axis labels to skip so that only
        // numXTickLabels are drawn.
        var xLabelSkip = ceil(numWeeks / this.layout.numXTickLabels);

        // Draw the tick label marking the start of the previous weeks.
        if (i % xLabelSkip == 0) {
          drawXAxisTickLabel(
            previous.weeks,
            this.layout,
            this.mapWeeksToWidth.bind(this)
          );
        }
      }

      // Assign current weeks to previous weeks so that it is available
      // during the next iteration of this loop to give us the start
      // position of the next line segment.
      previous = current;
    }
  };

  this.drawTitle = function () {
    fill(0);
    noStroke();
    textAlign('center', 'center');

    text(
      this.title,
      this.layout.plotWidth() / 2 + this.layout.leftMargin,
      this.layout.topMargin - this.layout.marginSize / 2
    );
  };

  this.mapWeeksToWidth = function (value) {
    return map(
      value,
      this.startWeeks,
      this.endWeeks,
      this.layout.leftMargin, // Draw left-to-right from margin.
      this.layout.rightMargin
    );
  };

  this.mapDeathsToHeight = function (value) {
    return map(
      value,
      this.minDeaths,
      this.maxDeaths,
      this.layout.bottomMargin, // Smaller deaths at bottom.
      this.layout.topMargin
    ); // Bigger deaths at top.
  };
}
