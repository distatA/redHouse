// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectBtn: '',
    cart: [],
    allMoney: 0,
    allGoodTag: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCart();
  },

  getCart: function () {
    let that = this;
    wx.getStorage({
      key: 'cart',
      success: function (res) {
        console.log(res.data);
        let tempCarts = res.data;
        that.setData({
          cart: res.data
        })

        let tempAllMoney = 0;
        let allTag = true;
        let alltempGood = that.data.allGoodTag;
        for (let j = 0; j < tempCarts.length; j++) {
          for (let k = 0; k < tempCarts[j].goodList.length; k++) {
            if (tempCarts[j].goodList[k].state == 1 || tempCarts[j].goodList[k].state == true) {
              tempAllMoney += Math.round(tempCarts[j].goodList[k].total_money*100)/100;//Math.round(number * 100) / 100
            }
            if (tempCarts[j].goodList[k].state == 0) {
              allTag = false;
            }
          }
        }
        if (allTag == false) {
          alltempGood = false;
        } else {
          alltempGood = true;
        }
        that.setData({
          allMoney: tempAllMoney.toFixed(2),
          allGoodTag: alltempGood
        })
      },
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
// 选中商家
  seleteShop: function (e) {
    let shopNum = e.target.dataset.shopkey;
    console.log(shopNum)
    let tempCart = this.data.cart;
    let tempshopMoney = Number(this.data.allMoney);
    let tempAllTag = this.data.allGoodTag;

    // console.log(tempCart[shopNum].state);

    if (tempCart[shopNum].state) {
      tempCart[shopNum].state = false;
      for (let m = 0; m < tempCart[shopNum].goodList.length; m++) {
        tempCart[shopNum].goodList[m].state = tempCart[shopNum].state;
        tempshopMoney -= tempCart[shopNum].goodList[m].total_money;
      }
    } else {
      // 商铺未选改为选中
      tempCart[shopNum].state = true;
      for (let m = 0; m < tempCart[shopNum].goodList.length; m++) {
        //找出之前未选中的
        if (tempCart[shopNum].goodList[m].state == 0) {
          tempshopMoney += tempCart[shopNum].goodList[m].total_money;
        }
        tempCart[shopNum].goodList[m].state = tempCart[shopNum].state;
        // tempshopMoney += tempCart[shopNum].goodList[m].total_money;
      }
    }

    let g = true;
    for (let i = 0; i < tempCart.length; i++) {
      if (tempCart[i].state == false) {
        g = false;
        tempAllTag = false;
        break;
      }
    }
    if (g) {
      tempAllTag = true;
    }

    this.setData({
      cart: tempCart,
      allMoney: tempshopMoney.toFixed(2),
      allGoodTag: tempAllTag,
    })
    wx.setStorage({
      key: 'cart',
      data: tempCart,
    })

  },
// 选中商品
  seleteGood: function (e) {
    
    let shopNum = e.target.dataset.shopkey;
    let goodNum = e.target.dataset.goodkey;
    let tempCart = this.data.cart;
    let tempMoney = Number(this.data.allMoney) ;
    let tempAllTag = this.data.allGoodTag;
    console.log(tempCart);
    console.log(shopNum);
    console.log(goodNum);
    console.log(tempMoney);

    // 物品选中判断商铺状态
    let shopAll = false;
    if (tempCart[shopNum].goodList[goodNum].state == false) {
      tempCart[shopNum].goodList[goodNum].state = true;
      tempMoney += tempCart[shopNum].goodList[goodNum].total_money;
      console.log(tempMoney);
      //商品全部选中是商户也应被选中
      for (let h = 0; h < tempCart[shopNum].goodList.length; h++) {
        if (tempCart[shopNum].goodList[h].state == false) {
          tempCart[shopNum].state = false;
          shopAll = true;
        }
      }
      if (shopAll === false) {
        tempCart[shopNum].state = true;
      }

    } else if (tempCart[shopNum].goodList[goodNum].state == true) {
      tempCart[shopNum].goodList[goodNum].state = false;
      tempMoney = tempMoney - tempCart[shopNum].goodList[goodNum].total_money;
      tempCart[shopNum].state = false;
    }

    let g = true;
    for (let i = 0; i < tempCart.length; i++) {
      for (let j = 0; j < tempCart[i].goodList.length; j++) {
        if (tempCart[i].goodList[j].state == false) {
          tempAllTag = false;
          g = false;
          break;
        }
      }
    }
    if (g) {
      tempAllTag = true;
    }

    console.log(tempMoney)
    this.setData({
      cart: tempCart,
      allMoney: tempMoney.toFixed(2),
      allGoodTag: tempAllTag
    })
    wx.setStorage({
      key: 'cart',
      data: tempCart,
    })
  },
  // 删除
  deleteNum: function (e) {
    let tempCart = this.data.cart;
    let shopNum = e.target.dataset.shopkey;
    let goodNum = e.target.dataset.goodkey;

    if (tempCart[shopNum].goodList[goodNum].num > 1) {
      tempCart[shopNum].goodList[goodNum].num--;
    } else {
      return;
    }

    tempCart[shopNum].goodList[goodNum].total_money = tempCart[shopNum].goodList[goodNum].num * tempCart[shopNum].goodList[goodNum].price;

    this.setData({
      cart: tempCart
    })

    wx.setStorage({
      key: 'cart',
      data: tempCart,
    })
    this.getCart();

  },
// 添加
  addNum: function (e) {
    let tempCart = this.data.cart;
    let shopNum = e.target.dataset.shopkey;
    let goodNum = e.target.dataset.goodkey;

    tempCart[shopNum].goodList[goodNum].num++;
    tempCart[shopNum].goodList[goodNum].total_money = tempCart[shopNum].goodList[goodNum].num * tempCart[shopNum].goodList[goodNum].price;

    this.setData({
      cart: tempCart
    })

    wx.setStorage({
      key: 'cart',
      data: tempCart,
    })
    this.getCart();
  },
  // 全选
  selectAll: function () {
    let tempCart = this.data.cart;
    let tempAllTag = this.data.allGoodTag;
    let tempMoney = 0;
    if (tempAllTag == true) {
      tempAllTag = false;
      for (let i = 0; i < tempCart.length; i++) {
        tempCart[i].state = tempAllTag;
        for (let j = 0; j < tempCart[i].goodList.length; j++) {
          tempCart[i].goodList[j].state = tempAllTag;

        }
      }
      tempMoney = 0;
    } else {
      tempAllTag = true;
      for (let i = 0; i < tempCart.length; i++) {
        tempCart[i].state = tempAllTag;
        for (let j = 0; j < tempCart[i].goodList.length; j++) {
          tempCart[i].goodList[j].state = tempAllTag;
          tempMoney += tempCart[i].goodList[j].total_money;
        }
      }
    }
    this.setData({
      cart: tempCart,
      allGoodTag: tempAllTag,
      allMoney: tempMoney.toFixed(2),
    })

    wx.setStorage({
      key: 'cart',
      data: tempCart,
    })
  },
// 减少
  deleteGood: function (e) {
    // console.log(e);
    let tempCart = this.data.cart;
    let shopNum = e.currentTarget.dataset.shopkey;
    let goodNum = e.currentTarget.dataset.goodkey;

    console.log(tempCart[shopNum].goodList[goodNum]);

    tempCart[shopNum].goodList.splice(goodNum, 1);
    if (tempCart[shopNum].goodList.length == 0) {
      tempCart.splice(shopNum, 1);
    }
    this.setData({
      cart: tempCart,
    })
    wx.setStorage({
      key: 'cart',
      data: tempCart,
    })
    this.getCart();
  },
// 结算
  finishMoney: function () {
    let commitCart = this.data.cart;
  
    if (this.data.allMoney==0){
      wx.showToast({
        title: '请选择商品',
        icon:'none'
      })
    }else{
      let newArr = [];
      commitCart.forEach((value, index) => {
        newArr[index] = value;
        newArr[index].goodList = value.goodList.filter(
          item => item.state)
      })
      console.log(newArr)
      let arr = newArr.filter(item => item.goodList.length > 0)
      wx.setStorage({
        key: 'commitCart',
        data: arr,
      })
      wx.navigateTo({
        url: '../cart/cart_detail/cart_detail',
      })
    }
    
  }
})