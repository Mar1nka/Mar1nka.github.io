class BadFlower extends Flower{
    constructor (context) {
        super(context);
        this.image.src = 'images/scene/badFlower.png';
        this.image2.src = 'images/scene/goodFlowerEnd.png';
    }
}

global.BadFlower = BadFlower;
