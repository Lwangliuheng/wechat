// pages/picklist/surveyList/surveyList.js
var config = require('../../../config');

var timer; // 计时器
var isOpenRedPacket;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    timeLeft: 10,  // 倒计时
    uid: '',  // 用户id
    orderNo: '', // 订单号,
    isOpen: false, // 红包拆开了吗
    isTiming: true, // 是否在倒计时
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    // 清除定时器
    if(timer) clearTimeout(timer);

    // 开始倒计时
    timer = setInterval (() => {
      console.log(this.data.timeLeft)
      if(this.data.timeLeft > 0) {
        this.setData({
          timeLeft: --this.data.timeLeft
        })
      }else {
        this.setData({
          timeLeft: 0,
          isTiming: false
        })
        clearTimeout(timer);
      }
    },1000)
  },

  // 拆开红包
  openRedPacket() {
    this.setData({
      isOpen: true
    })
    wx.request({
      url: config.RequestAddressPrefix5 + '/rider/income/v1/redpacket/receive',
      method: 'POST',
      data: {
        uid: this.data.orderNo,
        orderNo: this.data.orderNo
      },
      success (res) {
        if(res.data.rescode == 200) {
          console.log("获取到的红包金额是",res.data.data);
          isOpenRedPacket = true;
        }
      }
    })
  },

  // 抢单
  getMoreOrder () {
    if(!this.data.timeLeft) {
      wx.navigateTo({
        url: '../surveyList/surveyList'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log(isOpenRedPacket)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
