/*
Coronavirus simulation

Roughly simulates an outbreak using different social distances.
Play around with the variables at the top to explore how it can spread in different environments.

Inspired by this article:
https://www.washingtonpost.com/graphics/2020/world/corona-simulator/?fbclid=IwAR1tGUaApSRIXYCArDRx3kra6xkTNUkh4k4EWonp0d0XOvU2P9z7pVqiOcQ

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
*/

function EpidemicSimulator() {
  // Name for the visualisation to appear in the menu bar.
  this.name = 'Epidemic Simulator';
  this.id = 'epidemic-simulator';

  this.population = 200;
  this.personSize = 15;
  this.recoveryTime = 300;
  this.deathChance = 7; // Out of 100%
  this.socialDistance = 0; // Out of 100%

  this._bounds = width;
  this._people = [];
  this._collisions = true;

  this._normalCount = 0;
  this._sickCount = 0;
  this._recoveryCount = 0;
  this._deathCount = 0;
  this._socialDistanceCount = 0;

  this._normalColor;
  this._sickColor;
  this._recoveryColor;
  this._deadColor;

  this.NORMAL = 0;
  this.SICK = 1;
  this.RECOVER = 2;
  this.DEAD = 3;

  this.setup = function () {
    // createCanvas(this._bounds + 500, this._bounds + 200);

    textStyle(BOLD);

    _normalColor = color(80, 200, 80);
    _sickColor = color(210, 200, 0);
    _recoveryColor = color(203, 138, 192);
    _deadColor = color(200, 70, 70);

    // _noDistButton = createButton('No social distance');
    // _noDistButton.position(0, this._bounds - 25);
    // _noDistButton.mousePressed(this.onNoDistTriggered);

    // _lowDistButton = createButton('Low social distance');
    // _lowDistButton.position(130, this._bounds - 25);
    // _lowDistButton.mousePressed(this.onLowDistTriggered);

    // _highDistButton = createButton('High social distance');
    // _highDistButton.position(270, this._bounds - 25);
    // _highDistButton.mousePressed(this.onHighDistTriggered);

    // _collisionsButton = createButton('Disable collisions');
    // _collisionsButton.position(410, this._bounds - 25);
    // _collisionsButton.mousePressed(this.onCollisionsTriggered);

    this.resetSim(); //is not calling the function why???
  };

  this.draw = function () {
    noStroke(); //
    fill(0); //Background colour, size and shape
    rect(0, 0, this._bounds, this._bounds); //

    for (let i = 0; i < this._people.length; i++) {
      //
      this._people[i].move(); // Makes all the people show and move when created from population
      this._people[i].display(); //
    }

    this.displayStats(); //calls display stats on top of the screen

    if (this._sickCount == 0) {
      this.displayEnd(); //calls end text 'Outbreak end'
    } else {
      this.displayGraph(); //if remains sick people the graph continues
    }
  };

  this.resetSim = function () {
    //TODO funcao nao esta a ser chamada.
    const frameCount = 0; //begining of countdown
    const _people = []; //takes the persons from the array
    const _normalCount = this.population; //number of people in the countdown
    const _sickCount = 0; //number of sick people in th countdown, zero sick until the simulation starts
    const _recoveryCount = 0; //number of recovered people in th countdown
    const _deathCount = 0; ////number of death people in th countdown
    const _socialDistanceCount = 0;

    noStroke();
    fill(100);
    rect(0, this._bounds, this._bounds, this._bounds - 1000);

    for (let i = 0; i < this.population; i++) {
      let person = new Person(random(this._bounds), random(this._bounds)); //trows persons into the _person array
      this._people.push(person);

      if ((i / this.population) * 100 < this.socialDistance) {
        person.practiceSocialDistance();
      }
    }

    // Patient zero doesn't practice social distancing.
    for (let i = 0; i < _people.length; i++) {
      if (!_people[i].socialDistance) {
        _people[i].setState(this.SICK);
        break;
      }
    }
  };

  this.displayStats = function () {
    //Display stats ****** Function working *******
    noStroke(); //
    textAlign(LEFT); // Text aligment on the screen
    textSize(14); //

    fill(255, 200); //stats square
    rect(0, 0, 200, 130); //stats position

    fill(0);
    text('Total: ' + this._people.length, 10, 20);
    text(
      'Social distance: ' +
        this._socialDistanceCount +
        ' (' +
        this.percentage(this._socialDistanceCount, this._people.length) +
        '%)',
      10,
      40
    );

    fill(_normalColor);
    text(
      'Healthy: ' +
        this._normalCount +
        ' (' +
        this.percentage(this._normalCount, this._people.length) +
        '%)',
      10,
      60
    );

    fill(_sickColor);
    text(
      'Sick: ' +
        this._sickCount +
        ' (' +
        this.percentage(this._sickCount, this._people.length) +
        '%)',
      10,
      80
    );

    fill(_recoveryColor);
    text(
      'Recovered: ' +
        this._recoveryCount +
        ' (' +
        this.percentage(this._recoveryCount, this._people.length) +
        '%)',
      10,
      100
    );

    fill(_deadColor);
    text(
      'Passed: ' +
        this._deathCount +
        ' (' +
        this.percentage(this._deathCount, this._people.length) +
        '%)',
      10,
      120
    );
  };

  this.displayGraph = function () {
    //***** not working
    let sickHeight =
      map(this._sickCount, 0, this._people.length, height - 100, height) -
      this._bounds;
    let normalHeight =
      map(this._normalCount, 0, this._people.length, height - 100, height) -
      this._bounds;
    let recoveryHeight =
      map(this._recoveryCount, 0, this._people.length, height - 100, height) -
      this._bounds;
    let deadHeight =
      map(this._deathCount, 0, this._people.length, height - 100, height) -
      this._bounds;

    let brighter = 60;
    let speed = frameCount * 0.25;
    let y = height;

    strokeWeight(1);

    stroke(_deadColor);
    line(speed, y, speed, y - deadHeight);

    stroke(
      red(_deadColor) + brighter,
      green(_deadColor) + brighter,
      blue(_deadColor) + brighter
    );
    point(speed - 1, y - deadHeight);
    y -= deadHeight;

    stroke(_sickColor);
    line(speed, y, speed, y - sickHeight);

    stroke(
      red(_sickColor) + brighter,
      green(_sickColor) + brighter,
      blue(_sickColor) + brighter
    );
    point(speed - 1, y - sickHeight);
    y -= sickHeight;

    stroke(_normalColor);
    line(speed, y, speed, y - normalHeight);
    y -= normalHeight;

    stroke(_recoveryColor);
    line(speed, y, speed, y - recoveryHeight);

    stroke(
      red(_recoveryColor) + brighter,
      green(_recoveryColor) + brighter,
      blue(_recoveryColor) + brighter
    );
    point(speed - 1, y);
  };

  this.displayEnd = function () {
    //Displays Message when outbreak is complete ****** Function working *******
    noStroke();
    fill(255);
    textAlign(CENTER);
    textSize(60);
    text('OUTBREAK COMPLETE', width / 2, height / 2);
  };

  this.percentage = function (value, maxValue) {
    return ((value / maxValue) * 100.0).toFixed(1);
  };

  this.onNoDistTriggered = function () {
    socialDistance = 0;
    this.resetSim();
  };

  this.onLowDistTriggered = function () {
    socialDistance = 30;
    this.resetSim();
  };

  this.onHighDistTriggered = function () {
    socialDistance = 85;
    this.resetSim();
  };

  this.onCollisionsTriggered = function () {
    this._collisions = !this._collisions;

    if (_collisions) {
      this._collisionsButton.html('Disable collisions');
    } else {
      this._collisionsButton.html('Enable collisions');
    }

    this.resetSim();
  };
}
