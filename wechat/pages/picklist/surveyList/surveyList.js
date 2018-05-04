// pages/picklist/surveyList/surveyList.js
var config = require('../../../config');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[],
    todayReceiveOrderCount:"",//今日接单数
    todayIncome: ""//今日收入
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    /**
* 获取路径参数，判断进入的页面。
*/
    console.log(options)
    getApp().data.orderUserId = options.riderId;
    //getApp().data.orderUserId = "e8a5819e-d74a-11e7-b854-005056c00008";
    console.log(getApp().data.orderUserId, "获取的UserId");
    this.getOrderList();
    this.getTopInfo();
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },
  //获取头部信息
  getTopInfo(){
    wx.showLoading({
      title: '加载中...',
    });
    // var mobilePhone = "eac8cb6f-e5a6-4e2e-b741-6bc414fb0576";
    console.log(getApp().data.orderUserId,"idididi")
    var mobilePhone = getApp().data.orderUserId;
    var requesturl = config.RequestAddressPrefix2 + '/rider/v1/me/'+mobilePhone;
    var that = this;
    wx.request({
      url: requesturl,
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res, 66666)
        if (res.data.rescode == 200) {
          that.setData({
            todayReceiveOrderCount: res.data.data.todayReceiveOrderCount,
            todayIncome: res.data.data.todayIncome
          })
          console.log(res.data.data, 555555555)
          wx.hideLoading()
        }

      },
      fail: function () {

      }
    })
  },
  //获取订单列表
  getOrderList(){
    wx.showLoading({
      title: '加载中...',
    });
    var data = {
      userId: getApp().data.orderUserId,
      lng: getApp().data.longitude,//getApp().data.longitude,
      lat: getApp().data.latitude //getApp().data.latitude
    };
    var requesturl = config.RequestAddressPrefix2 + '/order/v1/unconsumed/list';
    var that = this;
    wx.request({
      url: requesturl,
      method: "POST",
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.rescode == 200) {
          that.setData({
            orderList: res.data.data
          })
          console.log(res.data.data,555555555)
          wx.hideLoading()
        }
       
      },
      fail: function () {

      }
    })
     
  },
  //抢单按钮
  lootMenu(event){
    console.log(11111)
    console.log(event.currentTarget.dataset.orderno,"订单号")
    getApp().data.orderno = event.currentTarget.dataset.orderno;
    this.getLootDat(event.currentTarget.dataset.orderno);
    //   wx.showModal({
    //   title: '温馨提示',
    //   content: '抢单成功后不能手动取消，需联系客服取消订单',
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
  },
  getLootDat(id){
    wx.showLoading({
      title: '加载中',
    });
    var data = {
      uid: getApp().data.orderUserId,
      orderNo:id,
      lng: 116.4694415328,//getApp().data.longitude,
      lat: 39.8984379793  //getApp().data.latitude
    };
    var requesturl = config.RequestAddressPrefix2 + '/order/v1/scramble';
    var that = this;
    wx.request({
      url: requesturl,
      method: "POST",
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res, 666)
        wx.hideLoading();
        var url = '../surveyMap/surveyMap';
        wx.navigateTo({
          url: url
        });
        if (res.data.rescode == 200) {
          //抢单成功
          if (res.data.data.ok){
            // var url = '../surveyMap/surveyMap?roomName=' + self.data.roomName + '&userName=' + self.data.userName;
            var url = '../surveyMap/surveyMap';
              wx.navigateTo({
                url: url
              });
          };
          //发放了红包
          if (res.data.data.grantRedPacket){
            var url = '../redPacket/redPacket';
            wx.navigateTo({
              url: url
            });
          }else{
            //没有红包

          }
          // that.setData({
          //   orderList: res.data.data
          // })
          console.log(res.data.data, 555555555)
          
        }

      },
      fail: function () {

      }
    })

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