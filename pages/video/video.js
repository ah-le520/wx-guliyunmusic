import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
       videoGroupList:[],
       navId:'', //记录当前导航的id
       videoListData:[],
       videoId:'',
       videoUpdataTime:[], //记录视频播放的时间
       isRefreshTragger:false //记录下拉刷新是否被触发
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
//    获取视频列表
    this.videoGroupList()
    },

// 获取视频列表回调
async videoGroupList(){
       let result = await request('/video/group/list') 
       this.setData({
        videoGroupList:result.data.slice(0,14),
           navId:result.data[0].id
       })
    //  拿到导航标签数据,调用获取视频列表数据
    this.getVideoList(this.data.navId)
},
// 获取视频列表数据
async getVideoList(navId){
  if(!navId){
    return;
  }
    let result = await request('/video/group',{id:navId});
    // 关闭加载提示框
    wx.hideLoading();
    let index= 0;
    let videoList = result.datas.map((item)=>{
        item.id = index++;
        return item
    })
    this.setData({
        videoListData:videoList,
        isRefreshTragger:false
    })
},
// nav选中事件
currentChose(e){
    let id = e.target.dataset.id;
    this.setData({
        navId:id,
        videoListData:[]
    })
    wx.showLoading({
      title:'正在加载'
    })
   
     //  拿到导航标签数据,调用获取视频列表数据
     this.getVideoList(this.data.navId)
},
// 视频播放回调
handlePlay(e){
     let vid = e.target.id;
    //  this.vid!=vid && this.videoContext&&this.videoContext.stop();
    //  this.vid = vid;
     this.setData({
        videoId:vid
     })
     this.videoContext =  wx.createVideoContext(vid);
    //  判断当前视频是否播放过
    let {videoUpdataTime} =this.data;
    let videoItem = videoUpdataTime.find(item=>item.vid === vid);
    if(videoItem){
    this.videoContext.seek(videoItem.currentTime)
    }  
    //  this.videoContext.play()
},
// 监听视频播放完毕的回调
handleEnded(e){
    // 移除播放完毕的视频时间记录
     let {videoUpdataTime} = this.data;
    let index = videoUpdataTime.findIndex(item =>item.vid === e.target.id);
    videoUpdataTime.splice(index,1);
    this.setData({
        videoUpdataTime
    })
},
//  处理视频播放时间的事件
timeupdate(e){
   let videoTimeObj = {vid:e.target.id,currentTime:e.detail.currentTime};
   let {videoUpdataTime} = this.data;
   // 判断当前视频是否保存过
   let videoItem = videoUpdataTime.find((item)=>item.vid ===videoTimeObj.vid);
   if(videoItem){
       videoItem.currentTime = videoTimeObj.currentTime
   }else{
    videoUpdataTime.push(videoTimeObj)
   }
//    更新updata状态
   this.setData({
    videoUpdataTime
   })
},
// 下拉刷新
refresh(){
    this.setData({
        isRefreshTragger:true
    })
     this.getVideoList(this.data.navId)
},
        //  跳转搜索界面
        toSearch(){
            wx.navigateTo({
              url: '/pages/search/search',
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
    onShareAppMessage({from}) {
          if(from == 'menu'){
              return {
                title:'来自右上角转发',
                path:'/pages/video/video.wxml'
              }
          }else{
              return{
                title:'自定义按钮',
                path:'/pages/video/video.wxml'
              }
          }
    }
})