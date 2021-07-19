// pages/myWindow/myWindow.js
const app = getApp();
var common = require("../../utils/common.js");
// var echarts = require("../../ec-canvas/echarts.js");
// import * as echarts from '../../ec-canvas/echarts';
let chart = null;
// 2、进行初始化数据
function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    color: ['#37a2da', '#32c5e9', '#67e0e3'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data: ['热度', '正面', '负面']
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 15,
      top: 40,
      containLabel: true
    },
    xAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    yAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: ['汽车之家', '今日头条', '百度贴吧', '一点资讯', '微信', '微博', '知乎'],
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    series: [
      {
        name: '热度',
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'inside'
          }
        },
        data: [300, 270, 340, 344, 300, 320, 310],
        itemStyle: {
          // emphasis: {
          //   color: '#37a2da'
          // }
        }
      },
      {
        name: '正面',
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: true
          }
        },
        data: [120, 102, 141, 174, 190, 250, 220],
        itemStyle: {
          // emphasis: {
          //   color: '#32c5e9'
          // }
        }
      },
      {
        name: '负面',
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: true,
            position: 'left'
          }
        },
        data: [-20, -32, -21, -34, -90, -130, -110],
        itemStyle: {
          // emphasis: {
          //   color: '#67e0e3'
          // }
        }
      }
    ]
  };

  chart.setOption(option);
  return chart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart // 3、将数据放入到里面
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        that.setData({
          nickName: res.data.nickName,//昵称
          headUrl: res.data.headUrl,//头像
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
    this.huiyuan()//  会员绑定列表
  },
  // 数据表
  getData:function(){
    
  },
//  会员绑定列表
  huiyuan: function (pageIndex = 1){
  var that = this;
  wx.getStorage({
    key: 'idNum',
    success: function (res) {
      wx.request({
        url: app.globalData.URL + '/api/window/memberList',
        data: {
          member_no_me: res.data.member_no,
          pageIndex: pageIndex,
          pageSize:10
        },
        method: 'GET',
        header: {
          "token": res.data.token,
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          that.setData({
            huiyuanList: res.data.data.list,
            pageIndex: res.data.data.pageNum,//当前页
            pages: res.data.data.pages,//总页数
            total: res.data.data.total,//总个数
          })
        }
      })
    }
  })
},
  // 我的橱窗
  myDow:function(){
    wx.navigateTo({
      url: '/pages/myDow/myDow',
    })
  },
// 关注
  guanZhu: function (e) {
    var that = this;
    var flag = e.currentTarget.id;
    var member = e.currentTarget.dataset.id;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        console.log(res.data.member_no);
        wx.request({
          url: app.globalData.URL + 'api/redAndOfficeGroup/follow',
          data: {
            member_no_me: res.data.member_no,
            member_no_other: member,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(flag)
            if (res.data.code == 200 && flag == 0) {
              wx.showToast({
                title: '关注成功',
              })
            } else if (res.data.code == 200 && flag == 1) {
              wx.showToast({
                title: '取消关注',
                icon: 'none'
              })
            } else if (res.data.code == 500) {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
            }
            that.huiyuan()//会员列表

          }
        })
      },
    })
  },
  // 红人店铺
  redShop: function (e) {
    // console.log(e)
    var member = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/redHome/redHome?member=' + member,
    })
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
    var pages = that.data.pages;//总页数
    var pageIndex = that.data.pageIndex;//当前页数
    if (pageIndex < pages) {
      // 显示加载图标
      // wx.showLoading({
      //   title: '加载中',
      // })
      wx.getStorage({
        key: 'idNum',
        success: function (res) {
          common.ajaxGet('/api/window/memberList',
            {
              member_no_me: res.data.member_no,
              pageIndex: pageIndex + 1,
              pageSize: 10
            },
            function (data) {
              wx.hideLoading()
              if (data.code == 200) {
                that.setData({
                  huiyuanList: that.data.huiyuanList.concat(data.data.list),
                  pages: data.data.pages,//总页数
                  pageIndex: data.data.pageNum,//当前页数
                  total: data.data.total,//总个数
                })
              }
            })
        }

      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})