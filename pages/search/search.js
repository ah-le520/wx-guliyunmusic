// pages/search/search.js
import request from '../../utils/request'
let isRequest = false //用来维护函数节流
Page({

    /**
     * 页面的初始数据
     */
    data: {
         placeHolderContext:'', 
         hotListData:[],
         searchKeyWord:'',//用户输入的关键字
         searchResultListData:[],//相关的搜索信息
         historyList:[],//历史记录
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //  获取默认搜索关键字
        this.getSearchKeyWord();
         // 获取热搜榜数据
         this.getHotListData();
        //  获取历史记录
        this.getSearchHistory();
    },
    //获取默认搜索关键字
        async  getSearchKeyWord(){
             let result = await request('/search/default')
             let placeHolderContext = result.data.realkeyword
             this.setData({
                placeHolderContext
             })
        },
        // 获取热搜榜数据
        async getHotListData(){
             let result = await request('/search/hot/detail')
             let index = 0
             result = result.data.map((item)=>{
                 item.id = index++
                 return item
             })
             this.setData({
                hotListData:result
             })
        },
        // 获取搜索信息
        SearchInfo(e){
            let searchKeyWord = e.detail.value.trim()
            this.setData({
                searchKeyWord
            })
            // 函数节流
            if(isRequest){
                return
            }
            isRequest = true
            this.getSearchInfo(searchKeyWord)
            setTimeout(()=>{
            isRequest = false
            },300)
            if(!this.data.searchKeyWord){
                this.setData({
                    searchResultListData:[]
                   })
            }
        },
        // 搜索的请求
       async getSearchInfo(){
        if(!this.data.searchKeyWord){
            return
        }
        let {searchKeyWord,historyList} = this.data
            let result  =await request('/search',{keywords:searchKeyWord,limit:10})
            if(result.code == 200){
                if(historyList.indexOf(searchKeyWord) != -1){
                    historyList.splice(historyList.indexOf(searchKeyWord),1)
                }
                // 保存历史记录
                historyList.unshift(searchKeyWord)
                this.setData({
                    searchResultListData:result.result.songs,
                    historyList
                })
                // 存到本地
                wx.setStorageSync('searchHistory', historyList)
            }else{
                this.setData({
                    searchResultListData:[],
                })
            }
        },
        // 获取历史记录
        getSearchHistory(){
            let historyList = wx.getStorageSync('searchHistory');
            if(historyList){
                this.setData({
                    historyList
                })
            }
        },
        // 清空搜索框内容
        clearContent(){
            this.setData({
                searchKeyWord:'',
                searchResultListData:[]
            })
        },
        // 删除历史记录
        deleteHistory(){
            wx.showModal({
                content:'确认删除吗？',
                success:(res)=>{
                if(res.confirm){
                    this.setData({
                        historyList:[]
                    })
                    wx.removeStorageSync('searchHistory')
                }
                }
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