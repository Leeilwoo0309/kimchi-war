/**
 * 플레이어의 움직임을 조정한다.
 * @var xSpeed x축으로 움직이는 속도
 * @var ySpeed y축으로 움직이는 속도
 */
function playerMove() {
    var xSpeed = 0, ySpeed = 0;
    if (keyDown.w)
        ySpeed += playerOneself.ability.moveSpd;
    if (keyDown.s)
        ySpeed -= playerOneself.ability.moveSpd;
    if (keyDown.a)
        xSpeed -= playerOneself.ability.moveSpd;
    if (keyDown.d)
        xSpeed += playerOneself.ability.moveSpd;
    if (checkCollide(playerOneself.position, { x: xSpeed, y: ySpeed }))
        return;
    // 속도의 벡터 합이 영백터가 아닐 때, 더 빨라지는 현상 막는거
    if (xSpeed * ySpeed === 0) {
        xSpeed *= Math.SQRT2;
        ySpeed *= Math.SQRT2;
    }
    playerOneself.position.x += xSpeed;
    playerOneself.position.y += ySpeed;
    mousePosition.x += xSpeed;
    mousePosition.y += ySpeed;
}
/**
 * 플레이어와 벽과 충돌 감지
 * @param position 현재 플레이어의 위치
 * @param speed 플레이어가 이동하고자 하는 방향
 * @returns 충돌 여부에 따라 true 또는 false 반환
 */
function checkCollide(position, speed) {
    var collideChecker = document.querySelector('.checker.player');
    var ret = false;
    collideChecker.style.position = 'absolute';
    collideChecker.style.backgroundColor = 'red';
    collideChecker.style.left = "".concat(position.x + speed.x * 1.5 - cameraPosition.x - playerSizeHalf, "px");
    collideChecker.style.top = "".concat(-position.y - speed.y * 1.5 + cameraPosition.y - playerSizeHalf, "px");
    gameObjects.forEach(function (e, i) {
        if (e.isCollide(collideChecker)) {
            ret = true;
        }
    });
    return ret;
}
