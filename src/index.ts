import { Context, Schema, h } from 'koishi'

export const name = 'hero-search'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.command('搜图 <message>')
  .action((_, message) => {
    const session = _.session;
    ctx.logger.info(message);
    let imgList = h.select(message, "img").map((item) => item.attrs.src);
    if (!imgList || !imgList.length) {
        session.send("无效参数，请求操作结束");
        return;
    }
    session.send("搜索原图中...");
  })
}
