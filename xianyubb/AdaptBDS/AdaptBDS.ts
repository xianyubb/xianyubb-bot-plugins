/// <reference path="D:\Dev\Xianyubb-bot_Dev\xianyubb-bot\completion/index.d.ts" />
import * as fs from "fs";

const logger = new Logger();
const CONFIG = JSON.parse(fs.readFileSync(__dirname + "/AdaptBDS/config.json", "utf-8"));

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

if (!fs.existsSync(__dirname + "/AdaptBDS/config.json")) {
    fs.mkdirSync(__dirname + "/AdaptBDS", { recursive: true });  //
    fs.writeFileSync(__dirname + "/AdaptBDS/config.json", JSON.stringify({
        "listenGroup": []
    }));
}


function wsevent(data: string) {
    if (!data) return;
    const Message: MessageType = JSON.parse(data);
    if (Message.type === "Chat") {
        const Chat: ChatMessage = Message as ChatMessage;
        CONFIG.listenGroup.forEach((groupID: number) => {
            bot.send_group_msg(groupID, `[${Chat.msg.player_name}] ${Chat.msg.message}`);
        });
    }
}

bds.getClients().forEach((CM: ConnectMessage) => {
    CM.WebSocket.on("message", wsevent);
});


function onReceiveGroupMessage(msg: GroupMessage) {
    (CONFIG.listenGroup as Array<number>).forEach((groupID) => {
        if (msg.group_id === groupID) {
            bds.sendData(JSON.stringify({
                type: "Group",
                msg: {
                    sender_name: msg.sender.nickname,
                    user_id: msg.sender.user_id,
                    message: msg.raw_message,
                    group_id: msg.group_id
                }
            }));
        }
    });
}


export function onEnable() {
    bot.BotEvents.on("onReceiveGroupMessage", onReceiveGroupMessage);
}

export function unLoad() {
    bot.BotEvents.removeListener("onReceiveGroupMessage", onReceiveGroupMessage);
    bds.getClients().forEach((CM: ConnectMessage) => {
        CM.WebSocket.removeListener("message", wsevent);
    });
}

