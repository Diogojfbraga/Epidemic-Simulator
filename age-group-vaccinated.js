function AgeGroupVaccinated() {
  // Name for the visualisation to appear in the menu bar.
  this.name = 'Age Group Vaccinated';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'age-group-vac';

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    // Locations of margin positions. Left and bottom have double margin
    // size due to axis and tick labels.
    leftMargin: 100,
    rightMargin: width - 30,
    topMargin: 50,
    bottomMargin: height,
    pad: 5,

    plotWidth: function () {
      return this.rightMargin - this.leftMargin;
    },

    // Boolean to enable/disable background grid.
    grid: true,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 10,
    numYTickLabels: 8,
  };

  // Middle of the plot: for 0% line.
  this.midX = this.layout.plotWidth() / 2 + this.layout.leftMargin;

  // Default visualisation colours.
  this.firstDoseColour = color(255, 0, 0);
  this.secondDoseColour = color(0, 255, 0);

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function () {
    var self = this;
    this.data = loadTable(
      './data/covid-vac/agegroupvac.csv',
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
    textFont('sans-serif', 16);
  };

  //shows alert in the console if there is no data
  this.draw = function () {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Draw firstDose/secondDose labels at the top of the plot.
    this.drawCategoryLabels();

    //varable to set a line to with the lenght of the data that will be used
    var lineHeight = (height - this.layout.topMargin) / this.data.getRowCount();

    //collects data from which cell of the row
    for (var i = 0; i < this.data.getRowCount(); i++) {
      // Calculate the y position for each age.

      var lineY = lineHeight * i + this.layout.topMargin;

      // Create an object that stores data from the current row.
      var age = {
        // Convert strings to numbers.
        name: this.data.getString(i, 'age'),
        firstDose: this.data.getNum(i, 'firstDose'),
        secondDose: this.data.getNum(i, 'secondDose'),
      };

      // Draw the age name in the left margin.
      noStroke();
      fill(200);
      textAlign('right', 'top');
      text(age.name, this.layout.leftMargin - this.layout.pad, lineY);

      // Draw firstDose employees rectangle.
      fill(this.firstDoseColour);
      rect(
        this.midX,
        lineY,
        (-1 * this.mapPercentToWidth(age.firstDose)) / 2.5,
        lineHeight / 1.5 - this.layout.pad
      );
      fill(200);
      noStroke();
      textAlign('right', 'bottom');
      text(
        round(age.firstDose, 3),
        this.midX - this.mapPercentToWidth(age.firstDose) / 2.5,
        lineY
      );

      // Draw secondDose employees rectangle.
      fill(this.secondDoseColour);
      rect(
        this.midX,
        lineY,
        this.mapPercentToWidth(age.secondDose) / 2.5,
        lineHeight / 1.5 - this.layout.pad
      );
      fill(200);
      noStroke();
      textAlign('right', 'bottom');
      //rounds the percentage number
      text(
        round(age.secondDose, 3),
        this.midX + 17 + this.mapPercentToWidth(age.secondDose) / 2.5,
        lineY
      );
    }

    // Draw 0%/middle line
    stroke(150);
    strokeWeight(1);
    line(
      this.midX,
      this.layout.topMargin,
      this.midX,
      this.layout.bottomMargin - 20
    );
  };

  //draw all the labels.
  this.drawCategoryLabels = function () {
    fill(200);
    noStroke();
    textAlign('left', 'top');
    text('First Dose', this.midX / 2, this.layout.pad);
    textAlign('center', 'top');
    text('0%', this.midX, this.layout.pad);
    textAlign('center', 'top');
    text('Second Dose', this.midX + this.midX / 2, this.layout.pad);
  };

  //set the size of the bars according with the data.
  //Note: the original data shows percent of elements of more than 100%
  this.mapPercentToWidth = function (percent) {
    return map(percent, 0, 100, 0, this.layout.plotWidth());
  };
}
