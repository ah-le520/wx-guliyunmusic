// 发送ajax请求
import config from './config'
// 封装功能函数
export default (url, data = {},cookie) => {
    return new Promise((resolve, reject) => {
        //    初始化Promise实例状态为pending
        wx.request({
            url: config.login + url,
            data,
            method:'GET',
            header:{'content-type': 'application/json',
            'Cookie': cookie},
            success: (res) => {
                wx.setStorage({
                    key:'cookies',
                    data:res.cookies
                })
                resolve(res) //修改promise的状态为成功状态
            },
            fail: (err) => {
                reject(err) //修改promise的状态为失败状态
            }
        })
    })
}