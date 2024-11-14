const params = new URLSearchParams(window.location.search);
const paramJson = JSON.stringify({
    team: params.get('team'),
    id: params.get('id'),
    nickname: params.get('nickname'),
});

const BODY = document.body;
//@ts-ignore
const TEAM: 'red' | 'blue' = params.get('team');
const ENEMY_TEAM: 'red' | 'blue' = TEAM === 'blue' ? 'red' : 'blue';
const PLAYER_ID: number = parseInt(params.get('id'));
const NICKNAME: string = params.get('nickname');
const socket = new WebSocket("ws://kimchi-game.kro.kr:8002");



let players: PlayersVariable = {
    blue: [],
    red: []
};
let playerSizeHalf: number = 15;
let playerOneself: PlayerClass = undefined;

let keyDown: KeyDown = {
    w: false, a: false, s: false, d: false, space: false,
    p: false,
    q: false,
    e: false,
    shift: false,
    tab: false,
    f: false,
    arrowup: false,
    arrowleft: false,
    arrowdown: false,
    arrowright: false,
    mouse: [false, false, false]
}

// 공격속도 대기
let atkWait: number = 0;
let cameraPosition: {x: number, y: number} = {x: 0, y: 0};
let mousePosition: {x: number, y: number} = {x: 0, y: 0};
let projectileObjects: Projectile[] = [];
let gameObjects: GameObject[] = [
    // 맵 가장자리 막는것들
    new GameObjectBuilder().setPositionSize({x: -1800, y: 0, height: 5000, width: 1000}).setStyle({color: 'gray'}).build(),
    new GameObjectBuilder().setPositionSize({x: 1800, y: 0, height: 5000, width: 1000}).setStyle({color: 'gray'}).build(),
    new GameObjectBuilder().setPositionSize({x: 0, y: -1500, height: 1000, width: 5000}).setStyle({color: 'gray'}).build(),
    new GameObjectBuilder().setPositionSize({x: 0, y: 1500, height: 1000, width: 5000}).setStyle({color: 'gray'}).build(),
    // 맵 중간중간 구조물들
    new GameObjectBuilder().setPositionSize({x: 0, y: 800, height: 500, width: 40}).setStyle({color: 'gray'}).build(),
    new GameObjectBuilder().setPositionSize({x: 0, y: -800, height: 500, width: 40}).setStyle({color: 'gray'}).build(),
    
    new GameObjectBuilder().setPositionSize({x: -1200, y: 0, height: 40, width: 300}).setStyle({color: 'gray'}).build(),
    new GameObjectBuilder().setPositionSize({x: -660, y: 0, height: 40, width: 300}).setStyle({color: 'gray'}).build(),
    new GameObjectBuilder().setPositionSize({x: 1200, y: 0, height: 40, width: 300}).setStyle({color: 'gray'}).build(),
    new GameObjectBuilder().setPositionSize({x: 660, y: 0, height: 40, width: 300}).setStyle({color: 'gray'}).build(),

    new GameObjectBuilder().setPositionSize({x: -500, y: 0, height: 500, width: 70}).setStyle({color: 'rgb(53, 53, 53)'}).build(),
    new GameObjectBuilder().setPositionSize({x: 500, y: 0, height: 500, width: 70}).setStyle({color: 'rgb(53, 53, 53)'}).build(),
];

let hpProgressBars: NodeListOf<HTMLDivElement> = document.querySelectorAll('.hp-progress');
let statusTopDiv: HTMLDivElement = document.querySelector('.status-top');

let gameStatus: GameStatus = {
    gameScore: {
        blue: 0,
        red: 0
    },
    roundScore: {
        blue: 0,
        red: 0
    },
    phase: {
        step: 'wait',
        leftTime: 0
    }
};

let shop = {
    isActive: false,
    press: false,
}