class BeeEater {
    constructor (context) {
        this.context = context;
        this.x = 0;
        this.y = 0;
        this.width = 150;
        this.height = 150;

        this.endX = 0;
        this.endY = 0;

        this.rightMovingImage = new Image();
        this.rightMovingImage.src = 'images/scene/rightMovingBeeEater.png';

        this.leftMovingImage = new Image();
        this.leftMovingImage.src = 'images/scene/leftMovingBeeEater.png';

        this.currentImageIndex = 0;
        this.imageFrameNumber = 16;

        this.frameCounter = 0;
        this.frameDelay = 4;

        this.croppedWidth = 323;
        this.croppedHeight = 306;

        this.directionX = 1;
        this.directionY = -1;

        this.stepX = 2;
        this.stepY = -2;
    }

    setPosition (x, y) {
        this.x = x;
        this.y = y;
    }

    checkCollisionBorderCanvas(canvasWidth, canvasHeight, canvasX, canvasY) {
    if(this.x + this.stepX > canvasWidth - this.width || this.x + this.stepX < canvasX) {
        this.stepX *= -1;
    }

    if(this.y + this.stepY > canvasHeight - this.height || this.y + this.stepY < canvasY) {
        this.stepY *= -1;
    }

    }

    get currentImage () {
        if(this.directionX === 1) {
            return this.rightMovingImage;
        } else {
            return this.leftMovingImage;
        }
    }

    draw () {
        this.frameCounter++;

        if(this.frameCounter > this.frameDelay) {
            this.frameCounter = 0;

            if(this.currentImageIndex < this.imageFrameNumber - 1) {
                this.currentImageIndex += 1;
            } else {
                this.currentImageIndex = 0;
            }
        }

        this.context.drawImage(
            this.currentImage,
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

    move () {
        this.endX = this.x + this.stepX;
        this.endY = this.y + this.stepY;

        this.directionX = this.getDirection(this.endX, this.x);
        this.directionY = this.getDirection(this.endY, this.y);

        this.x = this.endX;
        this.y = this.endY;
    }

    getDirection (endPos, pos) {
        let direction = 1;

        if ((endPos - pos) < 0) {
            direction = -1;
        }

        return direction;
    }
}

global.BeeEater = BeeEater;
