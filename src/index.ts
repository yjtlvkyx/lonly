import * as Koa from 'koa'
import * as bodyfi from 'koa-body-parser'
import {load} from './utils'
import * as path from 'path'

const app = new Koa();

app.use(bodyfi({
    multipart: true,
    // 使用非严格模式，解析delete请求的请求体
    strict: false
}))

const router = load(path.join(__dirname, './routes'));

app.use(router.routes());

app.listen(7001, () => {
    console.log('7001端口服务开启成功')
})