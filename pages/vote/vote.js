// pages/vote/vote.js
const app = getApp();
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hrList: [{
      name: "文字投票",
    }, {
      name: "图片投票",
    }],
    currentTab:0,
    listIndex: [{ id: 1, value: '' }, { id: 2, value: '' }, { id: 3, value: '' }],
    radio:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imageUrl: options.imageUrl ? options.imageUrl : '',//笔记发布的图片
      textValue: options.textValue ? options.textValue : '',//笔记内容
      // 关联的商品
      goods_name: options.goods_name ? options.goods_name : '',
      category_choice: options.category_choice ? options.category_choice : '',//1房产
      price: options.price ? options.price : '',
      first_price: options.first_price ? options.first_price : '',
      low_price: options.low_price ? options.low_price : '',
      spu_image: options.spu_image ? options.spu_image : '',
      spu_no: options.spu_no ? options.spu_no : '',
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
  clickMenu(e){
    this.setData({
      currentTab: e.currentTarget.dataset.current
    })
  },
  // 删除
  del(e){
    var id = e.currentTarget.id;
    console.log(id)
    var listIndex = this.data.listIndex;
    if (listIndex.length > 1){
      var arr = listIndex.splice(id,1)
      this.setData({
        listIndex
      })
    }
  },
  // 添加
  add(){
    var listIndex = this.data.listIndex;
    if (listIndex.length < 6) {
      var arr = listIndex.push({id:listIndex.length+1,value:''})

      console.log(listIndex)
      this.setData({
        listIndex
      })
    }
  },
  // 单多选
  radioChange(e) {
    console.log(e.detail.value)
    this.setData({
      radio: e.detail.value,//1单选 2多选
    })
  },
  // 开始时间
  bindDateChange: function (e) {
    this.setData({
      userDate: e.detail.value
    })
  },
  // 结束时间
  bindDateChange2: function (e) {
    this.setData({
      userDate2: e.detail.value
    })
  },
  // 投票标题
  inputTitle(e){
    this.setData({
      voteTitle: e.detail.value
    })
  },
  // 图片标题
  imgTitle1(e){
    this.setData({
      imgTitle1: e.detail.value
    })
  },
  imgTitle2(e) {
    this.setData({
      imgTitle2: e.detail.value
    })
  },
  // 选项标题
  xuanxiang(e){
    var id = e.currentTarget.id;
    var listIndex = this.data.listIndex;
    listIndex[id].value = common.trim(e.detail.value)
    // this.setData({
    //   listIndex
    // })
   
  },
  // 发起投票
  submit(){
    var listIndex = JSON.stringify(this.data.listIndex);
    if (!this.data.voteTitle) {
      wx.showToast({
        title: '请输入投票标题',
        icon: 'none'
      })
      return false
    }
    
    if (this.data.currentTab==0){//文字
      if (!this.data.listIndex[0].value){
        wx.showToast({
          title: '请输入选项',
          icon: 'none'
        })
        return false
      }
    }else{//图片
      if (!this.data.imgList){
        wx.showToast({
          title: '请上传左侧图片',
          icon: 'none'
        })
        return false
      }
      if (!this.data.imgList2) {
        wx.showToast({
          title: '请上传右侧图片',
          icon: 'none'
        })
        return false
      }
      if (!this.data.imgTitle1) {
        wx.showToast({
          title: '请填写左侧图片标题',
          icon: 'none'
        })
        return false
      }
      if (!this.data.imgTitle2) {
        wx.showToast({
          title: '请填写左侧图片标题',
          icon: 'none'
        })
        return false
      }

    }
    if (!this.data.userDate) {
      wx.showToast({
        title: '请选择投票开始时间',
        icon: 'none'
      })
      return false
    }
    if (!this.data.userDate2) {
      wx.showToast({
        title: '请选择投票结束时间',
        icon: 'none'
      })
      return false
    }
    wx.navigateTo({
      url: '/pages/post/post?voteTitle=' + this.data.voteTitle + '&radio=' + this.data.radio + '&currentTab=' + this.data.currentTab + '&userDate=' + this.data.userDate + '&userDate2=' + this.data.userDate2 + '&listIndex=' + encodeURIComponent(listIndex) + '&imgList=' + this.data.imgList + '&imgList2=' + this.data.imgList2 + '&imgTitle1=' + this.data.imgTitle1 + '&imgTitle2=' + this.data.imgTitle2 + '&postId=' + 1 + '&textValue=' + this.data.textValue + '&imageUrl=' + this.data.imageUrl 
        + '&goods_name=' + this.data.goods_name + '&first_price=' + this.data.first_price + '&low_price=' + this.data.low_price + '&spu_image=' + this.data.spu_image + '&spu_no=' + this.data.spu_no + '&category_choice=' + this.data.category_choice  + '&price=' + this.data.price,
    })
  },
  // 上传图片
  uploadImg: function () {
    let _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        let tempFilePaths = res.tempFilePaths;
        var tempFilesSize = res.tempFiles[0].size
     
        if (res.tempFiles[0].size <= 1048576) {
          wx.showLoading({
            title: '图片上传中...',
          });
          //图片压缩接口，需要真机才能
          // wx.compressImage({
          //   src: tempFilePaths[0], // 图片路径
          //   quality: 80, // 压缩质量
          //   success: function (res) {
              wx.uploadFile({
                url: common.getHeadStr() + '/api/upload/uploadFile',
                filePath: tempFilePaths[0],
                name: 'file',
                header: {
                  "token": app.globalData.token,
                  'content-type': 'application/json'
                },
                success: function (res) {
                  console.log(res)
                  var fa = JSON.parse(res.data)
                  if (fa.code == 200) {
                    _this.setData({
                      // headImgUrl: fa.data,
                      imgList: common.getHeadImg() + fa.data,//拼接域名
                    });
                  } else if (fa.code==401){
                    wx.showToast({
                      title: fa.message,
                      icon:'none'
                    })

                  }
                },
                complete: function () {
                  wx.hideLoading();
                }
              })

          //   }
          // })

        } else {
          wx.showToast({
            title: '上传图片过大',
            icon: 'none'
          })
        }
      }
    })
  },
  uploadImg2: function () {
    let _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        let tempFilePaths = res.tempFilePaths;
        var tempFilesSize = res.tempFiles[0].size
        console.log(tempFilesSize)
        if (res.tempFiles[0].size <= 1048576) {
          wx.showLoading({
            title: '图片上传中...',
          });
          //图片压缩接口，需要真机才能
          // wx.compressImage({
          //   src: tempFilePaths[0], // 图片路径
          //   quality: 80, // 压缩质量
          //   success: function (res) {
              wx.uploadFile({
                url: common.getHeadStr() + '/api/upload/uploadFile',
                filePath: tempFilePaths[0],
                name: 'file',
                header: {
                  "token": app.globalData.token,
                  'content-type': 'application/json'
                },
                success: function (res) {
                  console.log(res)
                  var fa = JSON.parse(res.data)
                  if (fa.code == 200) {
                    _this.setData({
                      // headImgUrl: fa.data,
                      imgList2: common.getHeadImg() + fa.data,//拼接域名
                    });
                  }
                },
                complete: function () {
                  wx.hideLoading();
                }
              })

          //   }
          // })
        } else {
          wx.showToast({
            title: '上传图片过大',
            icon: 'none'
          })
        }
      }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})