var GameObject = /** @class */ (function () {
    function GameObject() {
        this.positionSize = undefined;
        this.style = undefined;
        this.objSelector = undefined;
        this.property = { isCircle: false };
        this.INIT = { positionSize: this.positionSize };
    }
    /**
     * 어떤 Div와 이 Obj가 충돌했는지 확인
     * @param subjectDiv 이거랑 부딪혔는지 확인함.
     * @returns 부딪혔으면 true, 아니면 false
     */
    GameObject.prototype.isCollide = function (subjectDiv) {
        var rect1 = subjectDiv.getBoundingClientRect();
        var rect2 = this.objSelector.getBoundingClientRect();
        if (this.property.isCircle) {
            var r1 = this.objSelector.offsetWidth / 2;
            var r2 = subjectDiv.offsetWidth / 2;
            var x1 = this.objSelector.offsetLeft + r1;
            var y1 = this.objSelector.offsetTop + r1;
            var x2 = subjectDiv.offsetLeft + r2;
            var y2 = subjectDiv.offsetTop + r2;
            var distance = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
            return distance <= (r1 + r2);
        }
        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    };
    GameObject.prototype.start = function () {
        this.INIT = { positionSize: this.positionSize };
    };
    GameObject.prototype.update = function () {
        this.objSelector.style.left = "".concat(this.positionSize.x - cameraPosition.x - this.positionSize.width / 2, "px");
        this.objSelector.style.top = "".concat(-this.positionSize.y + cameraPosition.y - this.positionSize.height / 2, "px");
    };
    return GameObject;
}());
var GameObjectBuilder = /** @class */ (function () {
    function GameObjectBuilder() {
        this.obj = new GameObject();
    }
    GameObjectBuilder.prototype.setPositionSize = function (positionSize) {
        this.obj.positionSize = positionSize;
        return this;
    };
    GameObjectBuilder.prototype.setStyle = function (style) {
        this.obj.style = style;
        return this;
    };
    GameObjectBuilder.prototype.setProperty = function (properties) {
        this.obj.property = properties;
        return this;
    };
    GameObjectBuilder.prototype.build = function () {
        var objectDiv = document.querySelector('.objects');
        var object = document.createElement('div');
        object.style.width = "".concat(this.obj.positionSize.width, "px");
        object.style.height = "".concat(this.obj.positionSize.height, "px");
        object.style.left = "".concat(this.obj.positionSize.x, "px");
        object.style.top = "".concat(this.obj.positionSize.y, "px");
        object.style.backgroundColor = this.obj.style.color;
        object.style.position = 'absolute';
        this.obj.objSelector = object;
        objectDiv.appendChild(object);
        this.obj.start();
        return this.obj;
    };
    return GameObjectBuilder;
}());
