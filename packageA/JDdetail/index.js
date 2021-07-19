const { axios } = require("../../utils/common.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    path: '',
    skuId: null, //商品id
    banner: null, //轮播图
    JDimg: app.globalData.JDimg,
    result: null,
    richText: null,//富文本
    data: '',
    member_no: app.globalData.member_no,
    isCollect: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/jdIcon/c8e2978b25c704c274db0cd849796e3.png',
    noCollect: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/jdIcon/1a96345aa224452d5261160bad9a7ff.png',
    collect :false 
  },
  // 获取商品详情信息
  getProductDeatail(skuId) {
    axios({
      url: '/api/jd/itemDetails',
      data: { skuId }
    }).then(res => {
      const { result } = res.data.data.queryResult
      this.setData({
        banner: result.images,
        result
      })
    })
  },
  // 获取商品详情的富文本
  getRichText(skuId) {
    axios({
      url: '/api/jd/bigIntroduce',
      data: { skuId }
    }).then(res => {
      let richText = res.data.data.querybigfieldconvertskuResult.wdis
      // 把富文本的图片样式修改一下
      let reg = /src='http:\/\/.*?(gif)'/gi 
      richText = richText.replace(/<img/g, '<img class="my_img"');
      richText = richText.replace(reg, '');
      this.setData({ richText })
    })
  },

  // 获取跳转路径
  getToPageUrl() {
    let { member_no,city } = wx.getStorageSync('idNum')
    axios({
      url: '/api/jd/kplClick',
      data: { skuId: this.data.skuId }
    }).then(res => {
      let { shortUrl } = res.data.data.pidurlconvertResult.clickUrl
      console.log(`pages/proxy/union/union?spreadUrl=${shortUrl}&customerinfo=${member_no +','+city}`);
      wx.navigateToMiniProgram({
        appId: 'wx1edf489cb248852c',
        path: `pages/proxy/union/union?spreadUrl=${shortUrl}&customerinfo=${member_no}`
      })
    })
  },
  // 获取收藏的状态
  getCollectStatus(collect_id,member_no) {
    axios({
      url: '/api/myCollection/IsCollect',
      data: {
        collect_id,
        member_no
      }
    }).then(res => {
      this.setData({ collect : res.data.data})
    })
  },
  // 收藏
  collect(e) {
    let { item } = e.currentTarget.dataset
    let { data, member_no, JDimg } = this.data
    axios({
      url: '/api/myCollection/collection',
      data: {
        jd_name: item.name,
        jd_price: item.price,
        jd_image: JDimg + item.img,
        jd_type: 1,
        jd_rate: data.commisionRatioWl,
        jd_num: data.qtty30,
        jd_rate_price: data.backMoney,
        collect_type: 1,
        collect_id: data.skuId,
        member_no
      }
    }, 'POST').then(res => {
        if(!this.data.collect ){
        wx.showToast({ title: '收藏成功', icon: 'success',})
      }else {
        wx.showToast({ title: '取消收藏', icon: 'success',})
      }
      this.setData({collect:!this.data.collect})
    })
  },
  onLoad: async function (options) {
    await this.isLogin()
    let skuId
    console.log(options);
    if (options.data) {
      let data = JSON.parse(options.data)
      console.log(data,'数据');
      skuId = +data.skuId
      data.vipCommisionRatioWl = Number(+data.commisionRatioWl * 1.25 ).toFixed(2)
      data.vipBackMoney = Number(data.price * (+data.commisionRatioWl * 1.25) / 100).toFixed(1)
      this.setData({ skuId, data })
    }else if (options.member_no){
      app.globalData.inviteMember_no = options.member_no
      console.log(app.globalData.inviteMember_no,'存到app里面');
    } 
      await this.getCollectStatus(skuId,this.data.member_no)
      await this.getProductDeatail(skuId)
      await this.getRichText(skuId)
  },
  isLogin() {
    let _this = this
    wx.getStorage({
      key: 'idNum',
      success: function (data) {
        _this.setData({ member_no: data.data.member_no })
        console.log(data.data.member_no );
      },
      fail: function () {
        wx.showToast({
          title: '未登录',
          icon: 'none'
        })
        setTimeout(()=>{
          wx.switchTab({ url: '/pages/personal/personal' })
        },1500)
      }
    })
  },
  onShareAppMessage: function (options) {
    console.log(this.data.data);
    return {
      title: this.data.result.name,
      // imageUrl:'../../img/icon/youjiantou.png',//图片地址
      path:'/packageA/JDdetail/index?member_no='+app.globalData.member_no +'&data='+JSON.stringify(this.data.data)
    }
  }
})