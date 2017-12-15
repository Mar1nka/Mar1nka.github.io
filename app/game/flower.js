(function () {

    'use strict';

    class Flower {
        constructor (context) {
            this.context = context;
            this.x = 0;
            this.y = 0;
            this.width = 50;
            this.height = 50;
            this.color = '';

            this.image = new Image();
            this.image2 = new Image();

            this.currentImageIndex = 0;
            this.imageFrameNumber = 5;

            this.frameCounter = 0;
            this.frameDelay = 4;

            this.croppedWidth = 140;
            this.croppedHeight = 140;

            this.isBlossom = true;
            this.isEnd = false;
        }

        setPosition (x, y) {
            this.x = x;
            this.y = y;
        }

        draw () {
            this.frameCounter++;

            if (this.frameCounter > this.frameDelay) {
                this.frameCounter = 0;

                if (this.isBlossom) {
                    if (this.currentImageIndex < this.imageFrameNumber - 1) {
                        this.currentImageIndex += 1;
                    } else {
                        this.isBlossom = false;
                    }
                }

                if (this.isEnd) {
                    if (this.currentImageIndex < this.imageFrameNumber - 1) {
                        this.currentImageIndex += 1;
                    } else {
                        this.isEnd = false;
                        EventObserver.triggerEvent('removeFlower', this);
                    }
                }
            }

            this.context.drawImage(
                this.image,
                Math.floor(this.croppedWidth * this.currentImageIndex),
                0,
                this.croppedWidth,
                this.croppedHeight,
                this.x,
                this.y,
                this.width,
                this.height
            );
        }

        blossom () {
            this.isBlossom = true;
            this.currentImageIndex = 0;
            this.frameCounter = 0;
        }

        changeImage () {
            this.image = this.image2;
            this.isEnd = true;

            this.currentImageIndex = 0;
            this.frameCounter = 0;
        }
    }

    global.Flower = Flower;

})();