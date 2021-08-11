function CovidCases() {
  // Name for the visualisation to appear in the menu bar.
  this.name = 'Covid Cases';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = ' covidCases';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function () {
    var self = this;
    this.data = loadTable(
      './data/CovidCases/WHO-COVID-19-global-table-data-May-29th-2021.csv',
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
    if (!this.loaded) {
      console.log('Data not yet loaded'); //if no data loaded display alert
      return;
    }

    // Create a select DOM element.
    // Drop menu position
    this.select = createSelect();
    this.select.position(350, 100);

    // Fill the options with all data names.
    var data = this.data.columns;
    // First entry is empty.
    for (let i = 1; i < data.length; i++) {
      this.select.option(data[i]);
    }
  };

  this.destroy = function () {
    this.select.remove();
  };

  // Create a new pie chart object.
  // Pie position
  this.pie = new PieChart(100 + width / 2.5, 50 + height / 2, width * 0.4);

  this.draw = function () {
    fill(47, 79, 79);
    rect(0, 0, width, height);
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Get the value of the data we're interested in from the
    // select item.
    var dataName = this.select.value();

    // Get the column of raw data for dataName.
    var col = this.data.getColumn(dataName);

    // Convert all data strings to numbers.
    col = stringsToNumbers(col);

    // Copy the row labels from the table (the first item of each row).
    var labels = this.data.getColumn(0);

    // Colour to use for each category.
    var colours = ['blue', 'red', 'green', 'pink', 'purple', 'yellow'];

    // Make a title.
    var title = 'Covid Cases ' + dataName;

    // Draw the pie chart!
    this.pie.draw(col, labels, colours, title);
  };
}
