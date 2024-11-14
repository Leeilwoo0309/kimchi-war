// 입력에 따라 keyDown에 저장
BODY.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
        e.preventDefault();
    }
    if (keyDown[e.key.toLowerCase()] === false) {
        keyDown[e.key.toLowerCase()] = true;
    }
    else if (e.key == ' ')
        keyDown.space = true;
});
// 다시 땠을 때 keyDown에 저장된 정보 삭제
BODY.addEventListener('keyup', function (e) {
    if (keyDown[e.key.toLowerCase()] === true)
        keyDown[e.key.toLowerCase()] = false;
    else if (e.key == ' ')
        keyDown.space = false;
    if (e.key.toLowerCase() === 'p')
        shop.press = false;
});
// 마우스 위치 구함
BODY.addEventListener('mousemove', function (e) {
    mousePosition.x = e.clientX + cameraPosition.x;
    mousePosition.y = -e.clientY + cameraPosition.y;
});
BODY.addEventListener('mousedown', function (e) {
    keyDown.mouse[e.button] = true;
});
BODY.addEventListener('mouseup', function (e) {
    keyDown.mouse[e.button] = false;
});
var playersJson = "\n{\"team\": \"".concat(TEAM, "\", \"id\": ").concat(PLAYER_ID, ", \"nickname\": \"").concat(NICKNAME, "\", \"gold\": 5, \"position\": {\"x\": 0, \"y\": 0},\n\"ability\": {\"damage\": 15, \"armor\": 3, \"moveSpd\": 2.5, \"atkSpd\": 2}, \"status\": {\"hp\": [80, 80], \"barrier\": [], \"isArrive\": true, \"isNoDmg\": false}}\n");
players[TEAM].push(new PlayerClass(playersJson));
players.blue.forEach(function (e) { return e.build(); });
players.red.forEach(function (e) { return e.build(); });
// findPlayerById(PLAYER_ID).selector = document.querySelector(`.player.${ TEAM }.player${ PLAYER_ID }`);
// findPlayerById(PLAYER_ID).selector.style.backgroundColor = TEAM;
playerOneself = findPlayerById(PLAYER_ID);
document.title = "Kimchi War (".concat(TEAM, ", ").concat(PLAYER_ID, ")");
setTimeout(function () {
    gameStart();
}, 100);
function gameStart() {
    initPosition();
    display("ready");
}
function gameReady() {
}
function roundStart() {
    if (hasItems[0]) {
        playerOneself.status.barrier.push([items[0].extra[0], 999999]);
    }
}
