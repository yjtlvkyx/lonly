import * as KoaRouter from 'koa-router'
import * as Koa from 'koa'
import * as glob from 'glob'

type HTTPMethod = 'HEAD' | 'OPTIONS' | 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE';

type routeOptions = {
    /**
     * 比较特殊，比如前面拼接路径前缀
     */
    prefix?: string,
    middlewares?: Array<Koa.middleware>
}

type loadOptions = {
    extname?: string
}

const router = new KoaRouter();

const decorator = (method: HTTPMethod, path, options: routeOptions = {}, router: KoaRouter) => {
    return (target, property, descriptor) => {
        process.nextTick(() => {
            //集合中间件队列
            const middlewares = [];

            //类装饰器中间件插入
            if (target.middlewares) {
                middlewares.push(...target.middlewares);
            }

            //其他方法装饰器插入拦截执行中间件
            if (target[property].middlewares) {
                middlewares.push(...target[property].middlewares);
            }

            middlewares.push(target[property]);

            //执行中间件队列
            const url = options.prefix ? options.prefix + path : path;
            const meth = method.toLocaleLowerCase();
            router[meth](url, ...middlewares);
        })
    }
}

const method = (method: HTTPMethod) => (path: string, options?: routeOptions) => decorator(method, path, options, router);

//做文件引入
const load = (path: string, options: loadOptions = {}) => {
    const extname = options.extname ? options.extname : '.{js,ts}';
    glob.sync(require('path').join(path, `./**/*${extname}`)).forEach(element => require(element));
    return router;
}

//制作统一中间件
const middlewares = (middlewares: Koa.middleware[]) => {
    return (target) => {
        target.prototype.middlewares = middlewares;
    }
}

export const get = method('GET');
export const post = method('POST');
export {load};
export {middlewares};