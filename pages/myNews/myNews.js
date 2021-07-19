// pages/myNews/myNews.js
const app = getApp();
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { num: '1', value: '男' },
      { num: '2', value: '女' },
    ],
    sex: '',
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // wx.getStorage({
    //   key: 'phone',
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       phone: res.data.data ? res.data.data :'',//手机号码 
    //     })
    //   },fail:function(){
    //     that.setData({
    //       phone:  '',//手机号码 
    //     })
    //   }
    // })
    that.setData({
      type: options.type ? options.type : 1,//手机号码 
    })
    if (options.phone) {
      console.log(options.phone)
      that.setData({
        phones: options.phone,//手机号码 
      })
    }
    
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        console.log(res)
        that.setData({
          headUrl: res.data.headUrl,//微信头像
          userName: res.data.realName,//微信名
          nickName: res.data.nickName,//用户名
          member_no: res.data.member_no,
          signature: res.data.sign ? res.data.sign : '',//签名
          sex: res.data.gender ? res.data.gender : '',//性别
          userDate: res.data.birth ? res.data.birth : '',//生日
          redType: res.data.redType,//0 普通 1红人 2官方红人
          imageUrl: res.data.imageUrl ? res.data.imageUrl : '',//店铺展示图
          token: res.data.token,
          phone: res.data.mobile ? res.data.mobile : '',//手机号码 
          
        })
      }
    })
    wx.getStorage({
      key: 'expre12',
      success: function (res) {
        console.log(res)
        that.setData({
          expre12: res.data ? res.data : '',//微信二维码
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
  // 姓名
  getnameValue: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  // 性别
  radioChange(e) {
    console.log(e.detail.value)
    this.setData({
      sex: e.detail.value
    })
  },
  // 手机号码
  getphoneValue:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  onChange(event) {
    console.log(event)
    this.setData({
      checked: event.detail
    });
  },
  // 生日
  bindDateChange: function (e) {
    this.setData({
      userDate: e.detail.value
    })
  },
  // 签名
  getsignValue: function (e) {
    this.setData({
      signature: e.detail.value
    })
  },
  // 去绑定手机号
  phone:function(){
    wx.navigateTo({
      url: '/pages/phone/phone?phone=' + this.data.phone,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  // 上传头像
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
                  if(fa.code==200){
                    _this.setData({
                      headImgUrl: fa.data,
                      userHeadUrl: common.getHeadImg() + fa.data,//拼接域名
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
// 提交
  tijiao: common.throttle(function(e){
    var userHeadUrl = this.data.userHeadUrl;//上传的头像
    var headImg = this.data.headUrl;//微信头像
    var headUrl;
    if(this.data.img){//店铺图
      var imageUrl = this.data.img;
    }else{
      var imageUrl = this.data.imageUrl;
    }
    if (this.data.img1) {//微信二维码
      var expre12 = this.data.img1;
    } else {
      var expre12 = this.data.expre12;
    }
    console.log(this.data.phone)
    if(this.data.type==2){
      var phone = this.data.phones
    }else{
      var phone = this.data.phone
    }
    if (userHeadUrl != null || userHeadUrl != undefined) {
      headUrl = userHeadUrl
    }
    if (userHeadUrl == null || userHeadUrl == undefined) {
      headUrl = headImg
    }
var that = this;
    if (this.data.userName == "") {
      this.alert('请填写您的姓名')
    } else if (this.data.sex == "" || this.data.sex == undefined ) {
      this.alert('请选择您的性别')
    }else {
      wx.request({url: app.globalData.URL +'/api/myMessage/updateMyMessage', 
      data:{
        birth: this.data.userDate,
        nickName: this.data.userName,
        member_no: this.data.member_no,
        headUrl: headUrl,
        gender: this.data.sex ? this.data.sex : 0 ,
        sign: this.data.signature,
        mobile:phone,
        imageUrl: imageUrl,
        expre12: expre12,
      },
        method: 'POST',
        header: {
          "token": this.data.token,
          'content-type': 'application/json'
        },
        success:function (res) {
          console.log(res)
          var numMsg = res.data.data;
          numMsg.token = that.data.token;
        
          if (res.data.code==200) {
            console.log(numMsg)
            wx.setStorage({
              key: 'idNum',
              data: numMsg,
            });
            wx.setStorage({
              key: 'phone',
              data: numMsg.mobile,
            });
            wx.setStorage({
              key: 'expre12',
              data: expre12,
            });
            wx.showToast({
              title: '保存成功',
              duration: 2000
            })
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/personal/personal'
              })
            }, 2000)
          }
        }
        })
    }  
  },1000),
  alert: function (mes) {
    wx.showModal({
      title: '提示',
      confirmText: "关闭", //默认是“取消”
      showCancel: false,
      content: mes,
      success: function (res) {
        if (res.confirm) { //这里是点击了确定以后
          //console.log('用户点击确定')

        } else { //这里是点击了取消以后
          //console.log('用户点击取消')
        }
      }
    })
  },
//上传店铺展示图
  selectPic: function () {
    let that = this;
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: function (res) {

        that.sendPic(res.tempFilePaths[0]);
      },
    })
  },
  // 上传微信二维码
  // 上传头像
  uploadImgs: function () {
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
                      img1: common.getHeadImg() + fa.data,//拼接域名
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
  sendPic: function (tempFilePaths) {
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    })
    let that = this;
    let pic = tempFilePaths;
    if (pic) {
      wx.getStorage({
        key: 'idNum',
        success: function (res) {
          wx.hideLoading()
          wx.uploadFile({
            url: app.globalData.URL + '/api/upload/uploadFile',
            filePath: pic,
            name: 'file',
            header: {
              "token": that.data.token,
              'content-type': 'application/json'
            },
            success: function (response) {
              let result = JSON.parse(response.data);
              console.log(result);
              let tempImg = "https://firsthouse.oss-cn-shanghai.aliyuncs.com/" + result.data;
              console.log(tempImg);
              that.setData({
                img: tempImg
              })
             
            }
          })
        },
      })
    } else {
      console.log(0);
    }

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