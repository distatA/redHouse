// pages/kol/kol.js
const app = getApp();
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hrList: [{
      name: "推荐",
      num: 4
    }, {
      name: "关注",
      num: 5
    }],
    loop: true,
    autoplay: true,
    tabScroll: 0,
    currentTab: 0,
    windowHeight: '',
    windowWidth: '',
    height: 1800,
    show_play_btn: false,
    numId: 4,
    animationData: {},
    animationData1: {},
    isPost: false,
    display: 1,
    otherTrue: false,
    moneyist: [0.01, 6.66, 18.88, 66.66, 100, 1.88],
    recommendList: '', //推荐列表数组
    focusList: '', //关注列表数组
    showClickMask: false, //点赞弹起的遮罩层用于点击空白处收起控件使用,
    redType:0
  },
  // 点击菜单
  clickMenu: function (e) {
    var current = e.currentTarget.dataset.current //获取当前tab的index
    var id = e.currentTarget.id;
    var tabWidth = this.data.windowWidth / 5; // 导航tab共5个，获取一个的宽度
    this.setData({
      tabScroll: (current - 2) * tabWidth, //使点击的tab始终在居中位置
      numId: id,
      currentTab: current
    })
    if (current == 0) {
      //推荐
      this.getIndexData(4) //获取轮播图
    } else if (current == 1) {
      //关注
      this.getIndexData(5) //获取轮播图
      this.getFocus() //关注
    }
  },
  // 滑块
  changeContent: function (e) {
    var current = e.detail.current // 获取当前内容所在index,文档有
    if (current == 0) {
      //推荐
      this.getIndexData(4) //获取轮播图
    } else if (current == 1) {
      //关注
      this.getIndexData(5) //获取轮播图
      this.getFocus() //关注
    }
    var tabWidth = this.data.windowWidth / 5
    this.setData({
      currentTab: current,
      tabScroll: (current - 2) * tabWidth
    })
  },
  onLoad: function (options) {
    var that = this;
    // 地理位置
    wx.getStorage({
      key: 'cityName',
      success: function (res) {
        console.log(res.data)
        that.setData({
          dingwei: res.data,
        })
      }
    })
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        console.log(res)
        that.setData({
          mymember_no: res.data.member_no,
          redType: res.data.redType, //0不是会员
        })
      }
    })
  },
  onShow: function () {
    var that = this;
    // 地理位置
    wx.getStorage({
      key: 'cityName',
      success: function (res) {
        console.log(res.data)
        that.setData({
          dingwei: res.data,
          showClickMask: false,
        })
      }
    })
    setTimeout(function () {
      console.log(that.data.dingwei)
      that.getRecommend(); //推荐
      that.getIndexData(4); //获取轮播图
    }, 300)
  },
  // 跳转到红人店铺
  redHome: function (e) {
    var member = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/redHome/redHome?member=' + member,
    })
  },
  // 链接
  shop: function (e) {
    var choice = e.currentTarget.dataset.choice;
    var goods_name = e.currentTarget.dataset.goods_name;
    var member_no = e.currentTarget.dataset.member_no;
    if (choice == 1) { //房产
      wx.navigateTo({
        url: '/pages/huose/huose?shopId=' + e.currentTarget.id + '&category_id=' + choice + '&goods_name=' + goods_name + '&member_no=' + member_no + '&comeFrom=' + 'home',
      })
    } else {
      wx.navigateTo({
        url: '/pages/home_page/good_detail/good_detail?shopId=' + e.currentTarget.id + '&category_id=' + choice + '&goods_name=' + goods_name + '&member_no=' + member_no + '&comeFrom=' + 'home',
      })
    }

  },
  // 购物车
  cartAccess: function () {
    wx.navigateTo({
      url: '../cart/cart',
    })
  },
  // 遮罩层的点击事件
  // clickMask(e) {
  //   console.log('遮罩层');
  //   this.hiddenReview()
  //   this.setData({
  //     showClickMask: false
  //   })
  // },
  // 隐藏点赞评论框
  // hiddenReview() {
  //   let {
  //     recommendList,
  //     focusList
  //   } = this.data
  //   if (recommendList) {
  //     recommendList.forEach(i => {
  //       i.isView = false
  //     })
  //   }
  //   if (focusList) {
  //     focusList.forEach(i => {
  //       i.isView = false
  //     })
  //   }
  //   this.setData({
  //     recommendList,
  //     focusList
  //   })
  // },
  // 推荐点赞评论
  onclick: function (e) {
    var that = this;
    that.data.recommendList[e.currentTarget.id].isView = !that.data.recommendList[e.currentTarget.id].isView
    if (that.data.recommendList[e.currentTarget.id].isView) {
      that.setData({
        // showClickMask: true,
        recommendList: that.data.recommendList,
      })
    } 
    // else {
    //   that.setData({
    //     // showClickMask: false,
    //     recommendList: that.data.recommendList,
    //   })
    // }
  },
  // 关注点赞评论
  onclick1: function (e) {
    var that = this;
    that.data.focusList[e.currentTarget.id].isView = !that.data.focusList[e.currentTarget.id].isView
    if (that.data.focusList[e.currentTarget.id].isView) {
      that.setData({
        // showClickMask: true,
        focusList: that.data.focusList,
      })
    }
    //  else {
    //   that.setData({
    //     // showClickMask: false,
    //     focusList: that.data.focusList,
    //   })
    // }
  },
  // 笔记详情
  noteDetail: function (e) {
    console.log(e)
    var noteId = e.currentTarget.id;
    var type = e.currentTarget.dataset.type; //1-小程序发布笔记 2-小程序发布文章 3-后台发布 4后台抓取
    var comment = e.currentTarget.dataset.comment;
    var like = e.currentTarget.dataset.like;
    var read = e.currentTarget.dataset.read;
    var flag = e.currentTarget.dataset.flag;
    var member = e.currentTarget.dataset.member;
    var time = e.currentTarget.dataset.time;
    var headUrl = e.currentTarget.dataset.headurl;
    var nickName = e.currentTarget.dataset.nickname;
    var img = e.currentTarget.dataset.img; //一张图片
    var imgs = e.currentTarget.dataset.imgs; //多张图片
    var video = e.currentTarget.dataset.video;
    var title = e.currentTarget.dataset.title;

    var spu = e.currentTarget.dataset.spu;
    var goods_name = e.currentTarget.dataset.goods_name;
    var member_no = e.currentTarget.dataset.member_no;
    var choice = e.currentTarget.dataset.choice;

    // console.log(nickName, time,img)
    wx.navigateTo({
      url: '/pages/myNote_detail/myNote_detail?noteId=' + noteId + '&headUrl=' + headUrl + "&nickName=" + nickName + '&type=' + type + '&comment=' + comment + '&like=' + like + '&read=' + read + '&flag=' + flag + '&member=' + member + '&time=' + time + '&img=' + img + '&video=' + video + '&imgs=' + imgs + '&title=' + title + '&spu=' + spu + '&goods_name=' + goods_name + '&member_no=' + member_no + '&choice=' + choice,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  //获取轮播图
  getIndexData: function (bySource) {
    var that = this;
    var bySource = bySource;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + '/api/enjoy/homeImage',
          data: {
            city: that.data.dingwei,
            bySource: bySource, //1首页优享 2 首页红人团 3首页官方团 4红人社区-推荐  5红人社区-关注  6签到图  7首页图 8红人好物'
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (response) {
            // console.log(response.data.data);
            that.setData({
              bnrUrl: response.data.data,
            })

          }
        })
      }
    })
  },
  // 推荐
  getRecommend: function () {
    var that = this;
    // 显示加载图标
    // wx.showLoading({
    //   title: '加载中',
    // })
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + '/api/noteAndArticle/myRecomMend',
          data: {
            cityName: that.data.dingwei,
            member_no: res.data.member_no,
            searchName: that.data.searchValue != undefined ? that.data.searchValue : '',
            pageIndex: 1,
            pageSize: 10,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (response) {
            if (response.data.code == 200) {
              // wx.hideLoading()
              var newArr = response.data.data.list;
              
              for (let i = 0; i < newArr.length; i++) {
                newArr[i].isView = false;
                if (newArr[i].memberNoteAndArticleComments) {
                  newArr[i].memberNoteAndArticleComments = newArr[i].memberNoteAndArticleComments.slice(0, 2);
                }
                if (newArr[i].nickNames) {
                  newArr[i].nickNames = newArr[i].nickNames.map(function (obj, index) {
                    return obj;
                  }).join("，");
                }
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
                      newArr[i].memberArtVote.list[j].checked = false; //未投票
                      newArr[i].memberArtVote.list[j].chose = newArr[i].memberArtVote.chose; //1单选 2多选
                    } else {
                      newArr[i].memberArtVote.list[j].checked = true; //已投票
                      newArr[i].memberArtVote.list[j].chose = newArr[i].memberArtVote.chose; //1单选 2多选
                    }

                  }
                }
              }


              that.setData({
                recommendList: newArr,
                member_no: res.data.member_no,
                pageIndex: response.data.data.pageNum,
                pages: response.data.data.pages,
              })
              // that.hiddenReview()
            } else if (response.data.code == 401) {
              wx.clearStorageSync() //清除本地缓存
              wx.showModal({
                content: '登陆超时，请重新登陆',
                success(res) {
                  if (res.confirm) {
                    wx.switchTab({
                      url: '/pages/personal/personal',
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
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

            }
          }
        })
      }
    })
  },
  // 投票选择
  onclicks(e) {
    var id = e.currentTarget.id;
    var target = e.currentTarget.dataset.target;
    var chose = e.currentTarget.dataset.chose; //1单选 2多选
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

    if (target == 0) { //投票
      if (chose == 2) { //多选
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
                if (that.data.currentTab == 0) {
                  that.getRecommend() //刷新推荐
                } else {
                  that.getFocus() //关注
                }

              },
            )
          }
        })
      } else { //单选
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
                  if (that.data.currentTab == 0) {
                    that.getRecommend() //刷新推荐
                  } else {
                    that.getFocus() //关注
                  }
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

    } else { //取消投票
      wx.showModal({
        title: '您确定要取消投票吗?',
        content: '',
        success(res) {
          if (res.confirm) { //用户点击确定
            wx.getStorage({
              key: 'idNum',
              success: function (res) {
                common.ajaxGet(
                  '/api/noteAndArticle/delVote', {
                    id: id,
                    memberNo: res.data.member_no,
                  },
                  function (res) {
                    console.log(res)
                    if (res.code == 200) {

                      if (that.data.currentTab == 0) {
                        that.getRecommend() //刷新推荐
                      } else {
                        that.getFocus() //关注
                      }
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
          } else if (res.cancel) { //用户点击取消
            console.log('用户点击取消')
          }
        }
      })
    }

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
  //关注
  getFocus: function () {
    var that = this;
    // 显示加载图标
    // wx.showLoading({
    //   title: '加载中',
    // })
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        // console.log(res);
        wx.request({
          url: app.globalData.URL + '/api/noteAndArticle/myFollow',
          data: {
            member_no: res.data.member_no,
            searchName: that.data.searchValue != undefined ? that.data.searchValue : '',
            pageIndex: 1,
            pageSize: 10
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (response) {
            if (response.data.code == 200) {
              wx.hideLoading()
              var newArr = response.data.data.list;
              for (let i = 0; i < newArr.length; i++) {
                newArr[i].isView = false;
                if (newArr[i].memberNoteAndArticleComments) {
                  newArr[i].memberNoteAndArticleComments = newArr[i].memberNoteAndArticleComments.slice(0, 2);
                }
                if (newArr[i].nickNames) {
                  newArr[i].nickNames = newArr[i].nickNames.map(function (obj, index) {
                    return obj;
                  }).join("，");
                }
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
                      newArr[i].memberArtVote.list[j].checked = false; //未投票
                      newArr[i].memberArtVote.list[j].chose = newArr[i].memberArtVote.chose; //1单选 2多选
                    } else {
                      newArr[i].memberArtVote.list[j].checked = true; //已投票
                      newArr[i].memberArtVote.list[j].chose = newArr[i].memberArtVote.chose; //1单选 2多选
                    }
                  }
                }
              }
              that.setData({
                focusList: newArr,
                pageIndex1: response.data.data.pageNum,
                pages1: response.data.data.pages
              })
            } else if (response.data.code == 401) {
              wx.clearStorageSync() //清除本地缓存
              wx.showModal({
                content: '登陆超时，请重新登陆',
                success(res) {
                  if (res.confirm) {
                    wx.switchTab({
                      url: '/pages/personal/personal',
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }


          }
        })
      },
      fail: function () {
        // wx.hideLoading()
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
  // 广告详情
  viewBanner: function (e) {
    var id = e.currentTarget.id; //1.网址2.商品3.文章4.专题 6.黑卡 7.第六空间小程序
    var appUrl = e.currentTarget.dataset.id;
    if (id == 2) {
      var arr = appUrl.split(',')
      if (arr[1] == 1) { //房产
        wx.navigateTo({
          url: '/pages/huose/huose?shopId=' + arr[0],
        })
      } else {
        wx.navigateTo({
          url: '/pages/home_page/good_detail/good_detail?shopId=' + arr[0],
        })
      }
    } else if (id == 1) {
      wx.navigateTo({ //外链
        url: '/pages/pageH/pageH?url=' + appUrl,
      })
    } else if (id == 3) { //文章
      wx.showToast({
        title: '暂不能跳转',
        icon: 'none'
      })
    } else if (id == 4) { //专题
      wx.navigateTo({
        url: '/pages/actieve/actieve?id=' + appUrl,
      })
    } else if (id == 6) { //黑卡
      wx.navigateTo({
        url: '/pages/banCard/banCard?id=' + appUrl + '&type=' + 1,
      })
    } else if (id == 7) { //第六空间小程序
      wx.navigateToMiniProgram({
        appId: 'wx787c7dbe01af57c6',
        path: appUrl, //'pages/invitation2/invitation2?id=12',
        extraData: {
          from: '12'
        },
        envVersion: 'release',
        success(res) {
          // 打开其他小程序成功同步触发
          wx.showToast({
            title: '跳转成功'
          })
        }
      })
    }
  },
  // 点赞
  zan: function (e) {
    console.log(e)
    var like_type = e.currentTarget.dataset.type;
    var like_id = e.currentTarget.id;
    var flag = e.currentTarget.dataset.flag;
    var title = e.currentTarget.dataset.title;
    var member_other = e.currentTarget.dataset.member;
    var that = this;
    that.setData({
      showClickMask: false
    })
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        var member_no = res.data.member_no;
        var nickName = res.data.nickName
        common.ajaxGet(
          '/api/NoteAndArticleComment/commentLike', {
            like_type: like_type, //1-笔记  2-文章  3-评论 4-抓取的文章 5-快讯 6-后台发布的快讯 7-后台发布的笔记
            like_id: like_id,
            member_no: member_no,
          },
          function (res) {
            console.log(flag)
            if (res.code == 200 && flag == 0) {
              wx.showToast({
                title: '点赞成功',
              })
              var data = {
                action: 2,
                chatMsg: {
                  msg: '赞了你的作品',
                  send_user_id: member_no, //发送者
                  accept_user_id: member_other, //接受者
                  id: '', //消息的接受
                  accept_type: 0, //0-普通会员（包括红人）  1-商家
                  send_type: 0, //0-普通会员（包括红人）  1-商家
                  sign_flag: 0, //0 未签收 1 签收
                  msgType: 4 //4点赞 
                },
                extend: like_id, //扩展字段文章id
                extend_nother: ''
              }
              that.sendSocketMessage(data)
              var param = {
                memberNo: member_other,
                nickName: nickName,
                title: title.slice(0, 20)
              }
              wx.requestSubscribeMessage({ //授权订阅消息
                tmplIds: ['QM-TyWar5R3GfNYeDQhbWsc4EcfdzPUb94Qw3_lnU3Y'],
                success(res) {
                  console.log(res)
                  // common.userFrom(param, function (res) {
                  //   console.log(res)
                  // })
                }
              })
            } else if (flag == 1) {
              wx.showToast({
                title: '取消点赞',
                icon: 'none'
              })
            }
            if (that.data.currentTab == 0) {
              that.getRecommend() //
            } else if (that.data.currentTab == 1) {
              that.getFocus()
            }
          },
        )
      }
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
  // 关闭弹框
  closeZz: function (e) {
    this.setData({
      display: 1,
    })
  },
  other() { //自定义金额
    this.setData({
      otherTrue: true
    })
  },
  back() { //固定金额
    this.setData({
      otherTrue: false
    })
  },
  shang(e) {
    console.log(e)
    this.setData({
      display: 2,
      article_id: e.currentTarget.id,
      myheadUrl: e.currentTarget.dataset.head,
      mynickName: e.currentTarget.dataset.name
    })
    wx.requestSubscribeMessage({ //授权订阅消息
      tmplIds: ['SCew5mud7SrIRO3fzrFfIRyWb7iCPKPUezGaY2i27Z8'],
      success(res) {
        console.log(res);
      }
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
    console.log(that.data.article_id)
    var price = '';
    if (type == 1) {
      price = e.currentTarget.id
    } else if (type == 2) {
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
            type: 2, //1给红人打赏 2给笔记打赏
            article_id: that.data.article_id,
            price: price, //金额
            reward_member_no: memberNo, //我的
            member_no_other: '', //红人的
          },
          method: 'POST',
          header: {
            "token": res.data.token,
            "Content-Type": "application/json"
          },
          success: function (response) {
            console.log(response)
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
                  console.log(res)
                  wx.showToast({
                    title: '打赏成功',
                  })
                  // wx.requestSubscribeMessage({//授权订阅消息
                  //   tmplIds: ['SCew5mud7SrIRO3fzrFfIRyWb7iCPKPUezGaY2i27Z8'],
                  //   success(res) {
                  //     // 订阅消息
                  //     // common.ajaxGet(
                  //     //   '/api/wxMessgae/pushReward',
                  //     //   {
                  //     //     outTradeNo: response.data.data.productNo
                  //     //   },
                  //     //   function (res) {
                  //     //     console.log(res)
                  //     //     if (res.code == 200) {
                  //     //     }
                  //     //   }
                  //     // )
                  //   }
                  // })

                  that.setData({
                    display: 1
                  })
                  if (that.data.currentTab == 0) {
                    that.getRecommend() //
                  } else if (that.data.currentTab == 1) {
                    that.getFocus()
                  }
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
  browseMore(e) {
    var id = e.currentTarget.id;
    var rewardList = JSON.stringify(e.currentTarget.dataset.reward);
    if (id == this.data.mymember_no) { //是该文章的作者
      wx.navigateTo({
        url: '/pages/dashang/dashang?rewardList=' + encodeURIComponent(rewardList) + '&type=' + 1
      })
    } else {
      this.setData({
        display: 2,
        article_id: e.currentTarget.dataset.id,
        myheadUrl: e.currentTarget.dataset.head,
        mynickName: e.currentTarget.dataset.name
      })
      console.log(2222);
      wx.requestSubscribeMessage({ //授权订阅消息
        tmplIds: ['SCew5mud7SrIRO3fzrFfIRyWb7iCPKPUezGaY2i27Z8'],
        success(res) {
          console.log(res);
        }
      })

    }
  },
  // 发帖
  post: function () {
    var that = this;
    that.setData({
      isPost: !that.data.isPost,

    })
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })

    animation.rotate(360).step()
    that.setData({
      animationData: animation.export()
    })
  },
  postNote(e) {
    wx.navigateTo({
      url: '/pages/post/post?postId=' + e.currentTarget.id,
    })
  },
  post1() { //普通会员
    wx.navigateTo({
      url: '/pages/post/post?postId=' + 1,
    })
  },

  //查看图片
  clickImg: function (event) {
    var index = event.currentTarget.id;
    var list = event.currentTarget.dataset.list;

    var imgArr = new Array();
    for (let i = 0; i < list.length; i++) {
      imgArr.push(list[i].imageUrl);
    }
    wx.previewImage({
      current: imgArr[index], //当前图片地址
      urls: imgArr, //所有要预览的图片的地址集合 数组形式
    })
  },
  /**播放视屏 */
  play(e) {
    //执行全屏方法  
    var videoContext = wx.createVideoContext('myvideo', this);
    videoContext.requestFullScreen();
    this.setData({
      fullScreen: true
    })
  },
  /**关闭视屏 */
  closeVideo() {
    //执行退出全屏方法
    var videoContext = wx.createVideoContext('myvideo', this);
    videoContext.exitFullScreen();
  },
  /**视屏进入、退出全屏 */
  fullScreen(e) {
    var isFull = e.detail.fullScreen;
    //视屏全屏时显示加载video，非全屏时，不显示加载video
    this.setData({
      fullScreen: isFull
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
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  // 搜索
  toSearch: function () {
    var that = this;
    console.log(that.data.numId)
    if (that.data.numId == 4) {
      that.getRecommend() //推荐
    } else if (that.data.numId == 5) {
      that.getFocus() //关注
    }

  },
  // 输入框
  getInputValue: function (e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
  // 回车搜索
  searchHandle: function () {
    this.toSearch()
  },
  //取消
  cancel: function () {
    this.setData({
      searchValue: ''
    })
    if (this.data.numId == 4) {
      this.getRecommend() // 推荐列表
    } else if (this.data.numId == 5) {
      this.getFocus() // 关注列表
    }

  },
   // 监听滚动条事件,如果触发,点赞的选项框就隐藏
   handleScroll() {
     
  },
   // 页面滚动事件
   onPageScroll (e) {
     let {recommendList,focusList,currentTab} = this.data 
     if(currentTab === 0){
      recommendList.forEach((v) => {
        v.isView = false;
      });
      this.setData({ recommendList})
     }else{
      focusList.forEach((v) => {
        v.isView = false;
      });
      this.setData({ focusList})
     }
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
    if (that.data.numId == 4) {
      var pageIndex = that.data.pageIndex; //总页数
      var pages = that.data.pages; //当前页

      if (pageIndex < pages) {
        // 显示加载图标
        // wx.showLoading({
        //   title: '加载中',
        // })
        wx.getStorage({
          key: 'idNum',
          success: function (res) {
            wx.request({
              url: app.globalData.URL + '/api/noteAndArticle/myRecomMend',
              data: {
                cityName: that.data.dingwei,
                member_no: res.data.member_no,
                searchName: that.data.searchValue != undefined ? that.data.searchValue : '',
                pageIndex: pageIndex + 1,
                pageSize: 10,
              },
              method: 'GET',
              header: {
                "token": res.data.token,
                'content-type': 'application/json'
              },
              success: function (response) {
                if (response.data.code == 200) {
                  // wx.hideLoading()
                  var newArr = response.data.data.list;

                  for (let i = 0; i < newArr.length; i++) {
                    newArr[i].isView = false;
                    if (newArr[i].memberNoteAndArticleComments) {
                      newArr[i].memberNoteAndArticleComments = newArr[i].memberNoteAndArticleComments.slice(0, 2);
                    }
                    if (newArr[i].nickNames) {
                      newArr[i].nickNames = newArr[i].nickNames.map(function (obj, index) {
                        return obj;
                      }).join("，");
                    }
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
                          newArr[i].memberArtVote.list[j].checked = false; //未投票
                          newArr[i].memberArtVote.list[j].chose = newArr[i].memberArtVote.chose; //1单选 2多选
                        } else {
                          newArr[i].memberArtVote.list[j].checked = true; //已投票
                          newArr[i].memberArtVote.list[j].chose = newArr[i].memberArtVote.chose; //1单选 2多选
                        }

                      }
                    }
                  }

                  that.setData({
                    recommendList: (that.data.recommendList).concat(newArr),
                    member_no: res.data.member_no,
                    pageIndex: response.data.data.pageNum,
                    pages: response.data.data.pages
                  })
                }
              }
            })
          },

        })
      } else {
        wx.showToast({
          title: "到底啦",
          icon: "none"
        })
      }
    } else if (that.data.numId == 5) {
      var pageIndex1 = that.data.pageIndex1; //总页数
      var pages1 = that.data.pages1; //当前页
      if (pageIndex1 < pages1) {
        // // 显示加载图标
        // wx.showLoading({
        //   title: '加载中',
        // })
        wx.getStorage({
          key: 'idNum',
          success: function (res) {
            wx.request({
              url: app.globalData.URL + '/api/noteAndArticle/myFollow',
              data: {
                member_no: res.data.member_no,
                searchName: that.data.searchValue != undefined ? that.data.searchValue : '',
                pageIndex: pageIndex1 + 1,
                pageSize: 10
              },
              method: 'GET',
              header: {
                "token": res.data.token,
                'content-type': 'application/json'
              },
              success: function (response) {
                if (response.data.code == 200) {
                  // wx.hideLoading()
                  var newArr = response.data.data.list;
                  for (let i = 0; i < newArr.length; i++) {
                    newArr[i].isView = false;
                    if (newArr[i].memberNoteAndArticleComments) {
                      newArr[i].memberNoteAndArticleComments = newArr[i].memberNoteAndArticleComments.slice(0, 2);
                    }
                    if (newArr[i].nickNames) {
                      newArr[i].nickNames = newArr[i].nickNames.map(function (obj, index) {
                        return obj;
                      }).join("，");
                    }
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
                          newArr[i].memberArtVote.list[j].checked = false; //未投票
                          newArr[i].memberArtVote.list[j].chose = newArr[i].memberArtVote.chose; //1单选 2多选
                        } else {
                          newArr[i].memberArtVote.list[j].checked = true; //已投票
                          newArr[i].memberArtVote.list[j].chose = newArr[i].memberArtVote.chose; //1单选 2多选
                        }

                      }
                    }
                  }
                  that.setData({
                    focusList: (that.data.focusList).concat(newArr),
                    pageIndex1: response.data.data.pageNum,
                    pages1: response.data.data.pages
                  })
                }

              }
            })
          },

        })
      } else {
        wx.showToast({
          title: "我是有底线的",
          icon: "none"
        })
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log(res)

    if (res.from == 'button') {
      var noteId = res.target.id; //笔记ID
      var headUrl = res.target.dataset.headurl; //作者头像
      var nickName = res.target.dataset.nickname; //作者昵称

      var type = res.target.dataset.type; //1-小程序发布笔记 2-小程序发布文章 3-后台发布 4后台抓取
      var comment = res.target.dataset.comment; //评论数
      var like = res.target.dataset.like; //点赞数
      var read = res.target.dataset.read; //阅读数
      var flag = res.target.dataset.flag; //是否点赞
      var authorMember = res.target.dataset.member_no; //作者ID
      var time = res.target.dataset.time; //笔记时间

      var title = res.target.dataset.title;
      var videoUrls = res.target.dataset.video;
      // 关联的商品
      var spu = res.target.dataset.spu;
      var goods_name = res.target.dataset.goods_name;
      var imgUrl = res.target.dataset.imgurl;
      var choice = res.target.dataset.choice;
      return {
        title: title,
        path: '/pages/myNote_detail/myNote_detail?headUrl=' + headUrl + '&nickName=' + nickName + '&member_no=' + authorMember + '&type=' + type + '&comment=' + comment + '&like=' + like + '&read=' + read + '&flag=' + flag + '&time=' + time + '&video=' + videoUrls + '&spu=' + spu + '&goods_name=' + goods_name + '&choice=' + choice + '&noteId=' + noteId + '&title=' + title,
        imageUrl: imgUrl ? imgUrl : '',
        success: function (res) {
          console.log(res)
          wx.showToast({
            title: '分享成功',
          })
          // 分享成功
        },
        fail: function (res) {
          wx.showToast({
            title: '分享失败',
            icon: 'none'
          })
          // 分享失败
        }
      }
    }

  }
})