// pages/post/post.js
const app = getApp();
var common = require("../../utils/common.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    moren: 1,
    num: 0,
    num1: 0,
    oldValue: "",
    luStatu: false,//di'bu
    list: [],
    width: 0,
    fileList: [],
    open: false,
    isDel: false,
    imageUrl: [],
    isUpLoad: false,
    imageUrlBackUp: [],
    newUpLoad: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options) {
      this.setData({
        postId: options.postId,//1发笔记 2发快讯
        goods_name: options.goods_name ? options.goods_name : '',
        category_choice: options.category_choice ? options.category_choice : '',//1房产
        price: options.price ? options.price : '',
        first_price: options.first_price ? options.first_price : '',
        low_price: options.low_price ? options.low_price : '',
        spu_image: options.spu_image ? options.spu_image : '',
        spu_no: options.spu_no ? options.spu_no : '',
        imageUrl: options.imageUrl ? JSON.parse(options.imageUrl) : '',
        textValue: options.textValue ? options.textValue : '',//笔记内容
        textValue1: options.textValue1 ? options.textValue1 : '',//快讯标题
        textValue2: options.textValue2 ? options.textValue2 : '',//快讯内容
        // 发起投票数据
        listIndex: options.listIndex ? JSON.parse(decodeURIComponent(options.listIndex)) : '',//选项标题
        voteTitle: options.voteTitle ? options.voteTitle : '',//投票标题
        radio: options.radio ? options.radio : '',//1单选 2多选
        currentTab: options.currentTab ? options.currentTab : '',//0 文字 1图片
        userDate: options.userDate ? options.userDate : '',//开始时间
        userDate2: options.userDate2 ? options.userDate2 : '',//结束时间
        imgList: options.imgList ? options.imgList : '',//图片投票
        imgList2: options.imgList2 ? options.imgList2 : '',//图片投票
        imgTitle1: options.imgTitle1 ? options.imgTitle1 : '',//图文标题
        imgTitle2: options.imgTitle2 ? options.imgTitle2 : '',//图文标题
      })
      if (options.postId == 2) {
        wx.setNavigationBarTitle({
          title: '发布快讯'
        })
      }
      if (options.voteTitle && options.voteTitle != 'undefined') {
        this.setData({
          isDel: true
        })
      }

    }
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
    this.getHong()//判断是否是红人 
  },
  // 删除图片
  delete(e) {
    console.log(e);
    let { id } = e.currentTarget.dataset;
    let image = this.data.imageUrl
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          image.splice(id, 1)
          that.setData({
            imageUrl: image,
          });
        }
      }
    })

  },
  // 上传图片
  addImg: function () {
    let _this = this;
    if (_this.data.videoUrls) {
      wx.showToast({
        title: "图片与视频不能同时上传",
        icon: 'none'
      })
    } else {
      wx.chooseImage({
        count: 9, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          let tempFilePaths = res.tempFilePaths;
          var tempFilesSize = res.tempFiles[0].size
          console.log(tempFilesSize, tempFilePaths)

          if (res.tempFiles[0].size <= 1048576) {
            wx.showLoading({
              title: '图片上传中...',
            });
            //图片压缩接口，需要真机才能
            var imageUrl = [];
            var imageUrls = [];
            let newUpLoad = tempFilePaths.map((v) => {
              v = { imageUrl: v }
              return v
            })
            if (_this.data.imageUrl && imageUrl.length < 9) {
              _this.setData({
                newUpLoad
              })
            }
            for (var i = 0; i < tempFilePaths.length; i++) {

              wx.compressImage({
                src: tempFilePaths[i], // 图片路径
                quality: 80, // 压缩质量
                success: function (res) {
                  wx.uploadFile({
                    url: common.getHeadStr() + '/api/upload/uploadFile',
                    filePath: res.tempFilePath,
                    name: 'file',
                    header: {
                      "token": _this.data.token,
                      'content-type': 'application/json'
                    },
                    success: function (res) {
                      var fa = JSON.parse(res.data)
                      // console.log(fa.data, 'fadata')
                      if (fa.code == 200) {
                        imageUrl.push({ "imageUrl": common.getHeadImg() + fa.data })
                        imageUrls.push(common.getHeadImg() + fa.data)
                        // 检查图片是否违规
                        common.ajaxPost(
                          '/api/check/imageCheck',
                          {
                            urls: imageUrls
                          },
                          function (data) {
                            // console.log(data, 'data');
                            if (data.code == 200) {
                              var num = false;
                              for (let i = 0; i < data.data.length; i++) {
                                for (let j = 0; j < data.data[i].sceneList.length; j++) {
                                  console.log('是不是已通过', data.data[i].sceneList[j].code == 'pass')
                                  if (data.data[i].sceneList[j].code != 'pass') {
                                    wx.showToast({
                                      title: data.data[i].sceneList[j].result,
                                      icon: 'none'
                                    })
                                    num = true;
                                    return false;
                                  }
                                }
                              }
                              if (!num && _this.data.imageUrl < 9) {
                                wx.showToast({
                                  title: '上传成功'
                                })
                                _this.setData({
                                  isUpLoad: true,
                                  imageUrlBackUp: imageUrl
                                });
                              }
                            } else {
                              return false;
                            }
                          }
                        )
                      }
                    },
                    complete: function () {
                      wx.hideLoading();
                    }
                  })
                }
              })
            }
            setTimeout(() => {
              let { imageUrlBackUp, imageUrl, isUpLoad, newUpLoad } = _this.data
              console.log(imageUrl.length, '长度 ');
              let length = imageUrl.length + newUpLoad.length
              //添加
              if (isUpLoad && length <= 9 && newUpLoad.length == 0) {
                _this.setData({
                  imageUrl: [...imageUrl, ...imageUrlBackUp],
                });
                //追加
              } else if (isUpLoad && length <= 9 && imageUrl.length > 0 && newUpLoad) {
                _this.setData({
                  imageUrl: [...imageUrl, ...newUpLoad],
                });
              }
              else {
                wx.showToast({
                  icon: 'none',
                  title: '只能上传九张~'
                })
              }
            }, 3000)
          } else {
            wx.showToast({
              title: '上传图片过大',
              icon: 'none'
            })
          }
        }
      })
    }
  },
  // 发起投票
  vote() {
    wx.navigateTo({
      url: '/pages/vote/vote?textValue=' + this.data.textValue + '&imageUrl=' + JSON.stringify(this.data.imageUrl) + '&goods_name=' + this.data.goods_name + '&first_price=' + this.data.first_price + '&low_price=' + this.data.low_price + '&spu_image=' + this.data.spu_image + '&spu_no=' + this.data.spu_no + '&category_choice=' + this.data.category_choice + '&price=' + this.data.price,
    })
  },
  // 删除投票
  del() {
    this.setData({
      isDel: false
    })
  },
  // 上传视频
  addVideoTap: function () {
    var that = this;
    console.log(that.data.imageUrl)
    if (!that.data.imageUrl) {
      //选择上传视频
      wx.chooseVideo({
        sourceType: ['album', 'camera'], //视频选择的来源
        //sizeType: ['compressed'],
        compressed: false,//是否压缩上传视频
        camera: 'back', //默认拉起的是前置或者后置摄像头
        success: function (res) {
          if (0 < res.duration <= 60) {
            //上传成功，设置选定视频的临时文件路径
            that.setData({
              videoUrl: res.tempFilePath
            });
            //在上传到服务器前显示加载中
            // wx.showLoading({
            //   title: '加载中...',
            //   icon: 'loading',
            // });
            //上传视频
            wx.uploadFile({
              url: common.getHeadStr() + '/api/upload/uploadFile', //开发者服务器的 url
              filePath: res.tempFilePath, // 要上传文件资源的路径 String类型！！！
              name: 'file', // 文件对应的 key ,(后台接口规定的关于图片的请求参数)
              header: {
                "token": that.data.token,
                'content-type': 'multipart/form-data'
              }, // 设置请求的 header

              success: function (res) {

                //上传成功后隐藏加载框
                wx.hideLoading();
                var fa = JSON.parse(res.data)
                console.log(fa)
                var fas = []
                fas.push(common.getHeadImg() + fa.data)

                if (fa.code == 200) {
                  common.ajaxPost(
                    '/api/check/videoCheck',
                    {
                      urls: fas
                    },
                    function (data) {
                      console.log(data)
                      if (data.code == 200) {
                        wx.showLoading({
                          title: '视频检测中...',
                          icon: 'loading',
                        });

                        var check = setInterval(function () {
                          common.ajaxPost(
                            '/api/check/videoCheckResult',
                            {
                              urls: data.data
                            },
                            function (data) {
                              wx.hideLoading();
                              console.log(data)
                              if (data.code == 200) {
                                var num = true;
                                if (data.data.length == 0) {
                                  num = false
                                }
                                for (let i = 0; i < data.data.length; i++) {
                                  for (let j = 0; j < data.data[i].sceneList.length; j++) {
                                    console.log(data.data[i].sceneList[j].code)
                                    console.log(data.data[i].sceneList[j].code == 'pass')
                                    if (data.data[i].sceneList[j].code != 'pass') {
                                      wx.showToast({
                                        title: data.data[i].sceneList[j].result,
                                        icon: 'none'
                                      })
                                      num = false;
                                      // return false;
                                    }
                                  }
                                }
                                console.log(num)
                                if (num) {
                                  wx.showToast({
                                    title: '上传成功'
                                  })
                                  that.setData({
                                    videoUrls: common.getHeadImg() + fa.data,//拼接域名
                                  })

                                  clearInterval(check)//清除定时器
                                }
                              }
                            }
                          )
                        }, 1000)

                        // that.setData({
                        //   videoUrls: common.getHeadImg() + fa.data,//拼接域名
                        // })

                      }
                    }
                  )


                }

              },
              fail: function (res) {
                wx.hideLoading();
                wx.showToast({
                  title: '视频上传失败',
                  icon: 'none'
                })

              }
            })
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '时间要大于1s小于60S',
              icon: 'none'
            })
          }

        }
      })
    } else {
      wx.showToast({
        title: "图片与视频不能同时上传",
        icon: 'none'
      })
    }
  },
  //判断是否是红人
  getHong: function () {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        that.setData({
          token: res.data.token
        })
        wx.request({
          url: app.globalData.URL + 'api/openShop/get',
          data: {
            member_no: res.data.member_no,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {

            if (res.data.code == 200) {
              that.setData({
                open: true
              })
            } else if (res.data.code == 401) {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
            } else {
              that.setData({
                open: false
              })
            }

          }
        })

      }
    })
  },
  // 鼠标获取焦点
  bindIuput: function (e) {

    var value = common.trim(e.detail.value);
    this.setData({
      textValue: value,
    })
  },

  // 快讯标题
  bindTextAreaBlur1: function (e) {
    var value = common.trim(e.detail.value);
    this.setData({
      textValue1: value,
      num: value.length
    })
  },
  // 快讯内容
  bindTextAreaBlur2: function (e) {
    var value = common.trim(e.detail.value);
    this.setData({
      textValue2: value,
      num1: value.length
    })
  },
  // 发布
  submit: common.throttle(function () {
    var type = this.data.type
    var that = this;
    if (that.data.postId == 1) {//发笔记
      var value = that.data.textValue;
      var title = that.data.textValue
    } else { //发快讯
      var value = that.data.textValue2;
      var title = that.data.textValue1;
      if (!title) {
        wx.showToast({
          title: '请填写标题',
          icon: 'none'
        })
        return false;
      }
      if (!value) {
        wx.showToast({
          title: '请填写内容',
          icon: 'none'
        })
        return false;
      }
    }

    var imageUrl = that.data.imageUrl ? that.data.imageUrl : '';
    var videoUrls = that.data.videoUrls ? that.data.videoUrls : '';


    if (value == '' && imageUrl == '' && videoUrls == '') {
      wx.showToast({
        title: '发布内容不能为空',
        icon: 'none'
      })

    } else {
      var oldValue = this.data.oldValue;
      var noteId = this.data.noteId;
      var type = this.data.type;

      wx.getStorage({
        key: 'idNum',
        success: function (res) {

          var memberNoteArticle = {};
          var memberNoteArticleImageList = [];//图片


          if (value != '') {
            memberNoteArticle.content = value
          }
          // if (videoUrls != '') {
          //   var videoUrls = videoUrls;
          // }
          if (imageUrl && imageUrl != '') {
            memberNoteArticleImageList = imageUrl;
          }
          if (that.data.moren == 1) {
            var spu_no = that.data.spu_no;
          }

          var MemberArtVoteDetail = [];
          if (that.data.currentTab == 0) {//1文字
            for (let i = 0; i < that.data.listIndex.length; i++) {
              if (that.data.listIndex[i].value != '') {
                MemberArtVoteDetail.push({ title: that.data.listIndex[i].value, image: '' })
              }
            }
          } else {
            MemberArtVoteDetail.push({ title: that.data.imgTitle1, image: that.data.imgList }, { title: that.data.imgTitle2, image: that.data.imgList2 })
          }
          if (that.data.isDel) {
            var memberArtVote = {
              title: that.data.voteTitle,//投票表头
              type: that.data.currentTab == 0 ? 1 : 2,//1文字 2图片
              chose: that.data.radio,//1单选 2多选
              start_at: that.data.userDate,
              end_at: that.data.userDate2,
              list: MemberArtVoteDetail,
            }
          } else {
            var memberArtVote = {}
          }

          if (value == '') {//内容为空时
            wx.request({
              url: app.globalData.URL + 'api/publish/noteAndArticle',
              data: {
                type: that.data.postId == 2 ? 5 : that.data.postId,//1笔记 5快讯
                title: title,
                member_no: res.data.member_no,
                spu_no: spu_no != 'undefined' ? spu_no : '',//商品spu_no
                spu_name: that.data.goods_name != 'undefined' ? that.data.goods_name : '',//商品名
                category_choice: that.data.category_choice != 'undefined' ? that.data.category_choice : '',//1 房产
                videoUrls: videoUrls,//视频
                memberNoteArticle: memberNoteArticle,
                memberNoteArticleImageList: memberNoteArticleImageList,
                memberArtVote: memberArtVote
              },
              method: 'POST',
              header: {
                "token": res.data.token,
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res)
                if (res.data.code != 200) {
                  wx.showToast({
                    title: '提交失败，请重试！',
                    icon: 'none'
                  })
                } else if (res.data.code == 200) {
                  that.setData({
                    oldValue: value
                  })
                  wx.showToast({
                    title: '发表成功',
                    icon: 'success',
                    success: function () {
                      setTimeout(function () {
                        wx.switchTab({
                          url: '/pages/kol/kol'
                        })
                      }, 1500)
                    }
                  })
                } else if (res.data.code == 401) {
                  wx.showToast({
                    title: res.message,
                    icon: 'none'
                  })
                }
              }
            })

          } else {
            //  
            wx.getStorage({
              key: 'idNum',
              success: function (res) {
                console.log(title)
                console.log(value)
                console.log(title + value)
                console.log(res);
                wx.request({
                  url: 'https://58hongren.com/api/check/context', //仅为示例，并非真实的接口地址
                  data: {
                    context: title + value,
                   memberNo: res.data.member_no
                  },
                  method:'POST',
                  header: {
                    "content-type": "application/x-www-form-urlencoded",
                    "token":res.data.token
                  },
                  success ({data}) {
                    if (data.code == 200) {
                      common.ajaxPost('/api/publish/noteAndArticle',
                        {
                          type: that.data.postId == 2 ? 5 : that.data.postId,//1笔记
                          title: title,//标题
                          member_no: res.data.member_no,
                          spu_no: spu_no != 'undefined' ? spu_no : '',//商品spu_no
                          spu_name: that.data.goods_name != 'undefined' ? that.data.goods_name : '',//商品名
                          category_choice: that.data.category_choice != 'undefined' ? that.data.category_choice : '',//1 房产 
                          videoUrls: videoUrls,//视频
                          memberNoteArticle: memberNoteArticle,//内容
                          memberNoteArticleImageList: memberNoteArticleImageList,
                          memberArtVote: memberArtVote
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
                                setTimeout(function () {
                                  wx.switchTab({
                                    url: '/pages/kol/kol'
                                  })
                                }, 1500)
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
                })
              }
            })
          }
        }
      })
    }
  }, 500),

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
    if (that.data.postId == 1) {//笔记跳转
      wx.navigateTo({
        url: '/pages/linkGoods/linkGoods?textValue=' + that.data.textValue + '&imageUrl=' + JSON.stringify(that.data.imageUrl) + '&type=' + 0 + '&postId=' + that.data.postId + '&voteTitle=' + that.data.voteTitle + '&radio=' + that.data.radio + '&currentTab=' + that.data.currentTab + '&userDate=' + that.data.userDate + '&userDate2=' + that.data.userDate2 + '&listIndex=' + encodeURIComponent(JSON.stringify(that.data.listIndex)) + '&imgList=' + that.data.imgList + '&imgList2=' + that.data.imgList2 + '&imgTitle1=' + that.data.imgTitle1 + '&imgTitle2=' + that.data.imgTitle2,
      })
    } else {//快讯
      wx.navigateTo({
        url: '/pages/linkGoods/linkGoods?textValue1=' + that.data.textValue1 + '&type=' + 0 + '&postId=' + that.data.postId + '&textValue2=' + that.data.textValue2,
      })
    }
    // if(more){
    //   wx.navigateTo({
    //     url: '/pages/linkGoods/linkGoods',
    //   })
    // }else{
    //   wx.showToast({
    //     title: '暂无商品关联',
    //     icon: 'none',
    //   })
    // }

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // clearInterval(check)//清除定时器
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