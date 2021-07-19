// pages/person_page/add_address/add_address.js
const app = getApp();
// var localData = require("../../../utils/json.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [],
    multiIndex: [0, 0, 0],
    tag:[
      {
        thistag:'公司'
      },
      {
        thistag: '家'
      },
      {
        thistag: '学校'
      },
    ],
    tagSelected:0,
    moren:0,
    name:'',
    tell:'',
    area:'',
    addressTag:'',
  },
  nameInput:function(e){
    this.setData({
      name:e.detail.value
    })
  },
  tellInput:function(e){
    this.setData({
      tell: e.detail.value
    })
  },
  addressInput: function (e) {
    // console.log(e.detail.value)
    this.setData({
      area: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCity();
    this.setData({
      types: options.types ? options.types : 1,
    })
 
  },
  // 微信授权地址
  getLocation:function(){
    var that = this;
    wx.getLocation({//调用位置
      type: 'gjc02',
      success: function (res) {
        console.log(res)
        // wx.openLocation({//打开地图
        //   latitude: res.latitude,
        //   longitude: res.longitude,
        //   success:function(res){
        //     console.log(res)
            wx.chooseLocation({//选择位置
              success: function(res) {
                console.log(res)
                var arr = res.address.split('区')
                console.log(arr)
                wx.getStorage({
                  key: 'idNum',
                  success(res) {
                    that.setData({
                      name: res.data.nickName,
                      tell: res.data.mobile
                    })
                  },
                })
                that.setData({
                  address: res.name,
                  place: arr[0]+'区'
                })
              },
            })
        //   },
        // })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  //城市选择
  getCity:function(){
    var that = this;
    wx.showLoading({
      title: 'Loading...',
    })
    wx.request({
      url: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/images/json/cityDataArr.json',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();
        if(res.data){
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

  },
  chooseTag:function(e){
    // console.log(e.target.dataset.tagid);
    this.setData({
      tagSelected: e.target.dataset.tagid
    })
  },
  changeMoren:function(){
    if(this.data.moren == 0){
      this.setData({
        moren: 1
      })
    }else{
      this.setData({
        moren: 0
      })
    }
  },
  getTell:function(){
    wx.addPhoneContact({
      success:function(res) {
        console.log(res)
      }
    } )
  },
// 保存
  saveAddress:function(){
    var that = this;
    var city = '';
    
    let tagName = this.data.tag[this.data.tagSelected];
    console.log(this.data.multiIndex)
    console.log(this.data.multiIndex[0])
    console.log(this.data.multiIndex[1])
    if(this.data.types ==0 ){//微信授权
      var area = this.data.address;//详细地址
       city = that.data.place;//城市
    }else{//自己填选
      var area = that.data.area;//详细地址
      for (let i = 0; i < this.data.multiArray.length; i++) {
        city = city + this.data.multiArray[i][this.data.multiIndex[i]].name + ' ';
      }
    }
    //判断输入信息
    if (!this.data.name || !this.data.tell || !area ){
      wx.showModal({
        title: '提示',
        content: '请输入完整信息',
      })
      return;
    }
    //判断输入信息
    // if (this.data.multiIndex[0] == 0 && this.data.multiIndex[1] == 0 && this.data.multiIndex[2] == 0) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请选择地区',
    //   })
    //   return;
    // }

    //存入信息
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + '/api/myself/addAddress',
          data: {
            memberId:res.data.member_no,
            name: that.data.name,
            mobile: that.data.tell,
            region: city,
            address: area,
            isDefault: that.data.moren,
            slogin: tagName.thistag
          },
          method: 'POST',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (response) {
            // console.log(response);
            if (response.data.code==200){
              wx.showToast({
                title: response.data.data,
              })
              setTimeout(function(){
                wx.navigateBack({
                  delta: 1
                })
              },1000)
            }else{
              wx.showToast({
                title: response.message,
                icon:'none'
              })
            }
            
          }
        })
      },
    })

    

  }
})