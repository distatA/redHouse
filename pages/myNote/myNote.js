// pages/myNote/myNote.js
const app = getApp();
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      member: options.member
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
    this.getRedNote()//笔记
  },
  // 红人笔记
  getRedNote: function (pageSize=50) {
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
            pageSize: 10,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {
            if(res.data.code==200){
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
                pageIndex: res.data.data.pageNum,//当前页个数
                pages: res.data.data.pages,//总个数
              })
            }
           
          }
        })
      },
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
  // 笔记详情
  noteDetail: function (e) {
    console.log(e)
    var noteId = e.currentTarget.id;
    var type = e.currentTarget.dataset.type;//1-小程序发布笔记 2-小程序发布文章 3-后台发布 4后台抓取
    var comment = e.currentTarget.dataset.comment;
    var like = e.currentTarget.dataset.like;
    var read = e.currentTarget.dataset.read;
    var flag = e.currentTarget.dataset.flag;
    var member = e.currentTarget.dataset.member;
    var time = e.currentTarget.dataset.time;
    var headUrl = e.currentTarget.dataset.headurl;
    var nickName = e.currentTarget.dataset.nickname;
    var img = e.currentTarget.dataset.img;//一张图片
    var imgs = e.currentTarget.dataset.imgs;//多张图片
    var video = e.currentTarget.dataset.video;
    var title = e.currentTarget.dataset.title;
    // console.log(nickName, time,img)
    wx.navigateTo({
      url: '/pages/myNote_detail/myNote_detail?noteId=' + noteId + '&headUrl=' + headUrl + "&nickName=" + nickName + '&type=' + type + '&comment=' + comment + '&like=' + like + '&read=' + read + '&flag=' + flag + '&member=' + member + '&time=' + time + '&img=' + img + '&video=' + video + '&imgs=' + imgs + '&title=' + title,
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
  // 点赞
  zan:function(e){
    console.log(e)
    var like_type = e.currentTarget.dataset.type;
    var like_id = e.currentTarget.id;
    // var member_no = e.currentTarget.dataset.member;
    var flag = e.currentTarget.dataset.flag;
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        var member_no= res.data.member_no;
    common.ajaxGet(
      '/api/NoteAndArticleComment/commentLike', {
        like_type: like_type, //1-笔记  2-文章  3-评论
        like_id: like_id,
        member_no: res.data.member_no,
      },
      function (res) {
        
        if (res.code == 200 && flag==0){
          wx.showToast({
            title: '点赞成功',
          })
          var data = {
            action: 2,
            chatMsg: {
              msg: '赞了你的作品',
              send_user_id: member_no,//发送者
              accept_user_id: that.data.member,//接受者
              id: '',//消息的接受
              accept_type: 0, //0-普通会员（包括红人）  1-商家
              send_type: 0,//0-普通会员（包括红人）  1-商家
              sign_flag: 0,//0 未签收 1 签收
              msgType: 4 //4点赞 
            },
            extend: like_id,//扩展字段文章id
            extend_nother: ''
          }
          that.sendSocketMessage(data)
         
        } else if (flag==1){
          wx.showToast({
            title: '取消点赞',
            icon:'none'
          })
        
        }
        that.getRedNote()//红人笔记
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
  // 链接
  shop: function (e) {

    var id = e.currentTarget.dataset.id;
    var goods_name = e.currentTarget.dataset.goods_name;
    var member_no = e.currentTarget.dataset.member_no;
    if (id == 1) {//房产
      wx.navigateTo({
        url: '/pages/huose/huose?shopId=' + e.currentTarget.id + '&category_id=' + id + '&goods_name=' + goods_name + '&member_no=' + member_no,
      })
    } else {
      wx.navigateTo({
        url: '/pages/home_page/good_detail/good_detail?shopId=' + e.currentTarget.id + '&category_id=' + id + '&goods_name=' + goods_name + '&member_no=' + member_no,
      })
    }

  },
  // 点赞
  // zan: function (e) {
  //   console.log(e)
  //   var like_type = e.currentTarget.dataset.type;
  //   var like_id = e.currentTarget.id;
  //   var flag = e.currentTarget.dataset.flag;
  //   var that = this;
  //   // if (like_type == 3 || like_type == 4){
  //   //   like_type = 2
  //   // }
  //   wx.getStorage({
  //     key: 'idNum',
  //     success: function (res) {
  //       common.ajaxGet(
  //         '/api/NoteAndArticleComment/commentLike', {
  //           like_type: like_type, //1-笔记  2-文章  3-评论
  //           like_id: like_id,
  //           member_no: res.data.member_no,
  //         },
  //         function (res) {
  //           console.log(flag)
  //           if (res.code == 200 && flag == 0) {
  //             wx.showToast({
  //               title: '点赞成功',
  //             })
  //           } else if (flag == 1) {
  //             wx.showToast({
  //               title: '取消点赞',
  //               icon: 'none'
  //             })
  //           }
            
  //         },
  //       )
  //     }
  //   })
  // },
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
    var that = this;
    var pages = this.data.pages;//总个数
    var pageIndex = this.data.pageIndex;//当前页个数
    if (pageIndex < pages) {
      // 显示加载图标
      // wx.showLoading({
      //   title: '加载中...',
      // })
      wx.getStorage({
        key: 'idNum',
        success: function (res) {
          // console.log(res.data);
          wx.request({
            url: app.globalData.URL + '/api/redAndOfficeGroup/redAndOfficeNoteHot',
            data: {
              member_no_other: that.data.member,
              member_no: res.data.member_no,
              pageIndex: pageIndex+1,
              pageSize: 10,
            },
            method: 'GET',
            header: {
              "token": res.data.token,
              'content-type': 'application/json'
            },
            success: function (res) {
              wx.hideLoading()
              if (res.data.code == 200) {
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
                  redNotes: (that.data.redNotes).concat(newArr),
                  pageIndex: res.data.data.pageNum,//当前页个数
                  pages: res.data.data.pages,//总个数
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
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})