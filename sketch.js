/********       BSc EXAMINATION COMPUTER SCIENCE *********
                     Mid-Term project 20/21
                    Student Number 200409407

*/

// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var gallery;

function setup() {
  // Create a canvas to fill the content div from index.html.
  canvasContainer = select('#app');
  var c = createCanvas(1024, 576);
  c.parent('app');

  // Create a new gallery object.
  gallery = new Gallery();

  // Add the visualisation objects here.
  gallery.addVisual(new AgeGroupVaccinated());
  gallery.addVisual(new CovidCases());
  gallery.addVisual(new WallOfHearts());
  gallery.addVisual(new Maps());
  gallery.addVisual(new EpidemicSimulator());
}

function draw() {
  background(47, 79, 79);
  if (gallery.selectedVisual != null) {
    gallery.selectedVisual.draw();
  }
}
