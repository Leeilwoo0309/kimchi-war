type PlayersVariable = {
    red?: PlayerClass[],
    blue?: PlayerClass[],
    green?: PlayerClass[],
    black?: PlayerClass[]
}

type Team = 'red' | 'blue' | 'green' | 'black';

type GameStatus = {
    gameScore: {
        blue: number,
        red: number
    },
    roundScore: {
        blue: number,
        red: number
    },
    phase: {
        step: 'game' | 'wait',
        leftTime: number
    }
}

type Player = {
    gold: number,
    position: {x: number, y: number},
    ability: Ability,
    selector: HTMLDivElement,
    status: Status,
    barrier: [number?, number?][]
}

type Status = {
    hp: [number, number],
    barrier: [number?, number?][],
    isArrive: boolean;
    isNoDmg: boolean
}

type Ability = {
    damage: number,
    armor: number,
    atkSpd: number,
    moveSpd: number
}

type ItemAbility = {
    damage?: number,
    armor?: number,
    atkSpd?: number,
    moveSpd?: number,
    hp?: number
}

type KeyDown = {
    w: boolean,
    a: boolean,
    s: boolean,
    d: boolean,
    space: boolean,
    p: boolean,
    q: boolean,
    e: boolean,
    shift: boolean,
    tab: boolean,
    f: boolean,
    arrowup: boolean,
    arrowleft: boolean,
    arrowdown: boolean,
    arrowright: boolean,
    mouse: [boolean, boolean, boolean]
}

type ItemsName = 
    'start-barrier'