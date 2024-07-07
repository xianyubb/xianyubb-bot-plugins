/// <reference path="D:\Dev\Xianyubb-bot_Dev\xianyubb-bot\completion/index.d.ts" />


import os from 'os';
import si from 'systeminformation';
import * as diskinfo from "node-disk-info";


export function onEnable() { }

const logger = new Logger();

// 获取操作系统名称
const platform = os.platform();
const release = os.release();

// 获取CPU核数和速度
const cpuCores = os.cpus().length;
const cpuSpeed = os.cpus()[0].speed / 1000; // 转换为GHz


// logger.log(`操作系统: ${platform}`);
// logger.log(`操作系统发行版: ${release}`);
// 
// logger.log(`CPU: ${os.cpus()[0].model} `);
// logger.log(`CPU核数: ${cpuCores}`);
// 
// logger.log(`CPU速度: ${cpuSpeed} GHz`);

function getCpuUsage(): Promise<string> {
    return new Promise((resolve) => {
        si.currentLoad()
            .then((data) => {
                const cpuUsage = data.currentLoad.toFixed(2); // 获取CPU使用率
                resolve(cpuUsage);
                // logger.log(`CPU使用率: ${cpuUsage}%`);
            })
            .catch((error: any) => {
                logger.error('Error:' + error);
            });
    });

}

// const totalMemory = os.totalmem() / (1024 * 1024); // 转换为MB
// const freeMemory = os.freemem() / (1024 * 1024); // 转换为MB
// const usedMemory = totalMemory - freeMemory;
// const memoryUsage = (usedMemory / totalMemory * 100).toFixed(2); // 计算内存使用率
//
// console.log(`内存使用情况: ${memoryUsage}%`);
// console.log(`已用/总共: ${(usedMemory / 1024).toFixed(2)}GB / ${(totalMemory / 1024).toFixed(2)}GB`);


// 
function getDistInfo(): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const aDrives = await diskinfo.getDiskInfo();
            // logger.log(aDrives.length.toString());
            const info: Array<string> = [];
            for (let i = 0; i < aDrives.length; i++) {
                let drive = aDrives[i];
                const totalSpace = drive.blocks / (1024 * 1024 * 1024); // 转换为GB
                const freeSpace = drive.available / (1024 * 1024 * 1024); // 转换为GB
                const usedSpace = drive.used / (1024 * 1024 * 1024);
                const spaceUsage = (usedSpace / totalSpace * 100).toFixed(2); // 计算硬盘使用率
                // logger.log(`硬盘: ${drive.mounted} 容量: ${totalSpace.toFixed(2)}GB 已用: ${usedSpace.toFixed(2)}GB 空余: ${freeSpace.toFixed(2)}GB 使用率: ${spaceUsage}%`);
                // break;
                info.push(`硬盘: ${drive.mounted} 容量: ${totalSpace.toFixed(2)}GB 已用: ${usedSpace.toFixed(2)}GB 空余: ${freeSpace.toFixed(2)}GB 使用率: ${spaceUsage}%`);
            }
            resolve(info);
        } catch (e) {
            logger.error(JSON.stringify(e));
            reject(0);
        }
    }
    );
}

async function onReceiveGroupMessage(msg: GroupMessage) {
    const totalMemory = os.totalmem() / (1024 * 1024); // 转换为MB
    const freeMemory = os.freemem() / (1024 * 1024); // 转换为MB
    const usedMemory = totalMemory - freeMemory;
    const memoryUsage = (usedMemory / totalMemory * 100).toFixed(2); // 计算内存使用率
    if (msg.raw_message.trim() === "状态") {
        const message = OtherAPI.reply(
            msg.message_id,
            OtherAPI.at(msg.user_id.toString(), [{
                type: "text",
                data: {
                    text: `\n操作系统: ${platform}\n`
                        + `操作系统发行版: ${release}\n`
                        + `CPU: ${os.cpus()[0].model}\n`
                        + `CPU核数: ${cpuCores}\n`
                        + `CPU速度: ${cpuSpeed} GHz\n`
                        + `CPU使用率: ${await getCpuUsage()}%\n`
                        + `内存使用率: ${memoryUsage}%\n`
                        + `已用/总共: ${(usedMemory / 1024).toFixed(2)}GB / ${(totalMemory / 1024).toFixed(2)}GB\n`
                        + `磁盘使用情况: \n${(await getDistInfo()).join("\n")}`
                }
            }])
        );
        bot.send_group_msg(msg.group_id, message, false);
    }
}

bot.BotEvents.on("onReceiveGroupMessage", onReceiveGroupMessage);

export function unLoad() {
    bot.BotEvents.removeListener("onReceiveGroupMessage", onReceiveGroupMessage);
}
