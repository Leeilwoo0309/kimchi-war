/**
 * 모든 팀을 상대로 코드를 실행한다.
 * @param callback 모든 팀을 상대로 실행할 함수
 * @returns 없다!
 */
function runEachTeam(callback: (e: PlayerClass) => void) {
    if (players.red.length * players.blue.length === 0) return;

    players.red.forEach(e => callback(e));
    players.blue.forEach(e => callback(e));
}

function printKillLog(participants: {killer: number, killed: number}, fromSocket: boolean = false) {
    let killLogDiv: HTMLDivElement = document.querySelector('.kill-log');
    let killAlert: HTMLDivElement = document.createElement('div');
    const partics: [PlayerClass, PlayerClass] = [
        findPlayerById(participants.killer),
        findPlayerById(participants.killed)
    ]

    killAlert.className = `kill-${ partics[1].team } kill-alert`;
    killAlert.innerHTML = `
            <span class="killer">${ partics[0].nickname }</span>
            <span class="arrow">→</span>
            <span class="killed">${ partics[1].nickname }</span>
    `;

    killAlert.style.marginRight = '-500px';

    setTimeout(() => {
        killAlert.style.transition = 'transform 300ms, opacity 1000ms';
        killAlert.style.transform = 'translate(-500px, 0px)';
    }, 10);

    killLogDiv.appendChild(killAlert);

    setTimeout(() => {
        killAlert.style.opacity = '0';
    }, 5000);


    setTimeout(() => {
        killLogDiv.removeChild(killAlert);
    }, 6000);

    gameStatus.roundScore[partics[0].team] += 1;

    if (!fromSocket) socket.send(JSON.stringify({ header: playerOneself, body: { msg: "killLog", info: participants }}))
}

function initPosition() {
    players.blue[0].position = {x: -900, y: 170};
    if (players.blue.length >= 2) players.blue[1].position = {x: -900, y: -170};
    players.red[0].position = {x: 900, y: 170};
    if (players.red.length >= 2) players.red[1].position = {x: 900, y: -170};
}