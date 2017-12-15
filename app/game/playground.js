(function () {

    class PlayGround {
        constructor () {
            this.canvas = null;
            this.context = null;
            this.hive = null;
            this.bee = null;
            this.leftBear = null;
            this.rightBear = null;
            this.beeEater = null;

            this.goodFlowers = [];
            this.maxNumberGoodFlowers = 20;

            this.badFlowers = [];
            this.maxNumberBadFlowers = (Math.floor(this.maxNumberGoodFlowers * 0.2));

            this.scores = 0;
            this.currentDifficulty = 0;
            this.health = this.maxNumberBadFlowers;

            this.requestAnimationId = undefined;
            this.addFlowersIntervalId = undefined;
            this.moveLeftBearTimerId = undefined;
            this.moveRightBearTimerId = undefined;
            this.changeBadFlowersPositionIntervalId = undefined;

            this.isGameOver = false;

            this.renderBind = this.render.bind(this);
            this.addFlowersBind = this.addFlowers.bind(this);
            this.moveLeftBearsCyclicallyBind = this.moveLeftBearsCyclically.bind(this);
            this.moveRightBearsCyclicallyBind = this.moveRightBearsCyclically.bind(this);
            this.changePosBadFlowersBind = this.changeBadFlowersPositions.bind(this);

            this.removeFlower = this.removeFlower.bind(this);
            this.windowResizeHandler = this.windowResizeHandler.bind(this);
            this.sceneObjects = [];
        }


        start () {
            this.isGameOver = false;
            this.scores = 0;
            this.currentDifficulty = 0;
            this.goodFlowers = [];
            this.badFlowers = [];
            this.health = this.maxNumberBadFlowers;

            this.requestAnimationId = undefined;
            this.addFlowersIntervalId = undefined;
            this.moveLeftBearTimerId = undefined;
            this.moveRightBearTimerId = undefined;
            this.changeBadFlowersPositionIntervalId = undefined;

            this.init();

            EventObserver.addEventListener('removeFlower', this.removeFlower);

            this.sceneObjects = [
                this.hive,
                this.bee,
                this.goodFlowers
            ];
        }

        windowResizeHandler () {
            this.canvas.width = document.body.offsetWidth;
            this.canvas.height = document.body.offsetHeight - 80;
        }

        init () {
            this.initCanvas();
            this.initHive();
            this.initGoodFlowers();
            this.initBee();

            this.showScores(this.scores);
            this.showHealth(this.health);

            this.requestAnimationId = requestAnimationFrame(this.renderBind);

            this.addFlowersIntervalId = setInterval(this.addFlowersBind, 500);

            window.addEventListener('resize', this.windowResizeHandler);
        }

        destroy () {
            clearInterval(this.addFlowersIntervalId);
            clearInterval(this.changeBadFlowersPositionIntervalId)
            clearTimeout(this.moveRightBearTimerId);
            clearTimeout(this.moveLeftBearTimerId);
            cancelAnimationFrame(this.requestAnimationId);
            EventObserver.removeEventListener('removeFlower', this.removeFlower);
            window.removeEventListener('resize', this.windowResizeHandler);

            //TODO call bee.destroy() method

            this.bee.destroy();

            this.isGameOver = true;
        }

        initCanvas () {
            this.canvas = document.querySelector('.play-area');
            this.context = this.canvas.getContext('2d');

            this.canvas.width = document.body.offsetWidth;
            this.canvas.height = document.body.offsetHeight - 80;

            this.canvas.x = 0;
            this.canvas.y = 0;

            this.canvas.style.background = '#63a00d';
        }

        initHive () {
            this.hive = new Hive(this.context);
            this.hive.setPosition(this.canvas.width / 2 - this.hive.width / 2, this.canvas.height / 2 -
                this.hive.height /
                2);
            this.hive.draw();
        }

        initGoodFlowers () {
            this.createFlowers(this.maxNumberGoodFlowers, this.goodFlowers, 'good');
            this.drawFlowers(this.goodFlowers);
        }

        initBadFlowers () {
            this.createFlowers(this.maxNumberBadFlowers, this.badFlowers, 'bad');
            this.drawFlowers(this.badFlowers);
            this.changeBadFlowersPositionIntervalId = setInterval(this.changePosBadFlowersBind, 5000);
        }

        initBee () {
            this.bee = new Bee(this.context);
            this.bee.init();
            this.bee.setPosition(this.canvas.width / 4 - this.bee.width / 2, this.canvas.height / 4 - this.bee.height /
                2);
            this.bee.draw();
        }

        initBears () {
            this.leftBear = new Bear(this.context);
            this.leftBear.setConstPos(
                {
                    'startPosX': this.canvas.x - this.leftBear.width,
                    'startPosY': this.hive.y + this.hive.height - this.leftBear.height,
                    'goalPosX': this.hive.x,
                    'goalPosY': this.hive.y + this.hive.height - this.leftBear.height,
                    'finishPosX': this.canvas.x - 1.5 * this.leftBear.width,
                    'finishPosY': this.hive.y + this.hive.height - this.leftBear.height
                });

            this.rightBear = new Bear(this.context);
            this.rightBear.setConstPos(
                {
                    'startPosX': this.canvas.width + this.rightBear.width,
                    'startPosY': this.hive.y + this.hive.height - this.rightBear.height,
                    'goalPosX': this.hive.x,
                    'goalPosY': this.hive.y + this.hive.height - this.rightBear.height,
                    'finishPosX': this.canvas.width + 1.5 * this.rightBear.width,
                    'finishPosY': this.hive.y + this.hive.height - this.rightBear.height
                });

            this.moveLeftBearTimerId = setTimeout(this.moveLeftBearsCyclicallyBind, 0);
            this.moveRightBearTimerId = setTimeout(this.moveRightBearsCyclicallyBind, 0);
        }

        initBeeEater () {
            this.beeEater = new BeeEater(this.context);
            this.beeEater.setPosition(this.canvas.width / 2, this.canvas.height - this.beeEater.height);
            this.beeEater.draw();
        }


        clearCanvas () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }


        getRandom (min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        checkIntersectionObjects (obj1, obj2) {
            return (obj1.x < obj2.x + obj2.width &&
                obj1.x + obj1.width > obj2.x &&
                obj1.y < obj2.y + obj2.height &&
                obj1.height + obj1.y > obj2.y);
        }

        showScores (scores) {
            let element = document.querySelector('.scores-value');
            element.innerHTML = scores;
        }

        showHealth (health) {
            let element = document.querySelector('.health-value');
            element.innerHTML = health;
        }

        getDifficulty () {
            let difficulty = 0;

            if (this.scores >= 10 && this.scores < 20) {
                difficulty = 1;
            } else if (this.scores >= 20 && this.scores < 30) {
                difficulty = 2;
            } else if (this.scores >= 30 && this.scores < 50) {
                difficulty = 3;
            } else if (this.scores >= 50) {
                difficulty = 4;
            }

            if (difficulty < this.currentDifficulty) {
                difficulty = this.currentDifficulty;
            }

            return difficulty;
        }

        checkGameStage () {
            switch (this.currentDifficulty) {
            case 1:
                this.initBadFlowers()
                this.sceneObjects.push(this.badFlowers);
                break;
            case 2:
                this.initBears();
                this.sceneObjects.push(this.leftBear);
                this.sceneObjects.push(this.rightBear);
                break;
            case 3:
                this.initBeeEater();
                this.sceneObjects.push(this.beeEater);
                break;
            case 4:
                EventObserver.triggerEvent('winning');
                this.destroy();
                break;
            }
        }



        render () {
            for (let i = 0; i < this.sceneObjects.length; i++) {
                this.updateObj(this.sceneObjects[i]);
            }

            this.clearCanvas();

            for (let i = 0; i < this.sceneObjects.length; i++) {
                this.drawObj(this.sceneObjects[i]);
            }

            this.hive.draw();
            this.bee.move();
            this.bee.draw();

            if (!this.isGameOver) {
                this.requestAnimationId = requestAnimationFrame(this.renderBind);
            }
        }

        updateObj (obj) {
            switch (obj) {
            case this.goodFlowers:
                this.updateScores(this.goodFlowers);
                break;
            case this.leftBear:
                this.updateBear(this.leftBear);
                break;
            case this.rightBear:
                this.updateBear(this.rightBear);
                break;
            case this.badFlowers:
                this.updateBadFlowers(this.badFlowers);
                break;
            case this.beeEater:
                this.updateBeeEater();
                break;
            }
        }

        drawObj (obj) {
            switch (obj) {
            case this.goodFlowers:
                this.drawFlowers(this.goodFlowers);
                break;
            case this.leftBear:
                this.leftBear.determineSteps();
                this.leftBear.move();
                this.leftBear.draw();
                break;
            case this.rightBear:
                this.rightBear.determineSteps();
                this.rightBear.move();
                this.rightBear.draw();
                break;
            case this.badFlowers:
                this.drawFlowers(this.badFlowers);
                break;
            case this.beeEater:
                this.beeEater.move();
                this.beeEater.draw();
                break;
            }
        }


        // flowers
        createFlowers (number, flowers, type) {
            let constructors = {
                'good': GoodFlower,
                'bad': BadFlower
            };

            for (let i = 0; i < number; i++) {
                let flower = new constructors[type](this.context);
                this.setFlowersPosition(flower);
                //+
                flower.blossom();
                flowers.push(flower);
            }

            return flowers;
        }

        setFlowersPosition (flower) {
            let x = this.getRandom(0, this.canvas.width - flower.width);
            let y = this.getRandom(0, this.canvas.height - flower.height);

            flower.setPosition(x, y);

            if (this.checkIntersectionObjects(flower, this.hive)) {
                this.setFlowersPosition(flower);
            }
        }

        drawFlowers (flowers) {
            for (let i = 0; i < flowers.length; i++) {
                flowers[i].draw();
            }
        }

        addFlowers () {
            if (this.goodFlowers.length < (this.maxNumberGoodFlowers * 0.8)) {
                let numberFlowers = 1;
                this.createFlowers(numberFlowers, this.goodFlowers, 'good');
            }
        }

        changeBadFlowersPositions () {
            for (let i = 0; i < this.badFlowers.length; i++) {
                let flower = this.badFlowers[i];
                flower.blossom();
                this.setFlowersPosition(flower);
            }
        }

        updateScores (flowers) {
            let arrIntersectionGoodFlowers = this.getIntersectionObjectsBeeFlowers(flowers);

            this.scores += arrIntersectionGoodFlowers.length;
            this.showScores(this.scores);

            if (arrIntersectionGoodFlowers.length) {
                if (this.getDifficulty() > this.currentDifficulty) {
                    this.currentDifficulty = this.getDifficulty();
                    this.checkGameStage();
                }

                for (let i = 0; i < arrIntersectionGoodFlowers.length; i++) {
                    arrIntersectionGoodFlowers[i].changeImage();
                }
            }
        }

        updateBadFlowers (badFlowers) {
            let arrIntersectionBadFlowers = this.getIntersectionObjectsBeeFlowers(badFlowers);
            this.health -= arrIntersectionBadFlowers.length;
            this.showHealth(this.health);

            if (arrIntersectionBadFlowers.length) {
                this.checkHealth();

                for (let i = 0; i < arrIntersectionBadFlowers.length; i++) {
                    arrIntersectionBadFlowers[i].changeImage();
                }
            }
        }

        getIntersectionObjectsBeeFlowers (flowers) {
            let arrIntersectionObjects = [];

            for (let i = 0; i < flowers.length; i++) {
                let flower = flowers[i];

                if (!flower.isEnd) {

                    if (this.checkIntersectionObjects(this.bee, flower)) {
                        arrIntersectionObjects.push(flower);
                    }

                }
            }

            return arrIntersectionObjects;
        }

        checkHealth () {
            if (this.health <= 0) {
                this.destroy();
                EventObserver.triggerEvent('gameOver');
            }
        }

        removeFlower (flower) {
            if (flower instanceof GoodFlower) {
                let index = this.goodFlowers.indexOf(flower);
                this.goodFlowers.splice(index, 1);
            } else if (flower instanceof BadFlower) {
                let index = this.badFlowers.indexOf(flower);
                this.badFlowers.splice(index, 1);
            }
        }


        // bears
        updateBear (bear) {
            if (this.checkIntersectionObjects(bear, this.hive)) {
                bear.turnOtherWay();
                this.scores = 0;
            }

            if (this.checkIntersectionObjects(bear, this.bee)) {
                this.meetBearAndBeeHandler(bear);
            }
        }

        meetBearAndBeeHandler (bear) {
            this.bee.stopMove();
            bear.meetBeeHandler();
        }

        moveLeftBearsCyclically () {
            this.leftBear.setToInitialState();

            clearTimeout(this.moveLeftBearTimerId);
            let milliseconds = this.getRandom(10000, 20000);
            this.moveLeftBearTimerId = setTimeout(this.moveLeftBearsCyclicallyBind, milliseconds);
        }

        moveRightBearsCyclically () {
            this.rightBear.setToInitialState();

            clearTimeout(this.moveRightBearTimerId);
            let milliseconds = this.getRandom(10000, 20000);
            this.moveRightBearTimerId = setTimeout(this.moveRightBearsCyclicallyBind, milliseconds);
        }

        // beeEater
        updateBeeEater () {
            this.beeEater.checkCollisionBorderCanvas(this.canvas.width, this.canvas.height, this.canvas.x,
                this.canvas.y);

            if (this.checkIntersectionObjects(this.beeEater, this.bee)) {
                this.bee.stopMove();
                this.health = 0;
                this.showHealth(this.health);
                this.checkHealth();
            }
        }
    }

    global.PlayGround = PlayGround;
})();


