// pages/home/home.js
//赶紧走吧,这公司呆不了,我是过来人,老板是真ex~
const app = getApp();
var common = require("../../utils/common.js");
var amapFile = require('../../utils/amap-wx.js');
var markersData = {
  latitude: '',//纬度
  longitude: '',//经度
  key: "4ada276712c47bf88a9cdc6d41248a2a"//申请的高德地图key
};
Page({
  data: {
    topbgurl: ['https://firsthouse.oss-cn-shanghai.aliyuncs.com/blog/2019-12-03/3134537c3f8c41d6a1e446d58df10bae-tmp_da68e86c008f59c4d741e9124ebe2dbb.jpg'],
    dingwei: '',
    isFocus: false,
    searchValue: '',
    currentTopTap: 0,
    menuList: [{
      name: "优享",
      num: 0
    }, {
      name: "红人团",
      num: 1
    }, {
      name: "官方团",
      num: 2
    }],  //导航栏的tab
    tabList: [
      {
        id: 0,
        name: '房产'
      },
      {
        id: 1,
        name: '京东'
      },
      // {
      //   id: 2,
      //   name: '居家'
      // },
    ], //优享的三个tab
    currentTab: 0,
    star: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/images/home/star1_0.png',
    bnrUrl: [],//轮播图
    pageIndex: 1,
    pageSize: 5,
    recommendation: [],
    isFixed: false, //是否开启粘性定位
    hrAllList: [],//红人，官方列表
    display: 1,
    JDcurrent: 0, //京东的分类tab
    extraData: {
      from: '优享新可能nav'
    },
    JDimg: app.globalData.JDimg,
    JDcategory: [
      {
        name: '家用电器',
        url: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/1155Icon/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20201125192101.png'
      }, {
        name: '家居日用',
        url: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/1155Icon/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20201125192055.png'
      }, {
        name: '厨具',
        url: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/1155Icon/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20201125192127.png'
      }, {
        name: '母婴',
        url: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/1155Icon/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20201125192139.png'
      }, {
        name: '美妆',
        url: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/1155Icon/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20201125192132.png'
      }, {
        name: '食品',
        url: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/1155Icon/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20201125192106.png'
      }, {
        name: '个人清洁',
        url: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/1155Icon/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20201125192034.png'
      }, {
        name: '服饰鞋靴',
        url: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/1155Icon/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20201125192150.png'
      }, {
        name: '箱包皮具',
        url: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/1155Icon/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20201125192144.png'
      }, {
        name: '运动户外',
        url: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/1155Icon/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20201125192046.png'
      }, {
        name: '宠物生活',
        url: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/1155Icon/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20201125192121.png'
      },
      {
        name: '数码科技',
        url: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/1155Icon/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20201125192113.png'
      }
    ], //JD分类的数组
    JDlist: [], //JD商品数组
    JDpageNum: 1,
    JDpageSize: 10,
    JDcurrentName: '家用电器', //关键字
  },
  // 页面滚动事件
  onPageScroll: function (e) {
    this.getToTop()
  },
  /*
   * 获取距离顶部距离,如果小于自身盒子高度则开始吸顶 
   */
  getToTop() {
    wx.createSelectorQuery().select('#tap').boundingClientRect(rect => {
      rect && rect.top < 35 ? this.setData({ isFixed: true }) : this.setData({ isFixed: false })
    }).exec()
  },
  // 获取分类列表信息
  getJDcategoryData(keyWords, pageNum = this.data.JDpageNum, pageSize = this.data.JDpageSize) {
    common.axios({
      url: '/api/jd/itemList',
      data: {
        pageNum,
        pageSize,
        keyWords
      }
    }).then(res => {
      
      let JDlist = res.data.data.searchgoodsResult.result.queryVo
      JDlist = JDlist.map(v => {
        v.backMoney = Number(v.price * v.commisionRatioWl / 100).toFixed(2)
        return v
      })
      this.setData({ JDlist })
    })
  },
  // 跳转京东详情
  toJDdetail(e) {
    let { skuId, backMoney, commisionRatioWl, qtty30 ,price} = e.currentTarget.dataset.item
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        let data = JSON.stringify({
          skuId,
          backMoney,
          commisionRatioWl,
          qtty30,
          price
        })
        wx.navigateTo({ url: `../../packageA/JDdetail/index?data=${data}` })
      },
      fail: function () {
        wx.showModal({
          content: '您尚未登陆，请先登陆',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/personal/personal',
              })
            } else if (res.cancel) {
            }
          }
        })
      }
    })
  },
  onLoad: function (options) {
    console.log(options)  ;
    console.log(app.globalData.member_no);
    
    var that = this;
    if (options.city) {//配置城市主页

      that.setData({
        dingwei: options.city + '市',
        dingweis: options.city,
      })
    }else if (options.member_no){
      //邀请人的id
      app.globalData.inviteMember_no = options.member_no
    } 
    else {
      // 判断用户是否登陆
      wx.getStorage({
        key: 'idNum',
        success: function (data) {
          app.globalData.member_no = data.data.member_no;
          app.globalData.token = data.data.token;
          // 地理位置
          that.setData({
            dingwei: data.data.city,
            dingweis: data.data.city.split('市')[0]
          })
          if (data.data.city != '合肥' && data.data.city != '合肥市') {
            that.loadInfo()
          }
        },
        fail: function () {
          that.setData({
            dingwei: '合肥市',
            dingweis: '合肥',
          })
        }
      })
    }

    setTimeout(function () {
      that.getIndexData1();//获取首页开屏广告  
      that.getJDcategoryData(that.data.JDcurrentName) //获取JD的数据信息
    }, 500)

    this.roomList()// 房间列表
  },
  onShow: function () {
    wx.showTabBar()
    // 获取上个页面参数
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    if (currPage.data.dingwei != '') {
      this.setData({//将携带的参数赋值
        dingwei: currPage.data.dingwei,
        dingweis: currPage.data.dingwei.split('市')[0]
      });
      // 地理位置
      wx.setStorage({
        key: 'cityName',
        data: currPage.data.dingwei
      })
    }
    var that = this;
    setTimeout(function () {
      that.getIndexData(1);//获取首页轮播图
      that.getHuose()//房产推荐
      that.getRedListArticle()//红人文章
      // that.getJDcategoryData(that.data.JDcurrentName)
    }, 100)
  },
  // 选择京东商品的分类
  changeJDcategory(e) {
    const { index, name } = e.currentTarget.dataset
    this.setData({
      JDpageNum : 1,
      JDcurrent: index,
      JDcurrentName: name
    })
    this.getJDcategoryData(name)
  },
  // 门头扫码
  scan() {
    wx.getFileSystemManager().readFile({
      filePath: '',
      encoding: 'base64',
      success: res => {
      }
    })
  },

  toMiniProgramSuccess(res) {
    //从其他小程序返回的时候触发
    wx.showToast({
      title: '通过超链接跳转其他小程序成功返回了'
    })
  },
  navigateToMiniProgram() {
    wx.navigateToMiniProgram({
      appId: 'wx787c7dbe01af57c6',
      path: 'pages/invitation2/invitation2?id=12',
      extraData: {
        from: 'bar'
      },
      envVersion: 'develop',
      success(res) {
        // 打开其他小程序成功同步触发
        wx.showToast({
          title: '跳转成功'
        })
      }
    })
  },
  // 房间列表
  roomList: function () {
    var that = this;
    wx.request({
      url: app.globalData.URL + '/api/live/roomList',
      data: {
        pageIndex: 0,
        pageSize: 100
      },
      method: 'GET',
      success: function (data) {
        if (data.data.code == 200) {
          if (data.data.data.room_info && data.data.data.room_info.length > 4) {
            var arr = data.data.data.room_info.slice(0, 4);
            for (let i = 0; i < arr.length; i++) {
              var start = common.timeFormat(data.data.data.room_info[i].start_time * 1000);
              arr[i].start_time = start;
            }
            that.setData({
              roomList: arr,
            })
          }
        }
      }
    })
  },

  //跳转直播间
  roomLive: function (e) {
    let status = e.currentTarget.dataset.status;
    let title = e.currentTarget.dataset.title;
    let head = e.currentTarget.dataset.head;
    let name = e.currentTarget.dataset.name;

    let roomId = e.currentTarget.id; // 房间号
    let customParams = { pid: 1 }
    /**
     * 开发者在直播间页面路径上携带自定义参数，后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节
     * 
     */
    if (status == 103) {
      wx.navigateTo({
        url: '/pages/roomVideo/roomVideo?roomId=' + roomId + '&title=' + title + '&head=' + head + '&name=' + name,
      })
    } else {
      wx.navigateTo({
        url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${encodeURIComponent(JSON.stringify(customParams))}`
      })
    }
  },
  // 更多直播列表
  roomLists: function () {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.navigateTo({
          url: '/pages/roomLists/roomLists?dingwei=' + that.data.dingwei,
        })
      },
      fail: function () {
        wx.showModal({
          content: '您尚未登陆，请先登陆',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/personal/personal',
              })
            } else if (res.cancel) {
            }
          }
        })
      }
    })
    // 
  },
  // 地理位置授权
  loadInfo: function () {
    var that = this;
    wx.getLocation({
      success: function (res) {
        var longitude = res.longitude
        var latitude = res.latitude
        that.loadCity(longitude, latitude)
      },
    })
  },
  loadCity: function (longitude, latitude) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({ key: markersData.key });
    myAmapFun.getRegeo({
      location: '' + longitude + ',' + latitude + '',//location的格式为'经度,纬度'
      success: function (data) {
        wx.setStorageSync("cityName", data[0].regeocodeData.addressComponent.city);
        wx.showModal({
          content: '您定位显示您在' + (data[0].regeocodeData.addressComponent.city != '' ? data[0].regeocodeData.addressComponent.city : data[0].regeocodeData.addressComponent.province) + '，' + '是否切换为' + (data[0].regeocodeData.addressComponent.city != '' ? data[0].regeocodeData.addressComponent.city : data[0].regeocodeData.addressComponent.province) + '?',
          success(res) {
            if (res.confirm) {
              that.setData({
                dingwei: data[0].regeocodeData.addressComponent.city != '' ? data[0].regeocodeData.addressComponent.city : data[0].regeocodeData.addressComponent.province,
                dingweis: data[0].regeocodeData.addressComponent.city != '' ? data[0].regeocodeData.addressComponent.city.split('市')[0] : data[0].regeocodeData.addressComponent.province.split('市')[0],
              })
              that.getIndexData(1);//获取首页轮播图
              that.getRecommendation();//好物推荐
              that.getRedListArticle()//红人文章
              that.getIndexData1();//获取首页开屏广告
            } else if (res.cancel) {
              that.setData({
                dingwei: that.data.dingwei,
                dingweis: that.data.dingwei.split('市')[0]
              })
            }
          }
        })

      }
    });

  },

  //  关闭弹窗
  close: function (e) {
    this.setData({
      display: 2,
    })
    wx.showTabBar()
  },
  /* 弹窗的时候 阻止冒泡 */
  myCatchTouch: function () {
    return;
  },
  //优享的tab菜单切换
  change(e) {
    const currentTopTap = e.currentTarget.dataset.id
    this.setData({
      currentTopTap
    })
    switch (currentTopTap) {
      case 0:
        this.getJDcategoryData(this.data.JDcurrentName)
        break;
      case 1:
        this.getHuose()
        break;
      case 2:
        this.getRecommendation()
        break;
    }
  },
  // 广告详情
  viewBanner: function (e) {
    var id = e.currentTarget.id;//1.网址2.商品3.文章 4.专题 6黑卡 7其它小程序
    var appUrl = e.currentTarget.dataset.id;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        if (appUrl) {
          if (id == 2) {
            var arr = appUrl.split(',&')
            if (arr[1] == 1) {//房产
              wx.navigateTo({
                url: '/pages/huose/huose?shopId=' + arr[0],
              })
            } else {
              wx.navigateTo({
                url: '/pages/home_page/good_detail/good_detail?shopId=' + arr[0],
              })
            }
          } else if (id == 1) {
            if (!appUrl) {
            } else {
              wx.navigateTo({//外链
                url: '/pages/pageH/pageH?url=' + appUrl,
              })
            }
          } else if (id == 3) {//文章
            var newArr = appUrl.split(',&');
            wx.navigateTo({
              url: '/pages/myNote_detail/myNote_detail?nickName=' + newArr[0] + '&headUrl=' + newArr[1] + '&sign=' + newArr[2] + '&member_no=' + newArr[3] + '&noteId=' + newArr[4] + '&read=' + newArr[5] + '&comment=' + newArr[6] + '&like=' + newArr[7] + '&type=' + newArr[8] + '&flag=' + newArr[9] + '&time=' + newArr[10],
            })
          } else if (id == 4) {//专题
            wx.navigateTo({//外链
              url: '/pages/actieve/actieve?id=' + appUrl,
            })
          } else if (id == 6) {//黑卡
            wx.navigateTo({
              url: '/pages/banCard/banCard?id=' + appUrl + '&type=' + 1,
            })

          } else if (id == 7) {//第六空间小程序
            if (!appUrl) {
              // wx.showToast({
              //   title: '地址为空',
              //   icon: 'none'
              // })
            } else {
              wx.navigateToMiniProgram({
                appId: 'wx787c7dbe01af57c6',
                path: appUrl,//'pages/invitation2/invitation2?id=12',
                extraData: {
                  from: '12'
                },
                envVersion: 'release',//测试develop 正式：release
                success(res) {
                  // 打开其他小程序成功同步触发
                  wx.showToast({
                    title: '跳转成功'
                  })
                }
              })
            }
          }
        } else {
          return
        }
      },
      fail: function () {
        wx.showModal({
          content: '您尚未登陆，请先登陆',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/personal/personal',
              })
            } else if (res.cancel) {
            }
          }
        })
      }
    })

  },
  // 城市选择
  getCity: function () {
    wx.navigateTo({
      url: '/pages/cityList/cityList',
    })
  },
  //获取首页轮播图
  getIndexData: function (bySource = 1) {
    
    var that = this;
    wx.request({
      url: app.globalData.URL + '/api/enjoy/homeImage',
      data: {
        city: that.data.dingwei,
        bySource: bySource,//0首页开屏广告
      },
      method: 'GET',
      success: function (res) {
        console.log('首页轮播图', res);
        if (res.data.code == 200) {
          that.setData({
            bnrUrl: res.data.data
          })
          wx.setStorage({
            key: 'city',
            data: that.data.dingwei
          })
        }
      }
    })


  },
  //获取首页开屏广告
  getIndexData1: function () {
    var that = this;
    wx.request({
      url: app.globalData.URL + '/api/enjoy/homeImage',
      data: {
        city: that.data.dingwei,
        bySource: 0,//0首页开屏广告
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 200) {
          if (res.data.data.length > 0) {
            that.setData({
              bnrUrlImg: res.data.data ? res.data.data : ''
            })
            // wx.hideTabBar()//隐藏底部
          }
          wx.setStorage({
            key: 'city',
            data: that.data.dingwei
          })
        }
      }
    })
  },
  //红人文章（榜单）
  getRedListArticle: function () {
    var that = this;
    wx.request({
      url: app.globalData.URL + 'api/enjoy/redList',
      data: {
        cityName: that.data.dingwei,
        member_no: '',
        pageIndex: 1,
        pageSize: 1
      },
      method: 'GET',
      success: function (response) {
        if (response.data.code == 200) {
          that.setData({
            hongren: response.data.data.list,

          })
        }
      }
    })
  },
  //最新三条的跳转
  toPgae(e){
    console.log(e);
let {comment_num , category_choice , flag , id , like_num , read_num ,type ,title} = e.currentTarget.dataset.item
    let noteId = id
    let comment = comment_num;
    let like = like_num;
    let read = read_num;
    let choice = category_choice;
    wx.navigateTo({
      url: '/pages/myNote_detail/myNote_detail?noteId=' + noteId + '&headUrl=' + '' + "&nickName=" + '' + '&type=' + type + '&comment=' + comment + '&like=' + like + '&read=' + read + '&flag=' + flag + '&member=' + '' + '&time=' + '' + '&img=' + '' + '&video=' + '' + '&imgs=' + '' + '&title=' + title + '&spu=' + '' + '&goods_name=' + '' + '&member_no=' + '' + '&choice=' + choice,
    })
  },
  // 跳转到红人店铺
  redHome: function (e) {
    var member = e.currentTarget.id;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.navigateTo({
          url: '/pages/redHome/redHome?member=' + member,
        })
      },
      fail: function () {
        wx.showModal({
          content: '您尚未登陆，请先登陆',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/personal/personal',
              })
            } else if (res.cancel) {
            }
          }
        })
      }
    })

  },
  // 跳转到红人店铺
  redHomes: function (e) {
    var member = e.currentTarget.id;
    var type = e.currentTarget.dataset.type;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        if (type == 1) {
          wx.navigateTo({
            url: '/pages/redHome/redHome?member=' + member,
          })
        } else {
          wx.navigateTo({
            url: '/pages/shopHome/shopHome?merchant_no=' + member,
          })
        }
      },
      fail: function () {
        wx.showModal({
          content: '您尚未登陆，请先登陆',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/personal/personal',
              })
            } else if (res.cancel) {
            }
          }
        })
      }
    })

  },
  // 笔记详情
  noteDetail: function (e) {
    var noteId = e.currentTarget.id;
    var type = e.currentTarget.dataset.type;//1-小程序发布笔记 2-小程序发布文章 3-后台发布 4后台抓取
    var comment = e.currentTarget.dataset.comment;
    var like = e.currentTarget.dataset.like;
    var read = e.currentTarget.dataset.read;
    var flag = e.currentTarget.dataset.flag;
    var headUrl = e.currentTarget.dataset.headurl;
    var nickName = e.currentTarget.dataset.nickname;
    var sign = e.currentTarget.dataset.sign;
    var member = this.data.member;
    var time = e.currentTarget.dataset.time;

    wx.navigateTo({
      url: '/pages/myNote_detail/myNote_detail?noteId=' + noteId + '&headUrl=' + headUrl + "&nickName=" + nickName + '&sign=' + sign + '&type=' + type + '&comment=' + comment + '&like=' + like + '&read=' + read + '&flag=' + flag + '&member=' + member + '&time=' + time,
    })
  },
  getInputValue: function (e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
  //商品链接
  goodsDetails: function (e) {
    var shopId = e.currentTarget.id;
    var goods_name = e.currentTarget.dataset.goods_name;
    var member_no = e.currentTarget.dataset.id;
    var comeFrom = 'home'
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.navigateTo({
          url: '/pages/home_page/good_detail/good_detail?shopId=' + shopId + '&comeFrom=' + comeFrom + '&goods_name=' + goods_name + '&member_no=' + member_no,
        })
      },
      fail: function () {
        wx.showModal({
          content: '您尚未登陆，请先登陆',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/personal/personal',
              })
            } else if (res.cancel) {
            }
          }
        })
      }
    })

  },
  // 查看榜单
  redRanking: function () {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.navigateTo({
          url: '/pages/redRanking/redRanking?dingwei=' + that.data.dingwei,
        })
      },
      fail: function () {
        wx.showModal({
          content: '您尚未登陆，请先登陆',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/personal/personal',
              })
            } else if (res.cancel) {
            }
          }
        })
      }
    })
  },
  // 搜索
  toSearch: function (e) {
    var cityName = this.data.dingwei;
    wx.navigateTo({
      url: '/pages/search/search?cityName=' + cityName,
    })
  },
  // 导航菜单点击
  clickMenu: function (e) {
    var current = e.currentTarget.dataset.current //获取当前tab的index
    this.setData({ currentTab: current, bnrUrl: [] })
    if (current == 1) {
      this.getHrList(1);//调用红人团列表
      this.getIndexData(2)//红人团轮播图
    } else if (current == 2) {
      // this.getHrList(2);//调用红人团列表
      this.guan()//官方团
      this.getIndexData(3)//红人团轮播图
    }

  },
  // 官方团列表
  guan: function (pageIndex = 1) {
    let that = this;
    // 显示加载图标
    // wx.showLoading({
    //   title: '加载中...',
    // })
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        var member_no = res.data.member_no;
        wx.request({
          url: app.globalData.URL + '/api/redAndOfficeGroup/officeGroup',
          data: {
            cityName: that.data.dingwei,
            member_no: member_no,
            pageIndex: pageIndex,
            pageSize: 10,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (response) {
            // wx.hideLoading()
            that.setData({
              hrAllList: response.data.data.list,
              pageIndex: response.data.data.pageNum,//当前页个数
              pages: response.data.data.pages,//总页数
            })
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
            }
          }
        })
      }
    })
  },
  // 红人团，官方团列表
  getHrList: function (type, pageIndex = 1) {
    let that = this;
    // 显示加载图标
    // wx.showLoading({
    //   title: '加载中...',
    // })
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        var member_no = res.data.member_no;
        wx.request({
          url: app.globalData.URL + '/api/redAndOfficeGroup/redAndOfficeList',
          data: {
            cityName: that.data.dingwei,
            member_no: member_no,
            pageIndex: pageIndex,
            pageSize: 10,
            type: type,//1红人团 2官方团
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (response) {
            // wx.hideLoading()
            that.setData({
              hrAllList: response.data.data.list,
              pageIndex2: response.data.data.pageNum,//当前页
              pages2: response.data.data.pages,//总页数
            })
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
            }
          }
        })
      }
    })
  },
  // 更多房产
  moreHouse() {
    wx.navigateTo({
      url: '/pages/moreHouse/moreHouse?dingwei=' + this.data.dingwei,
    })
  },
  // 房产推荐
  getHuose: function (pageIndex = 1) {
    let that = this;
    // 显示加载图标
    // wx.showLoading({
    //   title: '加载中...',
    // })
    wx.request({
      url: app.globalData.URL + '/api/enjoy/recommendHouse',
      data: {
        cityName: that.data.dingwei,
        area: '',
        index: '',
        flag: '',
        pageIndex: pageIndex,
        pageSize: 6,
      },
      method: 'GET',
      success: function (res) {
        // wx.hideLoading()
        if (res.data.code == 200) {
          that.setData({
            pageIndex1: res.data.data.pageNum,//当前页数
            pages1: res.data.data.pages,//总页数
            houseList: res.data.data.list
          })
        }
      }
    })
  },
  // 好物推荐
  getRecommendation: function (pageIndex = 1) {
    let that = this;
    // 显示加载图标
    // wx.showLoading({
    //   title: '加载中...',
    // })
    wx.request({
      url: app.globalData.URL + '/api/enjoy/recommendGood',
      data: {
        cityName: that.data.dingwei,
        pageIndex: pageIndex,
        pageSize: 10,
      },
      method: 'GET',
      success: function (res) {
        // wx.hideLoading()
        if (res.data.code == 200) {
          that.setData({
            pageIndex1_1: res.data.data.pageNum,//当前页数
            pages1_1: res.data.data.pages,//总页数
            recommendation: res.data.data.list
          })
        }

      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

    if (this.data.currentTab == 0) {
      this.getIndexData();//获取首页轮播图

      this.getRedListArticle()//红人文章
      this.roomList()// 房间列表
      if (this.data.currentTopTap == 1) {
        this.getHuose()//房产推荐
      } else {
        this.getRecommendation();//好物推荐
      }
    } else if (this.data.currentTab == 1) {
      this.getIndexData(2);//获取首页轮播图
      this.getHrList(1)//红人团
    } else if (this.data.currentTab == 2) {
      this.getIndexData(3);//获取首页轮播图
      // this.getHrList(2)//红人团
      this.guan()
    }

    wx.stopPullDownRefresh()
  },
  onReachBottom() {
    let that = this;
    if (that.data.currentTab === 0) {//优享
      if (that.data.currentTopTap === 1) {

        let { JDpageNum, JDpageSize, JDcurrentName, JDlist } = this.data
        JDpageNum = JDpageNum + 1
        // wx.showLoading({
        //   title: '加载中',
        // })
        common.axios({
          url: '/api/jd/itemList',
          data: {
            pageNum: JDpageNum,
            pageSize: JDpageSize,
            keyWords: JDcurrentName
          }
        }, 'GET').then(res => {

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
        // wx.hideLoading()
      }
      if (that.data.currentTopTap == 0) {//红人房产

        // if (pageIndex1 < pages1) {
        //   // 显示加载图标
        //   wx.showLoading({
        //     title: '加载中...',
        //   })
        //   ({
        //     url: app.globalData.URL + '/api/enjoy/recommendHouse',
        //     data: {
        //       cityName: that.data.dingwei,
        //       pageIndex: pageIndex1 + 1 ,
        //       pageSize: 10,
        //     },
        //     method: 'GET',
        //     success: function (res) {
        //       wx.hideLoading()
        //       if (res.data.code == 200) {
        //         that.setData({
        //           pageIndex1: res.data.data.pageNum,//当前页数
        //           pages1: res.data.data.pages,//总页数
        //           houseList: (that.data.houseList).concat(res.data.data.list)
        //         })
        //       }

        //     }
        //   })

        // } else {
        //   wx.showToast({
        //     title: "我是有底线的",
        //     icon: "none"
        //   })
        // }
      } else if (that.data.currentTopTap == 2) {//红人好物
        var pages1_1 = that.data.pages1_1;//总个数
        var pageIndex1_1 = that.data.pageIndex1_1;//当前页个数

        if (pageIndex1_1 < pages1_1) {
          // 显示加载图标
          // wx.showLoading({
          //   title: '加载中...',
          // })
          wx.request({
            url: app.globalData.URL + '/api/enjoy/recommendGood',
            data: {
              cityName: that.data.dingwei,
              pageIndex: pageIndex1_1 + 1,
              pageSize: 10,
            },
            method: 'GET',
            success: function (res) {
              // wx.hideLoading()
              that.setData({
                pageIndex1_1: res.data.data.pageNum,//当前页数
                pages1_1: res.data.data.pages,//总页数
                recommendation: (that.data.recommendation).concat(res.data.data.list)
              })
            }
          })

        } else {
          wx.showToast({
            title: "我是有底线的",
            icon: "none"
          })
        }
      }

    } else if (that.data.currentTab == 1) {//红人团

      var pages2 = that.data.pages2;//总页数
      var pageIndex2 = that.data.pageIndex2;//当前页
      if (pageIndex2 < pages2) {
        // 显示加载图标
        // wx.showLoading({
        //   title: '加载中...',
        // })
        wx.getStorage({
          key: 'idNum',
          success: function (res) {
            var member_no = res.data.member_no;
            ({
              url: app.globalData.URL + '/api/redAndOfficeGroup/redAndOfficeList',
              data: {
                cityName: that.data.dingwei,
                member_no: member_no,
                pageIndex: pageIndex2 + 1,
                pageSize: 10,
                type: 1,//1红人团 2官方团
              },
              method: 'GET',
              header: {
                "token": res.data.token,
                'content-type': 'application/json'
              },
              success: function (response) {
                // wx.hideLoading()
                that.setData({
                  hrAllList: (that.data.hrAllList).concat(response.data.data.list),
                  pageIndex2: response.data.data.pageNum,//当前页个数
                  pages2: response.data.data.pages,//总个数
                })
              }
            })
          },
        })
      } else {
        wx.showToast({
          title: "我到底啦",
          icon: "none"
        })
      }
    } else if (that.data.currentTab == 2) {
      var pages = this.data.pages;//总页数
      var pageIndex = this.data.pageIndex;//当前页
      if (pageIndex < pages) {//官方团列表
        // 显示加载图标
        // wx.showLoading({
        //   title: '加载中...',
        // })
        wx.getStorage({
          key: 'idNum',
          success: function (res) {
            var member_no = res.data.member_no;
            ({
              url: app.globalData.URL + '/api/redAndOfficeGroup/officeGroup',
              data: {
                cityName: that.data.dingwei,
                member_no: member_no,
                pageIndex: pageIndex + 1,
                pageSize: 10,
              },
              method: 'GET',
              header: {
                "token": res.data.token,
                'content-type': 'application/json'
              },
              success: function (response) {
                // wx.hideLoading()
                that.setData({
                  hrAllList: (that.data.hrAllList).concat(response.data.data.list),
                  pageIndex: response.data.data.pageNum,//当前页个数
                  pages: response.data.data.pages,//总个数
                })
              }
            })
          },
        })
      } else {
        wx.showToast({
          title: "我到底啦",
          icon: "none"
        })
      }
    }
  },
  onShareAppMessage: function () {
  },
  // 关注红人团红人
  getFous: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    var number = e.currentTarget.dataset.number;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        ({
          url: app.globalData.URL + '/api/redAndOfficeGroup/follow',
          data: {
            member_no_me: res.data.member_no,
            member_no_other: number,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {
            if (res.data.code == 200 && id == 0) {
              wx.showToast({
                title: '关注成功',
              })

            } else if (res.data.code == 200 && id == 1) {
              wx.showToast({
                title: '取消关注',
                icon: 'none',
              })

            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none',
              })
            }
            setTimeout(function () {
              that.getHrList(1)
            }, 1500)

          }
        })
      },
    })
  },
  // 关注官方团红人
  getFousGuan: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    var number = e.currentTarget.dataset.number;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        ({
          url: app.globalData.URL + '/api/redAndOfficeGroup/follow',
          data: {
            member_no_me: res.data.member_no,
            member_no_other: number,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {
            if (res.data.code == 200 && id == 0) {
              wx.showToast({
                title: '关注成功',
              })

            } else if (res.data.code == 200 && id == 1) {
              wx.showToast({
                title: '取消关注',
                icon: 'none',
              })

            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none',
              })
            }
            setTimeout(function () {

              that.guan()//官方团
            }, 1500)
          }
        })
      },
    })
  },
  // 跳到好物详情页面
  skipGoodDetail: function (event) {
    var comeFrom = 'home'
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        if (event.category_choice == 1) {//房产
          console.log("跳转房产团购");
          wx.navigateTo({
            url: '/pages/huose/huose?shopId=' + event.spu_no + '&comeFrom=' + comeFrom + '&goods_name=' + event.goods_name + '&goods_stock=' + event.goods_stock + '&goods_rest_stock=' + event.goods_rest_stock + '&member_no=' + event.member_no,
          })
        } else if (event.category_choice > 1 && event.open_group == 1) {
          console.log("跳转商品团购");
        } else if (event.category_choice > 1 && event.open_group == 0) {
          console.log("跳转单独购买");
          wx.navigateTo({
            url: '../home_page/good_detail/good_detail?shopId=' + event.spu_no + '&comeFrom=' + comeFrom + '&goods_name=' + event.goods_name + '&category_id=' + event.category_choice + '&member_no=' + event.member_no,
          })
        } else {
          wx.showToast({
            title: '数据错误',
            icon: 'none'
          })
        }
      },
      fail: function () {
        wx.showModal({
          content: '您尚未登陆，请先登陆',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/personal/personal',
              })
            } else if (res.cancel) {

            }
          }
        })
      }
    })
  },
  // 跳到房产详情页面
  skipGoodDetails: function (event) {
    var comeFrom = 'home'
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        //房产
        wx.navigateTo({
          url: '/pages/huose/huose?shopId=' + event.spu_no + '&comeFrom=' + comeFrom + '&goods_name=' + event.goods_name + '&goods_stock=' + event.goods_stock + '&goods_rest_stock=' + event.goods_rest_stock + '&member_no=' + event.member_no,
        })
      },
      fail: function () {
        wx.showModal({
          content: '您尚未登陆，请先登陆',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/personal/personal',
              })
            } else if (res.cancel) {

            }
          }
        })
      }
    })
  },
  // 好物详情
  buyNow(e) {
    var that = this;
    var thisGood = that.data.recommendation[e.currentTarget.id];
    that.skipGoodDetail(thisGood);

  },
  // 房产详情
  buyNows(e) {
    var that = this;
    var thisGood = that.data.houseList[e.currentTarget.id];
    that.skipGoodDetails(thisGood);
  },
  // 购物车
  cartAccess: function () {
    wx.navigateTo({
      url: '../cart/cart',
    })
    // wx.navigateTo({
    //   url: '/pages/pageH/pageH?url=' +'https://login.pizzahut.com.cn/CRM/superapp_wechat_getTicket/index.html?id=ea83bd5d834544e8bb5a1c385d26c448',
    // })
  }

})