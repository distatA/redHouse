// pages/img/img.js

function temp(e) {
  console.log(e.target.id)
  var id = e.currentTarget.id;//1.网址2.商品3.文章 4.专题5.轮播图 6.优惠券
  var appUrl = e.currentTarget.dataset.id;
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
    wx.navigateTo({//外链
      url: '/pages/pageH/pageH?url=' + appUrl,
    })
  } else if (id == 3) {//文章
    var newArr = appUrl.split(',&');
    console.log(newArr)
    wx.navigateTo({
      url: '/pages/myNote_detail/myNote_detail?nickName=' + newArr[0] + '&headUrl=' + newArr[1] + '&sign=' + newArr[2] + '&member_no=' + newArr[3] + '&noteId=' + newArr[4] + '&read=' + newArr[5] + '&comment=' + newArr[6] + '&like=' + newArr[7] + '&type=' + newArr[8] + '&flag=' + newArr[9] + '&time=' + newArr[10],
    })
  }else if(id == 4){
    wx.navigateTo({
      url: '/pages/moreHuose/moreHuose?id=' + appUrl + '&color=' + e.currentTarget.dataset.color,
    })
  }
}
module.exports = temp;