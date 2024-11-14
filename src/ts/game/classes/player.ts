class PlayerClass {
    public team: Team = TEAM;
    public id: number = 0;
    public nickname: string = '어떠서';
    public point: number = 5;
    public position: {x: number, y: number} = {x: 0, y: 0};
    public ability: Ability = undefined;
    public abilityItem: Ability = undefined;
    public abilityINIT: Ability = undefined;
    public selector: HTMLDivElement = undefined;
    public status: Status = undefined;
    public temp = {
        spawnWait: -1
    };
    public items: ItemsName[] = [];

    constructor(json: string) {
        this.modify(json)
    }

    public build(): PlayerClass {
        const playersDiv: HTMLDivElement = document.querySelector('#player-divs');

        this.abilityItem = {
            armor: 0,
            atkSpd: 0,
            damage: 0,
            moveSpd: 0
        }

        playersDiv.innerHTML += `
            <div class="player ${ this.team } player${ this.id }">
                <div class="info ${ this.team }">
                    <span id="nickname">${ this.nickname }</span>
                </div>
                <div class="hp ${ this.team } player${ this.id }">
                    <div class="hp-progress later ${ this.team } player${ this.id }"></div>
                    <div class="hp-progress barrier ${ this.team } player${ this.id }"></div>
                    <div class="hp-progress ${ this.team } player${ this.id }"></div>
                </div>
                <div class="damage-print player${ this.id }">
                </div>
            </div>
        `;

        this.selector = document.querySelector(`.player.${ this.team }.player${ this.id }`);
        this.selector.style.backgroundColor = this.team;
        this.abilityINIT = {
            armor: this.ability.armor,
            atkSpd: this.ability.atkSpd,
            damage: this.ability.damage,
            moveSpd: this.ability.moveSpd,
        };

        return this;
    }

    public update(): PlayerClass {
        if (!this.status.isArrive && gameStatus.phase.step === 'game') {
            this.selector.style.display = 'none';
            
            if (this.temp.spawnWait !== -1) {
                printKillLog({killer: this.temp.spawnWait, killed: this.id});
                this.temp.spawnWait = -1;

                setTimeout(() => {
                    this.selector.style.display = 'block';
                    this.status.hp[1] = this.status.hp[0];
                    this.status.isArrive = true;

                    initPosition();

                    this.ability.armor += 99999999;
                    this.status.isNoDmg = true;
                    
                    setTimeout(() => {
                        this.ability.armor -= 99999999;
                        this.status.isNoDmg = false;
                    }, 2000);
                }, 1000);
            }
        } else {
            this.selector.style.display = 'block';
        }
        
        if (this.status.isNoDmg) {
            this.selector.style.boxShadow = 'rgb(255, 247, 88) 0px 0px 2px 5px';
        } else {
            this.selector.style.boxShadow = '';
        }
        
        // players[team].specINIT.atkspd * (1 + Math.round(players[team].specItem.atkspd) / 100) * 100
        this.ability.atkSpd = Math.round(this.abilityINIT.atkSpd * (1 + Math.round(this.abilityItem.atkSpd) / 100) * 100) / 100;
        this.ability.moveSpd = Math.floor((this.abilityINIT.moveSpd + this.abilityINIT.moveSpd * this.abilityItem.moveSpd) * 100) / 100;
        
        return this;
    }
    
    /**
     * 플레이어의 정보 수정
     * @param json 수정하고자 하는 능력치를 JSON으로 받는다.
     */
    public modify(json: string): PlayerClass {
        const playerData = JSON.parse(json);
        
        this.id = playerData?.id;
        this.team = playerData?.team;
        this.nickname = playerData?.nickname;
        this.point = playerData?.gold;
        this.position = playerData?.position;
        this.ability = playerData?.ability;
        this.selector = document.querySelector(`.player.${ this.team }.player${ this.id }`);
        this.status = playerData?.status;

        return this;
    }
}

/**
 * @param id 플레이어의 id 기입
 * @returns 해당 id를 가진 PlayerClass 반환
 */
function findPlayerById(id: number): PlayerClass {
    if (players.red[0]?.id === id) return players.red[0];
    if (players.red[1]?.id === id) return players.red[1];
    if (players.blue[0]?.id === id) return players.blue[0];
    if (players.blue[1]?.id === id) return players.blue[1];
}

/**
 * 데미지를 넣는 함수
 * @param damage 데미지의 크기
 * @param targetID 어떤 id를 가진 플레이어가 맞는지 넣으면 됨
 * @returns void
 */
function damage(damage: number, targetID: number) {
    const parent: HTMLDivElement = document.querySelector(`.damage-print.player${ targetID }`);
    const alerter: HTMLDivElement = document.createElement('div');
    const textColor = {
        melee: 'rgb(227, 106, 14)',
        magic: 'rgb(14, 124, 227)',
        true: 'white',
        heal: 'rgb(0, 180, 0)'
    };

    if (Math.round(damage) == 0) return;

    alerter.innerHTML = `${ Math.round(damage) }`;
    alerter.style.opacity = '100%';
    alerter.style.marginTop = `-${Math.random() * 20 + 30}px`;
    alerter.style.marginLeft = `${ Math.random() * 50 - 20 }px`;
    alerter.style.color = `red`;
    alerter.style.fontSize = `${ (Math.log(damage * 4) + 15) }px`;
    alerter.style.transition = 'opacity 300ms';
    alerter.style.position = 'fixed ';
    alerter.style.textShadow = `0px 0px 2px red`;
    alerter.style.transform = 'scale(1.7, 1.7)';
    
    parent.appendChild(alerter);
    
    setTimeout(() => {
        alerter.style.transition = '400 cubic-bezier(0, 0, 0, 0.97);'
        alerter.style.transform = 'scale(1, 1)';
    }, 10);

    setTimeout(() => {
        // alerter.style.transform = 'translate(0, 10px)'
        alerter.style.opacity = '0%';
    }, 300);

    setTimeout(() => {
        alerter.style.display = 'none';
        // parent.removeChild(alerter);
    }, 600);

    if (PLAYER_ID === targetID) {
        // playerOneself.status.hp[1] -= damage;
        let totalDamageSum = damage;

        if (playerOneself.status.barrier.length > 0) {
            let index: number = 0;

            while (true) {
                if (playerOneself.status.barrier.length <= index) break;
                console.log(playerOneself.status.barrier.length, index);

                let barrierMax = playerOneself.status.barrier[index][0];

                playerOneself.status.barrier[index][0] -= totalDamageSum;

                if (playerOneself.status.barrier[index][0] < 0) {
                    totalDamageSum -= barrierMax;

                    index += 1;
                } else {
                    totalDamageSum = 0;
                    break;
                }
            }

            playerOneself.status.hp[1] -= totalDamageSum;
        } else {
            playerOneself.status.hp[1] -= damage;
        }

    }
}