// pages/redHome/redHome.js
const app = getApp();
var common = require("../../utils/common.js");
var amapFile = require('../../utils/amap-wx.js');
var markersData = {
  latitude: '',//纬度
  longitude: '',//经度
  key: "4ada276712c47bf88a9cdc6d41248a2a"//申请的高德地图key
};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    menuList: [{
      name: "房产"
    }, {
      name: "居家"
    }],
    tabScroll: 0,
    currentTab: 0,
    menuLists:[
      {
      name:"房产"
      },
      {
        name: "生活"
      },
    ],
    imgHeight:420,
    currentTabs: 0,
    bnrUrl: [],
    isSearch:false,//是否显示房产搜索结果
    isSearchs:false,//生活搜索结果
    getUserInfoFail: true,
    display: 1,
    otherTrue:false,
    moneyist:[0.01,6.66,18.88,66.66,100,1.88],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      member: options.member,//红人
      scene: options.scene ? options.scene : '',//小程序码参数 'e4bce017c2ca4196aa14b6ab46e21dd7'
      member_share: options.member_share ? options.member_share:'',//分享人
    })
    wx.getSystemInfo({
      success: res => {
        this.setData({
          screenWidth: res.screenWidth
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
    
    var that = this;
    var scene = that.data.scene;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        that.setData({ getUserInfoFail: false, member_me: res.data.member_no })
        if (scene && scene != '' && scene != undefined) {  // 小程序码
          console.log('小程序码')
          that.getScene()
        }else{
          that.getRedNews()//红人信息

          that.getRedNote()//红人的笔记
          that.getHouse()//红人房产
          that.getLife()//生活
          // that.getGoods()//爆款好物
          that.getLook()
          that.getLookList()
        }
        
      },
      fail: function () {
        that.setData({ getUserInfoFail: true, })
      }
    })
  },
  //微信授权
  loginApp: function (data) {
    var that = this;
    var allMsg = data.detail.userInfo;

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.login({
            success: res => {
              console.log(res);
              var code = res.code;

              console.log(data);
              var member_no = that.data.member_nos ? that.data.member_nos : '';
              if (code) {

                wx.request({
                  url: app.globalData.URL + '/api/home/login',
                  data: {
                    code: code,
                    nickName: allMsg.nickName,
                    headUrl: allMsg.avatarUrl,
                    gender: allMsg.gender,
                    cityName: that.data.cityName,
                    member_no: member_no,
                  },
                  method: 'POST',
                  success: function (response) {
                    console.log(response)
                    if (response.data.code == 200) {
                      var numMsg = response.data.data;
                      if (numMsg.member_no) {
                        //存当前时间到本地存储
                        var timestamp = (new Date()).getTime();
                        wx.setStorageSync('time', timestamp)
                        wx.setStorage({
                          key: 'idNum',
                          data: numMsg,
                        });
                        console.log("登陆成功");
                        that.setData({
                          getUserInfoFail: false,
                        })
                        that.loadInfo()//位置授权                         
                      }
                      // 小程序码
                      if (that.data.scene && that.data.scene != '' && that.data.scene != undefined) {
                        that.getScene()
                      } else {
                        that.getRedNews()//红人信息
                        that.getRedNote()//红人的笔记
                        that.getHouse()//红人房产
                        that.getLife()//生活
                        that.getLook()
                        that.getLookList()
                      }
                     

                    } else {
                      wx.showToast({
                        title: response.data.message,
                        icon: 'none'
                      })
                    }
                  }
                })
              } else {
                console.log("登陆失败");
              }
            },
          })
        } else {
          that.setData({
            getUserInfoFail: true,
            loading: false
          })
        }
      }
    })
  },
  // 地理位置授权
  loadInfo: function () {
    var page = this;
    wx.getLocation({
      success: function (res) {
        var longitude = res.longitude
        var latitude = res.latitude
        page.loadCity(longitude, latitude)
        // console.log(res);
      },
      fail: function () {
        wx.getStorage({
          key: 'idNum',
          success: function (res) {
            common.ajaxGet(
              '/api/enjoy/updateCity', {
                city: '合肥市',
                memberNo: res.data.member_no,
              },
              function (res) {

              },
            )
          }
        })
        console.log('拒绝位置授权')
      }
    })
  },
  loadCity: function (longitude, latitude) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({ key: markersData.key });
    myAmapFun.getRegeo({
      location: '' + longitude + ',' + latitude + '',//location的格式为'经度,纬度'
      success: function (data) {
        wx.getStorage({
          key: 'idNum',
          success: function (res) {
            common.ajaxGet(
              '/api/enjoy/updateCity', {
                city: data[0].regeocodeData.addressComponent.city != '' ? data[0].regeocodeData.addressComponent.city : data[0].regeocodeData.addressComponent.province,
                memberNo: res.data.member_no,
              },
              function (res) {

              },
            )
          }
        })
        wx.setStorageSync("cityName", data[0].regeocodeData.addressComponent.city != '' ? data[0].regeocodeData.addressComponent.city : data[0].regeocodeData.addressComponent.province);
        // console.log(data);
        that.setData({
          cityName: data[0].regeocodeData.addressComponent.city != '' ? data[0].regeocodeData.addressComponent.city : data[0].regeocodeData.addressComponent.province,
        })
      }
    });

  },
  // 判断是否是扫码进来
  getScene: function () {
    var that = this;
    common.ajaxGet(
      '/api/create/getScene',
      {
        scene: that.data.scene,
      }, res => {
        if (res.code == 200) {
          var arr = res.data.split('&')
          console.log(arr)
          that.setData({
            member: arr[0],//红人的
          })
          wx.getStorage({
            key: 'idNum',
            success: function (res) {
              console.log(res.data);
              wx.request({
                url: app.globalData.URL + '/api/redAndOfficeGroup/redShop',
                data: {
                  member_no: arr[0],
                  member_no_other: res.data.member_no
                },
                method: 'GET',
                header: {
                  "token": res.data.token,
                  'content-type': 'application/json'
                },
                success: function (res) {
                  console.log(res.data.data)

                  if (res.data.data.mobile) {
                    var mobile = res.data.data.mobile;
                    var phone = mobile.substr(0, 3) + '****' + mobile.substr(7);
                  }

                  that.setData({
                    redNews: res.data.data,
                    phone: res.data.data.mobile,
                    phones: phone
                  })
                  if (res.data.data.redType == 0) {
                    that.getIt()//他社区
                  }
                  that.getRedNote()//红人的笔记
                  that.getHouse()//红人房产
                  that.getLife()//生活
                  that.getLook()
                  that.getLookList()
                }
              })
            }
            
          })

        }
      }
    )
  },
  // 红人信息
  getRedNews:function(){
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        console.log(res.data);
        wx.request({
          url: app.globalData.URL + '/api/redAndOfficeGroup/redShop',
          data: {
            member_no: that.data.member,//that.data.member
            member_no_other: res.data.member_no
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data.data)
            if (res.data.data.mobile){
              var mobile = res.data.data.mobile;
              var phone = mobile.substr(0, 3) + '****' + mobile.substr(7);
            }
            
            that.setData({
              redNews: res.data.data,
              phone: res.data.data.mobile,
              phones: phone
            })
            if (res.data.data.imageUrl){
              wx.getImageInfo({
                src: res.data.data.imageUrl,
                success(res) {
                  
                  var imgHeight = res.height/(res.width / that.data.screenWidth)
                  // console.log(imgHeight)
                 that.setData({
                   imgHeight: imgHeight
                 })
                }
              })
            }
            

            if (res.data.data.redType==0){
              that.getIt()//他社区
            }
         
          }
        })
      },
      fail: function () {
        wx.hideLoading()
        wx.showModal({
          content: '您尚未登陆，请先登陆',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/personal/personal',
              })
            } else if (res.cancel) {
              wx.navigateBack({
                
              })
            }
          }
        })
      }
    })
  },
  // 红人笔记
  getRedNote:function(){
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        // console.log(res.data);
        wx.request({
          url: app.globalData.URL + '/api/redAndOfficeGroup/redAndOfficeNoteHot',
          data: {
            member_no_other: that.data.member,
            member_no: res.data.member_no,
            pageIndex: 1,
            pageSize: 8,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {
            var newArr = res.data.data.list;

            for (let i = 0; i < newArr.length; i++) {
              newArr[i].isView = false;
              
              let now = parseInt(new Date().getTime()); //当前时间戳
              // 投票
              if (newArr[i].memberArtVote.start_at) {
                let start = new Date(newArr[i].memberArtVote.start_at.replace(/\-/g, "/")).getTime()
                let end = new Date(newArr[i].memberArtVote.end_at.replace(/\-/g, "/")).getTime()

                if (now < start) {
                  var isVote = 0;
                  var voteText = '投票尚未开始';

                } else if (start < now && now < end) {
                  console.log(Math.floor((end - now) / 1000 / 3600))
                  var isVote = 1;
                  var voteText = '还有' + Math.floor((end - now) / 1000 / 3600 % 24) + '小时结束';
                } else if (end < now) {
                  var isVote = 2;
                  var voteText = '投票已结束';
                }
                newArr[i].isVote = isVote;
                newArr[i].voteText = voteText;
                // 判断用户是否点过
                for (let j = 0; j < newArr[i].memberArtVote.list.length; j++) {
                  let list = newArr[i].memberArtVote.list
                  let arr = list.every(function (value) {
                    return value.target == 0
                  })
                  if (arr) {
                    newArr[i].memberArtVote.list[j].checked = false;//未投票
                    newArr[i].memberArtVote.list[j].chose = newArr[i].memberArtVote.chose;//1单选 2多选
                  } else {
                    newArr[i].memberArtVote.list[j].checked = true;//已投票
                    newArr[i].memberArtVote.list[j].chose = newArr[i].memberArtVote.chose;//1单选 2多选
                  }

                }

              }
            }

            that.setData({
              redNotes: newArr,
              totalNot: res.data.data.total
            })

          }
        })
      },
    })
  },
  //查看图片
  clickImg: function (event) {
    console.log(event)
    var index = event.currentTarget.id;
    var imgArr = new Array();
    imgArr.push(index);
    // console.log(imgArr)
    wx.previewImage({
      current: imgArr[index], //当前图片地址
      urls: imgArr, //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
// 更多笔记
  moreNote:function(){
    wx.navigateTo({
      url: '/pages/myNote/myNote?member=' + this.data.member,
    })
  },
  // 笔记详情
  noteDetail: function (e) {
    console.log(this.data.redNews)
    var noteId = e.currentTarget.id;
    var type = e.currentTarget.dataset.type;//1-小程序发布笔记 2-小程序发布文章 3-后台发布 4后台抓取
    var comment = e.currentTarget.dataset.comment;
    var like = e.currentTarget.dataset.like;
    var read = e.currentTarget.dataset.read;
    var flag = e.currentTarget.dataset.flag;
    var member = this.data.member;
    var time = e.currentTarget.dataset.time;
    var headUrl = this.data.redNews.headUrl;
    var nickName = this.data.redNews.nickName;
    var sign = this.data.redNews.sign;
    var img = e.currentTarget.dataset.img;//一张图片
    var imgs = e.currentTarget.dataset.imgs;//多张图片
    var video = e.currentTarget.dataset.video;
    var title = e.currentTarget.dataset.title;
    var love = this.data.redNews.flag;//是否收藏

    var spu = e.currentTarget.dataset.spu;
    var goods_name = e.currentTarget.dataset.goods_name;
    // var member_no = e.currentTarget.dataset.member_no;
    var choice = e.currentTarget.dataset.choice;

    // console.log(nickName, time,img)
    wx.navigateTo({
      url: '/pages/myNote_detail/myNote_detail?noteId=' + noteId + '&headUrl=' + headUrl + "&nickName=" + nickName + '&type=' + type + '&comment=' + comment + '&like=' + like + '&read=' + read + '&flag=' + flag + '&member=' + member + '&time=' + time + '&img=' + img + '&video=' + video + '&imgs=' + imgs + '&title=' + title + '&spu=' + spu + '&goods_name=' + goods_name  + '&choice=' + choice + '&love=' + love + '&sign=' + sign,
    })
  },
  // 投票选择
  onclicks(e) {
    var id = e.currentTarget.id;
    var target = e.currentTarget.dataset.target;
    var chose = e.currentTarget.dataset.chose;//1单选 2多选
    var item = e.currentTarget.dataset.item;
    var pid = e.currentTarget.dataset.pid;
    console.log('pid', pid)
    var checkedArr = [];
    for (let i = 0; i < item.length; i++) {
      if (item[i].checked) {
        checkedArr.push(item[i].checked)
      }
    }
    console.log(checkedArr)
    var that = this;

    if (target == 0) {//投票
      if (chose == 2) {//多选
        wx.getStorage({
          key: 'idNum',
          success: function (res) {
            var member_no = res.data.member_no;
            common.ajaxGet(
              '/api/noteAndArticle/vote', {
                id: id,
                art_id: pid,
                memberNo: member_no,
              },
              function (res) {
                console.log(res)
                that.getRedNote()//刷新
              },
            )
          }
        })
      } else {//单选
        if (checkedArr.length == 0) {
          wx.getStorage({
            key: 'idNum',
            success: function (res) {
              var member_no = res.data.member_no;
              common.ajaxGet(
                '/api/noteAndArticle/vote', {
                  id: id,
                  art_id: pid,
                  memberNo: member_no,
                },
                function (res) {
                  console.log(res)
                  that.getRedNote()//刷新
                },
              )
            }
          })
        } else {
          wx.showToast({
            title: '单选不可修改',
            icon: 'none'
          })
        }
      }

    } else {//取消投票
      wx.showModal({
        title: '您确定要取消投票吗?',
        content: '',
        success(res) {
          if (res.confirm) {//用户点击确定
            wx.getStorage({
              key: 'idNum',
              success: function (res) {
                common.ajaxGet(
                  '/api/noteAndArticle/delVote',
                  {
                    id: id,
                    memberNo: res.data.member_no,
                  },
                  function (res) {
                    console.log(res)
                    if (res.code == 200) {

                      that.getRedNote()//刷新
                    } else {
                      wx.showToast({
                        title: res.message,
                        icon: 'none'
                      })
                    }
                  }
                )
              }
            })
          } else if (res.cancel) {//用户点击取消
            console.log('用户点击取消')
          }
        }
      })
    }

    console.log(target)
  },
  onclicks1() {
    wx.showToast({
      title: '投票时间尚未开始',
      icon: 'none'
    })
  },
  onclickss() {
    wx.showToast({
      title: '投票时间已过期',
      icon: 'none'
    })
  },
//商品链接
  goodsDetails:function(e){
    var shopId = e.currentTarget.id; 
    var goods_name = e.currentTarget.dataset.goods_name;
    var member_no = e.currentTarget.dataset.member_no;
    var choice = e.currentTarget.dataset.choice;
    var member_share = this.data.member_share;
    if (member_share){
      var source = 2//有分享
    }else{
      var source = 1//无分享，直接购买
    }

    var comeFrom = 'home'
    if (choice==1){//房产
      wx.navigateTo({
        url: '/pages/huose/huose?shopId=' + shopId + '&category_id=' + choice + '&goods_name=' + goods_name + '&member_no=' + member_no+'&comeFrom=' + comeFrom,
      })
    }else{
      wx.navigateTo({
        url: '/pages/home_page/good_detail/good_detail?shopId=' + shopId + '&comeFrom=' + comeFrom + '&goods_name=' + goods_name + '&member_no=' + member_no + '&source=' + source,
      })
    }
    
  },
  // 广告详情
  viewBanner: function (e) {
    var id = e.currentTarget.id;//1.网址2.商品3.文章
    var appUrl = e.currentTarget.dataset.id;
    if (id == 2) {
      var arr = appUrl.split(',&')
      if (arr[1] == 1) {//房产
        wx.navigateTo({
          url: '/pages/huose/huose?shopId=' + arr[0] + '&member_no=' + this.data.member,
        })
      } else {
        wx.navigateTo({
          url: '/pages/home_page/good_detail/good_detail?shopId=' + arr[0] + '&member_no=' + this.data.member+'&source='+1,
        })
      }
    } else if (id == 1) {
      wx.navigateTo({//外链
        url: '/pages/pageH/pageH?url=' + appUrl,
      })
    } else if (id == 3) {//文章
      var newArr = appUrl.split(',&');
      console.log(newArr)
      wx.navigateTo({
        url: '/pages/myNote_detail/myNote_detail?nickName=' + newArr[0] + '&headUrl=' + newArr[1] + '&sign=' + newArr[2] + '&member_no=' + newArr[3] + '&noteId=' + newArr[4] + '&read=' + newArr[5] + '&comment=' + newArr[6] + '&like=' + newArr[7] + '&type=' + newArr[8] + '&flag=' + newArr[9] + '&time=' + newArr[10],
      })
    }
  },
  // 爆款好物
  getGoods:function(){
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        // console.log(res.data);
        wx.request({
          url: app.globalData.URL + '/api/redAndOfficeGroup/redAndOfficeGoodsHot',
          data: {
            member_no_other: that.data.member,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {
            that.setData({
              goodsList: res.data.data
            })
          }
        })
      },
    })
  },
  // 输入框
  getValue: function (e) {
    this.setData({
      moneyValue: common.checkInputText(e.detail.value)
    }) 
  },
  // 支付打赏生成订单
  pay(e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    var price ='';
    if (type==1){
      price = e.currentTarget.id
    }else if(type==2){
      price = that.data.moneyValue
    }
    //生成订单
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        var memberNo = res.data.member_no;
        wx.request({
          url: app.globalData.URL + '/api/reward/create',
          data: {
            type: 1,//1给红人打赏 2给笔记打赏
            article_id: '',
            price: price,//金额
            reward_member_no: memberNo,//我的
            member_no_other: that.data.member,//红人的
          },
          method: 'POST',
          header: {
            "token": res.data.token,
            "Content-Type": "application/json"
          },
          success: function (response) {
            
            wx.hideLoading();
            if (response.data.code == 200) {
              let result = response.data.data.wxPayMpOrderResult;
              wx.requestPayment({
                'timeStamp': result.timeStamp,
                'nonceStr': result.nonceStr,
                'package': result.packageValue,
                'signType': result.signType,
                'paySign': result.paySign,
                'success': function (res) {
                  wx.showToast({
                    title: '打赏成功',
                  })
                  that.setData({
                    display: 1
                  })
                  that.getRedNews()//刷新接口
                },
                'fail': function (res) {
                  wx.showToast({
                    title: '支付失败',
                    icon: 'none',
                  })
                },
              })
            } else {
              wx.showToast({
                title: response.data.message,
                icon: 'none'
              })
            }
          }
        })
      },
    })
  },
  // 围观
  getLook: function () {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        // console.log(res.data);
        wx.request({
          url: app.globalData.URL + '/api/redAndOfficeGroup/insertLook',
          data: {
            member_no_other: that.data.member,
            member_no: res.data.member_no,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {

          }
        })
      },
    })
  },
  // 围观
  getLookList: function () {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        // console.log(res.data);
        wx.request({
          url: app.globalData.URL + '/api/redAndOfficeGroup/listLook',
          data: {
            member_no_other: that.data.member,
            member_no: res.data.member_no,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {
            if(res.data.code==200){
              console.log(res.data)
              console.log(res.data.data.slice(0, 5))
              that.setData({
                listLook:res.data.data,
                listLooks: res.data.data.slice(0,5)
              })
            }
          }
        })
      },
    })
  },
  other(){
    this.setData({
      otherTrue:true
    })
  },
  back() {//固定金额
    this.setData({
      otherTrue: false
    })
  },
  //打赏
  dashang(){
    var rewardList = JSON.stringify(this.data.redNews.rewardList);
    if (this.data.member == this.data.member_me){
      wx.navigateTo({
        url: '/pages/dashang/dashang?rewardList=' + encodeURIComponent(rewardList)+'&type='+1
      })
    }
  },
  // 微信二维码展示
  wxCodes: function (e) {
    var id = e.currentTarget.id;
    if(id==1){
      if (this.data.redNews.expre12) {
        this.setData({
          display: 2,
          wxId:id
        })
      } else {
        wx.showToast({
          title: '暂未上传微信',
          icon: 'none'
        })
      }
    }else{
      this.setData({
        display: 2,
        wxId: id
      })
    }
    
  },
  // 关闭弹框
  closeZz: function (e) {
    this.setData({
      display: 1,
    })
  },
  //点击保存图片
  save() {
    let that = this
    //若二维码未加载完毕，加个动画提高用户体验
    wx.showToast({
      icon: 'loading',
      title: '正在保存图片',
      duration: 1000
    })
    //判断用户是否授权"保存到相册"
    wx.getSetting({
      success(res) {
        console.log(res)
        //没有权限，发起授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {//用户允许授权，保存图片到相册
              that.savePhoto();
            },
            fail() {//用户点击拒绝授权，跳转到设置页，引导用户授权
              wx.openSetting({
                success() {
                  wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success() {
                      that.savePhoto();
                    }
                  })
                }
              })
            }
          })
        } else {//用户已授权，保存到相册
          that.savePhoto()
        }
      }
    })
  },
  //保存图片到相册，提示保存成功
  savePhoto() {
    let that = this
    wx.downloadFile({
      url: that.data.redNews.expre12,
      success: function (res) {
        console.log(res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            console.log(res)
            wx.showToast({
              title: '保存成功',
            })
            setTimeout(function(){
              that.setData({
                display: 1,
              })
            },1000)
          }
        })
      }
    })
  },
  /// 保存图片
  btnCreate: function (obj) {
    wx.showLoading({
      title: "正在保存..."
    })
    wx.saveImageToPhotosAlbum({
      filePath: this.data.imagePath,
      success: res => {
        wx.hideLoading();
        this.catchtap(() => {
          wx.showToast({
            title: '保存成功'
          })
        });
      },
      fail: err => {
        wx.hideLoading();
        wx.showModal({
          title: '打开小程序相册授权',
          content: '请在设置中打开相册授权即可保存图片至相册',
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success: function (data) {
                  console.log("openSetting success");
                },
                fail: function (data) {
                  console.log("openSetting fail");
                }
              });
            } else if (res.cancel) {
              this.catchtap(() => {
                wx.showToast({
                  title: '保存失败',
                  icon: 'none'
                })
              });
            }
          }
        })
      }
    });
  },

  onImgOK(event) {
    console.log(event.detail.path)
    this.setData({
      imagePath: event.detail.path
    })
  },
  // 关注
  guanZhu:function(){
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        var member_no = res.data.member_no
        // console.log(res.data);
        wx.request({
          url: app.globalData.URL + '/api/redAndOfficeGroup/follow',
          data: {
            member_no_me: res.data.member_no,
            member_no_other: that.data.member,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {
            if (res.data.code == 200){
              if (that.data.redNews.flag == 0) {
                wx.showToast({
                  title: '关注成功',
                })
                //关注订阅消息提示
                wx.requestSubscribeMessage({
                  tmplIds: ['_uzRd2nWEjpRHMywdZuK2G3IbWIzWfW7Ornx3J5c_fk'],
                  success(res) {
                    common.ajaxPost(
                      '/api/wxMessgae/pushFollow',
                      {
                        memberNo: member,
                        nickName: nickName
                      },
                      function (res) {
                        console.log(res)

                      }
                    )
                  }
                })
                var data = {
                  action: 2,
                  chatMsg: {
                    msg: '通过红人主页关注了你',
                    send_user_id: member_no,//发送者
                    accept_user_id: that.data.member,//接受者
                    id: '',//消息的接受
                    accept_type: 0, //0-普通会员（包括红人）  1-商家
                    send_type: 0,//0-普通会员（包括红人）  1-商家
                    sign_flag: 0,//0 未签收 1 签收
                    msgType: 3 //3新增粉丝 
                  },
                  extend: 1,//扩展字段
                  extend_nother: ''
                }
                that.sendSocketMessage(data)
              } else if (that.data.redNews.flag == 1) {
                wx.showToast({
                  title: '取消关注',
                  icon: 'none'
                })
              }
              that.getRedNews()//红人信息
            } else {
              wx.showToast({
                title: res.data.message,
                icon:'none'
              })
            }
            
          }
        })
      },
    })
  },
  // 发送和接收 socket 消息
  sendSocketMessage: function (msg) {
    let that = this
    return new Promise((resolve, reject) => {
      app.sendSocketMessage(msg)
      app.globalData.callback = function (res) {
        console.log('收到服务器内容', res)
        resolve(res)
      }
    })
  },
 
  //收藏
  cang: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    // wx.showLoading({
    //   title: "加载中",
    //   mask: true
    // });
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.hideLoading();
        common.ajaxPost(
          '/api/myCollection/collection',
          {
            collect_id: id,
            collect_type: 3,//'1-商品  2-笔记 3-店铺'
            member_no: res.data.member_no
          },
       
          function (data) {
            // console.log(data)
            if (data.code == 200) {
              if (that.data.shouCang) {
                wx.showToast({
                  title: "取消收藏",
                })
                that.setData({
                  shouCang: false
                })
              } else {
                wx.showToast({
                  title: "收藏成功",
                })
                that.setData({
                  shouCang: true
                })
              }
              that.getRedNews()//
            }
          }
        )
      },
    })
  },
  // 红人好物轮播图
  getImg:function(){
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        // console.log(res.data);
        wx.request({
          url: app.globalData.URL + '/api/redAndOfficeGroup/redAndOfficeImage',
          data: {
            member_no_other: that.data.member,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {

            that.setData({
              bnrUrl: res.data.data
            })

          }
        })
      }
    })
  },
  // 红人房产
  getHouse: function (){
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + '/api/redAndOfficeGroup/redAndOfficeHouse',
          data: {
            member_no_other: that.data.member,
            member_no: res.data.member_no,
            pageIndex:1,
            pageSize: 10
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {

            that.setData({
              houseList: res.data.data.list,
              pageIndex: res.data.data.pageNum,
              pages: res.data.data.pages,
              totalHuose: res.data.data.total
            })
            if (res.data.data.list.length == 0) {
              that.setData({
                currentTabs: 1
              })
            }

          }
        })
      }
    })
  },
  //收藏商品
  cang1: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    var flag = e.currentTarget.dataset.flag
    // wx.showLoading({
    //   title: "加载中",
    //   mask: true
    // });
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.hideLoading();
        common.ajaxPost(
          '/api/myCollection/collection',
          {
            collect_id: id,
            collect_type: 1,//'1-商品  2-笔记 3-店铺'
            member_no: res.data.member_no
          },
          function (data) {
            // console.log(data)
            if (data.code == 200) {
              if (flag == 0) {
                wx.showToast({
                  title: "收藏成功",
                })

              } else {
                wx.showToast({
                  title: "取消收藏",
                })

              }
              that.getHouse()
            }
          }
        )
      },
    })
  },
  // 好物生活
  getLife: function (){
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + '/api/redAndOfficeGroup/redAndOfficeGoods',
          data: {
            member_no_other: that.data.member,
            pageIndex: 1,
            pageSize: 10
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {
            that.setData({
              lifeList: res.data.data.list,
              pageIndex2: res.data.data.pageNum,//当前页
              pages2: res.data.data.pages,//总页数
              totalGoods: res.data.data.total
            })

          }
        })
      }
    })
  },
//房产详情页
  huose:function(e){
    var shopId = e.currentTarget.id;
    var goods_name = e.currentTarget.dataset.goods_name;
    var comeFrom = 'home'
    wx.navigateTo({
      url: '/pages/huose/huose?shopId=' + shopId + '&comeFrom=' + comeFrom + '&goods_name=' + goods_name + '&member_no=' + this.data.member,
    })
  },
//商品详情
goodDetail:function(e){
  var shopId = e.currentTarget.id;
  var goods_name = e.currentTarget.dataset.goods_name;
  var comeFrom = 'home'
  var type = e.currentTarget.dataset.type;
  var member_share = this.data.member_share;
  if (member_share) {
    var source = 2//有分享
  } else {
    var source = 1//无分享，直接购买
  }

  if (type == 1) {
    wx.navigateTo({
      url: '/pages/huose/huose?shopId=' + shopId + '&goods_name=' + goods_name + '&member_no=' + this.data.member + '&comeFrom=' + comeFrom,
    })
  } else {
    wx.navigateTo({
      url: '/pages/home_page/good_detail/good_detail?shopId=' + shopId + '&comeFrom=' + comeFrom + '&goods_name=' + goods_name + '&member_no=' + this.data.member + '&source=' + source,
    })
  }
},
  // TA社区
  getIt: function (){
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + '/api/redAndOfficeGroup/redAndOfficeNote',
          data: {
            member_no_other: that.data.member,
            member_no: res.data.member_no,
            pageIndex: 1,
            pageSize: 10
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data.data.list)
            that.setData({
              sheQu: res.data.data.list,
              pageIndex3: res.data.data.pageNum,
              pages3: res.data.data.pages,
              totalNot: res.data.data.total,
            })
          }
        })
      }
    })
  },
  // 房产搜索
  getInputValue: function (e) {
    console.log(e)
    this.setData({
      searchValue: e.detail.value
    })
  },
  toSearch: function (e) {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        // console.log(res.data);
        wx.request({
          url: app.globalData.URL + '/api/redAndOfficeGroup/houseSearch',
          data: {
            searchName: that.data.searchValue,
            member_no_other: that.data.member,
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
              isSearch: true,
              searchList: res.data.data
            })
            console.log(that.data.isSearch)
          }
        })
      }
    })
  },
  // 生活搜索
  getInputValues: function (e) {
    this.setData({
      searchValues: e.detail.value
    })
  },
  toSearchs: function (e) {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        // console.log(res.data);
        wx.request({
          url: app.globalData.URL + '/api/redAndOfficeGroup/lifeSearch',
          data: {
            searchName: that.data.searchValues,
            member_no_other: that.data.member,
            pageIndex: 1,
            pageSize: 50
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data.data.list)
            that.setData({
              isSearchs: true,
              searchLists: res.data.data.list
            })
            console.log(that.data.isSearchs)
          }
        })
      }
    })
  },
  clickMenus: function (e) {

    var id = e.currentTarget.id;
    this.setData({
      currentTabs: id
    })

  },
  // 立即购买
  buyNow(e) {
    var that = this;

    console.log(that.data.goodsList[e.currentTarget.id])
    let thisGood = that.data.goodsList[e.currentTarget.id];
    that.skipGoodDetail(thisGood)
  },
  skipGoodDetail: function (event) {
    console.log(event);
    var comeFrom = 'home'
    if (event.category_choice == 1 ) {//房产
      wx.navigateTo({
        url: '/pages/huose/huose?shopId=' + event.spu_no + '&comeFrom=' + comeFrom + '&goods_name=' + event.goods_name + '&goods_stock=' + event.goods_stock + '&goods_rest_stock=' + event.goods_rest_stock + '&member_no=' + event.member_no,
      })

    } else if (event.category_choice > 1 && event.open_group == 1) {
      console.log("跳转商品团购");
    } else if (event.category_choice > 1 && event.open_group == 0) {
      console.log("跳转单独购买");
      wx.navigateTo({
        url: '../home_page/good_detail/good_detail?shopId=' + event.spu_no + '&comeFrom=' + comeFrom + '&goods_name=' + event.goods_name + '&category_id=' + event.category_choice + '&end_time=' + event.end_time + '&member_no=' + event.member_no,
      })
    } else {
      wx.showToast({
        title: '数据错误',
        icon: 'none'
      })
      // console.log("数据错误");
    }
    // console.log(event);
  },
  //获取好物轮播图
  getIndexData: function () {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        // console.log(res.data);
        wx.request({
          url: app.globalData.URL + '/api/enjoy/homeImage',
          data: {
            city: that.data.dingwei,
            bySource: 1
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (response) {
            // console.log(response.data.data);
            that.setData({
              bnrUrl: response.data.data
            })

          }
        })
      },
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
    let that = this;
    var pageIndex = that.data.pageIndex;//总页数
    var pages = that.data.pages;//当前页

        if (that.data.currentTabs == 0) {//好物房产
          if (pageIndex < pages){
            wx.getStorage({
              key: 'idNum',
              success: function (res) {
                wx.request({
                  url: app.globalData.URL + '/api/redAndOfficeGroup/redAndOfficeHouse',
                  data: {
                    member_no_other: that.data.member,
                    member_no: res.data.member_no,
                    pageIndex: pageIndex + 1,
                    pageSize: 10
                  },
                  method: 'GET',
                  header: {
                    "token": res.data.token,
                    'content-type': 'application/json'
                  },
                  success: function (res) {
                    that.setData({
                      houseList: (that.data.houseList).concat(res.data.data.list),
                      pageIndex: res.data.data.pageNum,
                      pages: res.data.data.pages
                    })

                  }
                })
              }
            })
          }else{
            wx.showToast({
              title: "暂无更多数据",
              icon: "none"
            })
          }
        } else if (that.data.currentTabs == 1) {//好物生活
          if (that.data.pageIndex2 < that.data.pages2){
            wx.getStorage({
              key: 'idNum',
              success: function (res) {
                wx.request({
                  url: app.globalData.URL + '/api/redAndOfficeGroup/redAndOfficeGoods',
                  data: {
                    member_no_other: that.data.member,
                    pageIndex: that.data.pageIndex2 + 1,
                    pageSize: 10
                  },
                  method: 'GET',
                  header: {
                    "token": res.data.token,
                    'content-type': 'application/json'
                  },
                  success: function (res) {
                    that.setData({
                      lifeList: (that.data.lifeList).concat(res.data.data.list),
                      pageIndex2: res.data.data.pageNum,//当前页
                      pages2: res.data.data.pages,//总页数
                    })

                  }
                })
              }
            })
          }
          // else{
          //   wx.showToast({
          //     title: "暂无更多数据2",
          //     icon: "none"
          //   })
          // }
          
        }
    
    
     
  },
  // 拨打电话
  calling: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
    var that = this;
    var member_no = that.data.member_nos;//分享人的userid
    if (that.data.redNews.redType == 0){
      var title = that.data.redNews.nickName + '的主页';
    }else{
      var title = '红人名片-'+that.data.redNews.nickName ;
    }
    return {
      title: title,
      path: '/pages/redHome/redHome?member=' + that.data.member +'&member_share='+ member_no,
      imageUrl: '',
      success: function (res) {
        console.log('分享成功')
        // 分享成功
      },
      fail: function (res) {
        console.log('分享失败')
        // 分享失败
      }
    }
  }

})