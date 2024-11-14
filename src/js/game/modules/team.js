/**
 * 모든 팀을 상대로 코드를 실행한다.
 * @param callback 모든 팀을 상대로 실행할 함수
 * @returns 없다!
 */
function runEachTeam(callback) {
    if (players.red.length * players.blue.length === 0)
        return;
    players.red.forEach(function (e) { return callback(e); });
    players.blue.forEach(function (e) { return callback(e); });
}
function printKillLog(participants, fromSocket) {
    if (fromSocket === void 0) { fromSocket = false; }
    var killLogDiv = document.querySelector('.kill-log');
    var killAlert = document.createElement('div');
    var partics = [
        findPlayerById(participants.killer),
        findPlayerById(participants.killed)
    ];
    killAlert.className = "kill-".concat(partics[1].team, " kill-alert");
    killAlert.innerHTML = "\n            <span class=\"killer\">".concat(partics[0].nickname, "</span>\n            <span class=\"arrow\">\u2192</span>\n            <span class=\"killed\">").concat(partics[1].nickname, "</span>\n    ");
    killAlert.style.marginRight = '-500px';
    setTimeout(function () {
        killAlert.style.transition = 'transform 300ms, opacity 1000ms';
        killAlert.style.transform = 'translate(-500px, 0px)';
    }, 10);
    killLogDiv.appendChild(killAlert);
    setTimeout(function () {
        killAlert.style.opacity = '0';
    }, 5000);
    setTimeout(function () {
        killLogDiv.removeChild(killAlert);
    }, 6000);
    gameStatus.roundScore[partics[0].team] += 1;
    if (!fromSocket)
        socket.send(JSON.stringify({ header: playerOneself, body: { msg: "killLog", info: participants } }));
}
function initPosition() {
    players.blue[0].position = { x: -900, y: 170 };
    if (players.blue.length >= 2)
        players.blue[1].position = { x: -900, y: -170 };
    players.red[0].position = { x: 900, y: 170 };
    if (players.red.length >= 2)
        players.red[1].position = { x: 900, y: -170 };
}
