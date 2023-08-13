let bot = require("../app").bot
let Plugins = require("../src/plugins").Plugins
let http = require("http")

let example = new Plugins("motd", "服务器测试", [0, 1, 0], {
   author: "xianyubb"
})


const url = "http://win.xianyubb.top:2301/api?"




bot.BotEvents.on("onReceiveGroupMessage", (msg) => {
   let msg1 = msg.message
   if (msg1.trim().startsWith("motdpe")) {
      let ip_port = msg1.replace("motdpe", "").trim()
      try {
         const options = {
            hostname: 'win.xianyubb.top',
            port: 23001,
            path: `/api?host=${ip_port}`,
            method: 'GET',
         };

         const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
               data += chunk;
            });

            res.on('end', () => {
               const response = JSON.parse(data);
                let content = `[CQ:at,qq=${msg.user_id}]\n`+`服务器名 : ${response.motd} `
                  + `\n状态 : ${response.status} `
                  + `\n版本 : ${response.version} `
                  + `\n在线/最多 : ${response.online}/${response.max}`
                  + `\n延迟 : ${response.delay}`
                  bot.send_group_msg(msg.group_id, content, false)
            });
         });

         req.on('error', (error) => {
            console.log('An error occurred:', error);
         });

         req.end();
      } catch (error) {
         console.log('An error occurred:', error);
      }
   } else if (msg1.trim().startsWith("motdje")) {
      let ip_port = msg1.replace("motdje", "").trim()
      try {
         const options = {
            hostname: 'win.xianyubb.top',
            port: 23001,
            path: `/api/java?host=${ip_port}`,
            method: 'GET',
         };

         const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
               data += chunk;
            });

            res.on('end', () => {
               const response = JSON.parse(data);
               let content = `[CQ:at,qq=${msg.user_id}]\n` + `服务器名 : ${response.motd} `
                  + `\n状态 : ${response.status} `
                  + `\n版本 : ${response.version} `
                  + `\n在线/最多 : ${response.online}/${response.max}`
                  + `\n延迟 : ${response.delay}`
               bot.send_group_msg(msg.group_id, content, false)
            });
         });

         req.on('error', (error) => {
            console.log('An error occurred:', error);
         });

         req.end();
      } catch (error) {
         console.log('An error occurred:', error);
      }
   }
})
