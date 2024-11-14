var _socket = new WebSocket("ws://kimchi-game.kro.kr:8002");
var _params = new URLSearchParams(window.location.search);
var nicknameInput = document.querySelector('input');
var nicknameBtn = document.querySelector('#nickname-btn');
var teamBtn = document.querySelectorAll('.team-btn');
var startBtn = document.querySelector('#start-btn');
var id = parseInt(_params.get('id'));
var team = undefined;
var readyCount = 0;
var nickname = '';
var clientCount = 0;
var nicknames = [undefined, undefined, undefined, undefined];
nicknameBtn.addEventListener('click', function () {
    if (nicknameInput.value.length >= 10) {
        alert("닉네임이 너무 깁니다. (최대 9자)");
        return;
    }
    nickname = nicknameInput.value;
    nicknameBtn.innerHTML = "\uC900\uBE44 (\uB2C9\uB124\uC784: ".concat(nickname, ")");
});
startBtn.addEventListener('click', function () {
    _socket.send(JSON.stringify({
        msg: 'start'
    }));
    window.location.href = "../public/game.html?id=".concat(id, "&team=").concat(id == 1 || id == 3 ? 'red' : 'blue', "&nickname=").concat(nickname);
});
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
setInterval(function () {
    if (id !== 0) {
        startBtn.style.display = 'none';
    }
    startBtn.innerHTML = "\uC2DC\uC791 (".concat(clientCount, ")");
    _socket.send(JSON.stringify({
        nickname: nickname, id: id
    }));
    nicknames[id] = nickname;
    document.querySelector('#nicknames').innerHTML = "".concat(nicknames);
    document.querySelector('#team').innerHTML = "".concat(id % 2 == 0 ? '<span style="color: blue">블루팀</span>' : '<span style="color: red">레드팀</span>');
}, 16);
_socket.onopen = function () {
    _socket.send(JSON.stringify({ body: { msg: "connected" } }));
    _socket.send(JSON.stringify({ body: { msg: "ready" } }));
    _socket.onmessage = function (event) {
        var blob = event.data;
        var reader = new FileReader();
        reader.onload = function () {
            //@ts-ignore
            var sentJson = JSON.parse(reader.result);
            console.log(sentJson);
            if ((sentJson === null || sentJson === void 0 ? void 0 : sentJson.msg) === 'start') {
                window.location.href = "../public/game.html?id=".concat(id, "&team=").concat(id == 1 || id == 3 ? 'red' : 'blue', "&nickname=").concat(nickname);
            }
            if (sentJson.nickname) {
                nicknames[sentJson.id] = sentJson.nickname;
            }
        };
        if (typeof (blob) === 'string') {
            clientCount = JSON.parse(blob).body.users;
        }
        else {
            reader.readAsText(blob);
        }
    };
};
