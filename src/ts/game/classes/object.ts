type Style = {
    color?: string,
}

type Property = {
    isCircle: boolean,
}

class GameObject {
    public positionSize: {x: number, y: number, width: number, height: number} = undefined;
    public style: Style = undefined;
    public objSelector: HTMLDivElement = undefined;
    public property: Property = {isCircle: false};

    public INIT = {positionSize: this.positionSize};

    /**
     * 어떤 Div와 이 Obj가 충돌했는지 확인
     * @param subjectDiv 이거랑 부딪혔는지 확인함.
     * @returns 부딪혔으면 true, 아니면 false
     */
    public isCollide(subjectDiv: HTMLDivElement): boolean {
        const rect1 = subjectDiv.getBoundingClientRect();
        const rect2 = this.objSelector.getBoundingClientRect();

        if (this.property.isCircle) {
            const r1 = this.objSelector.offsetWidth / 2;
            const r2 = subjectDiv.offsetWidth / 2;
    
            const x1 = this.objSelector.offsetLeft + r1;
            const y1 = this.objSelector.offsetTop + r1;
            const x2 = subjectDiv.offsetLeft + r2;
            const y2 = subjectDiv.offsetTop + r2;
    
            const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    
            return distance <= (r1 + r2);
        }

        return !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
        );
    }

    public start() {
        this.INIT = {positionSize: this.positionSize}
    }

    public update() {
        this.objSelector.style.left = `${ this.positionSize.x - cameraPosition.x - this.positionSize.width / 2 }px`;
        this.objSelector.style.top = `${ -this.positionSize.y + cameraPosition.y - this.positionSize.height / 2}px`;
    }
}

class GameObjectBuilder {
    private obj: GameObject;
    
    constructor() {
        this.obj = new GameObject();
    }

    public setPositionSize(positionSize: {x: number, y: number, width: number, height: number}): GameObjectBuilder {
        this.obj.positionSize = positionSize;
        return this;
    }

    public setStyle(style: Style): GameObjectBuilder {
        this.obj.style = style;
        return this;
    }

    public setProperty(properties: Property): GameObjectBuilder {
        this.obj.property = properties;
        return this;
    }

    public build(): GameObject {
        let objectDiv: HTMLElement = document.querySelector('.objects');
        const object: HTMLDivElement = document.createElement('div');

        object.style.width = `${ this.obj.positionSize.width }px`;
        object.style.height = `${ this.obj.positionSize.height }px`;
        object.style.left = `${ this.obj.positionSize.x }px`;
        object.style.top = `${ this.obj.positionSize.y }px`;
        
        object.style.backgroundColor = this.obj.style.color;
        object.style.position = 'absolute';

        this.obj.objSelector = object;

        objectDiv.appendChild(object);
        this.obj.start();

        return this.obj;
    }
}