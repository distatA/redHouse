// pages/linkGoods/linkGoods.js
const app = getApp();
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moren: 0,
    radio: '1',
    arrId:[],
    shopArr:[],
    // checked:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imageUrl: options.imageUrl ? options.imageUrl:'',//笔记发布的图片
      textValue: options.textValue ? options.textValue :'',//笔记内容
      textValue1: options.textValue1 ? options.textValue1 : '',//快讯标题
      textValue2: options.textValue2 ? options.textValue2 : '',//快讯内容
      type:options.type,
      postId: options.postId,//1笔记 2快讯
      // 发起投票数据
      listIndex: options.listIndex ? JSON.parse(decodeURIComponent(options.listIndex)) : '',//选项标题
      voteTitle: options.voteTitle ? options.voteTitle : '',//投票标题
      radio: options.radio ? options.radio : '',//1单选 2多选
      currentTab: options.currentTab ? options.currentTab : '',//0 文字 1图片
      userDate: options.userDate ? options.userDate : '',//开始时间
      userDate2: options.userDate2 ? options.userDate2 : '',//结束时间
      imgList: options.imgList ? options.imgList : '',//图片投票
      imgList2: options.imgList2 ? options.imgList2 : '',//图片投票
      imgTitle1: options.imgTitle1 ? options.imgTitle1 : '',//图文标题
      imgTitle2: options.imgTitle2 ? options.imgTitle2 : '',//图文标题
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getGoods()// 好物列表
  },
 
 
// 搜索
  toSearch:function(){
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + 'api/publish/search',
          data: {
            member_no: res.data.member_no,
            searchName: that.data.searchValue
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {
            if (res.data.code == 200) {
              that.setData({
                goodsList: res.data.data
              })
            }
          }
        })
        // console.log(res)
       
      }
    })
  },
// 输入框
  getInputValue: function (e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
// 回车搜索
  searchHandle:function(){
    this.toSearch()
  },
//取消
  cancel:function(){
    this.setData({
      searchValue:''
    })
    this.getGoods()// 好物列表
  },
// 好物列表
getGoods:function(){
  var that = this;
  wx.getStorage({
    key: 'idNum',
    success: function (res) {
      // console.log(res)
      wx.request({
        url: app.globalData.URL + 'api/publish/myGoodsList',
        data: {
          member_no: res.data.member_no,
        },
        method: 'GET',
        header: {
          "token": res.data.token,
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.code == 200) {
            var array = res.data.data;
            for (var i = 0; i < array.length; i++) {
              array[i].checked = false
            }
            console.log(array)
            that.setData({
              goodsList: array,
              items: array
            })
          }else if(res.data.code == 401){
            wx.showToast({
              title: res.data.message,
              icon:'none'
            })
          }
        }
      })
      
    }
  })
},
  
  // 选择关联
  radioChange(e) {
    
    var id = e.detail.value;
    console.log(id)
    var that = this;

    var shopArr = that.data.goodsList[id];
    console.log(shopArr)
    
    that.setData({
      shopArr: shopArr,
    });

  },
// 提交
  submit:function(){
    var that = this ;
    var arrId = that.data.shopArr;
    console.log(arrId)
    if (that.data.type==0){//返回发笔记
      wx.navigateTo({
        url: '/pages/post/post?goods_name=' + arrId.goods_name + '&first_price=' + arrId.first_price + '&low_price=' + arrId.low_price + '&spu_image=' + arrId.spu_image + '&spu_no=' + arrId.spu_no + '&category_choice=' + arrId.category_choice + '&textValue=' + that.data.textValue + '&imageUrl=' + that.data.imageUrl + '&price=' + arrId.average_price + '&postId=' + that.data.postId + '&textValue1=' + that.data.textValue1 + '&textValue2=' + that.data.textValue2 + '&voteTitle=' + that.data.voteTitle + '&radio=' + that.data.radio + '&currentTab=' + that.data.currentTab + '&userDate=' + that.data.userDate + '&userDate2=' + that.data.userDate2 + '&listIndex=' + encodeURIComponent(JSON.stringify(that.data.listIndex)) + '&imgList=' + that.data.imgList + '&imgList2=' + that.data.imgList2 + '&imgTitle1=' + that.data.imgTitle1 + '&imgTitle2=' + that.data.imgTitle2,
      })
    }  else{//返回创建直播
      wx.navigateTo({
        url: '/pages/myLive/myLive?goods_name=' + arrId.goods_name + '&first_price=' + arrId.first_price + '&low_price=' + arrId.low_price + '&spu_image=' + arrId.spu_image + '&spu_no=' + arrId.spu_no + '&category_choice=' + arrId.category_choice + '&price=' + arrId.average_price,
      })
    }
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