import request from '../../utils/request'
let startY = 0;
let moveY = 0;
let moveDistance=0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform:'translateY(0)',
    coverTransition:'',
    userInfo:{},
    recentlyPlayList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  //下拉的效果
  handleTouchStart(event){
     startY = event.touches[0].clientY;
     this.setData({
        coverTransition:''
     })
  },
  handleTouchMove(event){
     moveY = event.touches[0].clientY;
     moveDistance = moveY - startY;
     if(moveDistance<=0){
         return;
     }
     if((moveDistance >= 80)){
         moveDistance = 80;
     }
   this.setData({
       coverTransform:`translateY(${moveDistance}rpx)`
   })

},
handleTouchEnd(){
    this.setData({
        coverTransform:`translateY(0)`,
        coverTransition:'transform 1s linear'
    })
},
// 跳转登录页面
toLogin(){
     wx.navigateTo({
       url: '/pages/login/login',
     })
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      let userInfo = wx.getStorageSync('userInfo')
    if(userInfo){
        this.setData({
            userInfo:JSON.parse(userInfo)
        })
    }
    this.getRecentlyPlayList(this.data.userInfo.userId)
  },
// 获取最近播放记录
   async getRecentlyPlayList(userId){
       let result = await request('/user/record',{ type : 0,uid :userId});
    //  将数据储存
    let index = 0;
    result = result.allData.slice(0,10).map((item)=>{
        item.id = index++;
        return item
    })
    this.setData({
        recentlyPlayList:result
    })
    },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})