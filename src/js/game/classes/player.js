var PlayerClass = /** @class */ (function () {
    function PlayerClass(json) {
        this.team = TEAM;
        this.id = 0;
        this.nickname = '어떠서';
        this.point = 5;
        this.position = { x: 0, y: 0 };
        this.ability = undefined;
        this.abilityItem = undefined;
        this.abilityINIT = undefined;
        this.selector = undefined;
        this.status = undefined;
        this.temp = {
            spawnWait: -1
        };
        this.items = [];
        this.modify(json);
    }
    PlayerClass.prototype.build = function () {
        var playersDiv = document.querySelector('#player-divs');
        this.abilityItem = {
            armor: 0,
            atkSpd: 0,
            damage: 0,
            moveSpd: 0
        };
        playersDiv.innerHTML += "\n            <div class=\"player ".concat(this.team, " player").concat(this.id, "\">\n                <div class=\"info ").concat(this.team, "\">\n                    <span id=\"nickname\">").concat(this.nickname, "</span>\n                </div>\n                <div class=\"hp ").concat(this.team, " player").concat(this.id, "\">\n                    <div class=\"hp-progress later ").concat(this.team, " player").concat(this.id, "\"></div>\n                    <div class=\"hp-progress barrier ").concat(this.team, " player").concat(this.id, "\"></div>\n                    <div class=\"hp-progress ").concat(this.team, " player").concat(this.id, "\"></div>\n                </div>\n                <div class=\"damage-print player").concat(this.id, "\">\n                </div>\n            </div>\n        ");
        this.selector = document.querySelector(".player.".concat(this.team, ".player").concat(this.id));
        this.selector.style.backgroundColor = this.team;
        this.abilityINIT = {
            armor: this.ability.armor,
            atkSpd: this.ability.atkSpd,
            damage: this.ability.damage,
            moveSpd: this.ability.moveSpd,
        };
        return this;
    };
    PlayerClass.prototype.update = function () {
        var _this = this;
        if (!this.status.isArrive && gameStatus.phase.step === 'game') {
            this.selector.style.display = 'none';
            if (this.temp.spawnWait !== -1) {
                printKillLog({ killer: this.temp.spawnWait, killed: this.id });
                this.temp.spawnWait = -1;
                setTimeout(function () {
                    _this.selector.style.display = 'block';
                    _this.status.hp[1] = _this.status.hp[0];
                    _this.status.isArrive = true;
                    initPosition();
                    _this.ability.armor += 99999999;
                    _this.status.isNoDmg = true;
                    setTimeout(function () {
                        _this.ability.armor -= 99999999;
                        _this.status.isNoDmg = false;
                    }, 2000);
                }, 1000);
            }
        }
        else {
            this.selector.style.display = 'block';
        }
        if (this.status.isNoDmg) {
            this.selector.style.boxShadow = 'rgb(255, 247, 88) 0px 0px 2px 5px';
        }
        else {
            this.selector.style.boxShadow = '';
        }
        // players[team].specINIT.atkspd * (1 + Math.round(players[team].specItem.atkspd) / 100) * 100
        this.ability.atkSpd = Math.round(this.abilityINIT.atkSpd * (1 + Math.round(this.abilityItem.atkSpd) / 100) * 100) / 100;
        this.ability.moveSpd = Math.floor((this.abilityINIT.moveSpd + this.abilityINIT.moveSpd * this.abilityItem.moveSpd) * 100) / 100;
        return this;
    };
    /**
     * 플레이어의 정보 수정
     * @param json 수정하고자 하는 능력치를 JSON으로 받는다.
     */
    PlayerClass.prototype.modify = function (json) {
        var playerData = JSON.parse(json);
        this.id = playerData === null || playerData === void 0 ? void 0 : playerData.id;
        this.team = playerData === null || playerData === void 0 ? void 0 : playerData.team;
        this.nickname = playerData === null || playerData === void 0 ? void 0 : playerData.nickname;
        this.point = playerData === null || playerData === void 0 ? void 0 : playerData.gold;
        this.position = playerData === null || playerData === void 0 ? void 0 : playerData.position;
        this.ability = playerData === null || playerData === void 0 ? void 0 : playerData.ability;
        this.selector = document.querySelector(".player.".concat(this.team, ".player").concat(this.id));
        this.status = playerData === null || playerData === void 0 ? void 0 : playerData.status;
        return this;
    };
    return PlayerClass;
}());
/**
 * @param id 플레이어의 id 기입
 * @returns 해당 id를 가진 PlayerClass 반환
 */
function findPlayerById(id) {
    var _a, _b, _c, _d;
    if (((_a = players.red[0]) === null || _a === void 0 ? void 0 : _a.id) === id)
        return players.red[0];
    if (((_b = players.red[1]) === null || _b === void 0 ? void 0 : _b.id) === id)
        return players.red[1];
    if (((_c = players.blue[0]) === null || _c === void 0 ? void 0 : _c.id) === id)
        return players.blue[0];
    if (((_d = players.blue[1]) === null || _d === void 0 ? void 0 : _d.id) === id)
        return players.blue[1];
}
/**
 * 데미지를 넣는 함수
 * @param damage 데미지의 크기
 * @param targetID 어떤 id를 가진 플레이어가 맞는지 넣으면 됨
 * @returns void
 */
function damage(damage, targetID) {
    var parent = document.querySelector(".damage-print.player".concat(targetID));
    var alerter = document.createElement('div');
    var textColor = {
        melee: 'rgb(227, 106, 14)',
        magic: 'rgb(14, 124, 227)',
        true: 'white',
        heal: 'rgb(0, 180, 0)'
    };
    if (Math.round(damage) == 0)
        return;
    alerter.innerHTML = "".concat(Math.round(damage));
    alerter.style.opacity = '100%';
    alerter.style.marginTop = "-".concat(Math.random() * 20 + 30, "px");
    alerter.style.marginLeft = "".concat(Math.random() * 50 - 20, "px");
    alerter.style.color = "red";
    alerter.style.fontSize = "".concat((Math.log(damage * 4) + 15), "px");
    alerter.style.transition = 'opacity 300ms';
    alerter.style.position = 'fixed ';
    alerter.style.textShadow = "0px 0px 2px red";
    alerter.style.transform = 'scale(1.7, 1.7)';
    parent.appendChild(alerter);
    setTimeout(function () {
        alerter.style.transition = '400 cubic-bezier(0, 0, 0, 0.97);';
        alerter.style.transform = 'scale(1, 1)';
    }, 10);
    setTimeout(function () {
        // alerter.style.transform = 'translate(0, 10px)'
        alerter.style.opacity = '0%';
    }, 300);
    setTimeout(function () {
        alerter.style.display = 'none';
        // parent.removeChild(alerter);
    }, 600);
    if (PLAYER_ID === targetID) {
        // playerOneself.status.hp[1] -= damage;
        var totalDamageSum = damage;
        if (playerOneself.status.barrier.length > 0) {
            var index = 0;
            while (true) {
                if (playerOneself.status.barrier.length <= index)
                    break;
                console.log(playerOneself.status.barrier.length, index);
                var barrierMax = playerOneself.status.barrier[index][0];
                playerOneself.status.barrier[index][0] -= totalDamageSum;
                if (playerOneself.status.barrier[index][0] < 0) {
                    totalDamageSum -= barrierMax;
                    index += 1;
                }
                else {
                    totalDamageSum = 0;
                    break;
                }
            }
            playerOneself.status.hp[1] -= totalDamageSum;
        }
        else {
            playerOneself.status.hp[1] -= damage;
        }
    }
}
