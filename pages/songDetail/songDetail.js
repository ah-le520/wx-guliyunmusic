import PubSub  from 'pubsub-js'
import moment from 'moment'
import request from '../../utils/request'
const appInstance  = getApp(); //获取全局app实例

Page({
    /**
     * 页面的初始数据
     */
    data: {
        isPlay:false,
        songs:{},
        songId:'',
        musicLink:'',//保存播放音乐链接
        currentTime:'00:00',//当前播放时长
        durationTime:'00:00',//总时长
        currentWidth:0,//当前进度条长度
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
//  这里options会接收通过路由跳转过来的参数
    // 发请求，获取歌曲详情
    let songId = options.songId
    this.setData({
        songId 
    })
    // 获取音乐详情
    this.getSongDetail(songId);
    // 判断当前页面的音乐是否在播放
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.songId == songId){
        // 修改当前页面播放状态
        this.setData({
            isPlay:true
        })
    }
    //获取全局背景音频管理器
    this.BackgroundAudioManager = wx.getBackgroundAudioManager();
    // 监听播放或者暂停状态
    this.BackgroundAudioManager.onPlay(()=>{
        this.changePlay(true);
        // 修改全局音乐播放状态
        appInstance.globalData.songId = songId;
    });
    this.BackgroundAudioManager.onPause(()=>{
        this.changePlay(false)
    });
    this.BackgroundAudioManager.onStop(()=>{
        this.changePlay(false)
    });
    // 监听音乐播放结束,自动播放下一曲
    this.BackgroundAudioManager.onEnded(()=>{
    //  调用消息发布
    // 订阅音乐推荐页面返回的id
    PubSub.subscribe('switchId',(name,switchId)=>{
        // 获取音乐信息更新界面
        this.getSongDetail(switchId)
        //   调用播放
        this.musicControl(true,switchId)
        //  接受完后，取消订阅,防止重复接收
        PubSub.unsubscribe('switchId')
        })
        //   发布切换类型给推荐页面
        PubSub.publish('switchType',"next")
    // 清空进度条,及当前播放时间
    this.setData({
        currentTime:'00:00',
        currentWidth:0
    })
    });
    // 监听音乐播放进度
    this.BackgroundAudioManager.onTimeUpdate(()=>{
         let currentTime = moment(this.BackgroundAudioManager.currentTime * 1000).format('mm:ss');
         let currentWidth = this.BackgroundAudioManager.currentTime/this.BackgroundAudioManager.duration*450
         this.setData({
            currentTime,
            currentWidth
         })
    })
    },
    // 修改播放暂停状态---监听的回调
    changePlay(isPlay){
        this.setData({
            isPlay
        })
        // 修改全局音乐播放状态
        appInstance.globalData.isMusicPlay = isPlay;
    },
     // 播放||暂停
    handleMusicPlay(){
     let isPlay = !this.data.isPlay
    //  this.setData({
    //      isPlay
    //  })
     let {songId,musicLink} = this.data
     this.musicControl(isPlay,songId,musicLink)
    },
     // 控制音乐播放暂停，并发请求
    async musicControl(isPlay,songId,musicLink){
         if(isPlay){
          if(!musicLink){
         //  获取音乐地址
         musicLink = await request('/song/url',{id:songId});
         this.setData({
            musicLink
         })
          }
          this.BackgroundAudioManager.src = musicLink.data[0].url;
          this.BackgroundAudioManager.title = this.data.songs.name   
         }else{
          this.BackgroundAudioManager.pause()
         }
    },
    // 获取歌曲对应的详情信息，需要根据歌曲的id获取,必选参数: ids
   async getSongDetail(ids){
         let result  =await request('/song/detail',{ids});
        //  初始化时长
       let durationTime = moment(result.songs[0].dt).format('mm:ss')
        //  保存结果
        this.setData({
            songs:result.songs[0],
            durationTime
        })
        // 动态设置导航栏标题为歌曲名
        wx.setNavigationBarTitle({
            title:this.data.songs.name
        })
    },
//  切换歌曲的回调
        handleSwitch(e){
        // 切换之前，将当前歌曲关闭
        this.BackgroundAudioManager.stop()
        let type = e.currentTarget.id;
        // 订阅音乐推荐页面返回的id
        PubSub.subscribe('switchId',(name,switchId)=>{
        // 获取音乐信息更新界面
        this.getSongDetail(switchId)
        //   调用播放
        this.musicControl(true,switchId)
        
        //  接受完后，取消订阅,防止重复接收
        PubSub.unsubscribe('switchId')
           
        })
        //   发布切换类型给推荐页面
        PubSub.publish('switchType',type)
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