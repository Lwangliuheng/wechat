
var config = require('../../../config');
Page({

  data: {
    tapTime: 0, // 节流
    hidePopup: true, // 类型弹窗状态
    current: 0, // 类型选中值
    currentType: '', // 上传图片的类型
    updateCar: '', // 要上传图片的车,
    uid: '', // 公众号传来userid
    types:[
      ["0", "45度车辆前景照片"],
      ["1", "当事人和车辆合影"],
      ["2", "当事车辆车架号"],
      ["3", "车辆受损细节(1)"],
      ["4", "车辆受损细节(2)"],
      ["5", "交强险标志"],
      ["6", "银行卡照片"],
      ["7", "其它照片"],
      ["8", "事故认定书"],
      ["9", "行驶本照片"],
      ["10", "驾驶证照片"],
      ["11", "当事人签名照片"],
      ["12", "身份证正面照片"],
      ["13", "身份证背面照片"],
      ["14", "查勘员与车辆合影"],
      ["15", "签名"]
    ],
    markCar: '', // 标的车
    otherCars: [], // 三方车
    orderNo: '' // 订单号
  },

  // 页面初始进来
  onLoad() {
    this.setData({
      orderNo: 'b21732c618934fa987fc659d261ef1be'
    })

    wx.showLoading({
      title: '加载中',
    });

    this.init(this.data.orderNo);

  },

  // 预览图片
  prewImage(e){
    // console.log(e);
      wx.previewImage({
        current: '',
        urls: [e.currentTarget.dataset.img],
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    },
    // 开始视频连接
  videoLink () {
    // 防止两次点击操作间隔太快
    var nowTime = new Date().getTime();
    if (nowTime - this.data.tapTime < 2000) {
      console.log('点击过于频繁')
      return;
    }
    this.setData({ 'tapTime': nowTime });
    // wx.navigateTo({
    //   url: '../../doubleroom/room/room',
    // })
    this.toWeb();
  },

  // iM链接

  toWeb: function () {
    wx.showLoading({
      title: '视频连接中',
    })
    var data = {
      'formId': getApp().data.formId,
      "orderNo": this.data.orderNo,
      "uid": this.data.uid
      // "openId": 'o-Xv05cbfCNP3K5 - 22r3u7z67tOU'
    }
    console.log(JSON.stringify(data))
    var requesturl = config.RequestAddressPrefix5 + '/survey/v2/video/connect';
    console.log(requesturl)
    var self = this;
    wx.request({
      url: requesturl,
      method: "post",
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        // wx.hideLoading();
        if (res.data.rescode != 200) {
          wx.showToast({
            title: res.data.resdes,
            duration: 2000
          })
          console.log(res)
          // wx.hideLoading();
        } else if (res.data.rescode == 200) {
          if (res.data.data.bindIdleCode == 200) {
            console.log("dataObj11" + res.data.data)
            var userId = getApp().data.userId;//登录获取app  userId
            res.data.data.selToID = userId;
            res.data.data.roomID = res.data.data.videoRoomId;
            console.log(res.data.data.roomID)
            getApp().data.IMAccount = res.data.data.customerServiceImAccount;
            getApp().data.toWebData = res.data.data;
            var url = '../../doubleroom/room/room?type=create&roomName=' + self.data.roomName + '&userName=' + self.data.userName;
            wx.navigateTo({
              url: url
            });
          } else {
            wx.showToast({
              title: '坐席繁忙',
              icon: 'success',
              duration: 1000
            })
            // wx.navigateBack({
            //   delta: 1
            // })
          }
        }
      },
      fail: function () {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

  // 初始函数
  init (orderNo) {
    var that = this;
    wx.request({
      url: config.RequestAddressPrefix5 + `/survey/v1/photo/${orderNo}`,
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        if (res.data.rescode == 200) {
          // console.log("成功了", res.data);
          that.setData({
            markCar: res.data.data[0],
            otherCars: res.data.data.slice(1)
          })
          // console.log(that.data.otherCars)
        } else {
          console.error(res);
        }
      }
    })
  },

  // 点击弹窗x按钮
  close () {
    this.setData({
      hidePopup: true,
      current: 0
    })
  },

  // 点击上传
  shopPopup(e) {
    this.setData({
      hidePopup: false,
      current: 0,
      updateCar: e.currentTarget.dataset.vehicle
    })
  },

  // 选择弹窗里的类型
  chooseType(e) {
    this.setData({
      current: e.currentTarget.dataset.id+1,
      currentType: this.data.types[e.currentTarget.dataset.id],
      hidePopup: true
    })
    
    setTimeout (() => {
      this.uploadImage();
    },0)
  },

  // 上传图片
  uploadImage () {
    const that = this;

    // 选择图片
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

        var tempFilePath = res.tempFilePaths[0];
        
        // 要穿的参数
        let data = {
          orderNo: that.data.orderNo,
          photoType: that.data.currentType[0],
          vehicleLicenseNo: that.data.updateCar.vehicleLicenseNo,
          originalVehicleLicenseNo: that.data.updateCar.originalVehicleLicenseNo,
        }

        // 获取当时经纬度
        var position = new Promise( (resolve, reject) => {
            wx.getLocation({
              success: function(res) {
                console.log(res)
                resolve(res);
              },
            })
        })

        position.then( res => {

          data.lng = res.longitude;
          data.lat = res.latitude;

          // 获取到的图片 上传到服务器
          wx.uploadFile({
            url: config.RequestAddressPrefix5 + `/survey/v1/photo/upload`, 
            filePath: tempFilePath,
            name: 'photoFile',
            formData: data,
            success: function (res) {
              // console.log(res.data)
              //do something
              if (JSON.parse(res.data).rescode == 200) {
                that.setData({
                  markCar: JSON.parse(res.data).data[0],
                  otherCars: JSON.parse(res.data).data.slice(1)
                })
              }
            }
          })
        })
      }
    })
  }
})