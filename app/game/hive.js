(function () {

    'use strict';

    class Hive {
        constructor (context) {
            this.context = context;
            this.x = 0;
            this.y = 0;
            this.width = 135;
            this.height = 150;

            this.image = new Image();
            this.image.src = 'images/scene/hive.png';
        }

        setPosition (x, y) {
            this.x = x;
            this.y = y;
        }

        draw () {
            this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    global.Hive = Hive;

})();