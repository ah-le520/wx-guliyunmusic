// import request from '../../utils/request'
import loginPage from '../../utils/loginPage'
Page({

    /**
     * 页面的初始数据
     */
    data: {
       phone:"",
       password:"",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    // 表单项
    handleInput(event){
    // let type  =event.target.id;   //id传值
    let type = event.target.dataset.type   //后面这个type是自己定义的键
    this.setData({
        [type]:event.detail.value
    })
    },
    // 登录验证
   async login(){
        let {phone,password} = this.data;
        // 设置一个cookie,解决网络拥堵
        const cookie = '9d89ce1eae3d3e2b19be57c8952325a0=2c2031bf-1ea9-4e13-95b2-92484a027d34.7Gy7ZchFj-UO2zUyp9t7c02AHJY; order=id%20desc; serverType=nginx; pro_end=-1; ltd_end=-1; memSize=1998; bt_user_info=%7B%22status%22%3Atrue%2C%22msg%22%3A%22%u83B7%u53D6%u6210%u529F%21%22%2C%22data%22%3A%7B%22username%22%3A%22150****2797%22%7D%7D; SetName=; ChangePath=10; sites_path=/www/wwwroot; site_model=php; rank=list; Path=/www/wwwroot; file_recycle_status=true; record_paste_type=1; 2960fc2d6b4dcc284ebdc9f9c7152a8e=fe986542-e123-4711-8f28-b9831ed1368f.m8tBDL5hClgqdn1saSugCHrIR28; request_token=7WZXvunZ1PPL1g32EV0FmSgjvpxwmcm1ILzewTIFJGQN9h0m; backup_path=/www/backup; config-tab=0; network-unitType=KB/s; disk-unitType=KB/s; loginState=false; NMTID=00OSmkDYf3dRDa4iEuilZaxB7ffow0AAAGCixxa6Q'
//  前端验证账户格式
    if(!phone){
        wx.showToast({
          title: '手机号不能为空',
          icon:'none'
        })
        return;
    }
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
    if(!phoneReg.test(phone)){
        wx.showToast({
            title: '请输入正确的手机号',
            icon:'none'
          })
          return;
    } 
    if(!password){
        wx.showToast({
          title: '密码不能为空',
          icon:'none'
        })
        return;
    }
    // 后端验证
    let data = await loginPage('/login/cellphone',{phone,password},cookie)
    let result = data.data
    if(result.code === 200){
        wx.showToast({
          title: '登录成功',
        })
        // 将数据存储到本地
        wx.setStorageSync('userInfo', JSON.stringify(result.profile))
        // 跳转到个人中心页
        wx.reLaunch({
          url: '/pages/personal/personal',
        })
    }else if(result.code===400){
        wx.showToast({
          title: '手机号错误',
          icon:'none'
        })
    }else if(result.code===502||result.code===501){
        wx.showToast({
          title: '密码错误',
          icon:'none'
        })
    }else{
        wx.showToast({
          title: '网络太拥挤，请稍候再试。',
          icon:'none'
        })
    }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})