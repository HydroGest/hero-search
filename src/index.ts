 
import { Context, Schema, h } from 'koishi'

export const name = 'hero-search'

export interface Config {
  token: string;
  containUrl: boolean;
}

export const Config: Schema<Config> = Schema.object({
  token: Schema.string().required().description('你的 SauceNAO.com 的 API Token'),
  containUrl: Schema.boolean().default(true).description('是否包含链接'),
})

export function apply(ctx: Context, config: Config) {
  
  const sagiri = require("sagiri");
  
  ctx.command('搜图 <message>')
  .action(async (_, message) => {
    const session = _.session;
    ctx.logger.info(message);
    let imgList = h.select(message, "img").map((item) => item.attrs.src);
    if (!imgList || !imgList.length) {
        await session.send("无效参数，请求操作结束");
        return;
    }
    await session.send("搜索原图中...");
    const client = sagiri(config.token);
    const results = await client(imgList[0]);
    let msgList: string[] = [];
    results.forEach((item) => {
      msgList.push(`<message><img src="${item.thumbnail}" cache=true />
${config.containUrl ? `链接：${item.url}` : ""}
作者：${(item.authorName ? item.authorName: "未知")}
网站：${item.site}
相似度：${item.similarity}%
索引：${item.index}</message>`);
      //ctx.logger.info(`#${item.index}: ${item.thumbnail}`)
    });
    await session.send(`<message forward>${msgList.join('')}</message>`);
  });
}
 
