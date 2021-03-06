(function () {

    const STATES = {
        WITHOUT_HONEY: 0,
        WITH_HONEY: 1
    }

    class Bear {
        constructor (context) {
            this.context = context;
            this.x = 0;
            this.y = 0;
            this.width = 150;
            this.height = 150;

            this.state = STATES.WITHOUT_HONEY;

            this.currentImageIndex = 0;
            this.imageFrameNumber = 10;

            this.frameCounter = 0;
            this.frameDelay = 4;

            this.croppedWidth = 344;
            this.croppedHeight = 388;

            this.originalSpeedPerFrame = 3;
            this.speedPerFrame = 3;
            this.directionX = 0;
            this.directionY = 0;
            this.endX = 0;
            this.endY = 0;
            this.stepX = 0;
            this.stepY = 0;

            this.isChangeDirectionX = false;
            this.isChangeDirectionY = false;
            this.isIntersectionBee = false;

            this.startPosX = 0;
            this.startPosY = 0;
            this.goalPosX = 0;
            this.goalPosY = 0;
            this.finishPosX = 0;
            this.finishPosY = 0;


            this.rightMovingImage = new Image();
            this.rightMovingImage.src = 'images/scene/rightMovingBear.png';

            this.rightMovingImageWithHoney = new Image();
            this.rightMovingImageWithHoney.src = 'images/scene/rightMovingBearWithHoney.png';

            this.leftMovingImage = new Image();
            this.leftMovingImage.src = 'images/scene/leftMovingBear.png';

            this.leftMovingImageWithHoney = new Image();
            this.leftMovingImageWithHoney.src = 'images/scene/leftMovingBearWithHoney.png';

            this.rightMovingImage.addEventListener('load', () => {
                this.frames = 0;
            })
        }

        get currentImage () {
            if (this.directionX === 1) {
                if (this.state === STATES.WITHOUT_HONEY) {
                    return this.rightMovingImage;
                } else {
                    return this.rightMovingImageWithHoney;
                }
            } else {
                if (this.state === STATES.WITHOUT_HONEY) {
                    return this.leftMovingImage;

                } else {
                    return this.leftMovingImageWithHoney;

                }
            }
        }


        draw () {
            this.frameCounter++;

            if (this.frameCounter > this.frameDelay) {
                this.frameCounter = 0;
                if (this.currentImageIndex < this.imageFrameNumber - 1) {
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

        setConstPos (objPos) {
            this.startPosX = objPos.startPosX;
            this.startPosY = objPos.startPosY;
            this.goalPosX = objPos.goalPosX;
            this.goalPosY = objPos.goalPosY;
            this.finishPosX = objPos.finishPosX;
            this.finishPosY = objPos.finishPosY;

            this.x = this.startPosX;
            this.y = this.startPosY;
        }

        setPosition (x, y) {
            this.x = x;
            this.y = y;
        }

        setEndPosition (x, y) {
            this.endX = x;
            this.endY = y;

            this.determineSteps();
        }

        determineSteps () {
            this.directionX = this.direction.x;
            this.directionY = this.direction.y;

            let speedsObj = this.getSpeedsRerFrame();

            this.stepX = this.directionX * speedsObj.speedPerFrameX;
            this.stepY = this.directionY * speedsObj.speedPerFrameY;
        }

        get direction () {
            let directionX = 1;
            let directionY = 1;

            if ((this.endX - this.x) < 0) {
                directionX = -1;
            }

            if ((this.endY - this.y) < 0) {
                directionY = -1;
            }

            let direction = {
                x: directionX,
                y: directionY
            };

            return direction;
        }

        getSpeedsRerFrame () {
            let distanceX = Math.abs(this.endX - this.x);
            let distanceY = Math.abs(this.endY - this.y);

            let maxDistance = distanceX;
            let minDistance = distanceY;

            if (distanceY > distanceX) {
                maxDistance = distanceY;
                minDistance = distanceX;
            }

            let minSpeedPerFrame = (minDistance * this.speedPerFrame) / maxDistance;
            let speedPerFrameX = this.speedPerFrame;
            let speedPerFrameY = this.speedPerFrame;

            if (minDistance === distanceX) {
                speedPerFrameX = minSpeedPerFrame;
            } else if (minDistance === distanceY) {
                speedPerFrameY = minSpeedPerFrame;
            }

            let speedsObj = {
                'speedPerFrameX': speedPerFrameX,
                'speedPerFrameY': speedPerFrameY
            }

            return speedsObj;
        }

        move () {
            if ((this.directionX === 1 && this.x < this.endX) || (this.directionX === -1 && this.x > this.endX)) {
                this.x += this.stepX;
            }

            if ((this.directionY === 1 && this.y < this.endY) || (this.directionY === -1 && this.y > this.endY)) {
                this.y += this.stepY;
            }
        }


        turnOtherWay () {
            this.setEndPosition(this.finishPosX, this.finishPosY);
            this.directionX *= -1;
            this.isChangeDirectionX = true;
            this.state = STATES.WITH_HONEY;
        }

        meetBeeHandler () {
            if(this.speedPerFrame < 5) {
                this.speedPerFrame += 0.5;
            }

            if (!this.isChangeDirectionX && !this.isIntersectionBee) {
                this.setEndPosition(this.finishPosX, this.finishPosY);
                this.directionX *= -1;
                this.isChangeDirectionX = true;
            }

            this.isIntersectionBee = true;
        }

        setToInitialState () {
            this.state = STATES.WITHOUT_HONEY;
            this.setPosition(this.startPosX, this.startPosY);
            this.speedPerFrame = this.originalSpeedPerFrame;
            this.isChangeDirectionX = false;
            this.isIntersectionBee = false;
            this.draw();
            this.setEndPosition(this.goalPosX, this.goalPosY);
        }

    }

    global.Bear = Bear;
})();