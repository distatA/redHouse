// pages/search/search.js
const app = getApp();
const { axios }  = require('../../utils/common')
Page({

  // url: '/api/jd/itemList',
  // data: {
  //   pageNum,
  //   pageSize,
  //   keyWords
  // }
  /**
   * 页面的初始数据
   */
  data: {
    menuLists:[
      {
        name:'京东'
      },
      {
        name:'房产'
      },
      {
        name: '红人店铺'
      },
      {
        name: '红人社区'
      },
    ],
    JDimg: app.globalData.JDimg,
    currentTabs:0,
    JDpageNum:1,
    JDpageSize:10,
    JDlist:[], //京东商品列表
    searchValue:'' //输入框的内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cityName: options.cityName
    })
  },
  toPage(e){
    const { item } = e.currentTarget.dataset
    let data = JSON.stringify({
      skuId:item.skuId,
      backMoney:item.backMoney,
      commisionRatioWl:item.commisionRatioWl,
      qtty30:item.qtty30,
      price : item.price
    })
    wx.navigateTo({ url: `../../packageA/JDdetail/index?data=${data}` })
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

  },
  searchJD(pageNum,pageSize,keyWords){
      axios({
        url: '/api/jd/itemList',
        data: {
          pageNum,
          pageSize,
          keyWords
        }
      }).then(res=>{
      let JDlist = res.data.data.searchgoodsResult.result.queryVo
      JDlist = JDlist.map(v => {
        v.backMoney = Number(v.price * v.commisionRatioWl / 100).toFixed(2)
        return v
      })
          this.setData({JDlist})
      })
  },
  // 菜单切换
  clickMenus: function (e) {
    // console.log(e)
    var id = e.currentTarget.dataset.current;
    this.setData({
      currentTabs: id
    })
  },
  // 输入框
  getInputValue: function (e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
// 搜索
  search:function(){
    this.toSearch()
  },
//回车搜索
  searchHandle:function(){
    this.toSearch()
  },
// 好物搜索
  toSearch: function (e) {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        console.log(that.data.currentTabs);
        if(that.data.currentTabs == 0){
          that.searchJD(1,10,that.data.searchValue)
        }
        if (that.data.currentTabs == 1){//好物
          wx.request({
            url: app.globalData.URL + '/api/enjoy/searchGoods',
            data: {
              searchName: that.data.searchValue,
              cityName: that.data.cityName,
              pageIndex: 1,
              pageSize: 50
            },
            method: 'GET',
            header: {
              "token": res.data.token,
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res.data.data)
              that.setData({
                recommendation: res.data.data.list
              })

            }
          })
        } else if (that.data.currentTabs == 2){//店铺
          wx.request({
            url: app.globalData.URL + '/api/enjoy/searchRedShop',
            data: {
              searchName: that.data.searchValue,
              cityName: that.data.cityName,
              pageIndex: 1,
              pageSize: 50
            },
            method: 'GET',
            header: {
              "token": res.data.token,
              'content-type': 'application/json'
            },
            success: function (res) {
              // console.log(res.data.data)
              that.setData({
                searchRedShop: res.data.data.list
              })

            }
          })
        } else if (that.data.currentTabs == 3){//社区
          wx.request({
            url: app.globalData.URL + '/api/enjoy/searchRedCommunity',
            data: {
              searchName: that.data.searchValue,
              cityName: that.data.cityName,
              member_no:res.data.member_no,
              pageIndex: 1,
              pageSize: 50
            },
            method: 'GET',
            header: {
              "token": res.data.token,
              'content-type': 'application/json'
            },
            success: function (res) {
              // console.log(res.data.data)
              that.setData({
                searchRedCommunity: res.data.data.list
              })
            }
          })
        }
      }
    })
  },
  // 商品详情
  buyNow:function(e){
    var member_no = e.currentTarget.dataset.member;
    var spu_no = e.currentTarget.dataset.spu;
    var goods_name = e.currentTarget.dataset.goods_name;
    var id = e.currentTarget.dataset.id;
    if (id == 1) {//房产
      wx.navigateTo({
        url: '/pages/huose/huose?shopId=' + spu_no + '&category_id=' + id + '&goods_name=' + goods_name ,
      })
    } else {
      wx.navigateTo({
        url: '/pages/home_page/good_detail/good_detail?shopId=' + spu_no + '&category_id=' + id + '&goods_name=' + goods_name ,
      })
    }
  },
  // 红人店铺
  redShop: function (e) {
    var member = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/redHome/redHome?member=' + member,
    })
  },
  /* 视频退出全屏时的操作 */
  fullscreenchange: function (event) {
    console.log("视频全屏的操作" + event.detail.fullScreen);
    if (event.detail.fullScreen == false) {
      var videoContext = wx.createVideoContext('houseVideo');
      videoContext.stop();
      videoContext.exitFullScreen();
    }
  },
  /* 查看预览图 */
  bigImg: function (event) {
    console.log(event)
    var index = event.currentTarget.id;
    var imgArr = new Array();
    imgArr.push(index);
    console.log(imgArr)
    wx.previewImage({
      current: imgArr[0], //当前图片地址
      urls: imgArr, //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 链接
  shop: function (e) {
    
    var choice = e.currentTarget.dataset.choice;
    var goods_name = e.currentTarget.dataset.goods_name;
    var member_no = e.currentTarget.dataset.member_no;
    if (choice == 1) {//房产
      wx.navigateTo({
        url: '/pages/huose/huose?shopId=' + e.currentTarget.id + '&category_id=' + choice + '&goods_name=' + goods_name + '&member_no=' + member_no,
      })
    } else {
      wx.navigateTo({
        url: '/pages/home_page/good_detail/good_detail?shopId=' + e.currentTarget.id + '&category_id=' + choice + '&goods_name=' + goods_name + '&member_no=' + member_no,
      })
    }
  },
  // 笔记详情
  noteDetail: function (e) {
    console.log(e)
    var noteId = e.currentTarget.id;
    var type = e.currentTarget.dataset.type;//1-小程序发布笔记 2-小程序发布文章 3-后台发布 4后台抓取
    var comment = e.currentTarget.dataset.comment;
    var like = e.currentTarget.dataset.like;
    var read = e.currentTarget.dataset.read;
    var flag = e.currentTarget.dataset.flag;
    var member = e.currentTarget.dataset.member;
    var time = e.currentTarget.dataset.time;
    var headUrl = e.currentTarget.dataset.headurl;
    var nickName = e.currentTarget.dataset.nickname;
    var img = e.currentTarget.dataset.img;//一张图片
    var imgs = e.currentTarget.dataset.imgs;//多张图片
    var video = e.currentTarget.dataset.video;
    var title = e.currentTarget.dataset.title;
    // console.log(nickName, time,img)
    wx.navigateTo({
      url: '/pages/myNote_detail/myNote_detail?noteId=' + noteId + '&headUrl=' + headUrl + "&nickName=" + nickName + '&type=' + type + '&comment=' + comment + '&like=' + like + '&read=' + read + '&flag=' + flag + '&member=' + member + '&time=' + time + '&img=' + img + '&video=' + video + '&imgs=' + imgs + '&title=' + title,
    })
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
    if(this.data.currentTabs === 0){
      let { JDpageNum, JDpageSize, searchValue, JDlist } = this.data
      JDpageNum = JDpageNum + 1
      // wx.showLoading({
      //   title: '加载中',
      // })
      axios({
        url: '/api/jd/itemList',
        data: {
          pageNum: JDpageNum,
          pageSize: JDpageSize,
          keyWords: searchValue
        }
      }, 'GET').then(res => {
        wx.hideLoading()
        let newJDlist = res.data.data.searchgoodsResult.result.queryVo
        if (res.data.code === 200 && JDlist) {
          newJDlist = newJDlist.map((v, i) => {
            v.backMoney = Number(v.price * v.commisionRatioWl / 100).toFixed(2)
            return v
          })
          this.setData({
            JDlist: [...JDlist, ...newJDlist],
            JDpageNum
          })
        } else {
          wx.showToast({
            title: '已经到底了',
            icon: 'none'
          })
        }
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})