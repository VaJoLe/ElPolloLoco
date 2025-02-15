class StatusbarCoin extends DrawableObject {
  IMAGES = [
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png',
  ];
  percentage = 0;

  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 30;
    this.y = 40;
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
    } else if (this.percentage == 20) {
      return 1;
    } else if (this.percentage == 40) {
      return 2;
    } else if (this.percentage == 60) {
      return 3;
    } else if (this.percentage == 80) {
      return 4;
    } else {
      return 5;
    }
  }
}
