var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var teamColor = {
    blue: 'rgb(0, 0, 77)',
    red: 'rgb(77, 0, 0)'
};
setInterval(function () {
    playerMove();
    if (keyDown.mouse[0] && atkWait === 0 && playerOneself.status.isArrive) {
        atkWait += 1000 / playerOneself.ability.atkSpd;
        var angle = Math.atan2(playerOneself.position.y - mousePosition.y, playerOneself.position.x - mousePosition.x);
        projectileObjects.push(new ProjectileBuilder()
            .setInfo({
            angle: angle,
            reach: 700,
            speed: 30,
            tag: 'aa',
            team: TEAM,
            id: PLAYER_ID
        })
            .setHitInfo({
            critical: [0, 0],
            damage: playerOneself.ability.damage
        })
            .setStyle({
            color: teamColor[TEAM]
        })
            .setPositionSize(playerOneself.position.x, playerOneself.position.y, 20, 20)
            .build(TEAM));
    }
    if (keyDown.p && !shop.press) {
        shop.press = true;
        shop.isActive = !shop.isActive;
        if (!shop.isActive)
            document.querySelector('.win-store').classList.add('off');
        else {
            document.querySelector('.win-store').classList.remove('off');
            storeUpdate();
        }
        ;
    }
    gameProgress();
    synchronization();
}, 16);
setInterval(function () {
    updateSprites();
}, 8);
setInterval(function () {
    if (atkWait >= 1)
        atkWait -= 10;
    if (atkWait < 0)
        atkWait = 0;
    playerOneself.status.barrier.forEach(function (e, i) {
        if (e[0] <= 0)
            playerOneself.status.barrier.splice(i, 1);
        if (e[1] > 0)
            playerOneself.status.barrier[i][1] -= 1;
        else if (e[1] <= 0)
            playerOneself.status.barrier.splice(i, 1);
    });
    playerOneself.status.barrier.sort(function (x, y) { return x[1] - y[1]; });
    if (playerOneself.status.hp[0] < playerOneself.status.hp[1]) {
        playerOneself.status.hp[1] = playerOneself.status.hp[0];
    }
    // playerOneself.status.barrier.forEach((e, i) => {
    //     if (e[1] > 0) e[1] -= 10;
    //     // @ts-ignore
    //     if (e[1] <= 0 || e[0] <= 0) {
    //     }
    // });
}, 10);
setInterval(function () {
    if (hasItems[2] && playerOneself.status.hp[1] / playerOneself.status.hp[0] <= 0.5) {
        playerOneself.status.hp[1] += items[2].extra[0];
    }
}, 1000);
setInterval(function () {
    // 
    if (gameStatus.phase.step === 'game' && hasItems[3] && playerOneself.status.isArrive) {
        projectileObjects.push(new ProjectileBuilder()
            .setInfo({
            angle: 0,
            reach: 700,
            speed: 20,
            tag: 'item3',
            team: TEAM,
            id: PLAYER_ID,
            isTarget: true
        })
            .setHitInfo({
            critical: [0, 0],
            damage: Math.floor(playerOneself.ability.damage * items[3].extra[0])
            // damage: 10
        })
            .setStyle({
            color: teamColor[TEAM]
        })
            .setPositionSize(playerOneself.position.x, playerOneself.position.y, 15, 15)
            .build(TEAM));
    }
}, 2000);
/**
 * 모든 div들의 위치를 재조정한다.
 */
function updateSprites() {
    cameraPosition.x = playerOneself.position.x - window.innerWidth * 0.5;
    cameraPosition.y = playerOneself.position.y + window.innerHeight * 0.5;
    BODY.style.backgroundPositionX = "".concat(-cameraPosition.x, "px");
    BODY.style.backgroundPositionY = "".concat(cameraPosition.y, "px");
    // playerOneself.selector.style.left = `${ playerOneself.position.x - cameraPosition.x - playerSizeHalf }px`;
    // playerOneself.selector.style.top = `${ -playerOneself.position.y + cameraPosition.y - playerSizeHalf }px`;
    runEachTeam(function (e) {
        e.selector = document.querySelector(".player.".concat(e.team, ".player").concat(e.id));
        e.selector.style.left = "".concat(e.position.x - cameraPosition.x - playerSizeHalf, "px");
        e.selector.style.top = "".concat(-e.position.y + cameraPosition.y - playerSizeHalf, "px");
        e.update();
    });
    var totalBarrier = 0;
    playerOneself.status.barrier.forEach(function (e) { return totalBarrier += e[0]; });
    document.querySelector('#hp-status').innerHTML = "".concat(playerOneself.status.hp[1], " <span id=\"barrier-status\">(").concat(totalBarrier, ")</span>");
    hpProgressBars.forEach(function (e, i) {
        if (e.className.indexOf("player")) {
            // let totalBarrier: number = 0;
            // playerOneself.barrier.forEach(e => totalBarrier += e[0]);
            var id_1 = parseInt(e.className.split('player')[1]);
            var player = findPlayerById(id_1);
            // // console.log(e.className.split('player'));
            // e.style.width = `${ findPlayerById(id).status.hp[1] / findPlayerById(id).status.hp[0] * 100}%`;
            var totalBarrier_1 = 0;
            player.status.barrier.forEach(function (e) { return totalBarrier_1 += e[0]; });
            // console.log(totalBarrier, id, typeof(id));
            e.style.width = "".concat(player.status.hp[1] / player.status.hp[0] * 100, "%");
            if (player.status.hp[1] + totalBarrier_1 > player.status.hp[0]) {
                e.style.width = "".concat(Math.abs(player.status.hp[1]) / (player.status.hp[0] + totalBarrier_1) * 100, "%");
            }
            if (e.classList.contains('barrier')) {
                if (player.status.hp[1] + totalBarrier_1 > player.status.hp[0]) {
                    e.style.width = "".concat(100, "%");
                }
                else {
                    e.style.width = "".concat((player.status.hp[1] + totalBarrier_1) / player.status.hp[0] * 100, "%");
                }
            }
        }
    });
    statusTopDiv.querySelectorAll('.status-top-info').forEach(function (e) {
        var scorePrinter = '';
        if (e.classList.contains('blue')) {
            for (var i = 0; i < gameStatus.roundScore.blue; i++)
                scorePrinter += '●';
            for (var i = scorePrinter.length; i < 5; i++)
                scorePrinter += '○';
            if (gameStatus.roundScore.blue === 4)
                e.style.color = 'rgb(0, 92, 92)';
            else
                e.style.color = 'black';
            e.innerHTML = "".concat(scorePrinter, " (").concat(gameStatus.roundScore.blue, "/5)");
        }
        else if (e.classList.contains('red')) {
            for (var i = 0; i < gameStatus.roundScore.red; i++)
                scorePrinter += '●';
            for (var i = scorePrinter.length; i < 5; i++)
                scorePrinter += '○';
            if (gameStatus.roundScore.red === 4)
                e.style.color = 'rgb(105, 0, 0)';
            else
                e.style.color = 'black';
            e.innerHTML = "".concat(scorePrinter, " (").concat(gameStatus.roundScore.red, "/5)");
        }
        else if (e.classList.contains('status-top-score')) {
            e.innerHTML = "".concat(gameStatus.gameScore.blue, " - ").concat(gameStatus.gameScore.red);
        }
    });
    var teamTab = document.querySelector('#team-tab');
    teamTab.innerHTML = '';
    if (keyDown.tab) {
        teamTab.parentElement.style.display = 'block';
    }
    else {
        teamTab.parentElement.style.display = 'none';
    }
    runEachTeam(function (e) {
        var playersInfo = document.createElement('div');
        playersInfo.innerHTML = "\n            <span>".concat(e.nickname, " (").concat(e.team === 'blue' ? '블루팀' : '레드팀', ")</span>\n            <span>").concat(e.ability.damage, "</span>\n            <span>").concat(e.status.hp[0], " (").concat(e.status.hp[1], ")</span>\n            <span>").concat(e.ability.armor, "</span>\n            <span>").concat(e.ability.atkSpd, "</span>\n            <span>").concat(e.ability.moveSpd, "</span>");
        teamTab.appendChild(playersInfo);
    });
    gameObjects.forEach(function (e) { return e.update(); });
}
/**
 * 플레이어간 동기화하는 함수
 */
function synchronization() {
    var newProjectiles = [];
    projectileObjects.forEach(function (e) {
        if (!e.projectileINIT.isSent && e.projectileINIT.team === TEAM) {
            newProjectiles.push(e);
        }
    });
    projectileObjects = __spreadArray([], newProjectiles, true);
    var sendData = {
        projectiles: projectileObjects
    };
    if (PLAYER_ID === 0)
        sendData['gameStatus'] = gameStatus;
    socket.send(JSON.stringify({ header: playerOneself, body: sendData }));
    projectileObjects.forEach(function (e) {
        e.projectileINIT.isSent = true;
    });
}
var isDisplayUsing = false;
function gameProgress() {
    if (isDisplayUsing)
        return;
    if (gameStatus.roundScore.blue >= 5) {
        display('win', 'blue');
    }
    else if (gameStatus.roundScore.red >= 5) {
        display('win', 'red');
    }
}
function display(alert, team) {
    isDisplayUsing = true;
    var resultText = document.querySelector('#result-text');
    resultText.style.transition = 'transform 600ms ease-out, opacity 1000ms';
    resultText.style.marginTop = '-300px';
    resultText.style.transition = 'translate(0px, -1500px)';
    if (alert == 'win') {
        resultText.innerHTML = "".concat(team === 'red' ? '레드' : '블루', "\uD300 \uC2B9\uB9AC");
        resultText.style.backgroundColor = "".concat(team === 'red' ? 'rgba(184, 0, 0, 0.53)' : 'rgba(0, 156, 184, 0.53)');
        gameStatus.phase.step = 'wait';
    }
    else if (alert === 'ready') {
        resultText.innerHTML = "\uC900\uBE44 \uC2DC\uAC04 <p style=\"font-size: 20px; margin-top: -5px;\">[P]\uB85C \uC0C1\uC810 \uC5F4\uAE30 \uAC00\uB2A5, 15\uCD08</p>";
        resultText.style.backgroundColor = "#0000003d";
    }
    else if (alert === 'time') {
        var index_1 = 2;
        resultText.innerHTML = "3";
        var countdown_1 = setInterval(function () {
            resultText.innerHTML = "".concat(index_1);
            resultText.style.backgroundColor = "#0000003d";
            index_1 -= 1;
            if (index_1 === -1)
                clearInterval(countdown_1);
        }, 1000);
    }
    else if (alert === 'start') {
        gameStatus.phase.step = 'game';
        resultText.innerHTML = "\uAC8C\uC784 \uC2DC\uC791";
        resultText.style.backgroundColor = "#0000003d";
        isDisplayUsing = false;
        roundStart();
    }
    setTimeout(function () {
        resultText.style.transform = 'translate(0px, 300px)';
    }, 10);
    setTimeout(function () {
        if (alert !== 'time') {
            resultText.style.transition = 'transform 600ms ease-in';
            resultText.style.transform = 'translate(0px, 0px)';
        }
        if (alert === 'win') {
            setTimeout(function () {
                initPosition();
                gameStatus.roundScore.blue = 0;
                gameStatus.roundScore.red = 0;
                gameStatus.gameScore[team] += 1;
                playerOneself.point += gameStatus.gameScore.blue + gameStatus.gameScore.red + 3;
                if (hasItems[1])
                    playerOneself.point += items[1].extra[0];
                if (team === TEAM)
                    playerOneself.point += 3;
                display("ready");
            }, 1500);
        }
        else if (alert === 'time') {
            initPosition();
            display("start");
            runEachTeam(function (e) {
                e.status.hp[1] = e.status.hp[0];
            });
        }
    }, 3000);
    if (alert === 'ready') {
        setTimeout(function () {
            display('time');
        }, 13000);
    }
}
