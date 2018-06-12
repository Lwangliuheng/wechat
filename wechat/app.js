//app.js

var qcloud = require('./lib/index');

App({
  
  onLaunch: function () {
    // 展示本地存储能力
    // qcloud.setLoginUrl(config.url + 'getwxinfo');
    // qcloud.setLoginUrl(config.url + 'login');
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate, "是否有新版本");
    });
    updateManager.onUpdateReady(function () {
      console.log("进入更新状态");
      wx.showModal({
        title: '更新提示',
        showCancel:false,
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            console.log("更新完成");
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          };
        }
      });

    });
    updateManager.onUpdateFailed(function () {
      console.log("新的版本下载失败");
      // 新的版本下载失败
    });
  },
  onShow(){
   
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
    orderNo:'',
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
    selectName:"",//车牌号
    insuranceCompanyList:"" ,
    twoWayVideoStatus:false
  } 
})