var params = new URLSearchParams(window.location.search);
var paramJson = JSON.stringify({
    team: params.get('team'),
    id: params.get('id'),
    nickname: params.get('nickname'),
});
var BODY = document.body;
//@ts-ignore
var TEAM = params.get('team');
var ENEMY_TEAM = TEAM === 'blue' ? 'red' : 'blue';
var PLAYER_ID = parseInt(params.get('id'));
var NICKNAME = params.get('nickname');
var socket = new WebSocket("ws://kimchi-game.kro.kr:8002");
var players = {
    blue: [],
    red: []
};
var playerSizeHalf = 15;
var playerOneself = undefined;
var keyDown = {
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
};
// 공격속도 대기
var atkWait = 0;
var cameraPosition = { x: 0, y: 0 };
var mousePosition = { x: 0, y: 0 };
var projectileObjects = [];
var gameObjects = [
    // 맵 가장자리 막는것들
    new GameObjectBuilder().setPositionSize({ x: -1800, y: 0, height: 5000, width: 1000 }).setStyle({ color: 'gray' }).build(),
    new GameObjectBuilder().setPositionSize({ x: 1800, y: 0, height: 5000, width: 1000 }).setStyle({ color: 'gray' }).build(),
    new GameObjectBuilder().setPositionSize({ x: 0, y: -1500, height: 1000, width: 5000 }).setStyle({ color: 'gray' }).build(),
    new GameObjectBuilder().setPositionSize({ x: 0, y: 1500, height: 1000, width: 5000 }).setStyle({ color: 'gray' }).build(),
    // 맵 중간중간 구조물들
    new GameObjectBuilder().setPositionSize({ x: 0, y: 800, height: 500, width: 40 }).setStyle({ color: 'gray' }).build(),
    new GameObjectBuilder().setPositionSize({ x: 0, y: -800, height: 500, width: 40 }).setStyle({ color: 'gray' }).build(),
    new GameObjectBuilder().setPositionSize({ x: -1200, y: 0, height: 40, width: 300 }).setStyle({ color: 'gray' }).build(),
    new GameObjectBuilder().setPositionSize({ x: -660, y: 0, height: 40, width: 300 }).setStyle({ color: 'gray' }).build(),
    new GameObjectBuilder().setPositionSize({ x: 1200, y: 0, height: 40, width: 300 }).setStyle({ color: 'gray' }).build(),
    new GameObjectBuilder().setPositionSize({ x: 660, y: 0, height: 40, width: 300 }).setStyle({ color: 'gray' }).build(),
    new GameObjectBuilder().setPositionSize({ x: -500, y: 0, height: 500, width: 70 }).setStyle({ color: 'rgb(53, 53, 53)' }).build(),
    new GameObjectBuilder().setPositionSize({ x: 500, y: 0, height: 500, width: 70 }).setStyle({ color: 'rgb(53, 53, 53)' }).build(),
];
var hpProgressBars = document.querySelectorAll('.hp-progress');
var statusTopDiv = document.querySelector('.status-top');
var gameStatus = {
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
var shop = {
    isActive: false,
    press: false,
};
