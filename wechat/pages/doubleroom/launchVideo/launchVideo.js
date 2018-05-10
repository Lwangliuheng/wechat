// pages/doubleroom/roomname/roomname.js
var webimhandler = require('../../../utils/webim_handler.js');
var webim = require('../../../utils/webim.js');
var config = require('../../../config');

var bmap = require('../../../lib/bmap-wx.js'); 
Page({

	/**
	 * 页面的初始数据
	 */
  data: {
    otherPlatesState:false,
    reporterLicenseNoStaet:false,
    reporterLicenseNo: '',
    showCityDialog: true,
    roomName: '',	// 房间名称
    userName: '',	// 用户名称
    role: 'enter',    // 表示双人会话的角色，取值'enter'表示加入者，'create'表示创建者
    roomid: '',       // 房间id
    tapTime: ''	,	// 防止两次点击操作间隔太快
    selectName: "京",
    provincedata:
    ['京', '津', '冀', '晋', '蒙', '辽', '吉', '黑', '沪', '苏', '浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '贵', '云', '藏', '陕', '甘', '青', '宁', '新', '琼', '渝', '川', '桂',"其他"]

  },

	/**
	 * [bindRoomName 绑定输入框]
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
  // bindRoomName: function (e) {
  // 	var self = this;
  // 	self.setData({
  // 		roomName: e.detail.value
  // 	});
  // },

	/**
	 * [create 进入rtcroom页面]
	 * @return {[type]} [description]
	 */
  // 双向绑定
  LicenseNoInput(e) {
    var r = /^[a-zA-Z\d]{6,8}$/;
    console.log(!this.data.otherPlatesState)
    console.log(e.detail.value.length,"shuju")
    if (!this.data.otherPlatesState){
     
      if (!r.test(e.detail.value) && !this.data.otherPlatesState) {
        wx.showToast({
          title: '请输入正确的车辆车牌',
          icon: 'success',
          duration: 1000
        })
        this.setData({
          reporterLicenseNoStaet: false,
          reporterLicenseNo: e.detail.value.toUpperCase().substring(0, 8)
        });
        return;
      };

      if (e.detail.value.length > 8 && !this.data.otherPlatesState) {
        //非其他车牌限制
        this.setData({
          reporterLicenseNoStaet: true,
          reporterLicenseNo: e.detail.value.toUpperCase().substring(0, 8)
        });
      } else {
        this.setData({
          reporterLicenseNoStaet: true,
          reporterLicenseNo: e.detail.value.toUpperCase()
        });
      }
    }else{
      if (e.detail.value.length > 0){
        console.log("非其他车牌限制")
        //非其他车牌限制
        this.setData({
          reporterLicenseNoStaet: true,
          reporterLicenseNo: e.detail.value.toUpperCase()
        });
      }else{
        wx.showToast({
          title: '请输入正确的车辆车牌',
          icon: 'success',
          duration: 1000
        })
        this.setData({
          reporterLicenseNoStaet: false,
          reporterLicenseNo: e.detail.value.toUpperCase()
        });
      }
    }
    
    console.log(this.data.reporterLicenseNo)
  },
  //选择城市简称
  getCity: function(){
    this.setData({
      showCityDialog: false
    })
  },
  selectCity: function (event) {
    var self = this;
    var selectName = event.currentTarget.id;
    console.log(selectName,"地区名字")
    if (selectName == "其他"){
      console.log("选择其他")
      self.setData({
        otherPlatesState: true,
        selectName: selectName
      });
    }else{
      self.setData({
        otherPlatesState: false,
        selectName: selectName
      });
    };
    self.setData({
      showCityDialog: true
    })
  },
  
  videoConnect: function(){
    if (!this.data.otherPlatesState){
      if (this.data.reporterLicenseNo == '' || this.data.reporterLicenseNo == undefined || !this.data.reporterLicenseNoStaet) {
        wx.showToast({
          title: '请输入车牌号',
          icon: 'success',
          duration: 1000
        })
        return
      } else if (this.data.reporterLicenseNo.length < 5 && !this.data.otherPlatesState) {
        wx.showToast({
          title: '请输入正确车牌号',
          icon: 'success',
          duration: 1000
        })
        return
      }
    }else{
      if (this.data.reporterLicenseNo == '' || this.data.reporterLicenseNo == undefined){
        wx.showToast({
          title: '请输入车牌号',
          icon: 'success',
          duration: 1000
        })
        return
      }
    }
    
    var formId = getApp().data.formId;
    // var formId = 'f4dd1acfea5b9606a1527eb298ff4f1'
    console.log('openId'+getApp().data.openId)
    getApp().data.reporterLicenseNo = this.data.selectName + this.data.reporterLicenseNo;
    //后期加上
    wx.navigateTo({
      url: '/pages/doubleroom/creatOrder/creatOrder'
    })
    //发起视频
    //this.toWeb();
   
  },
 
   toWeb: function() {
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
        console.log(res)
        if (res.data.rescode != 200) {
          wx.showToast({
            title: res.data.resdes,
            icon: 'success',
            duration: 1000
          })
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
  create: function (e) {
    console.log(e.detail)
    console.log(e.detail.formId);
    getApp().data.formId = e.detail.formId;
    var self = this;
    // 防止两次点击操作间隔太快
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 2000) {
      return;
    }
    self.setData({
      roomName: '你我保'
    });
    //后期去掉
    // wx.navigateTo({
    //   url: '/pages/doubleroom/creatOrder/creatOrder'
    // })
    this.videoConnect();
    self.setData({ 'tapTime': nowTime });
  },
  formReset: function () {

    console.log('form发生了reset事件')

  },
	/**
	 * 生命周期函数--监听页面加载
	 */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中……',
      mask: true
    });
    var data = {
      "lng": getApp().data.longitude,
      "lat": getApp().data.latitude
    }
    var requesturl = config.RequestAddressPrefix2 + 'application/json';
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
        if (res.data.rescode == 200) {
          that.setData({
            showCityDialog:true,
            selectName: res.data.data
          });
          console.log(res.data.data,"车牌前缀");
        }else{
          that.setData({
            showCityDialog: true,
            otherPlatesState: true,
            selectName: "其他"
          });
          console.log(res.data.data, "车牌没有获取到");
        } 
      },
      fail: function () {
        that.setData({
          showCityDialog: true,
          otherPlatesState: true,
          selectName: "其他"
        });
        console.log(res.data.data, "车牌没有获取到");
        // wx.showToast({
        //   title: '获取位置失败',
        //   icon: 'success',
        //   duration: 1000
        // })
      }
    });

    
    this.setData({
      userName: options.userName || ''
    });
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
    return {
      title: '双人音视频',
      path: '/pages/doubleroom/launchVideo/launchVideo',
      imageUrl: '../../Resources/share.png'
    }
  }
})