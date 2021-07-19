// pages/comment/comment.js
const app = getApp();
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moren:0,
    num: 0,
    oldValue: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      noteId: options.noteId,
      nickName: options.nickName,
      headUrl: options.headUrl,
      type: options.type,//0写评论 x回复
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
// 匿名
  changeMoren: function () {
    if (this.data.moren == 0) {
      this.setData({
        moren: 1
      })
      this.randomWord()
    } else {
      this.setData({
        moren: 0
      })
    }
   
  },
randomWord:function () {

    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    var nums = "";
    for(var i = 0; i< 5; i++) {
      var id = parseInt(Math.random() * 61);
      nums += chars[id];
    }
  // console.log(nums)
    this.setData({
      anonymity:nums
    })


},

// 鼠标获取焦点
  bindTextAreaBlur: function (e) {
    var value = common.trim(e.detail.value);
    if (value.length > 300) {
      wx.showToast({
        title: '输入超过300了',
        icon: 'none'
      })
    }
    this.setData({
      textValue: value,
      num: value.length
    })
  },
// 发布
  submit: function () {
    var value = this.data.textValue
    var type = this.data.type
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
      var type = this.data.type;
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
            common.ajaxGet(
              '/api/check/context',
              {
                context: value,
                memberNo: res.data.member_no
              },
              function (data) {
                if (data.code == 200) {
                  common.ajaxPost('/api/NoteAndArticleComment/addComment',
                    {
                      pid: type,
                      context: value,
                      member_no: res.data.member_no,
                      article_id: noteId,
                      nick_name: res.data.nickName,
                      head_url: res.data.headUrl
                    },
                    function (res) {
                      console.log(res)
                      if (res.code != 200) {
                        wx.showToast({
                          title: '提交失败，请重试！',
                          icon: 'none'
                        })
                      } else if (res.code == 200) {
                        that.setData({
                          oldValue: value
                        })
                        wx.showToast({
                          title: '发表成功',
                          icon: 'success',
                          success: function () {
                            setTimeout(that.goBack, 1000)
                          }
                        })
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
  goBack: function () {
  
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2];
    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    console.log(this.data.anonymity)
    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      anonymity: this.data.anonymity
    })
    //最后就是返回上一个页面。
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    })
  
    clearTimeout();
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