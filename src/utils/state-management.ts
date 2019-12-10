import * as Koa from 'koa'
import * as path from 'path'
import * as fs from 'fs'

interface Message {
    message: string,
    field: string
}

//数据response信息
type responseMsg = {
    status: number,
    message?: Array<Message> | string,
    data?: object,
    code?: number
}

//打印路径，默认src下的logger/logger.default.log
type LogSrc = string;

/**
 * 打印日志方案
 * @param message 打印的信息文案
 * @param src 打印的路径，目前只支持文件类型，不支持深层嵌套
 */
export const logger = async (message: string, src?: LogSrc) => {
    const pathSrc = src ? path.join(process.cwd(), 'logger', src) : path.join(process.cwd(), 'logger', 'logger.default.log');
    try {
        //读写文件
        const fileSrc = fs.existsSync(path.join(pathSrc, '..'));
        message = message + '\t\t' + new Date() + '\r';
        if (fileSrc) {
            fs.writeFileSync(pathSrc, message, {
                flag: 'a'
            })
        } else {
            fs.mkdirSync(path.join(pathSrc, '..'));
            logger(message, src);
        }
    } catch (err) {
        console.log(err, '日志输出错误')
    }
}

/**
 * 接口运行错误的返回信息
 */
export const error = function (responseData: responseMsg, ctx: Koa.Context) {
    let {
        status,
        message = null,
        data = null,
        code = -1
    } = responseData;

    //处理message为字符串抛出
    message = !message ? null : typeof message === 'string' ? `${message}字段错误` : `${message.map(ele => ele.field).join(',')}字段错误`;
    ctx.status = status;
    ctx.body = {
        message,
        data,
        success: false,
        code
    }
    logger(JSON.stringify({...ctx.body, status: ctx.status}), 'logger.error.log')
}

/**
 * 接口运行成功的返回信息
 */
export const success = function (responseData: responseMsg, ctx: Koa.Context) {
    let {
        status,
        message = null,
        data = null,
        code = 0
    } = responseData;
    ctx.status = status;
    ctx.body = {
        message,
        data,
        success: true,
        code
    }
    logger(JSON.stringify({...ctx.body, status: ctx.status}), 'logger.success.log')
}