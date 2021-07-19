// pages/touSu/touSu.js
const app = getApp();
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    editText: '',
    max: 100,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type:options.type,//1评价 2投诉
      pid:options.id,
    })
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        that.setData({
          token: res.data.token
        })
      }
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
  // 内容
  getValueLength: function (e) {
    let value = e.detail.value;
    let len = parseInt(value.length);
    if (len > 100) return;
    this.setData({
      currentWordNumber: len,
      value: value
    })
  },
  // 号码
  getNum: function (e) {
    var code = e.detail.value;
    this.setData({
      code: code
    })
  },
  //提交
  tijiao: function () {
    var that = this;
    var memberFeedBackImages = '';
    var imgList = that.data.imgList ? that.data.imgList : '';
    var imgList2 = that.data.imgList2 ? that.data.imgList2 : '';
    var imgList3 = that.data.imgList3 ? that.data.imgList3 : '';
    // 判断是否上传图片
    if ((imgList && imgList != '') && (imgList2 && imgList2 != '') && (imgList3 && imgList3 != '')) {

      memberFeedBackImages +=imgList +','+ imgList2 +','+  imgList3
    } else if ((imgList && imgList != '') && (imgList2 && imgList2 != '')) {
      memberFeedBackImages+=imgList +','+  imgList2 
    } else if (imgList && imgList != '') {
      memberFeedBackImages+= imgList 
    }
    if (that.data.value != undefined) {
      wx.getStorage({
        key: 'idNum',
        success: function (res) {
          wx.request({
            url: app.globalData.URL + '/api/house/complain',
            data: {
              member_no: res.data.member_no,
              information: that.data.code,
              pid: that.data.pid,
              remark: that.data.value,
              imageUrl: memberFeedBackImages
            },
            method: 'POST',
            header: {
              "token": res.data.token,
              'content-type': 'application/json'
            },
            success: function (data) {
              //  console.log(data)
              if (data.data.code == 200) {
                wx.showToast({
                  title: data.data.data,
                })
                setTimeout(function () {
                  wx.navigateBack({

                  })
                }, 1000)
              }

            }
          })
        },
      })
    } else {
      wx.showToast({
        title: '请输入反馈内容',
        icon: 'none'
      })
    } 
},
  // 上传图片
  uploadImg: function () {
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
          wx.compressImage({
            src: tempFilePaths[0], // 图片路径
            quality: 80, // 压缩质量
            success: function (res) {
              wx.uploadFile({
                url: common.getHeadStr() + '/api/upload/uploadFile',
                filePath: res.tempFilePath,
                name: 'file',
                header: {
                  "token": _this.data.token,
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
                  }
                },
                complete: function () {
                  wx.hideLoading();
                }
              })

            }
          })

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
          wx.compressImage({
            src: tempFilePaths[0], // 图片路径
            quality: 80, // 压缩质量
            success: function (res) {
              wx.uploadFile({
                url: common.getHeadStr() + '/api/upload/uploadFile',
                filePath: res.tempFilePath,
                name: 'file',
                header: {
                  "token": _this.data.token,
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

            }
          })

        } else {
          wx.showToast({
            title: '上传图片过大',
            icon: 'none'
          })
        }
      }
    })
  },
  uploadImg3: function () {
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
          wx.compressImage({
            src: tempFilePaths[0], // 图片路径
            quality: 80, // 压缩质量
            success: function (res) {
              wx.uploadFile({
                url: common.getHeadStr() + '/api/upload/uploadFile',
                filePath: res.tempFilePath,
                name: 'file',
                header: {
                  "token": _this.data.token,
                  'content-type': 'application/json'
                },
                success: function (res) {
                  console.log(res)
                  var fa = JSON.parse(res.data)
                  if (fa.code == 200) {
                    _this.setData({
                      // headImgUrl: fa.data,
                      imgList3: common.getHeadImg() + fa.data,//拼接域名
                    });
                  }
                },
                complete: function () {
                  wx.hideLoading();
                }
              })

            }
          })

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