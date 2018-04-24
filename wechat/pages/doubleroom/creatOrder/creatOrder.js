// // pages/doubleroom/creatOrder/creatOrder.js
var config = require('../../../config');
Page({
  data: {
    tapTime: '',	// 防止两次点击操作间隔太快
     isExist: 1, //0 - 存在 ， 1 - 不存在 
     phoneNumber: "",//报案人电话
     insuranceCompany: "",//保险公司
     code:"",
     createState:false,//创建订单状态
     pohoneValue:"",
     phoneState:false,//手机号输入状态
     selectState:false,//保险公司选择状态
     insuranceCompanys:[],//保险公司列表
     selectValue: ""//保险公司名称
  },
  onLoad(options) {
    console.log(2222222222)
    //判断是否已经有报案电话
    // this.setData({
    //   insuranceCompany: getApp().data.insuranceCompany,
    //   phoneNumber: getApp().data.phoneNumber
    // })
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    //获取保险公司列表
    this.setInsuranceList();
  },
  //获取保险公司列表
  setInsuranceList(){
    var plateNumber = getApp().data.reporterLicenseNo;
    var requesturl = config.RequestAddressPrefix2 + '/weixin/survey/api/v1/query/insurance/' + plateNumber;
    var that = this;
    wx.request({
      url: requesturl,
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.rescode == 200){
          that.setData({
            isExist: res.data.data.isExist,
            phoneNumber: res.data.data.userMobilePhone,
            insuranceCompany: res.data.data.insuranceCompanyName,
            insuranceCompanys: res.data.data.insuranceCompanys
          })
          // wx.hideLoading()
        }
        console.log(res,6666666666666666666666)
      },
      fail: function () {
         
      }
    })
  },
  //手机号
  phoneChang(e){
    var phone = e.detail.value;
    var r = /^((0\d{2,3}-\d{7,8})|(1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}))$/;
    if (!r.test(phone)) {
      this.setData({
        pohoneValue:"",
        phoneState: false
      })
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'success',
        duration: 1000
      })
      return;
    }else{
      this.setData({
        pohoneValue: e.detail.value,
        phoneState: true
      })
    }  
  },
  //显示隐藏保险公司
  selectChang(e){
    // if (!this.data.phoneState) {
    //   wx.showToast({
    //     title: '请输入正确手机号',
    //     icon: 'success',
    //     duration: 1000
    //   })
    //   return
    // }
    if (this.data.insuranceCompany){
      return
    }
    this.setData({
      selectState: !this.data.selectState
    })
  },
  cancelClick(){
    this.setData({
      selectState: !this.data.selectState
    })
  },
  setCreate(){
    var data = {
      "longitude": getApp().data.longitude,
      "latitude": getApp().data.latitude,
      "plateNumber": getApp().data.reporterLicenseNo,
      "mobilePhone": this.data.pohoneValue,
      "insuranceCompanyCode": this.data.code,
      "insuranceCompanyName": this.data.selectValue
    }
    var requesturl = config.RequestAddressPrefix2 + '/weixin/survey/api/v1/order/create';
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
          // that.setData({
          //   createState: true
          // })
          console.log(6666666666)
          that.toWeb();
        } else {
          wx.showToast({
            title: res.data.resdes,
            icon: 'success',
            duration: 1000
          })
          that.setData({
            createState: false
          })
        }
      },
      fail: function () {
        that.setData({
          createState: false
        })
      }
    })
  },
  //选择保险公司
  selectClick(e){
    if(!this.data.phoneState){
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'success',
        duration: 1000
      })
      return
    }
    console.log(e.target.dataset.code,66666666666)
    this.setData({
      selectState: !this.data.selectState,
      code: e.target.dataset.code,
      selectValue: e.target.dataset.me
    })
   
    // this.setData({
    //   selectValue: e.target.dataset.me
    // })
  },
  toWeb: function () {
    var data = {
      'formId': getApp().data.formId,
      "reporterLicenseNo": getApp().data.reporterLicenseNo,
      "openId": getApp().data.openId
      // "openId": 'o-Xv05cbfCNP3K5 - 22r3u7z67tOU'
    }
    console.log(JSON.stringify(data))
    var requesturl = config.RequestAddressPrefix2 + '/weixin/survey/api/v1/video/connect';
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
        wx.hideLoading();
        console.log(res)
        if (res.data.rescode != 200) {
          wx.showToast({
            title: res.data.resdes,
            icon: 'success',
            duration: 1000
          })
          wx.hideLoading();
        } else if (res.data.rescode == 200) {
          if (res.data.data.bindIdleCode == 200) {
            console.log("dataObj11" + res.data.data)
            var userId = getApp().data.userId;//登录获取app  userId
            res.data.data.selToID = userId;
            res.data.data.roomID = res.data.data.videoRoomId;
            console.log(res.data.data.roomID)
            getApp().data.IMAccount = res.data.data.customerServiceImAccount;
            getApp().data.toWebData = res.data.data;
            var url = '../room/room?type=create&roomName=' + self.data.roomName + '&userName=' + self.data.userName;
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
  survey(){
    // 防止两次点击操作间隔太快
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 2000) {
      return;
    }
    this.setData({ 'tapTime': nowTime });
    if (this.data.isExist == 1){
      if (!this.data.phoneState) {
        wx.showToast({
          title: '请输入正确手机号',
          icon: 'success',
          duration: 1000
        })
        return
      }
      if (this.data.selectValue == "") {
        wx.showToast({
          title: '请选择保险公司',
          icon: 'success',
          duration: 1000
        })
        return
      }
      if (this.data.phoneState && this.data.selectValue != "") {
        wx.showLoading({
          title: '加载中……',
          mask: true
        })
        this.setCreate()
      }
    }else{
      this.toWeb()
    }
    
    // if (this.data.phoneState && this.data.selectValue != "" && this.data.createState){
    //   this.toWeb();
    // }
  }
})
