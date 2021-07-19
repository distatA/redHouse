// pages/home_page/good_group/good_group.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationBarTitle: 'BOBO纯棉四件套',
    top1: 1,
    top2: 0,
    bnrUrl1: [
      {
        imgUrl: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/images/home/good_detail/goodBanner.png'
      },
      {
        imgUrl: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/images/home/good_detail/goodBanner.png'
      },
      {
        imgUrl: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/images/home/good_detail/goodBanner.png'
      },
    ],
    tjList: [
      {
        avar: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/images/shequ/avar0.png',
        nickName: '合肥城记',
        leve: '1',
        time: '2019-6-12 11:28',
        title: '禄口街道付律师费稍等稍等说服力科技和顺帆路昆嘉路离开家东方季道世纪大厦了空间的说法',
        picList: [
          {
            articleImg: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/images/shequ/p1.png'
          },
          {
            articleImg: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/images/shequ/p2.png'
          },
          {
            articleImg: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/images/shequ/p3.png'
          },
        ],
        readNum: 200,
        liuyan: 500,
        zan: 600,
        showType: 1,
        lianList: true,
        lianCont: '宝丽金地贝壳湾'
      },
      {
        avar: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/images/shequ/avar0.png',
        nickName: '肥西笔记',
        leve: '1',
        time: '2019-6-12 11:28',
        title: '禄口街道付律师费稍等稍等说服力科技和顺帆路昆嘉路离开家东方季道世纪大厦了空间的说法发卡单身了都是废话',
        picList: [
          {
            articleImg: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/images/shequ/typepic2.png'
          }
        ],
        readNum: 200,
        liuyan: 500,
        zan: 600,
        showType: 2,
        lianList: true,
        lianCont: '电饭锅里看见奥德赛'
      },
      {
        avar: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/images/shequ/avar0.png',
        nickName: '独守空房',
        leve: '1',
        time: '2019-6-12 11:28',
        title: '禄口街道付律师费稍等稍等说服力科技和顺帆路昆嘉路离开家东方季道世纪大厦了空间的说法',
        readNum: 200,
        liuyan: 500,
        zan: 600,
        showType: 3,
        lianList: true,
        lianCont: '爱上符合规范'
      },
    ],
    score: 5,
    kolstar: 5,
    goodstar: 4,
    cheap: 5,
    commentTit: [
      {
        commentTop: '全部',
        num: 400
      },
      {
        commentTop: '好评',
        num: 380
      },
      {
        commentTop: '差评',
        num: 20
      },
      {
        commentTop: '有图',
        num: 200
      },
    ],
    currentIndex: 0,
    clientstar: 4,

  },
  
  //函数
  changeTabs: function (e) {
    let index = e.target.dataset.index;
    this.setData({
      currentIndex: index
    })
  },

  change1: function () {
    this.setData({
      top1: 1,
      top2: 0
    })
  },
  change2: function () {
    this.setData({
      top1: 0,
      top2: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: 'BOBO纯棉四件套'
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