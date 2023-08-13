let plugin = require("../src/plugins").Plugins
let bot = require("../app").bot

const gm = new plugin("guessnum", "猜数字", [0, 1, 0], {
    author: "xianyubb"
})

let game = {
    qq: {
        time: 123,
        sjs: "123"
    }
}
bot.BotEvents.on("onReceiveGroupMessage", (msg) => {
    if (msg.message.trim().startsWith("#猜数字")) {
        if (`${msg.user_id}` in game) {
            bot.send_group_msg(msg.group_id, `[CQ:at,qq=${msg.user_id}] nnd想多开游戏卡死我是嘛!`, false)
        } else {
            bot.send_group_msg(msg.group_id, `[CQ:at,qq=${msg.user_id}] 开始游戏!`, false)
            let sjs = Math.floor(Math.random() * 10)
            game[msg.user_id] = { time: 0, sjs: sjs }
        }
    }
    if (msg.message.trim().startsWith("#我猜")) {
        let num = Number(msg.message.replace("#我猜", "").trim())
        if (`${msg.user_id}` in game) {
            for (const i in game) {
                if (Object.hasOwnProperty.call(game, i)) {
                    const obj = game[i];
                    if (obj.time < 5) {
                        let sjs = obj.sjs
                        time = obj.time + 1
                        let res = gu(num, sjs)
                        if (res === "答对辣") {
                            delete game[i];
                            bot.send_group_msg(msg.group_id, `[CQ:at,qq=${msg.user_id}] ${res}`, false)
                            break
                        }
                        game[i] = { qqnum: msg.user_id, time: time, sjs: sjs }
                        bot.send_group_msg(msg.group_id, `[CQ:at,qq=${msg.user_id}] ${res}`, false)
                        break
                    } else {
                        bot.send_group_msg(msg.group_id, `[CQ:at,qq=${msg.user_id}] 不准你猜辣`, false)
                        delete game[i];
                        break
                    }
                }
            }
        }
    }

})


function gu(number, sjs) {
    if (number < sjs) {
        return "小辣"
    } else if (number > sjs) {
        return "大辣"
    } else if (number === sjs) {
        return "答对辣"
    }
}