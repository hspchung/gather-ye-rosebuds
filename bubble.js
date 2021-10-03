class Bubble {
    constructor(x, y, d, r, g, b, a) {
      this.x = x;
      this.y = y;
      this.d = d;
      this.toDelete = false;
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
    }
  
    show() {
      noStroke();
      fill(this.r, this.g, this.b, this.a);
      if(selectedMuse === 'Shakespeare'){
      circle(this.x, this.y, this.d);
      } else if(selectedMuse === 'Kanye'){
        square(this.x,this.y,this.d);
      }
    }
  
    move() {
      this.x = this.x + 3;
      this.y = this.y + 3;
    }
  
    expire() {
      this.toDelete = true;
    }
  }
  