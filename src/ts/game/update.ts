let teamColor: {blue: string, red: string} = {
    blue: 'rgb(0, 0, 77)',
    red: 'rgb(77, 0, 0)'
};

setInterval(() => {
    playerMove();

    if (keyDown.mouse[0] && atkWait === 0 && playerOneself.status.isArrive) {
        atkWait += 1000 / playerOneself.ability.atkSpd;
        const angle = Math.atan2(playerOneself.position.y - mousePosition.y, playerOneself.position.x - mousePosition.x);


        projectileObjects.push(
            new ProjectileBuilder()
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
                .build(TEAM)
        );
    }

    if (keyDown.p && !shop.press) {
        shop.press = true;
        shop.isActive = !shop.isActive;

        if (!shop.isActive) document.querySelector('.win-store').classList.add('off');
        else {
            document.querySelector('.win-store').classList.remove('off');

            storeUpdate();
        };
    }

    gameProgress(); 
    synchronization();
}, 16);

setInterval(() => {
    updateSprites();
}, 8);

setInterval(() => {
    if (atkWait >= 1) atkWait -= 10;
    if (atkWait < 0) atkWait = 0;

    playerOneself.status.barrier.forEach((e, i) => {
        if (e[0] <= 0) playerOneself.status.barrier.splice(i, 1);
        if (e[1] > 0) playerOneself.status.barrier[i][1] -= 1;
        else if (e[1] <= 0) playerOneself.status.barrier.splice(i, 1)
    });

    playerOneself.status.barrier.sort((x, y) => x[1] - y[1]);

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

setInterval(() => {
    if (hasItems[2] && playerOneself.status.hp[1] / playerOneself.status.hp[0] <= 0.5) {
        playerOneself.status.hp[1] += items[2].extra[0];
    }
}, 1000);

setInterval(() => {
    // 
    if (gameStatus.phase.step === 'game' && hasItems[3] && playerOneself.status.isArrive) {
        projectileObjects.push(
            new ProjectileBuilder()
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
                .build(TEAM)
        );
    }
}, 2000);

/**
 * 모든 div들의 위치를 재조정한다.
 */
function updateSprites() {
    cameraPosition.x = playerOneself.position.x - window.innerWidth * 0.5;
    cameraPosition.y = playerOneself.position.y + window.innerHeight * 0.5;

    BODY.style.backgroundPositionX = `${ -cameraPosition.x }px`;
    BODY.style.backgroundPositionY = `${ cameraPosition.y }px`;
    
    // playerOneself.selector.style.left = `${ playerOneself.position.x - cameraPosition.x - playerSizeHalf }px`;
    // playerOneself.selector.style.top = `${ -playerOneself.position.y + cameraPosition.y - playerSizeHalf }px`;
    
    runEachTeam((e) => {
        e.selector = document.querySelector(`.player.${e.team}.player${e.id}`);
        e.selector.style.left = `${ e.position.x - cameraPosition.x - playerSizeHalf }px`;
        e.selector.style.top = `${ -e.position.y + cameraPosition.y - playerSizeHalf }px`;

        e.update();
    });

    let totalBarrier: number = 0;
    playerOneself.status.barrier.forEach(e => totalBarrier += e[0])

    document.querySelector('#hp-status').innerHTML = `${ playerOneself.status.hp[1] } <span id="barrier-status">(${ totalBarrier })</span>`;
    hpProgressBars.forEach((e, i) => {
        if (e.className.indexOf(`player`)) {
            // let totalBarrier: number = 0;
            // playerOneself.barrier.forEach(e => totalBarrier += e[0]);
            const id: number = parseInt(e.className.split('player')[1]);
            const player: PlayerClass = findPlayerById(id);

            // // console.log(e.className.split('player'));
            // e.style.width = `${ findPlayerById(id).status.hp[1] / findPlayerById(id).status.hp[0] * 100}%`;

            let totalBarrier: number = 0;

            player.status.barrier.forEach(e => totalBarrier += e[0]);

            // console.log(totalBarrier, id, typeof(id));
            e.style.width = `${ player.status.hp[1] / player.status.hp[0] * 100}%`;

            if (player.status.hp[1] + totalBarrier > player.status.hp[0]) {
                e.style.width = `${ Math.abs(player.status.hp[1]) / (player.status.hp[0] + totalBarrier) * 100}%`;
            }

            if (e.classList.contains('barrier')) {
                if (player.status.hp[1] + totalBarrier > player.status.hp[0]) {
                    e.style.width = `${ 100 }%`;
                } else {
                    e.style.width = `${ (player.status.hp[1] + totalBarrier) / player.status.hp[0] * 100}%`;
                }
            }
        }
    });

    statusTopDiv.querySelectorAll('.status-top-info').forEach((e: HTMLDivElement) => {
        let scorePrinter: string = '';
        if (e.classList.contains('blue')) {
            for (let i = 0; i < gameStatus.roundScore.blue; i++) scorePrinter += '●'
            for (let i = scorePrinter.length; i < 5; i++) scorePrinter += '○'

            if (gameStatus.roundScore.blue === 4) e.style.color = 'rgb(0, 92, 92)';
            else e.style.color = 'black';
            e.innerHTML = `${ scorePrinter } (${ gameStatus.roundScore.blue }/5)`;
        } else if (e.classList.contains('red')) {
            for (let i = 0; i < gameStatus.roundScore.red; i++) scorePrinter += '●'
            for (let i = scorePrinter.length; i < 5; i++) scorePrinter += '○'
            
            if (gameStatus.roundScore.red === 4) e.style.color = 'rgb(105, 0, 0)';
            else e.style.color = 'black';
            e.innerHTML = `${ scorePrinter } (${ gameStatus.roundScore.red }/5)`;
        } else if (e.classList.contains('status-top-score')) {
            e.innerHTML = `${ gameStatus.gameScore.blue } - ${ gameStatus.gameScore.red }`
        }
    });

    const teamTab: HTMLDivElement = document.querySelector('#team-tab');
    teamTab.innerHTML = '';

    if (keyDown.tab) {
        teamTab.parentElement.style.display = 'block';
    } else {
        teamTab.parentElement.style.display = 'none';
    }

    runEachTeam(e => {
        const playersInfo: HTMLDivElement = document.createElement('div');

        playersInfo.innerHTML = `
            <span>${e.nickname} (${e.team === 'blue' ? '블루팀' : '레드팀'})</span>
            <span>${e.ability.damage}</span>
            <span>${e.status.hp[0]} (${e.status.hp[1]})</span>
            <span>${e.ability.armor}</span>
            <span>${e.ability.atkSpd}</span>
            <span>${e.ability.moveSpd}</span>`;

        teamTab.appendChild(playersInfo);
    });


    gameObjects.forEach(e => e.update());
}

/**
 * 플레이어간 동기화하는 함수
 */
function synchronization() {
    let newProjectiles: Projectile[] = [];

    projectileObjects.forEach(e => {
        if (!e.projectileINIT.isSent && e.projectileINIT.team === TEAM) {
            newProjectiles.push(e);
        }
    });

    projectileObjects = [...newProjectiles];

    let sendData = {
        projectiles: projectileObjects
    };
    
    if (PLAYER_ID === 0) sendData['gameStatus'] = gameStatus;

    socket.send(JSON.stringify({header: playerOneself, body: sendData}));

    projectileObjects.forEach(e => {
        e.projectileINIT.isSent = true;
    });
}

let isDisplayUsing: boolean = false;

function gameProgress() {
    if (isDisplayUsing) return;

    if (gameStatus.roundScore.blue >= 5) {
        display('win', 'blue');
    } else if (gameStatus.roundScore.red >= 5) {
        display('win', 'red');
    }

}

function display(alert: 'win' | 'ready' | 'time' | 'start', team?: 'red' | 'blue') {
    isDisplayUsing = true;
    const resultText: HTMLDivElement = document.querySelector('#result-text');

    resultText.style.transition = 'transform 600ms ease-out, opacity 1000ms';
    resultText.style.marginTop = '-300px';
    resultText.style.transition = 'translate(0px, -1500px)';

    if (alert == 'win') {
        resultText.innerHTML = `${ team === 'red' ? '레드' : '블루' }팀 승리`;
        resultText.style.backgroundColor = `${ team === 'red' ? 'rgba(184, 0, 0, 0.53)' : 'rgba(0, 156, 184, 0.53)'}`;

        gameStatus.phase.step = 'wait';
    } else if (alert === 'ready') {
        resultText.innerHTML = `준비 시간 <p style="font-size: 20px; margin-top: -5px;">[P]로 상점 열기 가능, 15초</p>`;
        resultText.style.backgroundColor = `#0000003d`;
    } else if (alert === 'time') {
        let index: number = 2;
        resultText.innerHTML = `3`;
        
        const countdown = setInterval(() => {
            resultText.innerHTML = `${ index }`;
            resultText.style.backgroundColor = `#0000003d`;
            
            index -= 1;
            
            if (index === -1) clearInterval(countdown);
        }, 1000);
    } else if (alert === 'start') {
        gameStatus.phase.step = 'game';
        resultText.innerHTML = `게임 시작`;
        resultText.style.backgroundColor = `#0000003d`;

        isDisplayUsing = false;

        roundStart();
    }
    
    
    setTimeout(() => {
        resultText.style.transform = 'translate(0px, 300px)';
    }, 10);
    
    setTimeout(() => {
        if (alert !== 'time') {
            resultText.style.transition = 'transform 600ms ease-in';
            resultText.style.transform = 'translate(0px, 0px)';
        }

        if (alert === 'win') {
            setTimeout(() => {
                initPosition();
                gameStatus.roundScore.blue = 0;
                gameStatus.roundScore.red = 0;

                gameStatus.gameScore[team] += 1;

                playerOneself.point += gameStatus.gameScore.blue + gameStatus.gameScore.red + 3;

                if (hasItems[1]) playerOneself.point += items[1].extra[0];

                if (team === TEAM) playerOneself.point += 3;

                display("ready");
            }, 1500);
        } else if (alert === 'time') {
            initPosition();
            display("start")

            runEachTeam(e => {
                e.status.hp[1] = e.status.hp[0];
            });
        }
    }, 3000);

    if (alert === 'ready') {
        setTimeout(() => {
            display('time');
        }, 13000);
    }
}