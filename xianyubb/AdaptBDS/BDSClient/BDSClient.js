// LiteLoader-AIDS automatic generated
/// <reference path="d:\Dev\Xianyubb-Dev/dts/helperlib/src/index.d.ts"/>
const CONFIG = new JsonConfigFile("./plugins/BDSClient/config.json");
const WS_URL = CONFIG.init("ws_url", "ws://localhost:8081");
const WS = new WSClient();
function generateUUIDv4() {
    // 生成随机的 128 位数字
    const randomPart = ([...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('') + '00000000').slice(0, 32);
    // 将随机生成的数字按照 UUID 的格式进行格式化
    const uuid = randomPart.substring(0, 8) +
        '-' + randomPart.substring(8, 12) +
        '-' + randomPart.substring(12, 16) +
        '-' + randomPart.substring(16, 20) +
        '-' + randomPart.substring(20, 32);
    return uuid;
}
const UUID = CONFIG.init("uuid", generateUUIDv4());
WS.connectAsync(WS_URL, (success) => {
    if (!success) {
        logger.warn("WS服务器连接失败, 将不会继续执行插件策略");
        return;
    }
    WS.send(JSON.stringify({
        uuid: UUID,
    }));
    // 接收来自WS服务器的事件
    WS.listen("onTextReceived", (msg) => {
        logger.info(msg);
        const message = JSON.parse(msg);
        if (message.type === "Group") {
            const Group = message;
            mc.broadcast(`[${Group.msg.sender_name}] ${Group.msg.message}`);
            logger.info(`[${Group.msg.sender_name}] ${Group.msg.message}`);
        }
    });
});
mc.listen("onChat", (player, msg) => {
    const chatMessage = {
        type: "Chat",
        msg: {
            player_name: player.realName,
            message: msg
        }
    };
    WS.send(JSON.stringify(chatMessage));
});
