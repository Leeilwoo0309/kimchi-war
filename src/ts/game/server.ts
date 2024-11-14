socket.onopen = () => {
    socket.send(JSON.stringify(
        {body: {msg: "connected"}}
    ));
    socket.send(JSON.stringify(
        {body: {msg: "ready"}}
    ));

    socket.onmessage = (event) => {
        const blob = event.data;
        const reader = new FileReader();

        reader.onload = function() {
            //@ts-ignore
            const sentJson: {body: any, header: PlayerClass} = JSON.parse(reader.result);

            if (sentJson.body) {
                if (sentJson.body.projectiles) {
                    let recivedProjectile: Projectile[] = sentJson.body.projectiles;

                    if (findPlayerById(sentJson.header.id) === undefined) {
                        console.log(JSON.stringify(sentJson.header));
                        players[sentJson.header.team].push(new PlayerClass(JSON.stringify(sentJson.header)));

                        findPlayerById(sentJson.header.id).build();
                        // findPlayerById(sentJson.header.id).selector = document.querySelector(`.player${sentJson.header.id}.${sentJson.header.team}.player`);
                        // findPlayerById(sentJson.header.id).selector.style.backgroundColor = `${ sentJson.header.team }`;

                        hpProgressBars = document.querySelectorAll('.hp-progress');

                        players[TEAM].sort((x, y) => x.id - y.id);
                    } else {
                        findPlayerById(sentJson.header.id).modify(JSON.stringify(sentJson.header));
                        findPlayerById(sentJson.header.id).abilityItem = sentJson.header.abilityItem;
                    }

                    if (sentJson.header.id === 0) gameStatus = sentJson.body.gameStatus;


                    recivedProjectile?.forEach((e) => {
                        if (e.projectileINIT.isArrive && !e.projectileINIT.isSent && e !== undefined) {
                            new ProjectileBuilder()
                                .setInfo({
                                    angle: e.projectileINIT.angle,
                                    reach: e.projectileINIT.reach,
                                    speed: e.projectileINIT.speed,
                                    tag: e.projectileINIT.tag,
                                    team: e.projectileINIT.team,
                                    id: e.projectileINIT.id,
                                    isArrive: e.projectileINIT.isArrive,
                                    isCanPass: e.projectileINIT.isCanPass,
                                    isCollide: e.projectileINIT.isCollide,
                                    isIgnoreObj: e.projectileINIT.isIgnoreObj,
                                    isSent: e.projectileINIT.isSent,
                                    isTarget: e.projectileINIT.isTarget
                                })
                                .setHitInfo({
                                    critical: e.projectileHit.critical,
                                    damage: e.projectileHit.damage
                                })
                                .setPositionSize(
                                    e.positionSize.x, e.positionSize.y, e.positionSize.height, e.positionSize.width
                                )
                                .setStyle({
                                    color: e.style.color,
                                    opacity: e.style.opacity
                                })
                                .build(e.projectileINIT.team)
                        }
                    });
                } else if (sentJson.body.msg) {
                    let message = sentJson.body.msg;

                    console.log(sentJson);

                    if (message === 'killLog') {
                        printKillLog(sentJson.body.info, true);
                    }
                }
            }
        };

        reader.readAsText(blob);
    };
}