// pages/picklist/surveyMap/surveyMap.js
var config = require('../../../config');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    layerState:false, // 弹层状态 
    employeesInfo:"", ///工作正信息
    basicInfo:"",//订单基本信息
    polyline:"",//划线数组
    markers:"",
    goSurveySiteState: false,    
    goSurveySiteValue:"前往查勘地点"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderInfo();
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
  //获取订单信息
  getOrderInfo(){
    wx.showLoading({
      title: '加载中',
    });
    var data = {
      // uid: getApp().data.orderUserId,
      uid: "eac8cb6f-e5a6-4e2e-b741-6bc414fb0576",
      lng: 116.4694415328,//getApp().data.longitude,
      lat: 39.8984379793  //getApp().data.latitude
    };
    var requesturl = config.RequestAddressPrefix2 + '/order/v1/undone';
    var that = this;
    wx.request({
      url: requesturl,
      method: "POST",
      data:data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res, 33)
        if (res.data.rescode == 200) {
          var polyline = [];
          var obj = {};
          //obj.points = res.data.data.routeCoordinatePoints;
          obj.points = [{
            longitude: 113.3245211,
            latitude: 23.099994
          }, {
            longitude: 113.324520,
            latitude: 23.21229
          },{
              longitude: 113.314520,
              latitude: 23.11229
          }, {
            longitude: 113.304520,
            latitude: 23.10229
          }];
          obj.color = "#4ddd26";
          obj.width = 4;
          obj.arrowLine = true;
          obj.borderWidth = 2;
          obj.dottedLine = false;
          polyline.push(obj);
          var markers = [{
            id: 111,
            latitude: 23.099994,
            longitude: 113.3245211
          }, {
            id: 112,
            latitude: 23.10229,
            longitude: 113.304520
          }]
           
          
          // polyline = res.data.data.routeCoordinatePoints;
          that.setData({
            basicInfo: res.data.data,
            markers: markers,
            polyline: polyline
          })
          console.log(res.data.data, "1111111")

        }

      },
      fail: function () {

      }
    })
  },
  //打开联系客服弹层
  contactCustomerService(event){
    wx.showLoading({
      title: '加载中',
    });
    var requesturl = config.RequestAddressPrefix2 + '/survey/v1/contact/customer/service';
    var that = this;
    wx.request({
      url: requesturl,
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res, 666666)
        if (res.data.rescode == 200) {
         
          wx.showModal({
            title: '客服电话',
            content: res.data.data,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          console.log(res.data.data, 555555555)

        }

      },
      fail: function () {

      }
    })
     
  },
  //打开工作证弹层
  openLayer(event){

    this.setData({
      layerState: true
    });
    wx.showLoading({
      title: '加载中',
    });
    // var userId = getApp().data.orderUserId;
    var userId = "eac8cb6f-e5a6-4e2e-b741-6bc414fb0576";
    var requesturl = config.RequestAddressPrefix2 + '/rider/v1/me/work/permit/' + userId;
    var that = this;
    wx.request({
      url: requesturl,
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res,666666)
        if (res.data.rescode == 200) {
          that.setData({
            employeesInfo: res.data.data
          })
          console.log(res.data.data, 555555555)
          
        }

      },
      fail: function () {

      }
    })
  },
  //关闭工作证弹层
  closeLayer(event){
    this.setData({
      layerState:false
    })
  },
  //前往查勘地点
  goSurveySite(e){

  //点击开始查勘按钮
    if (this.data.goSurveySiteState){
      wx.showLoading({
        title: '加载中',
      });
      var data = {
        // uid: getApp().data.orderUserId,
        uid: "eac8cb6f-e5a6-4e2e-b741-6bc414fb0576",
        orderNo: getApp().data.orderno
      };
      var requesturl = config.RequestAddressPrefix2 + '/survey/v1/arrivals';
      var that = this;
      wx.request({
        url: requesturl,
        method: "POST",
        data: data,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          wx.hideLoading();
          console.log(res, 33)
          if (res.data.rescode == 200) {
            var url = '../videoAndPicture/videoAndPicture';
            wx.navigateTo({
              url: url
            });
          }

        },
        fail: function () {

        }
      });
      
   }
    if (!this.data.goSurveySiteState) {
      this.setData({
        goSurveySiteState: true,
        goSurveySiteValue: "开始查勘"
      })
    }
    console.log(this.data.goSurveySiteState)
    
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