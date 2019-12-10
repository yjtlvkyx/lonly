import {success} from './../utils/state-management';
import * as Koa from 'koa';
import { get, post, middlewares } from '../utils';
import { validator } from '../utils/decorator';

const users = [
    {name: 'yjt', age: 12}
]

@middlewares([async (ctx, next) => {
    if (ctx.header.token) {
        await next();
    } else {
        throw Error('这里需要token')
    }
}])
export default class Users {
    @get('/users/list')
    @validator({
        query: {
            name: {
                type: 'string',
                required: true,
                validator: (rule, value) => value === 'muji'
            }
        }
    })
    public userList(ctx: Koa.Context) {
        success({
            data: users,
            status: 200,
            message: '成功',
            code: 1
        }, ctx)
    }

    @get('/users/submit')
    @validator({
        query: {
            name: {
                type: 'string',
                required: true,
                validator: (rule, value) => value === 'muji'
            },
            age: {
                type: 'number',
                required: true,
                validator: (rule, value) => Boolean(Number(value))
            }
        }
    })
    public userSubmit(ctx: Koa.Context) {
        success({
            data: null,
            status: 200,
            message: '请求成功',
            code: 0
        }, ctx)
    }
}