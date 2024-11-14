var Item = /** @class */ (function () {
    function Item(id, data) {
        var _a, _b, _c, _d;
        this.price = 1;
        this.ability = undefined;
        this.describe = '';
        this.id = 0;
        this.name = "";
        this.isBought = false;
        this.property = {
            onlyOne: false
        };
        this.extra = undefined;
        this.price = data.price;
        this.name = data.name;
        this.ability = (_a = data.ability) !== null && _a !== void 0 ? _a : {};
        this.describe = (_b = data === null || data === void 0 ? void 0 : data.describe) !== null && _b !== void 0 ? _b : '';
        this.id = id;
        this.property.onlyOne = (_c = data.onlyOne) !== null && _c !== void 0 ? _c : false;
        this.extra = (_d = data.extra) !== null && _d !== void 0 ? _d : [];
    }
    Item.prototype.buy = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        if (playerOneself.point >= this.price && !this.isBought && gameStatus.phase.step === 'wait') {
            playerOneself.point -= this.price;
            playerOneself.ability.damage += (_b = (_a = this.ability) === null || _a === void 0 ? void 0 : _a.damage) !== null && _b !== void 0 ? _b : 0;
            playerOneself.status.hp[0] += (_d = (_c = this.ability) === null || _c === void 0 ? void 0 : _c.hp) !== null && _d !== void 0 ? _d : 0;
            playerOneself.ability.armor += (_f = (_e = this.ability) === null || _e === void 0 ? void 0 : _e.armor) !== null && _f !== void 0 ? _f : 0;
            playerOneself.abilityItem.atkSpd += (_h = (_g = this.ability) === null || _g === void 0 ? void 0 : _g.atkSpd) !== null && _h !== void 0 ? _h : 0;
            playerOneself.abilityItem.moveSpd += (_k = (_j = this.ability) === null || _j === void 0 ? void 0 : _j.moveSpd) !== null && _k !== void 0 ? _k : 0;
            if (this.property.onlyOne)
                this.isBought = true;
            setTimeout(function () {
                storeUpdate();
            }, 20);
            return true;
        }
        return false;
    };
    return Item;
}());
var abilityReinforcementBtn = document.querySelectorAll('.abp');
var purchaseBtn = document.querySelector('#purchase-btn');
var selectedReinforce = -1;
var itemDes = document.querySelector('.win-store>.left');
var reinforceAbility = [
    new Item(0, { name: "공격력 증가", price: 1, ability: { damage: 2 }, describe: '공격력 2 증가', onlyOne: false }),
    new Item(1, { name: "체력 증가", price: 1, ability: { hp: 15 }, describe: '체력 15 증가', onlyOne: false }),
    new Item(2, { name: "방어력 증가", price: 1, ability: { armor: 3 }, describe: '방어력 2 증가', onlyOne: false }),
    new Item(3, { name: "공격 속도 증가", price: 1, ability: { atkSpd: 10 }, describe: '공격 속도 10% 증가', onlyOne: false }),
    new Item(4, { name: "이동 속도 증가", price: 1, ability: { moveSpd: 0.03 }, describe: '이동 속도 3% 증가', onlyOne: false }),
];
var items = [
    new Item(0, { name: "라운드 시작 시 보호막 30 제공", price: 3, onlyOne: true, extra: [30] }),
    new Item(1, { name: "라운드 끝날 때마다 추가 RP 2", price: 5, onlyOne: true, extra: [2] }),
    new Item(2, { name: "체력이 50% 이하일 때 초당 체력 2 회복", price: 2, onlyOne: true, extra: [2] }),
    new Item(3, { name: "2초마다 가까운 적에게 투사체 발사 (공격력의 40%만큼 피해)", price: 4, onlyOne: true, extra: [0.4] }),
    // new Item(3, {name: "라운드 당 ", price: 2, onlyOne: true, extra: [2] }),
];
var hasItems = [];
items.forEach(function (e) {
    hasItems.push(false);
    var rightDiv = document.querySelector('.right');
    var itemDiv = document.createElement('div');
    itemDiv.innerHTML = "".concat(e.name, " <p class=\"purchase-btn-s a").concat(e.id, "\">\uAD6C\uB9E4 (RP -").concat(e.price, ")</p>");
    itemDiv.classList.add("items");
    itemDiv.classList.add("i-".concat(e.id));
    rightDiv.appendChild(itemDiv);
    document.querySelector(".purchase-btn-s.a".concat(e.id)).addEventListener('click', function () {
        var itemD = document.querySelector(".i-".concat(e.id));
        if (e.buy()) {
            hasItems[e.id] = true;
            itemD.style.display = 'none';
        }
    });
});
abilityReinforcementBtn.forEach(function (e, i) {
    e.addEventListener('click', function () {
        selectedReinforce = i;
        storeUpdate();
    });
});
purchaseBtn.addEventListener('click', function () {
    reinforceAbility[selectedReinforce].buy();
});
function storeUpdate() {
    var abilities = [
        playerOneself.ability.damage,
        playerOneself.status.hp[0],
        playerOneself.ability.armor,
        playerOneself.ability.atkSpd,
        playerOneself.ability.moveSpd,
    ];
    document.querySelector('#now-point-span').innerHTML = "RP - <span id=\"now-point\">".concat(playerOneself.point, "</span>");
    document.querySelectorAll('.ab-c').forEach(function (e, i) {
        e.innerHTML = "".concat(abilities[i]);
    });
    if (selectedReinforce === -1)
        return;
    // itemDes.innerHTML = `
    //     <hr/>
    //     <p id="store-title">현재 능력치</p>
    //     <p class="ab">공격력: ${ playerOneself.ability.damage } <span class="abp">+2</span></p>
    //     <p class="ab">체력: ${ playerOneself.status.hp[0] } <span class="abp">+10</span></p>
    //     <p class="ab">방어력: ${ playerOneself.ability.armor } <span class="abp">+2</span></p>
    //     <p class="ab">공격 속도: ${ playerOneself.ability.atkSpd } <span class="abp">+10%</span></p>
    //     <p class="ab">이동 속도: ${ playerOneself.ability.moveSpd } <span class="abp">+3%</span></p>
    //     <hr />
    // `;
    document.querySelector('#item-name').innerHTML = "".concat(reinforceAbility[selectedReinforce].name);
    document.querySelector('#item-des').innerHTML = "".concat(reinforceAbility[selectedReinforce].describe);
    document.querySelector('#purchase-btn').innerHTML = "\uAD6C\uB9E4 (RP -".concat(reinforceAbility[selectedReinforce].price, ")");
    abilityReinforcementBtn = document.querySelectorAll('.abp');
}
