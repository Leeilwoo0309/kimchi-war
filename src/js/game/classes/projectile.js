var Projectile = /** @class */ (function () {
    function Projectile() {
        this.projectileINIT = {
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
        this.projectileHit = {
            damage: 0,
            critical: [0, 0]
        };
        this.positionSize = { x: 0, y: 0, width: 10, height: 10 };
        this.style = {
            color: undefined,
            opacity: undefined,
        };
        this._movedDistance = 0;
    }
    Projectile.prototype.start = function (type) {
        var _this = this;
        var _main = document.querySelector('.projectiles');
        var _projectile = document.createElement('div');
        _projectile.className = "".concat(type, " projectile");
        _projectile.style.width = "".concat(this.positionSize.width, "px");
        _projectile.style.height = "".concat(this.positionSize.height, "px");
        _projectile.style.rotate = "".concat(-this.projectileINIT.angle + Math.PI / 2, "rad");
        _projectile.style.left = "".concat(this.positionSize.x - cameraPosition.x - this.positionSize.width / 2, "px");
        _projectile.style.top = "".concat(-this.positionSize.y + cameraPosition.y - this.positionSize.height / 2, "px");
        // 투사체 스타일 결정
        if (this.style.color !== undefined)
            _projectile.style.backgroundColor = "".concat(this.style.color);
        if (this.style.opacity !== undefined)
            _projectile.style.opacity = "".concat(this.style.opacity, "%");
        _main.appendChild(_projectile);
        var target = Math.floor(Math.random() * 2);
        var enemyTeam = this.projectileINIT.team === 'blue' ? 'red' : 'blue';
        if (players[enemyTeam].length === 1)
            target = 0;
        var update = setInterval(function () {
            // clearInterval(update);
            _this._movedDistance += _this.projectileINIT.speed;
            if (_this.projectileINIT.isTarget) {
                _this.projectileINIT.angle = Math.atan2(players[enemyTeam][target].position.y - _this.positionSize.y, players[enemyTeam][target].position.x - _this.positionSize.x);
                _this.positionSize.x += _this.projectileINIT.speed * Math.cos(_this.projectileINIT.angle);
                _this.positionSize.y += _this.projectileINIT.speed * Math.sin(_this.projectileINIT.angle);
            }
            else {
                _this.positionSize.x += -_this.projectileINIT.speed * Math.cos(_this.projectileINIT.angle);
                _this.positionSize.y += -_this.projectileINIT.speed * Math.sin(_this.projectileINIT.angle);
            }
            _projectile.style.left = "".concat(_this.positionSize.x - cameraPosition.x - _this.positionSize.width / 2, "px");
            _projectile.style.top = "".concat(-_this.positionSize.y + cameraPosition.y - _this.positionSize.height / 2, "px");
            if (_this.projectileHit.damage > 0 && gameStatus.phase.step === 'game') {
                runEachTeam(function (e) {
                    if (_this.projectileINIT.team !== e.team && _this.isCollideWithPlayer2(_projectile, e.id) && !_this.projectileINIT.isCollide) {
                        _this.projectileINIT.isCollide = true;
                        // e.status.hp[1] -= this.projectileHit.damage;
                        var damageAmount = _this.projectileHit.damage - e.ability.armor;
                        if (damageAmount < 0)
                            damageAmount = 0;
                        damage(damageAmount, e.id);
                        if (e.status.hp[1] <= 0) {
                            e.status.isArrive = false;
                            e.temp.spawnWait = _this.projectileINIT.id;
                        }
                        if (!_this.projectileINIT.isCanPass)
                            _this.projectileINIT.isArrive = false;
                    }
                });
            }
            // 화면 밖으로 나가면 탄환 제거
            gameObjects.forEach(function (e) {
                if (_this.projectileINIT.isIgnoreObj)
                    return;
                if (e.isCollide(_projectile) && _this.projectileINIT.isArrive) {
                    _this.projectileINIT.isArrive = false;
                }
            });
            if (_this._movedDistance >= _this.projectileINIT.reach * 1.5 && _this.projectileINIT.isArrive) {
                _this.projectileINIT.isArrive = false;
            }
            if (!_this.projectileINIT.isArrive) {
                clearInterval(update);
                _main.removeChild(_projectile);
            }
        }, 16);
    };
    Projectile.prototype.isCollideWithPlayer2 = function (projectileSelector, id) {
        var rect1 = findPlayerById(id).selector.getBoundingClientRect();
        var rect2 = projectileSelector.getBoundingClientRect();
        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    };
    return Projectile;
}());
var ProjectileBuilder = /** @class */ (function () {
    function ProjectileBuilder() {
        this.projectile = new Projectile();
    }
    ProjectileBuilder.prototype.setInfo = function (info) {
        var _a, _b, _c, _d, _e;
        this.projectile.projectileINIT = {
            angle: info.angle,
            isArrive: (_a = info === null || info === void 0 ? void 0 : info.isArrive) !== null && _a !== void 0 ? _a : true,
            isCanPass: (_b = info === null || info === void 0 ? void 0 : info.isCanPass) !== null && _b !== void 0 ? _b : false,
            isCollide: (_c = info === null || info === void 0 ? void 0 : info.isCollide) !== null && _c !== void 0 ? _c : false,
            isIgnoreObj: (_d = info === null || info === void 0 ? void 0 : info.isIgnoreObj) !== null && _d !== void 0 ? _d : false,
            isSent: false,
            reach: info.reach,
            speed: info.speed,
            tag: info.tag,
            target: (_e = info === null || info === void 0 ? void 0 : info.target) !== null && _e !== void 0 ? _e : [false, undefined],
            team: info.team,
            id: info.id,
            isTarget: info.isTarget
        };
        return this;
    };
    ProjectileBuilder.prototype.setHitInfo = function (hitInfo) {
        this.projectile.projectileHit = {
            critical: hitInfo.critical,
            damage: hitInfo.damage
        };
        return this;
    };
    ProjectileBuilder.prototype.setPositionSize = function (x, y, height, width) {
        this.projectile.positionSize.x = x;
        this.projectile.positionSize.y = y;
        this.projectile.positionSize.height = height;
        this.projectile.positionSize.width = width;
        return this;
    };
    ProjectileBuilder.prototype.setStyle = function (style) {
        this.projectile.style.color = style === null || style === void 0 ? void 0 : style.color;
        this.projectile.style.opacity = style === null || style === void 0 ? void 0 : style.opacity;
        return this;
    };
    ProjectileBuilder.prototype.build = function (type) {
        this.projectile.start(type);
        return this.projectile;
    };
    return ProjectileBuilder;
}());
