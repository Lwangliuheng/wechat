//app.js

var qcloud = require('./lib/index');

App({

  onLaunch: function () {
    // 展示本地存储能力
    // qcloud.setLoginUrl(config.url + 'getwxinfo');
    // qcloud.setLoginUrl(config.url + 'login');
  },
  globalData: {
    userInfo: null,
    mergePushers: null,
    changeCamera: null,
  },
  data: {
    takePhone: '',
    LoadingtakePhone: false,
    changeLingkLoading: true,
    toWebData: {},
    userId: "",
    isGetLoginInfo: false,  // 是否已经获取登录信息
    userName: '',	// 用户名称
    seletoID:  '',//webid
    roomID: '',//房间id
    openId: '',//
    requestUrl :"https://survey.zhongchebaolian.com/boot-xcx-survey-api",//请求地址
    unionId:"",
    userType: "",
    origin: "",
    nickname:"",
    avatarUrl: "",
    gender:"",
    city: "",
    province: "",
    country: "",
    IMAccount: '',//web IMAccount
    formId: "",
    reporterLicenseNo: "",
    latitude: "",
    longitude:"",
    insuranceCompanyList:"" ,
    orderUserId: "",
    orderno: ""
  },
  /**
   * 获取路径参数，判断进入的页面。
   */
  pathIntercept(options) {
    // console.log(options.riderId, "订单入口userId")
    var userId = "e8a5819e-d74a-11e7-b854-005056c00008";
   // var userId = options.riderId;
    if (userId) {
      this.data.orderUserId = userId;
      //var url = '../picklist/surveyList/surveyList?userId=' + userId
      // wx.navigateTo({
      //   url: url
      // });
    }
  }, 
})