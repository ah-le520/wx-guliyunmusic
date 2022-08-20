import request from '../../utils/request'
import PubSub  from 'pubsub-js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        month:'', // 月
        date:'', //天
        recommendList:[], //推荐列表数据
        index:0,//音乐的下标
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //获取时间日期
      this.setData({
          month:new Date().getMonth() + 1,
          date:new Date().getDate()
      })
//获取推荐歌曲数据
    // 判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo')
    if(!userInfo){
        wx.showToast({
          title: '请先登录',
          icon:'none',
          success:()=>{
              wx.reLaunch({
                url: '/pages/login/login',
              })
          }
        })
    }
    // 开始获取
    this.getRecommendList()
    // 订阅播放界面切换类型
    PubSub.subscribe('switchType',(name,type)=>{
        let {recommendList,index} = this.data
        if(type === 'prev'){//上一曲
            // 判断index是否为0
            if(index === 0) index = recommendList.length;
            index -= 1
        }else{//下一曲
            if(index === recommendList.length-1) index = -1;
            index += 1
        }
        // 更新下标
        this.setData({
            index
        })
        let curMusicId = recommendList[index].id;
        // 发布消息回去
        PubSub.publish('switchId',curMusicId)
    })
    },
    // 获取歌曲数据
   async getRecommendList(){
        let result = await request('/recommend/songs')
         this.setData({
            recommendList:result.recommend
         })
    },
    // 跳转到歌曲详情页
    toSongDetail(e){
        // 注意数据在currentTarget里面，target没有,而且dataset里面的key会将大写自动转为小写
        let {songid,index} = e.currentTarget.dataset
        this.setData({
            index
        })
        wx.navigateTo({
            // 路由跳转支持query传参
          url: '/pages/songDetail/songDetail?songId='+songid
        })

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