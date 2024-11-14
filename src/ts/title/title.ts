const _socket = new WebSocket("ws://kimchi-game.kro.kr:8002");
const _params = new URLSearchParams(window.location.search);
const nicknameInput: HTMLInputElement = document.querySelector('input');
const nicknameBtn: HTMLButtonElement = document.querySelector('#nickname-btn');
const teamBtn: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.team-btn');
const startBtn: HTMLButtonElement = document.querySelector('#start-btn');


const id: number = parseInt(_params.get('id'));

let team: 'red' | 'blue' = undefined;
let readyCount: number = 0;
let nickname: string = '';
let clientCount = 0;
let nicknames: string[] = [undefined, undefined, undefined, undefined]

nicknameBtn.addEventListener('click', () => {
    if (nicknameInput.value.length >= 10) {
        alert("닉네임이 너무 깁니다. (최대 9자)");
        return;
    }

    nickname = nicknameInput.value;
    nicknameBtn.innerHTML = `준비 (닉네임: ${nickname})`
});

startBtn.addEventListener('click', () => {
    _socket.send(JSON.stringify({
        msg: 'start'
    }));

    window.location.href = `../public/game.html?id=${id}&team=${id == 1 || id == 3 ? 'red' : 'blue'}&nickname=${ nickname }`;
})

// teamBtn.forEach((e, i) => {
//     e.addEventListener('click', () => {
//         let lastTeam = team;
//         if (i === 0) {
//             team = 'blue';
//         } else {
//             team = 'red'
//         };
//     });
// });

setInterval(() => {
    if (id !== 0) {

        startBtn.style.display = 'none';
    }

    startBtn.innerHTML = `시작 (${ clientCount })`

    _socket.send(JSON.stringify({
        nickname: nickname, id: id
    }));

    nicknames[id] = nickname;

    document.querySelector('#nicknames').innerHTML = `${ nicknames }`;
    document.querySelector('#team').innerHTML = `${ id % 2 == 0 ? '<span style="color: blue">블루팀</span>' : '<span style="color: red">레드팀</span>' }`;
}, 16);

_socket.onopen = () => {
    _socket.send(JSON.stringify(
        {body: {msg: "connected"}}
    ));
    _socket.send(JSON.stringify(
        {body: {msg: "ready"}}
    ));

    _socket.onmessage = (event) => {
        const blob = event.data;
        const reader = new FileReader();

        reader.onload = function() {
            //@ts-ignore
            const sentJson: {body: any, header: PlayerClass, msg: string, nickname: string, id: number} = JSON.parse(reader.result);
            console.log(sentJson);

            if (sentJson?.msg === 'start') {
                window.location.href = `../public/game.html?id=${id}&team=${id == 1 || id == 3 ? 'red' : 'blue'}&nickname=${ nickname }`;
            }
            if (sentJson.nickname) {
                nicknames[sentJson.id] = sentJson.nickname;
            }
        };

        if (typeof(blob) === 'string') {
            clientCount = JSON.parse(blob).body.users;
        } else {
            reader.readAsText(blob);
        }
    };
}