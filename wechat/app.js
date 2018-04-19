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
    insuranceCompanyList:"" 
  } 
})