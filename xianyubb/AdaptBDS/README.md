# <center> 群服互通

## 功能介绍

[x] 支持群消息转发至 BDS

[x] 支持 BDS 聊天消息转发至群

[x] 同时支持多个 BDS 和 群聊

[ ] 支持群内执行 BDS 控制台命令

[x] 支持断线重连

[ ] 等等

## 使用插件

### 配置 xianyubb-bot

1. 配置安装好 xianyubb-bot
2. 配置好 xianyubb-bot 的 BDS 设置 将文件 xianyubb-bot/config/config.json 里的 BDS 配置里的 Enable 改为 true 即可
3. 将此目录下的 AdaptBDS.ts 放到 xianyubb-bot 根目录下的 **plugins_ts** 文件夹里
4. 启动 xianyubb-bot
5. 修改配置文件
6. 重启 xianyubb-bot

首次启动会在 xianyubb/plugins 文件夹下生成 AdaptBDS 文件夹 里面的 config.json 是此插件的配置文件

```json
{
    "listenGroup": [] // 监听群 类型 Array<number>
}
```

### 配置 BDS

1. 将此文件夹下的 BDSClient 文件夹 整体拖入 BDS 的 plugins 文件夹下
2. 启动 BDS
3. 修改 path/to/bds/plugins/BDSClient/config.json
4. 重启 BDS

[image](./image.png)

若出现以上情况则连接成功

```json
{
    "ws_url": "ws://localhost:8081", // ws 连接地址 与 xianyubb-bot BDS 配置项的端口一致
    "uuid": "1b328b0e-4e42-c343-28eb-19d61cfe6afc" // 无需配置 开发者选项
}
```
