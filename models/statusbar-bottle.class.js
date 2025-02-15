class StatusbarBottle extends DrawableObject {
  IMAGES = [
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png',
  ];
  percentage = 0;

  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 30;
    this.y = 80;
    this.width = 180;
    this.height = 50;
    this.setPercentage(this.percentage);
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let imagePath = this.IMAGES[this.resolvePercentage()];
    this.img = this.imageCache[imagePath];
  }

  resolvePercentage() {
    if (this.percentage == 0) {
      return 0;
    } else if (this.percentage > 0 && this.percentage <= 20) {
      return 1;
    } else if (this.percentage > 20 && this.percentage <= 40) {
      return 2;
    } else if (this.percentage > 40 && this.percentage <= 60) {
      return 3;
    } else if (this.percentage > 60 && this.percentage <= 80) {
      return 4;
    } else {
      return 5;
    }
  }
}
