type ProjectileInfoINIT = {
    angle: number,
    speed: number,
    reach: number,
    isArrive?: boolean,
    isSent?: boolean,
    isCollide?: boolean,
    isIgnoreObj?: boolean,
    isCanPass?: boolean,
    isTarget?: boolean,
    tag: string,
    target?: [boolean, string],
    team: 'red' | 'blue',
    id: number
}

type ProjectileInfoHit = {
    damage: number,
    critical: [number, number]
}

class Projectile {
    public projectileINIT: ProjectileInfoINIT = {
        angle: 0,
        speed: 15,
        reach: -1,
        isArrive: true,
        isSent: false,
        isCollide: false,
        isIgnoreObj: false,
        isCanPass: false,
        tag: '',
        target: [false, undefined],
        team: TEAM,
        id: PLAYER_ID
    };
    public projectileHit: ProjectileInfoHit = {
        damage: 0,
        critical: [0, 0]
    }
    public positionSize: {x: number, y: number, width: number, height: number} = {x: 0, y: 0, width: 10, height: 10};
    public style = {
        color: undefined,
        opacity: undefined,
    };
    private _movedDistance: number = 0;

    public start(type: "blue" | "red") {
        const _main: HTMLElement = document.querySelector('.projectiles');
    
        let _projectile = document.createElement('div');

        _projectile.className = `${ type } projectile`;
        _projectile.style.width = `${ this.positionSize.width }px`;
        _projectile.style.height = `${ this.positionSize.height }px`;
        _projectile.style.rotate = `${ -this.projectileINIT.angle + Math.PI / 2 }rad`;
        _projectile.style.left = `${ this.positionSize.x - cameraPosition.x - this.positionSize.width / 2 }px`;
        _projectile.style.top = `${ -this.positionSize.y + cameraPosition.y - this.positionSize.height / 2 }px`;


        // 투사체 스타일 결정
        if (this.style.color !== undefined) _projectile.style.backgroundColor  = `${ this.style.color }`;
        if (this.style.opacity !== undefined) _projectile.style.opacity  = `${ this.style.opacity }%`;

        _main.appendChild(_projectile);

        let target = Math.floor(Math.random() * 2);
        let enemyTeam: Team = this.projectileINIT.team === 'blue' ? 'red' : 'blue';

        if (players[enemyTeam].length === 1) target = 0;

        const update = setInterval(() => {
            // clearInterval(update);
            this._movedDistance += this.projectileINIT.speed;

            if (this.projectileINIT.isTarget) {
                this.projectileINIT.angle = Math.atan2(
                    players[enemyTeam][target].position.y - this.positionSize.y,
                    players[enemyTeam][target].position.x - this.positionSize.x
                );
                this.positionSize.x += this.projectileINIT.speed * Math.cos(this.projectileINIT.angle);
                this.positionSize.y += this.projectileINIT.speed * Math.sin(this.projectileINIT.angle);

            } else {
                this.positionSize.x += -this.projectileINIT.speed * Math.cos(this.projectileINIT.angle);
                this.positionSize.y += -this.projectileINIT.speed * Math.sin(this.projectileINIT.angle);
            }

            _projectile.style.left = `${ this.positionSize.x - cameraPosition.x - this.positionSize.width / 2 }px`;
            _projectile.style.top = `${ -this.positionSize.y + cameraPosition.y - this.positionSize.height / 2 }px`;

            if (this.projectileHit.damage > 0 && gameStatus.phase.step === 'game') {
                runEachTeam(e => {
                    if (this.projectileINIT.team !== e.team && this.isCollideWithPlayer2(_projectile, e.id) && !this.projectileINIT.isCollide) {
                        this.projectileINIT.isCollide = true;
    
                        // e.status.hp[1] -= this.projectileHit.damage;

                        let damageAmount = this.projectileHit.damage - e.ability.armor;

                        if (damageAmount < 0) damageAmount = 0;

                        damage(damageAmount, e.id);

                        if (e.status.hp[1] <= 0) {
                            e.status.isArrive = false;
                            e.temp.spawnWait = this.projectileINIT.id;
                        }
    
                        if (!this.projectileINIT.isCanPass) this.projectileINIT.isArrive = false;
                    }
                })
            }

            // 화면 밖으로 나가면 탄환 제거
            gameObjects.forEach((e) => {
                if (this.projectileINIT.isIgnoreObj) return;
                if (e.isCollide(_projectile) && this.projectileINIT.isArrive) {
                    this.projectileINIT.isArrive = false;
                }
            });

            if (this._movedDistance >= this.projectileINIT.reach * 1.5 && this.projectileINIT.isArrive) {
                this.projectileINIT.isArrive = false;
            }

            if (!this.projectileINIT.isArrive) {
                clearInterval(update);
                _main.removeChild(_projectile);
            }
        }, 16);
    }

    public isCollideWithPlayer2(projectileSelector: HTMLDivElement, id: number): boolean {
        const rect1 = findPlayerById(id).selector.getBoundingClientRect();
        const rect2 = projectileSelector.getBoundingClientRect();

        return !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
        );
    }
}

class ProjectileBuilder {
    private projectile: Projectile;

    constructor() {
        this.projectile = new Projectile();
    }

    public setInfo(info: ProjectileInfoINIT): ProjectileBuilder {
        this.projectile.projectileINIT = {
            angle: info.angle,
            isArrive: info?.isArrive ?? true,
            isCanPass: info?.isCanPass ?? false,
            isCollide: info?.isCollide ?? false,
            isIgnoreObj: info?.isIgnoreObj ?? false,
            isSent: false,
            reach: info.reach,
            speed: info.speed,
            tag: info.tag,
            target: info?.target ?? [false, undefined],
            team: info.team,
            id: info.id,
            isTarget: info.isTarget
        }
        return this;
    }

    public setHitInfo(hitInfo: ProjectileInfoHit): ProjectileBuilder {
        this.projectile.projectileHit = {
            critical: hitInfo.critical,
            damage: hitInfo.damage
        }
        return this;
    }

    public setPositionSize(x: number, y: number, height: number, width: number): ProjectileBuilder {
        this.projectile.positionSize.x = x;
        this.projectile.positionSize.y = y;
        this.projectile.positionSize.height = height;
        this.projectile.positionSize.width = width;

        return this;
    }

    public setStyle(style: {color?: string, opacity?: number}): ProjectileBuilder {
        this.projectile.style.color = style?.color;
        this.projectile.style.opacity = style?.opacity;
        return this;
    }

    public build(type: "blue" | "red") {
        this.projectile.start(type);

        return this.projectile;
    }
}