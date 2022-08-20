import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        banners: [],
        recommandLsit: [],
        topList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        let bannerListData = await request('/banner', { type: 2 })
        this.setData({
                banners: bannerListData.banners
            })
            //  推荐歌曲请求
        let recommandListData = await request('/personalized', { limt: 10 })
        this.setData({
                recommandLsit: recommandListData.result
            })
            // 排行榜请求
        let index = 0;
        let resultArr = [];
        while (index < 5) {
            let topListData = await request('/top/list', { idx: index++ });
            let topListItem = { name: topListData.playlist.name, tracks: topListData.playlist.tracks.slice(0, 3) };
            resultArr.push(topListItem);
            this.setData({
                topList: resultArr
            })
        }

    },
        // 每日推荐页跳转
        toRecommend(){
           wx.navigateTo({
             url: '/pages/recommendEveryDay/recommendEveryDay',
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