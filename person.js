class Person {
  //creates bubbles
  constructor(x, y) {
    this.pos = new p5.Vector(x, y);
    this.vel = p5.Vector.random2D();
    this.state = this.NORMAL;
    this.infectedTime = 0;
    this.socialDistance = false;
  }

  //makes bubbles move starting from a random position
  move() {
    if (this.state == this.DEAD) {
      return;
    }

    this.pos.add(this.vel);
    this.keepInBounds();

    this.interactWithOthers();

    if (this.state == this.SICK) {
      this.tryToRecover();
    }
  }

  interactWithOthers() {
    for (let i = 0; i < _people.length; i++) {
      let other = _people[i];
      if (this == other || other.state == this.DEAD) {
        continue;
      }

      let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);

      if (d < personSize) {
        if (this.state == this.SICK || other.state == this.SICK) {
          if (this.state == this.NORMAL) {
            this.setState(this.SICK);
          }

          if (other.state == this.NORMAL) {
            other.setState(this.SICK);
          }
        }

        if (_collisions && !this.socialDistance) {
          // Resolve direct collision.
          let newDirection = new p5.Vector(this.pos.x, this.pos.y);
          newDirection.sub(other.pos);
          newDirection.normalize();
          newDirection.mult(personSize - d);
          this.pos.add(newDirection);

          // Bounce to new direction.
          newDirection.normalize();
          this.vel.add(newDirection);
          this.vel.normalize();
        }

        break;
      }
    }
  }

  tryToRecover() {
    if (frameCount > this.infectedTime + recoveryTime) {
      if (random() < deathChance / 100.0) {
        this.setState(this.DEAD);
      } else {
        this.setState(this.RECOVER);
      }
    }
  }

  keepInBounds() {
    let halfSize = this.personSize / 2;

    if (this.pos.x - halfSize < 0 || this.pos.x + halfSize > this._boundsx) {
      this.vel.x *= -1;
      this.pos.x = constrain(this.pos.x, halfSize, this._boundsx - halfSize);
    }

    if (this.pos.y - halfSize < 0 || this.pos.y + halfSize > this._boundsy) {
      this.vel.y *= -1;
      this.pos.y = constrain(this.pos.y, halfSize, this._boundsy - halfSize);
    }
  }

  display() {
    textSize(this.personSize);

    if (this.state == this.NORMAL) {
      stroke(_normalColor);
    } else if (this.state == this.SICK) {
      stroke(_sickColor);
    } else if (this.state == this.RECOVER) {
      stroke(_recoveryColor);
    } else if (this.state == this.DEAD) {
      stroke(_deadColor);
    }
  }

  setState(newState) {
    this.state = newState;

    if (newState == this.SICK) {
      this.infectedTime = frameCount;
      _normalCount--;
      _sickCount++;
    } else if (this.state == this.RECOVER) {
      _sickCount--;
      _recoveryCount++;
    } else if (this.state == this.DEAD) {
      _sickCount--;
      _deathCount++;
    }
  }

  practiceSocialDistance() {
    this.vel.mult(0);
    this.socialDistance = true;
    _socialDistanceCount++;
  }
}
