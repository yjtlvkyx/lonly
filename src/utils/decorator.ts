import ValidateTest from 'async-validator'

import * as stateManagement from './state-management'

//规定校验参数类型
type validate = {
    query?: {},
    body?: {}
}

//进行校验的函数，返回中间件
const validateFunc = (validate: validate) => (ctx, next) => {
    let schema: object, rule: any;
    //声明校验实例及请求参数/请求方式，统一处理
    switch(true) {
        case Boolean(validate.query):
            schema = new ValidateTest(validate.query);
            rule = ctx.request.query;
        break;
        case Boolean(validate.body):
            schema = new ValidateTest(validate.query);
            rule = ctx.request.body;
        break;
        default:
            schema = new ValidateTest({});
            rule = [];
        break;
    }

    //将实例方法validate与请求参数进行匹配校验
    schema['validate'](rule, (error, fields) => {
        if (error) {
            //这里执行参数校验失败回调
            stateManagement.error({
                status: 400,
                message: error
            }, ctx)
        } else {
            //校验成功执行下一步
            next();
        }
    })
}

/**
 * 校验方法
 * @param validate 需要校验的参数对象
 */
const validator = (validate: validate = {}) => {
    return (target, property, descripter) => {
        //获取到传入校验参数对象时返回的中间件，加入目标中间件函数之前
        const validateMiddle = validateFunc(validate);
        target[property].middlewares ? target[property].middlewares.unshift(validateMiddle) :
        target[property].middlewares = [validateMiddle];
    }
}

export {validator};