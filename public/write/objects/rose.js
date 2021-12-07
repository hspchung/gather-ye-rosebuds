//Most of the credit to Shu's Sketch: https://editor.p5js.org/shuz/sketches/8uSUQRYW2
//Tweaked for this web-app's purposes
class Rose {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.currentHue = random(0, 360);
  
      this.petalNumber = 22;
      this.sizeFactor = 7 / (12 * this.petalNumber);
  
      this.saturation = { min: 60, max: 100 };
      this.brightness = { min: 30, max: 80 };
      this.noise = { strength: 0.4 };
  
      this.outline = createGraphics(180, 180);
      this.outline.colorMode(HSB);
    }
  
    reset() {
      this.outline.clear();
      this.currentHue = random(0, 360);
      this.theta0 = random(TWO_PI); // initial angle
      this.size = 60 + random(0, 30);
      this.idx = this.petalNumber; // reset idx
      loop(); // draw again while constructing new rose
    }
  
    update() {
      if (this.idx > 0) {
        newRosePos = false;
        let theta = this.theta0 + G * this.idx;
        this.petal(
          this.x + this.idx * cos(theta),
          this.y + this.idx * sin(theta),
          this.sizeFactor * this.size * this.idx
        );
        --this.idx;
      } else {
        newRosePos = true;
      }
    }
  
    draw(x, y) {
      image(this.outline, x - 80, y - 80);
    }
  
    petal(x, y, r0) {
      let delta = random(5); // random displacement
  
      this.outline.stroke(
        this.currentHue,
        this.saturation.min,
        this.brightness.max
      );
      this.outline.strokeWeight(3);
  
      noiseBlob(this.outline, x, y, r0, delta, this.noise.strength);
    }
  }
  
  function noiseBlob(graphic, x, y, r0, delta, noiseStrength) {
    let r, theta;
    graphic.beginShape();
    for (let i = 0; i < 360; i += 6) {
      theta = radians(i);
      r =
        r0 * (1 + noiseStrength * noise(delta + cos(theta), delta + sin(theta)));
      
      graphic.vertex(x + r * cos(theta), y + r * sin(theta));
    }
    graphic.endShape(CLOSE);
  }
  