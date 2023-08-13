let bot = require("../app").bot

bot.BotEvents.on("onReceiveGroupMessage", (msg) => {
    if (msg.message.trim().startsWith("#帮助")) {
        let content = 
            "帮助列表\n" +
            "motdje ip:port \n" +
            "motdpe ip:port \n" +
            "#猜数字\n" +
            "#我猜+数字"
        
        bot.send_group_msg(msg.group_id,content,false)
    }
})