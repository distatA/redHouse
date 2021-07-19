// pages/myNote_detail/myNote_detail.js
const app = getApp();
var common = require("../../utils/common.js");
var wxParser = require('../../wxParser/index.js');
var amapFile = require('../../utils/amap-wx.js');
var markersData = {
  latitude: '', //纬度
  longitude: '', //经度
  key: "4ada276712c47bf88a9cdc6d41248a2a" //申请的高德地图key
};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isCang: false, //是否收藏
    getUserInfoFail: true,
    isCreate: false,
    isShow: false,
    bigImage: "",
    imagePath: '',
    template: '',
    template1: '',
    reply: false,
    focus: false,
    isZan: false,
    isView: false,
    display: 1,
    otherTrue: false,
    moneyist: [0.01, 6.66, 18.88, 66.66, 100, 1.88],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.flag == 0) {
      this.setData({
        isZan: false
      })
    } else if (options.flag == 1) {
      this.setData({
        isZan: true
      })
    }

    this.setData({
      noteId: options.noteId, //文章id
      type: options.type ? options.type : 1, //1-小程序发布笔记 2-发布文章 3-后台发布 4后台抓取 5快讯
      authorMember: options.member, //作者ID
      scene: options.scene ? options.scene : '', //小程序码参数 48bbc5298a4e43a682c3d06a7784f72c
    })

    // 小程序码 
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        that.setData({
          getUserInfoFail: false,
          mymember_no: res.data.member_no,
        })
        //options.scene && options.scene != '' && options.scene != undefined
        if (options.scene && options.scene != '' && options.scene != undefined) {
          that.getScene()
        } else {
          that.noteDetails() // 笔记详情
          that.getCommentList() //评论列表
          that.getRedNum() //阅读数
        }

      },
      fail: function () {
        that.setData({
          getUserInfoFail: true,
        })
      },
    });

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    // 获取上个页面参数
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];

  },

  // 链接商品详情页
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 判断是否是扫码进来
  getScene: function () {
    var that = this;
    common.ajaxGet(
      '/api/create/getScene', {
        scene: that.data.scene,
      }, res => {
        if (res.code == 200) {
          var arr = res.data.split('&')

          that.setData({
            noteId: arr[14], //笔记ID
            headUrl: arr[0], //作者头像
            nickName: arr[1], //作者昵称
            sign: arr[2], //作者标签
            authorMember: [3],
            type: arr[4], //1-小程序发布笔记 2-小程序发布文章 3-后台发布 4后台抓取 5快讯
            comment: arr[5], //评论数
            like: arr[6], //点赞数
            read: arr[7], //阅读数
            flag: arr[8], //是否点赞
            time: arr[9], //笔记时间
            videoUrls: arr[10],

            // 关联的商品
            spu: arr[11],
            goods_name: arr[12],
            choice: arr[13],
            title: arr[15],
          })
          wx.getStorage({
            key: 'idNum',
            success: function (res) {
              wx.request({
                url: app.globalData.URL + '/api/noteAndArticle/myFollowDetails',
                data: {
                  id: arr[14],
                  member_no: res.data.member_no
                },
                method: 'GET',
                header: {
                  "token": res.data.token,
                  'content-type': 'application/json'
                },
                success: function (res) {
                  console.log('res', res)
                  if (res.data.code == 200) {
                    // 投票
                    var newArr = res.data.data.memberArtVote;
                    let now = parseInt(new Date().getTime()); //当前时间戳
                   
                    // 投票
                    if (newArr && newArr.start_at) {
                      let start = new Date(newArr.start_at.replace(/\-/g, "/")).getTime()
                      let end = new Date(newArr.end_at.replace(/\-/g, "/")).getTime()

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
                      newArr.isVote = isVote;
                      newArr.voteText = voteText;
                      // 判断用户是否点过
                      for (let j = 0; j < newArr.list.length; j++) {
                        let list = newArr.list
                        let arr = list.every(function (value) {
                          return value.target == 0
                        })
                        if (arr) {
                          newArr.list[j].checked = false; //未投票
                          newArr.list[j].chose = newArr.chose; //1单选 2多选
                        } else {
                          newArr.list[j].checked = true; //已投票
                          newArr.list[j].chose = newArr.chose; //1单选 2多选
                        }

                      }
                    }
                   
                    that.setData({
                      artPayVOS: res.data.data.artPayVOS, //付费
                      rewardList: res.data.data.rewardList, //打赏
                      noteDetails: res.data.data.noteVO,
                      voteNum: res.data.data.voteNum,
                      memberArtVote: newArr,
                      noteId: res.data.data.noteVO.pid,
                      tempUrl: res.data.data.noteVO.tempUrl ? res.data.data.noteVO.tempUrl : ''
                    })

                    let article = res.data.data.noteVO.content;

                    if (article != undefined) {
                      wxParser.parse({
                        bind: 'article',
                        html: article,
                        target: that
                      });
                    }
                    // 需要付费的内容
                    if (res.data.data.noteVO.content_fee) {
                      let article2 = res.data.data.noteVO.content_fee;
                      wxParser.parse({
                        bind: 'article2',
                        html: article2,
                        target: that
                      });
                    }
                  }
                  that.getCommentList() //评论列表
                  that.getRedNum() //阅读数
                }

              })
            }
          })

        }
      }
    )

  },
  // 笔记详情
  noteDetails: function () {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxGet(
          '/api/noteAndArticle/myFollowDetails', {
            id: that.data.noteId || '',
            member_no: res.data.member_no
          },
          function (res) {

            if (res.code == 200) {
              // 投票
              var newArr = res.data.memberArtVote;
              let now = parseInt(new Date().getTime()); //当前时间戳
              // 投票
              if (newArr && newArr.start_at) {
                let start = new Date(newArr.start_at.replace(/\-/g, "/")).getTime()
                let end = new Date(newArr.end_at.replace(/\-/g, "/")).getTime()

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
                newArr.isVote = isVote;
                newArr.voteText = voteText;
                // 判断用户是否点过
                for (let j = 0; j < newArr.list.length; j++) {
                  let list = newArr.list
                  let arr = list.every(function (value) {
                    return value.target == 0
                  })
                  if (arr) {
                    newArr.list[j].checked = false; //未投票
                    newArr.list[j].chose = newArr.chose; //1单选 2多选
                  } else {
                    newArr.list[j].checked = true; //已投票
                    newArr.list[j].chose = newArr.chose; //1单选 2多选
                  }

                }
              }
               let times = (new Date(res.data.noteVO.create_time.replace(/-/g, "/"))).getTime();
               res.data.noteVO.create_time = common.myTime(times + 28800000)
              that.setData({
                artPayVOS: res.data.artPayVOS, //付费
                rewardList: res.data.rewardList, //打赏
                noteDetails: res.data.noteVO,
                voteNum: res.data.voteNum,
                memberArtVote: newArr,
                noteId: res.data.noteVO.pid,
                tempUrl: res.data.noteVO.tempUrl ? res.data.noteVO.tempUrl : ''
              })
                console.log(res.data.rewardList,'数组');
              let article = res.data.noteVO.content;
              if (article != undefined) {
                wxParser.parse({
                  bind: 'article',
                  html: article,
                  target: that
                });
              }
              // 需要付费的内容
              if (res.data.noteVO.content_fee) {
                let article2 = res.data.noteVO.content_fee;
                wxParser.parse({
                  bind: 'article2',
                  html: article2,
                  target: that
                });
              }
            }

          }
        )
      }
    })
  },
  // 投票选择
  onclicks(e) {
    var id = e.currentTarget.id;
    var target = e.currentTarget.dataset.target;
    var chose = e.currentTarget.dataset.chose; //1单选 2多选
    var item = e.currentTarget.dataset.item;
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
                art_id: that.data.noteId,
                memberNo: member_no,
              },
              function (res) {
                // console.log(res)
                that.noteDetails() //刷新
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
                  art_id: that.data.noteId,
                  memberNo: member_no,
                },
                function (res) {
                  // console.log(res)
                  that.noteDetails() //刷新
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

                      that.noteDetails() //刷新
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
  // 支付文章生成订单
  fuqian() {
    var that = this;

    wx.requestSubscribeMessage({ //帖子被赞授权订阅消息
      tmplIds: ['SCew5mud7SrIRO3fzrFfIRyWb7iCPKPUezGaY2i27Z8'],
      success(res) {
        if (res) {
          //生成订单
          wx.getStorage({
            key: 'idNum',
            success: function (res) {
              var memberNo = res.data.member_no;
              wx.request({
                url: app.globalData.URL + '/api/publish/create',
                data: {
                  art_id: that.data.noteId,
                  memberNo: memberNo,
                },
                method: 'GET',
                header: {
                  "token": res.data.token,
                  "Content-Type": "application/json"
                },
                success: function (response) {

                  wx.hideLoading();
                  if (response.data.code == 200) {
                    let result = response.data.data;
                    wx.requestPayment({
                      'timeStamp': result.timeStamp,
                      'nonceStr': result.nonceStr,
                      'package': result.packageValue,
                      'signType': result.signType,
                      'paySign': result.paySign,
                      'success': function (res) {

                        that.setData({
                          isView: true
                        })
                        that.noteDetails() //刷新接口
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
        }
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
          '/api/myCollection/collection', {
            collect_id: id,
            collect_type: 2, //'1-商品  2-笔记 3-店铺'
            member_no: res.data.member_no
          },
          function (data) {

            if (data.code == 200) {
              if (that.data.noteDetails.collecNum == 0) {
                wx.showToast({
                  title: "收藏成功",
                })

              } else {
                wx.showToast({
                  title: "取消收藏",
                })

              }
              that.noteDetails()

            }
          }
        )
      },
    })
  },
  //查看图片
  clickImg: function (event) {
    var index = event.currentTarget.dataset.index; //获取data-index
    var imgList = event.currentTarget.dataset.list; //获取data-list

    var imgArr = [];
    for (let i = 0; i < imgList.length; i++) {
      imgArr.push(imgList[i])
    }

    wx.previewImage({
      current: imgArr[index], //当前图片地址
      urls: imgArr, //所有要预览的图片的地址集合 数组形式
    })
  },
  /* 视频退出全屏时的操作 */
  fullscreenchange: function (event) {

    if (event.detail.fullScreen == false) {

      var videoContext = wx.createVideoContext('houseVideo');
      videoContext.stop();
      videoContext.exitFullScreen();
    }
  },

  // 写评论
  comment: function () {

    // wx.navigateTo({
    //   url: '/pages/comment/comment?noteId=' + this.data.noteId + '&headUrl=' + this.data.myHeadUrl + '&nickName=' + this.data.myNickName+'&type='+0,
    // })
  },
  // 回复
  reply: function (e) {
    var that = this;
    var type = e.currentTarget.id;
    that.setData({
      reply: !that.data.reply,
      pid: type,
      focus: true,
    })


    // wx.navigateTo({
    //   url: '/pages/comment/comment?noteId=' + this.data.noteId + '&headUrl=' + this.data.myHeadUrl + '&nickName=' + this.data.myNickName + '&type=' + type,
    // })
  },
  // 发布
  submit: function (e) {
    var value = this.data.searchValue
    var type = e.currentTarget.id
    var that = this;
    console.log(value)
    // value = common.trim(value);
    if (value == "") {
      wx.showToast({
        title: '评论不得为空',
        icon: 'none'
      })
      return false;
    }

    if (value) {
      var oldValue = this.data.oldValue;
      var noteId = this.data.noteId;
      // var type = this.data.type;
      if (value == oldValue) {
        wx.showToast({
          title: '请勿提交重复数据！',
          icon: 'none'
        })
        return false;
      }
      wx.getStorage({
        key: 'idNum',
        success: function (res) {
          var member_no = res.data.member_no;
          common.ajaxGet(
            '/api/check/context', {
              context: value,
              memberNo: res.data.member_no
            },
            function (data) {
              if (data.code == 200) {
                common.ajaxPost('/api/NoteAndArticleComment/addComment', {
                    pid: type,
                    context: value,
                    member_no: res.data.member_no,
                    article_id: noteId,
                    nick_name: res.data.nickName,
                    head_url: res.data.headUrl
                  },
                  function (res) {

                    if (res.code != 200) {
                      wx.showToast({
                        title: '提交失败，请重试！',
                        icon: 'none'
                      })
                    } else if (res.code == 200) {
                      that.setData({
                        oldValue: value,
                        searchValue: ''
                      })
                      wx.showToast({
                        title: '发表成功',
                        icon: 'success',
                      })
                      that.getCommentList()
                      var data = {
                        action: 2,
                        chatMsg: {
                          msg: value,
                          send_user_id: member_no, //发送者
                          accept_user_id: that.data.authorMember, //接受者
                          id: '', //消息的接受
                          accept_type: 0, //0-普通会员（包括红人）  1-商家
                          send_type: 0, //0-普通会员（包括红人）  1-商家
                          sign_flag: 0, //0 未签收 1 签收
                          msgType: 5 //5评论 
                        },
                        extend: noteId, //扩展字段文章id
                        extend_nother: 1, //1评论作品 2评论回复
                      }
                      that.sendSocketMessage(data)
                    }
                  })
              } else {
                wx.showToast({
                  title: data.message,
                  icon: 'none'
                })
              }
            }
          )
        }
      })
    } else {
      wx.showToast({
        title: '请先输入内容',
        icon: 'none'
      })
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
    this.submit()
  },
  // 输入框
  getInputValues: function (e) {
    this.setData({
      searchValues: e.detail.value
    })
  },
  // 回车搜索
  searchHandles: function () {
    this.submits()
  },
  // 回复
  submits: function () {
    var value = this.data.searchValues
    var type = this.data.pid
    var that = this;
    value = common.trim(value);
    if (value == "") {
      wx.showToast({
        title: '评论不得为空',
        icon: 'none'
      })
      return false;
    }

    if (value.length > 300) {
      wx.showToast({
        title: '输入超过300了',
        icon: 'none'
      })
      return false;
    }

    if (value) {
      var oldValue = this.data.oldValue;
      var noteId = this.data.noteId;
      // var type = this.data.type;
      if (value == oldValue) {
        wx.showToast({
          title: '请勿提交重复数据！',
          icon: 'none'
        })
        return false;
      }
      wx.getStorage({
        key: 'idNum',
        success: function (res) {
          var member_no = res.data.member_no;
          common.ajaxGet(
            '/api/check/context', {
              context: value,
              memberNo: res.data.member_no
            },
            function (data) {
              if (data.code == 200) {
                common.ajaxPost('/api/NoteAndArticleComment/addComment', {
                    pid: type,
                    context: value,
                    member_no: res.data.member_no,
                    article_id: noteId,
                    nick_name: res.data.nickName,
                    head_url: res.data.headUrl
                  },
                  function (res) {

                    if (res.code != 200) {
                      wx.showToast({
                        title: '提交失败，请重试！',
                        icon: 'none'
                      })
                    } else if (res.code == 200) {
                      that.setData({
                        oldValue: value,
                        reply: false,
                        searchValues: ''
                      })
                      //评论回复订阅消息
                      wx.showToast({
                        title: '发表成功',
                        icon: 'success',
                      })
                      that.getCommentList()
                      var data = {
                        action: 2,
                        chatMsg: {
                          msg: value,
                          send_user_id: member_no, //发送者
                          accept_user_id: that.data.authorMember, //接受者
                          id: '', //消息的接受
                          accept_type: 0, //0-普通会员（包括红人）  1-商家
                          send_type: 0, //0-普通会员（包括红人）  1-商家
                          sign_flag: 0, //0 未签收 1 签收
                          msgType: 5 //5评论 
                        },
                        extend: noteId, //扩展字段文章id
                        extend_nother: 1, //1评论作品 2评论回复
                      }
                      that.sendSocketMessage(data)
                    }
                  })
              } else {
                wx.showToast({
                  title: data.message,
                  icon: 'none'
                })
              }
            }
          )
        }
      })
    } else {
      wx.showToast({
        title: '请先输入内容',
        icon: 'none'
      })
    }
  },
  // 评论列表
  getCommentList: function () {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {

        common.ajaxGet(
          '/api/NoteAndArticleComment/commentList', {
            article_id: that.data.noteId || '',
            member_no: res.data.member_no
          },
          function (data) {
            if (data.code == 200) {
              var arr = data.data;
              that.setData({
                commentList: arr,
              })
            }
          }
        )
      }
    })
  },
  // 点赞
  zan: function (e) {

    var like_type = e.currentTarget.dataset.type;
    var like_id = e.currentTarget.id;
    var flag = this.data.flag;
    var like = parseInt(this.data.like);
    var isZan = this.data.isZan;
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        var member_no = res.data.member_no
        common.ajaxGet(
          '/api/NoteAndArticleComment/commentLike', {
            like_type: like_type, //1-笔记  2-文章  5-评论
            like_id: like_id,
            member_no: member_no,
          },
          function (res) {

            if (res.code == 200 && flag == 0) {
              wx.showToast({
                title: '点赞成功',
              })
              var data = {
                action: 2,
                chatMsg: {
                  msg: '赞了你的作品',
                  send_user_id: member_no, //发送者
                  accept_user_id: that.data.authorMember, //接受者
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
              that.setData({
                like: like + 1,
                isZan: !isZan,
                flag: 1
              })
              var param = {
                memberNo: member_no,
                title: that.data.noteDetails.title.slice(0, 20)
              }
              wx.requestSubscribeMessage({ //帖子被赞授权订阅消息
                tmplIds: ['QM-TyWar5R3GfNYeDQhbWsc4EcfdzPUb94Qw3_lnU3Y'],
                success(res) {
                  //   common.userFrom(param, function (res) {
                  //     console.log(res);
                  //   })
                }
              })
            } else if (flag == 1) {
              wx.showToast({
                title: '取消点赞',
                icon: 'none'
              })
              that.setData({
                like: like - 1,
                isZan: !isZan,
                flag: 0
              })
            }
            that.getCommentList() //评论列表
            that.noteDetails()
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
  // 点赞
  zan1: function (e) {
    var like_id = e.currentTarget.id;
    var flag = e.currentTarget.dataset.flag;

    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        var member_no = res.data.member_no;
        common.ajaxGet(
          '/api/NoteAndArticleComment/commentLike', {
            like_type: 6, //1-笔记  2-文章  5-评论
            like_id: like_id,
            member_no: res.data.member_no,
          },
          function (res) {

            if (res.code == 200 && flag == 0) {
              wx.showToast({
                title: '点赞成功',
              })
              var data = {
                action: 2,
                chatMsg: {
                  msg: '赞了你的评论',
                  send_user_id: member_no, //发送者
                  accept_user_id: that.data.authorMember, //接受者
                  id: '', //消息的接受
                  accept_type: 0, //0-普通会员（包括红人）  1-商家
                  send_type: 0, //0-普通会员（包括红人）  1-商家
                  sign_flag: 0, //0 未签收 1 签收
                  msgType: 4 //4点赞 
                },
                extend: that.data.noteId, //扩展字段文章id
                extend_nother: ''
              }
              that.sendSocketMessage(data)

            } else if (flag == 1) {
              wx.showToast({
                title: '取消点赞',
                icon: 'none'
              })

            }
            that.getCommentList() //红人笔记
          },
        )
      }
    })
  },
  // 阅读数
  getRedNum: function () {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxGet(
          '/api/NoteAndArticleComment/readNumAdd', {
            article_id: that.data.noteId || '',
          },
          function (data) {
            that.setData({
              myHeadUrl: res.data.headUrl,
              myNickName: res.data.nickName,

            })
          },
        )
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  // 关闭弹框
  closeZz: function (e) {
    this.setData({
      display: 1,
    })
  },
  other() {
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
    this.setData({
      display: 2,

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
            article_id: that.data.noteId,
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
                  that.noteDetails() //
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
    var id = this.data.authorMember;
    var type = e.currentTarget.dataset.type;
    var rewardList = JSON.stringify(this.data.rewardList);
    var artPayVOS = JSON.stringify(this.data.artPayVOS);
    if (id == this.data.mymember_no) { //是该文章的作者
      wx.navigateTo({
        url: '/pages/dashang/dashang?rewardList=' + encodeURIComponent(rewardList) + '&artPayVOS=' + encodeURIComponent(artPayVOS) + '&type=' + type
      })
    } else {
      this.setData({
        display: 2,
      })

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

              var code = res.code;

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
                        that.loadInfo() //位置授权 
                        // 小程序码
                        if (that.data.scene && that.data.scene != '' && that.data.scene != undefined) {
                          that.getScene()
                        } else {
                          that.noteDetails() // 笔记详情
                          that.getCommentList() //评论列表
                          that.getRedNum() //阅读数  
                        }


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
      }
    })
  },
  loadCity: function (longitude, latitude) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({
      key: markersData.key
    });
    myAmapFun.getRegeo({
      location: '' + longitude + ',' + latitude + '', //location的格式为'经度,纬度'
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

        that.setData({
          cityName: data[0].regeocodeData.addressComponent.city != '' ? data[0].regeocodeData.addressComponent.city : data[0].regeocodeData.addressComponent.province,
        })
      }
    });

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log(this.data.noteDetails.pid)
    var noteId = this.data.noteDetails.pid; //笔记ID
    var headUrl = this.data.noteDetails.headUrl; //作者头像
    var nickName = this.data.noteDetails.nickName; //作者昵称
    var sign = this.data.noteDetails.sign; //作者标签

    var type = this.data.noteDetails.type; //1-小程序发布笔记 2-小程序发布文章 3-后台发布 4后台抓取
    var comment = this.data.noteDetails.comment_num; //评论数
    var like = this.data.noteDetails.like_num; //点赞数
    var read = this.data.noteDetails.read_num; //阅读数
    var flag = this.data.noteDetails.collecNum; //是否点赞
    var authorMember = this.data.noteDetails.member_no; //作者ID
    var time = this.data.noteDetails.time; //笔记时间

    var title = this.data.noteDetails.title;
    var videoUrls = this.data.noteDetails.videoUrls;
    // 关联的商品
    var spu = this.data.noteDetails.spu_no;
    var goods_name = this.data.noteDetails.spu_name;

    var choice = this.data.noteDetails.category_choice;

    return {
      title: title,
      path: '/pages/myNote_detail/myNote_detail?headUrl=' + headUrl + '&noteId=' + noteId + '&nickName=' + nickName + '&sign=' + sign + '&member_no=' + authorMember + '&type=' + type + '&comment=' + comment + '&like=' + like + '&read=' + read + '&flag=' + flag + '&time=' + time + '&video=' + videoUrls + '&spu=' + spu + '&goods_name=' + goods_name + '&choice=' + choice + '&title=' + title,
      imageUrl: '',
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
  },
  showPopup() {
    this.setData({
      shows: true
    });
  },

  onCloses() {
    this.setData({
      shows: false
    });
  },
  onImgOK(event) {
    this.setData({
      imagePath: event.detail.path
    })
  },
  /* 弹窗的时候 阻止冒泡 */
  myCatchTouch: function () {
    console.log('stop user scroll it!');
    return;
  },
  /// 创建海报
  createPoster: function (e) {
    this.setData({
      shows: false
    });
    var that = this
    wx.showLoading({
      title: '正在生成图片...',
    })
    if (this.data.type == 5) {
      this.setData({
        template1: that.palette1(),
      })
    } else {
      // palette是富文本的文章,生成海报有问题
      this.setData({
        template: that.palette(),
      })
    }

    setTimeout(function () {
      wx.hideLoading()
      that.setData({

        isCreate: true,
        isShow: true
      });
    }, 1000)

  },
  /// 隐藏
  catchtap: function (callback) {
    this.setData({
      isShow: false
    })
    setTimeout(() => {
      this.setData({
        isCreate: false
      })
      if (callback && typeof callback == "function") {
        callback();
      }
    }, 400)
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
              _this.catchtap(() => {
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
  // 文章
  palette() {
    var that = this
    var pageUrl = "pages/myNote_detail/myNote_detail"
    let contents =that.deleteHtmlTag(that.data.noteDetails.content)
    console.log('过滤的内容',contents);
    return ({
      width: '610rpx',
      height: '1068rpx',
      views: [{
          type: 'image',
          url: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/blog/2021-06-03/background1.jpg',
          css: {
            width: '610rpx',
            height: '1068rpx',
          },
        },
        {
          type: 'image',
          url: that.data.noteDetails.headUrl,
          css: {
            width: '50px',
            height: '50px',
            top: `26px`,
            left: `18px`,
            borderRadius: "25px"
          },
        },
        {
          type: 'image',
          url: '/img/icon/hong.png',
          css: {
            width: '12px',
            height: '12px',
            top: `65px`,
            left: `55px`,
          },
        },

        {
          type: 'text',
          text: that.data.noteDetails.nickName,
          css: {
            top: `23px`,
            left: `76px`,
            width: '100px',
            maxLines: `1`,
            fontWeight: '400',
            fontSize: '16px',
            color: '#000000'
          }
        },
        {
          type: 'image',
          url: '/img/icon/vip.png',
          css: {
            width: '20px',
            height: '18px',
            top: `23px`,
            left: `170px`,
          },
        },
        {
          type: 'text',
          text: that.data.noteDetails.sign,
          css: {
            top: `50px`,
            left: `76px`,
            width: '200px',
            maxLines: `1`,
            fontWeight: '400',
            fontSize: '12px',
            color: '#686868'
          }
        },
        {
          type: 'text',
          text: that.data.noteDetails.create_time,
          css: {
            top: `98px`,
            left: `20px`,
            width: '130px',
            maxLines: `1`,
            fontWeight: '400',
            fontSize: '12px',
            color: '#666666'
          }
        },
        {
          type: 'text',
          text: contents,
          css: {
            top: `126px`,
            left: `20px`,
            width: '270px',
            maxLines: !that.data.noteDetails.images[0] ? '8' : '4',
            fontWeight: '400',
            fontSize: '16px',
            lineHeight: '23px',
            color: '#000000'
          }
        },
        {
          type: 'image',
          url: that.data.noteDetails.images[0] ? that.data.noteDetails.images[0] : '',
          css: {
            width: '160rpx',
            height: '160rpx',
            top: `214px`,
            left: `20px`,
            borderRadius: "5px"
          },
        },
        {
          type: 'image',
          url: that.data.noteDetails.images[1] ? that.data.noteDetails.images[1] : '',
          css: {
            width: '160rpx',
            height: '160rpx',
            top: `214px`,
            left: `105px`,
            borderRadius: "5px"
          },
        },
        {
          type: 'image',
          url: that.data.noteDetails.images[2] ? that.data.noteDetails.images[2] : '',
          css: {
            width: '160rpx',
            height: '160rpx',
            top: `214px`,
            left: `190px`,
            borderRadius: "5px"
          },
        },

        {
          type: 'image',
          url: that.data.myHeadUrl,
          css: {
            width: '80rpx',
            height: '80rpx',
            top: `688rpx`,
            left: `26rpx`,
            borderRadius: "40rpx"
          },
        },
        {
          type: 'text',
          text: that.data.myNickName,
          css: {
            top: `686rpx`,
            left: `62px`,
            width: '180rpx',
            maxLines: `1`,
            fontWeight: '400',
            fontSize: '32rpx',
            color: '#000000'
          }
        },
        {
          type: 'text',
          text: '为你推荐',
          css: {
            top: `690rpx`,
            left: `165px`,
            width: '160rpx',
            maxLines: `1`,
            fontWeight: '400',
            fontSize: '28rpx',
            color: '#000000'
          }
        },
        {
          type: 'text',
          text: '我在第一房发现了优质文章',
          css: {
            top: `740rpx`,
            left: `63px`,
            width: '444rpx',
            maxLines: `1`,
            fontWeight: '400',
            fontSize: '14px',
            color: '#6D6D6D'
          }
        },

        {
          type: 'image',
          url: "https://58hongren.com/api/create/produceCodeNote?page=" + pageUrl + "&headUrl=" + that.data.noteDetails.headUrl + '&nickName=' + that.data.noteDetails.nickName + '&sign=' + that.data.noteDetails.sign + '&member_no=' + that.data.noteDetails.member_no + '&type=' + that.data.noteDetails.type + '&comment=' + that.data.noteDetails.comment_num + '&like=' + that.data.noteDetails.like_num + '&read=' + that.data.noteDetails.read_num + '&flag=' + that.data.noteDetails.collecNum + '&time=' + that.data.noteDetails.create_time + '&video=' + that.data.noteDetails.videoUrls + '&spu=' + that.data.noteDetails.spu_no + '&goods_name=' + that.data.noteDetails.spu_name + '&choice=' + that.data.noteDetails.category_choice + '&noteId=' + that.data.noteId + '&title=' + that.data.noteDetails.title,
          css: {
            width: '45px',
            height: '45px',
            top: `814rpx`,
            left: `260rpx`
          },
        },
        {
          type: 'text',
          text: '长按识别二维码，查看更多完整内容',
          css: {
            bottom: `126rpx`,
            left: `40px`,
            width: '250px',
            maxLines: `1`,
            fontWeight: '400',
            fontSize: '14px',
            color: '#6D6D6D'
          }
        },

      ]
    })
  },
  // 快讯
  palette1() {
    var that = this
    var pageUrl = "pages/myNote_detail/myNote_detail"
    console.log(that.data.noteDetails.content);
    return ({
      width: '610rpx',
      height: '992rpx',
      views: [{
          type: 'image',
          url: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/blog/2021-06-03/background2.jpg',
          css: {
            width: '610rpx',
            height: '992rpx',
          },
        },

        {
          type: 'text',
          text: that.data.noteDetails.create_time,
          css: {
            top: `64px`,
            left: `20px`,
            width: '300rpx',
            maxLines: `1`,
            fontWeight: '400',
            fontSize: '14px',
            color: '#666666'
          }
        },
        {
          type: 'text',
          text: '【' + that.data.noteDetails.title + '】',
          css: {
            top: `220rpx`,
            left: `40rpx`,
            width: '540rpx',
            maxLines: `2`,
            fontWeight: '900',
            fontSize: '16px',
            lineHeight: '21px',
            color: '#000000'
          }
        },
        {
          id: 'my-content',
          type: 'text',
          text: that.data.noteDetails.content,
          css: {
            top: `334rpx`,
            left: `44rpx`,
            width: '540rpx',
            fontWeight: '400',
            maxLines: `9`,
            fontSize: '12px',
            lineHeight: '20px',
            color: '#3C3B3B'
          }
        },

        {
          type: 'image',
          url: that.data.myHeadUrl,
          css: {
            width: '80rpx',
            height: '80rpx',
            top: `760rpx`,
            left: `43rpx`,
            borderRadius: "40rpx"
          },
        },
        {
          type: 'text',
          text: that.data.myNickName,
          css: {
            top: `780rpx`,
            left: `156rpx`,
            width: '230rpx',
            maxLines: `1`,
            fontWeight: '400',
            fontSize: '32rpx',
            color: '#000000'
          }
        },
        // {
        //   type: 'image',
        //   url: '/img/icon/vip.png',
        //   css: {
        //     width: '20px',
        //     height: '18px',
        //     top: `690rpx`,
        //     left: `170px`,
        //   },
        // },

        {
          type: 'image',
          url: "https://58hongren.com/api/create/produceCodeNote?page=" + pageUrl + "&headUrl=" + that.data.noteDetails.headUrl + '&nickName=' + that.data.noteDetails.nickName + '&sign=' + that.data.noteDetails.sign + '&member_no=' + that.data.noteDetails.member_no + '&type=' + that.data.noteDetails.type + '&comment=' + that.data.noteDetails.comment_num + '&like=' + that.data.noteDetails.like_num + '&read=' + that.data.noteDetails.read_num + '&flag=' + that.data.noteDetails.collecNum + '&time=' + that.data.noteDetails.create_time + '&video=' + that.data.noteDetails.videoUrls + '&spu=' + that.data.noteDetails.spu_no + '&goods_name=' + that.data.noteDetails.spu_name + '&choice=' + that.data.noteDetails.category_choice + '&noteId=' + that.data.noteId + '&title=' + that.data.noteDetails.title,
          css: {
            width: '124rpx',
            height: '124rpx',
            top: `734rpx`,
            left: `444rpx`
          },
        },


      ]
    })
  },
  // 过滤html标签
 deleteHtmlTag(str){
  str = str.replace(/<[^>]+>|&[^>]+;/g,"").trim();//去掉所有的html标签和&nbsp;之类的特殊符合
  return str;
 }
})
