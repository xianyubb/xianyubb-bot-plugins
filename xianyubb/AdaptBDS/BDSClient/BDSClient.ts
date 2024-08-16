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

const UUID: string = CONFIG.init("uuid", generateUUIDv4());

interface MessageType {
    type: "Chat" | "Group";
    msg: {};
}

interface ChatMessage extends MessageType {
    type: "Chat";
    msg: {
        "player_name": string;
        "message": string;
    };
}

interface GroupMessage extends MessageType {
    type: "Group";
    msg: {
        "sender_name": string;
        "user_id": number,
        "message": string;
        "group_id": number,
    };
}

mc.listen("onServerStarted", () => {
    WS.connectAsync(WS_URL, (success: boolean) => {
        if (!success) {
            logger.warn("WS服务器连接失败, 将尝试重连!!!");
            let times = 0;
            const int = setInterval(() => {
                WS.connectAsync(WS_URL, (success) => {
                    if (success) {
                        logger.info("重连成功!");
                        clearInterval(int);
                    }
                    else {
                        logger.warn(`重连失败, 重连第 ${++times} 次`);
                    }
                });
            }, 3000); // 3 秒后重连
        }
        else {
            logger.info("WS服务器连接成功!");
            // 向 WS 服务器发送 UUID 并开始接收来自 WS 服务器的事件
            // 注意: 以下代码需要在 MC 客户端中执行, 因为 MC 客户端没有提供 WebSocket API
            // 以下代码是示例代码, 请自行在 MC 客户端中实现
            // mc.broadcast(`[BDSClient] ${player.realName} 已连接`); // 向所有在线玩家广播该消息
            // mc.broadcast(`[BDSClient] 已连接的 UUID: ${UUID}`); // 向所有在线玩家广播该消息
            // mc.broadcast(`[BDSClient] 已连接的 MC 版本: ${mc.version}`); // 向所有在线玩家广播该消息
            // mc.broadcast(`[BDSClient] 已连接的 LiteLoader-AIDS 版本: ${helperlib
            WS.send(JSON.stringify({
                uuid: UUID,
            }));
        }

        // 接收来自WS服务器的事件
        WS.listen("onTextReceived", (msg: string) => {
            logger.info(msg);
            const message: MessageType = JSON.parse(msg);
            if (message.type === "Group") {
                const Group = message as GroupMessage;
                mc.broadcast(`[${Group.msg.sender_name}] ${Group.msg.message}`);
            }
        });
    });
});


mc.listen("onChat", (player, msg) => {
    const chatMessage: ChatMessage = {
        type: "Chat",
        msg: {
            player_name: player.realName,
            message: msg
        }
    };
    WS.send(JSON.stringify(chatMessage));
});

WS.listen("onLostConnection", (code) => {
    logger.warn(`WebSocket 已断开, 状态码: ${code}`);
    // 重连
    let times = 0;
    const int = setInterval(() => {
        WS.connectAsync(WS_URL, (success) => {
            if (success) {
                clearInterval(int);
                logger.info("重连成功!");
            }
            else {
                logger.warn(`重连失败, 重连第 ${++times} 次`);
            }
        });
    }, 3000); // 3 秒后重连
});