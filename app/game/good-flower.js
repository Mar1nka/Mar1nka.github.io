(function () {

    'use strict';

    class GoodFlower extends Flower {
        constructor (context) {
            super(context);
            this.image.src = 'images/scene/goodFlower.png';
            this.image2.src = 'images/scene/flowerDestroy.png';
        }
    }

    global.GoodFlower = GoodFlower;

})();