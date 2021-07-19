// pages/myLive/myLive.js
const app = getApp();
var common = require("../../utils/common.js");
const date = new Date();
const years = [];
const months = [];
const days = [];
const hours = [];
const minutes = [];
//获取年
for (let i = 2020; i <= date.getFullYear() + 5; i++) {
  years.push("" + i);
}
//获取月份
for (let i = 1; i <= 12; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  months.push("" + i);
}
//获取日期
for (let i = 1; i <= 31; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  days.push("" + i);
}
//获取小时
for (let i = 0; i < 24; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  hours.push("" + i);
}
//获取分钟
for (let i = 0; i < 60; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  minutes.push("" + i);
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    num2:0,
    isComment:1,//是否允许评论
    moren: 1,//是否关联商品
    time: '',
    multiArray: [years, months, days, hours, minutes],
    multiIndex: [0, 2, 16, 10, 17],
    time2: '',
    multiArray2: [years, months, days, hours, minutes],
    multiIndex2: [0, 2, 16, 10, 17],
    choose_year: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //设置默认的年份
    this.setData({
      choose_year: this.data.multiArray[0][0],
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
// 创建直播
  submit:function(){
    var that = this;
    // var time = (new Date(that.data.time)).getTime();
    // var time2 = (new Date(that.data.time2)).getTime();
    
    if (!that.data.textValue){
      wx.showToast({
        title: '请输入直播标题',
        icon:'none'
      })
      return false;
    }
    if (!that.data.time){
      wx.showToast({
        title: '请选择开播时间',
        icon: 'none'
      })
      return false;
    }
    if (!that.data.time2) {
      wx.showToast({
        title: '请选择结束时间',
        icon: 'none'
      })
      return false;
    }
    // if (time2<=time) {
    //   wx.showToast({
    //     title: '结束时间要大于开始时间',
    //     icon: 'none'
    //   })
    //   return false;
    // }
    if (!that.data.textValue2) {
      wx.showToast({
        title: '请输入主播昵称',
        icon: 'none'
      })
      return false;
    }
    if (!that.data.textValue3) {
      wx.showToast({
        title: '请输入主播微信账号',
        icon: 'none'
      })
      return false;
    }
    if (!that.data.img1) {
      wx.showToast({
        title: '请上传卡片封面图',
        icon: 'none'
      })
      return false;
    }
    if (!that.data.img2) {
      wx.showToast({
        title: '请上传直播封面图',
        icon: 'none'
      })
      return false;
    }
    // 调接口
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        console.log(res)
        common.ajaxPost('/api/live/myLive',
          {
            live_title: that.data.textValue,//直播标题
            start_time:that.data.time,//开始时间
            end_time: that.data.time2,//结束时间
            nick_name: that.data.textValue2,//主播昵称
            wx_code:that.data.textValue3,//主播昵称
            is_comment: that.data.isComment,//是否可以评论
            share_url:that.data.img1,//分享卡片封面图
            live_url:that.data.img1,//直播间封面图
            spus: that.data.spu_no,//关联商品
            member_no: res.data.member_no,
          },
          function (res) {
            console.log(res)
            if (res.code == 200) {
              wx.showToast({
                title: '创建成功',
              })
            }
            setTimeout(function(){
              wx.navigateTo({
                url:'/pages/myLiveList/myLiveList'
              })
            },1000)
          })
      }
    })
  },
  // 鼠标获取焦点:直播标题
  bindIuput: function (e) {
    var value = common.trim(e.detail.value);
    // console.log(value)
    this.setData({
      textValue: value,
      num: value.length
    })
  },
  // 主播昵称
  bindIuput2: function (e) {
    var value = common.trim(e.detail.value);
    this.setData({
      textValue2: value,
      num2: value.length
    })
  },
  // 主播微信账号
  bindIuput3: function (e) {
    var value = common.trim(e.detail.value);
    this.setData({
      textValue3: value,  
    })
  },
  // 是否评论
  radioChange(e) {
    console.log(e.detail.value)
    this.setData({
      isComment: e.detail.value
    })
  },
  // 是否关联
  changeMoren: function (e) {
    if (this.data.moren == 0) {
      this.setData({
        moren: 1
      })
    } else {
      this.setData({
        moren: 0
      })
    }
  },
  // 去关联
  guanLian: function () {
    var that = this;
    var more = that.data.more;
    wx.navigateTo({
      url: '/pages/linkGoods/linkGoods?type=' + 1 ,
    })

  },
  // 上传分享卡片封面
  selectPic1: function () {
    let that = this;
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.sendPic(res.tempFilePaths[0], 1);
      },
    })
  },
  selectPic2: function () {
    let that = this;
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.sendPic(res.tempFilePaths[0], 2);
      },
    })
  },
  sendPic: function (tempFilePaths, num) {
    console.log(tempFilePaths + "---" + num);
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
              "token": res.data.token,
              'content-type': 'application/json'
            },
            success: function (response) {
              let result = JSON.parse(response.data);
              console.log(result);
              let tempImg = "https://firsthouse.oss-cn-shanghai.aliyuncs.com/" + result.data;
              console.log(tempImg);
              if (num === 1) {
                that.setData({
                  img1: tempImg
                })
              } else if (num === 2) {
                that.setData({
                  img2: tempImg
                })
              } else if (num === 3) {
                that.setData({
                  img3: tempImg ? tempImg : ''
                })
              }
            }
          })
        },
      })
    } else {
      console.log(0);
    }

  },
  //获取时间日期
  bindMultiPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    const index = this.data.multiIndex;
    const year = this.data.multiArray[0][index[0]];
    const month = this.data.multiArray[1][index[1]];
    const day = this.data.multiArray[2][index[2]];
    const hour = this.data.multiArray[3][index[3]];
    const minute = this.data.multiArray[4][index[4]];
    // console.log(`${year}-${month}-${day}-${hour}-${minute}`);
    this.setData({
      time: year + '-' + month + '-' + day + ' ' + hour + ':' + minute
    })
    
  },
  //监听picker的滚动事件
  bindMultiPickerColumnChange: function (e) {
    //获取年份
    if (e.detail.column == 0) {
      let choose_year = this.data.multiArray[e.detail.column][e.detail.value];
      console.log(choose_year);
      this.setData({
        choose_year
      })
    }
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    if (e.detail.column == 1) {
      let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
      let temp = [];
      if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { //判断31天的月份
        for (let i = 1; i <= 31; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 4 || num == 6 || num == 9 || num == 11) { //判断30天的月份
        for (let i = 1; i <= 30; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 2) { //判断2月份天数
        let year = parseInt(this.data.choose_year);
        console.log(year);
        if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
          for (let i = 1; i <= 29; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        } else {
          for (let i = 1; i <= 28; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        }
      }
      console.log(this.data.multiArray[2]);
    }
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },
  //获取时间日期
  bindMultiPickerChange2: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    const index = this.data.multiIndex;
    const year = this.data.multiArray[0][index[0]];
    const month = this.data.multiArray[1][index[1]];
    const day = this.data.multiArray[2][index[2]];
    const hour = this.data.multiArray[3][index[3]];
    const minute = this.data.multiArray[4][index[4]];
    // console.log(`${year}-${month}-${day}-${hour}-${minute}`);
    this.setData({
      time2: year + '-' + month + '-' + day + ' ' + hour + ':' + minute
    })

  },
  //监听picker的滚动事件
  bindMultiPickerColumnChange2: function (e) {
    //获取年份
    if (e.detail.column == 0) {
      let choose_year = this.data.multiArray[e.detail.column][e.detail.value];
      console.log(choose_year);
      this.setData({
        choose_year
      })
    }
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    if (e.detail.column == 1) {
      let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
      let temp = [];
      if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { //判断31天的月份
        for (let i = 1; i <= 31; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 4 || num == 6 || num == 9 || num == 11) { //判断30天的月份
        for (let i = 1; i <= 30; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 2) { //判断2月份天数
        let year = parseInt(this.data.choose_year);
        console.log(year);
        if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
          for (let i = 1; i <= 29; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        } else {
          for (let i = 1; i <= 28; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        }
      }
      console.log(this.data.multiArray[2]);
    }
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
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