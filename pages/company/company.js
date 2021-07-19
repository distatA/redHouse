// pages/person_page/certificate/personal/personal.js
const app = getApp();
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open: false,
    img1: '',
    img2: '',
    img3:'',
    arrList: [
      {
        name: "房产", num: 0, checked: false
      },
      {
        name: "家居", num: 1, checked: false
      },
      {
        name: "家电", num: 2, checked: false
      },
      {
        name: "其它", num: 3, checked: false
      },
    ],
    items: [
      { num: '1', value: '是' },
      { num: '0', value: '否', checked: 'true' },
    ],
    time: 0,
    customItem: '全部'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type,//0提交过 1尚未提交
      types: options.types,//1个人 2企业
    })
    var that = this;
    wx.getStorage({
      key: 'cityName',
      success: function (res) {
        that.setData({
          dingwei: res.data
        })
      },
      fail:function(){
        
      }
    })
    that.getCity()//城市
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
    
    if (this.data.type == 0) {
      this.getDetail()//详情
    }
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
  //详情
  getDetail: function () {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxGet(
          '/api/myRedAuth/details',
          {
            member_no: res.data.member_no,
            type: that.data.types,
          },
          function (data) {
            if (data.code == 200) {
              if (data.data.type_name != undefined){
                var type_name = data.data.type_name;
                var type_names = type_name.split(',')
              }
              var regions = []
              regions.push(data.data.province,data.data.city)
              console.log(regions)

              that.setData({
                details: data.data ? data.data : '',
                type_names: type_names,
                token: res.data.token,
                region: regions,
              })
            }
          }
        )
      },
    })
  },
  // 选择地址
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  //企业名称
  getnameValue: function (e) {
    this.setData({
      nameValue: e.detail.value
    })
  },
  //信用代码
  getcodeValue: function (e) {
    this.setData({
      codeValue: e.detail.value
    })
  },
  radioChange: function (e) {
    // 0否 1是
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      is_office: e.detail.value
    })
  },
  //手机号
  getphoneValue: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //短信验证码
  getwordValue: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  // 发送验证码
  getNum() {
    var that = this;
    var phone = that.data.phone;
    if (phone) {
      if (common.check_phone(phone)) {
        wx.getStorage({
          key: 'idNum',
          success: function (res) {
            wx.showLoading({
              title: '验证码发送中...',
            });
            // console.log(res)
            common.ajaxGet('/api/sms/sendCode',
              {
                mobile: phone,
                tplCode: 'SMS_172975116',
              },
              function (data) {
                if (data.code == 200) {
                  wx.hideLoading();
                  // 60秒倒计时
                  var time = 60;
                  let down = setInterval(() => {
                    time -= 1;
                    if (time >= 0) {
                      that.setData({
                        time: time
                      })
                    } else if (time < 0) {
                      that.setData({
                        time: 0
                      })
                    }
                  }, 1000);
                  wx.showToast({
                    title: data.data,
                  })
                }
              })
          }
        })
      } else {
        wx.showToast({
          title: '手机号有误',
          icon: 'none'
        })
      }
    } else {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
    }
  },
  // 提交
  sendAll: common.throttle(function (e) {
    var that = this;
    if (that.data.type == 0) {//修改
      console.log(that.data.nameValue, that.data.img1)
      
      var nameValue = that.data.nameValue == undefined ? that.data.details.name : that.data.nameValue;
      var codeValue = that.data.codeValue == undefined ? that.data.details.social_code : that.data.codeValue;
      var phone = !that.data.phone ? that.data.details.mobile : that.data.phone;
    
      var img1 = that.data.img1 == '' ? that.data.details.front_card : that.data.img1;
      var img2 = that.data.img2 == '' ? that.data.details.reverse_card : that.data.img2;
      var img3 = that.data.img3 == '' ? that.data.details.card_image : that.data.img3;
      
      var is_office = that.data.details.is_office;
      var provinces = that.data.multiArray[0][that.data.multiIndex[0]].code == "110000" ? that.data.details.province : that.data.multiArray[0][that.data.multiIndex[0]].name;
      var city = that.data.multiArray[1][that.data.multiIndex[1]].code == "110100" ? that.data.details.city : that.data.multiArray[1][that.data.multiIndex[1]].name;
    } else {//新用户
      // console.log(that.data.multiArray[1][that.data.multiIndex[1]].code == "110100")
    
      var nameValue = that.data.nameValue;
      var codeValue = that.data.codeValue;
      var phone = that.data.phone;
   
      var img1 = that.data.img1;
      var img2 = that.data.img2;
      var img3 = that.data.img3;
      var open = that.data.open;
      var is_office = that.data.is_office;
      var provinces = that.data.multiArray[0][that.data.multiIndex[0]].name;
      var city = that.data.multiArray[1][that.data.multiIndex[1]].name
    }
    if (nameValue != undefined) {
      if (codeValue != undefined) {
        if (codeValue.length==18) {
          if (img3 != '') {
          if (img1 != '') {
            if (img2 != '') {
              if (phone != '' && phone != undefined){
                if (common.check_phone(phone)) {
                // 提交请求
                wx.getStorage({
                  key: 'idNum',
                  success: function (res) {
                   
                    wx.request({
                      url: app.globalData.URL + '/api/myRedAuth/companyAuth',
                      data: {
                        front_card: img1,//身份证正面照片地址
                        reverse_card: img2,//身份证反面照片地址
                        license_url: img3,//执业照片
                        social_code: codeValue,//信用代码
                        member_no: res.data.member_no,
                        mobile: phone,
                        name: nameValue,
                        open_store: 0,//0不开店 1开店
                        type: 2,//1个人 2企业
                        type_name: '其它',//开店类型
                        province: provinces,
                        city: city,//that.data.dingwei,
                        is_office: 0,//是否为官方红人
                        id: that.data.details.id
                      },
                      method: 'POST',
                      header: {
                        "token": res.data.token,
                        'content-type': 'application/json'
                      },
                      success: function (res) {
                        // console.log(res.data)
                        if (res.data.code == 200) {
                          wx.showToast({
                            title: '提交成功',
                          })
                          setTimeout(function () {
                            wx.navigateBack({
                              delta: 1
                            })
                          }, 1500)
                        } else {
                          wx.showToast({
                            title: res.data.message,
                            icon: 'none'
                          })
                          
                        }

                      }
                    })
                  }
                })
                } else {
                  wx.showToast({
                    title: '手机号码有误',
                    icon: 'none'
                  })
                }
              }else{
                wx.showToast({
                  title: '请填写手机号码',
                  icon: 'none'
                })
              }
            } else {
              wx.showToast({
                title: '请上传身份证反面照片',
                icon: 'none'
              })
            }
          } else {
            wx.showToast({
              title: '请上传身份证正面照片',
              icon: 'none'
            })
          }
          } else {
            wx.showToast({
              title: '请上传营业执照',
              icon: 'none'
            })
          }
        } else {
          wx.showToast({
            title: '信用代码有误',
            icon: 'none'
          })
        }
      } else {
        wx.showToast({
          title: '请输入信用代码',
          icon: 'none'
        })
      }
    } else {
      wx.showToast({
        title: '请输入企业名称',
        icon: 'none'
      })
    }
    return false;

  },1000),
  //点击选择
  clickOn: function (e) {
    // 多选
    var id = e.currentTarget.id;
    var item = this.data.arrList[id];
    item.checked = !item.checked;
    var type_name = new Array();
    for (var i = 0; i < this.data.arrList.length; i++) {
      if (this.data.arrList[i].checked == true) {
        // type_name += this.data.arrList[i].name + ','
        type_name.push(this.data.arrList[i].name)
        var str = type_name.join(",");
      }
    }
    this.setData({
      arrList: this.data.arrList,
      type_name: str
    })


  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  // 登陆协议
  users: function (e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/user/user?id=' + id,
    })
  },
  //城市
  getCity: function () {
    var that = this;
    wx.showLoading({
      title: 'Loading...',
    })
    wx.request({
      url: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/images/json/cityDataArr.json',
      headers: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data) {
          var temp = res.data.data;
          //初始化更新数据
          that.setData({
            provinces: temp,
            multiArray: [temp, temp[0].citys, temp[0].citys[0].areas],
            multiIndex: [0, 0, 0]
          })
          // console.log(that.data.provinces);
        }
        // console.log(res.data.data);
      }
    })
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      multiIndex: e.detail.value
    })
  },
  //滑动
  bindMultiPickerColumnChange: function (e) {
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    //更新滑动的第几列e.detail.column的数组下标值e.detail.value
    data.multiIndex[e.detail.column] = e.detail.value;
    //如果更新的是第一列“省”，第二列“市”和第三列“区”的数组下标置为0
    if (e.detail.column == 0) {
      data.multiIndex = [e.detail.value, 0, 0];
    } else if (e.detail.column == 1) {
      //如果更新的是第二列“市”，第一列“省”的下标不变，第三列“区”的数组下标置为0
      data.multiIndex = [data.multiIndex[0], e.detail.value, 0];
    } else if (e.detail.column == 2) {
      //如果更新的是第三列“区”，第一列“省”和第二列“市”的值均不变。
      data.multiIndex = [data.multiIndex[0], data.multiIndex[1], e.detail.value];
    }
    var temp = this.data.provinces;
    data.multiArray[0] = temp;
    if ((temp[data.multiIndex[0]].citys).length > 0) {
      //如果第二列“市”的个数大于0,通过multiIndex变更multiArray[1]的值
      data.multiArray[1] = temp[data.multiIndex[0]].citys;
      var areaArr = (temp[data.multiIndex[0]].citys[data.multiIndex[1]]).areas;
      //如果第三列“区”的个数大于0,通过multiIndex变更multiArray[2]的值；否则赋值为空数组
      data.multiArray[2] = areaArr.length > 0 ? areaArr : [];
    } else {
      //如果第二列“市”的个数不大于0，那么第二列“市”和第三列“区”都赋值为空数组
      data.multiArray[1] = [];
      data.multiArray[2] = [];
    }
    //data.multiArray = [temp, temp[data.multiIndex[0]].citys, temp[data.multiIndex[0]].citys[data.multiIndex[1]].areas];
    //setData更新数据
    this.setData(data);
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

  },
  changeOpen: function () {
    let tempOpen = !this.data.open;
    this.setData({
      open: tempOpen
    })
  },
  selectPic: function () {
    let that = this;
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: function (res) {

        that.sendPic(res.tempFilePaths[0], 3);
      },
    })
  },
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
              "token": that.data.token,
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
              }else if(num === 3){
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
})