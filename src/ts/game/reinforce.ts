class Item {
    public price: number = 1;
    public ability: ItemAbility = undefined;
    public describe: string = '';
    public id: number = 0;
    public name: string = "";
    public isBought: boolean = false;
    public property = {
        onlyOne: false
    }
    public extra: number[] = undefined;

    constructor(id: number, data: {name: string, price: number, ability?: ItemAbility, describe?: string, onlyOne?: boolean, extra?: number[]}) {
        this.price = data.price;
        this.name = data.name;
        this.ability = data.ability ?? {};
        this.describe = data?.describe ?? '';
        this.id = id;
        this.property.onlyOne = data.onlyOne ?? false;
        this.extra = data.extra ?? [];
    }

    public buy(): boolean {
        if (playerOneself.point >= this.price && !this.isBought && gameStatus.phase.step === 'wait') {
            playerOneself.point -= this.price;

            playerOneself.ability.damage += this.ability?.damage ?? 0;
            playerOneself.status.hp[0] += this.ability?.hp ?? 0;
            playerOneself.ability.armor += this.ability?.armor ?? 0;
            playerOneself.abilityItem.atkSpd += this.ability?.atkSpd ?? 0;
            playerOneself.abilityItem.moveSpd += this.ability?.moveSpd ?? 0;

            if (this.property.onlyOne) this.isBought = true;

            setTimeout(() => {
                storeUpdate();
            }, 20);

            return true;
        }


        return false;
    }
}

let abilityReinforcementBtn: NodeListOf<HTMLDivElement> = document.querySelectorAll('.abp');
let purchaseBtn: HTMLDivElement = document.querySelector('#purchase-btn');
let selectedReinforce: number = -1;
let itemDes: HTMLDivElement = document.querySelector('.win-store>.left');
const reinforceAbility: Item[] = [
    new Item(0, {name: "공격력 증가", price: 1, ability: {damage: 2}, describe: '공격력 2 증가', onlyOne: false}),
    new Item(1, {name: "체력 증가", price: 1, ability: {hp: 15}, describe: '체력 15 증가', onlyOne: false}),
    new Item(2, {name: "방어력 증가", price: 1, ability: {armor: 3}, describe: '방어력 2 증가', onlyOne: false}),
    new Item(3, {name: "공격 속도 증가", price: 1, ability: {atkSpd: 10}, describe: '공격 속도 10% 증가', onlyOne: false}),
    new Item(4, {name: "이동 속도 증가", price: 1, ability: {moveSpd: 0.03}, describe: '이동 속도 3% 증가', onlyOne: false}),
];
const items: Item[] = [
    new Item(0, {name: "라운드 시작 시 보호막 30 제공", price: 3, onlyOne: true, extra: [30] }),
    new Item(1, {name: "라운드 끝날 때마다 추가 RP 2", price: 5, onlyOne: true, extra: [2] }),
    new Item(2, {name: "체력이 50% 이하일 때 초당 체력 2 회복", price: 2, onlyOne: true, extra: [2] }),
    new Item(3, {name: "2초마다 가까운 적에게 투사체 발사 (공격력의 40%만큼 피해)", price: 4, onlyOne: true, extra: [0.4] }),
    // new Item(3, {name: "라운드 당 ", price: 2, onlyOne: true, extra: [2] }),
];
let hasItems: boolean[] = [];

items.forEach(e => {
    hasItems.push(false)

    const rightDiv: HTMLDivElement = document.querySelector('.right');
    const itemDiv: HTMLDivElement = document.createElement('div');

    itemDiv.innerHTML = `${e.name} <p class="purchase-btn-s a${ e.id }">구매 (RP -${e.price})</p>`;
    itemDiv.classList.add("items");
    itemDiv.classList.add(`i-${ e.id }`);

    rightDiv.appendChild(itemDiv);

    document.querySelector(`.purchase-btn-s.a${ e.id }`).addEventListener('click', () => {
        const itemD: HTMLDivElement = document.querySelector(`.i-${e.id}`);

        if (e.buy()) {
            hasItems[e.id] = true;
            itemD.style.display = 'none'
        }
    });
});

abilityReinforcementBtn.forEach((e, i) => {
    e.addEventListener('click', () => {
        selectedReinforce = i;
        storeUpdate();
    });
});

purchaseBtn.addEventListener('click', () => {
    reinforceAbility[selectedReinforce].buy();
});

function storeUpdate() {
    let abilities = [
        playerOneself.ability.damage,
        playerOneself.status.hp[0],
        playerOneself.ability.armor,
        playerOneself.ability.atkSpd,
        playerOneself.ability.moveSpd,
    ]
    document.querySelector('#now-point-span').innerHTML = `RP - <span id="now-point">${ playerOneself.point }</span>`;
    document.querySelectorAll('.ab-c').forEach((e, i) => {
        e.innerHTML = `${ abilities[i] }`;
    });
    
    
    if (selectedReinforce === -1) return;
    
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
    document.querySelector('#item-name').innerHTML = `${ reinforceAbility[selectedReinforce].name }`;
    document.querySelector('#item-des').innerHTML = `${ reinforceAbility[selectedReinforce].describe }`;
    document.querySelector('#purchase-btn').innerHTML = `구매 (RP -${ reinforceAbility[selectedReinforce].price  })`;
    
    abilityReinforcementBtn = document.querySelectorAll('.abp');
}