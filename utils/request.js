// 发送ajax请求
import config from './config'
// 封装功能函数
export default (url, data = {}, method = 'GET') => {
    return new Promise((resolve, reject) => {
        //    初始化Promise实例状态为pending
        wx.request({
            url: config.host + url,
            data,
            method,
            header:{
             cookie:wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find((item)=>item.indexOf('MUSIC_U') != -1):''
            },
            success: (res) => {
                resolve(res.data) //修改promise的状态为成功状态
            },
            fail: (err) => {
                reject(err) //修改promise的状态为失败状态
            }
        })
    })
}