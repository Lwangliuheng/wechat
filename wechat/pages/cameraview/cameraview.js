// pages/localview/localview.js
var rtcroom = require('../../utils/rtcroom.js');
var config = require('../../config.js');
var webimhandler = require('../../utils/webim_handler.js');
var flag = true,codeStatuse = '';

Component({
  properties: {
    // 房间id
    roomid: { type: Number, value: '' },
    // 房间名称
    roomname: { type: String, value: 'roomname' },
    // 用户名称
    username: { type: String, value: '' },
    // 类型：create/enter
    role: { type: String, value: 'enter' },
    // 推流code
    event: { type: Number, value: 0, observer: function (newVal, oldVal) { this.onPush(newVal); } },
    // 评论信息
    message: { type: String, value: '', observer: function (newVal, oldVal) { this.sendRoomTextMsg(newVal); } },
    // 推流配置
    config: { type: Object, value: {}, observer: function (newVal, oldVal) { this.setConfig(newVal, oldVal); } },
    // 样式
    styles: { type: Object, value: {} }
  },
  attached() { 
    var self = this;
    self.timer = setInterval(() => {
      self.changeLingkLoading();
      // if (getApp().data.takePhone == 'WEB$$takePic'){
      //   self.receivephone();
      // }
    }, 500)
    // self.timer = setInterval(self.changeLingkLoading(), 1000)
  },
  data: {
    timer:'',
    pusherContext: '',  // 推流context
    pushURL: '',        // 推流地址
    members: [],        // 成员信息
    isInRoom: false,    // 是否已经进入房间
    showLoading: false,
    LoadingtakePhone: false
  },
  methods: {
    //接受拍照消息
    receivephone: function () {
      getApp().data.takePhone = '';
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('myevent', myEventDetail, myEventOption)
    },
    // 设置推流配置
    setConfig: function (newVal, oldVal) {
      // 切换摄像头
      if (this.data.pusherContext && newVal.camera != oldVal.camera) {
        this.data.pusherContext.switchCamera({});
      }
      // 视频操作
      if (this.data.pusherContext && newVal.operate != oldVal.operate) {
        switch (newVal.operate) {
          case 'start': {
            this.data.pusherContext.start(); break;
          }
          case 'stop': {
            this.data.pusherContext.stop(); break;
          }
          case 'pause': {
            this.data.pusherContext.pause(); break;
          }
          case 'resume': {
            this.data.pusherContext.resume(); break;
          }
        }
      }
      this.setData({
        config: newVal
      });
    },
    // 初始化操作
    init: function () {
      // 重置用户名，因为一开始用户名是空的
      this.setData({
        username: this.data.username
      });
      console.log("初始化时房间号：" + this.data.roomid);
      //设置rtm事件监听
      this.setListener();
      if (this.data.roomid != 0) {
        this.data.role == 'enter'
        this.enterRoom();
      } else {
        this.data.role == 'create'
        this.createRoom();
      }
    },
    //解綁坐席狀態
    dismiss: function () {
      var data = {
        "surveyNo": getApp().data.toWebData.orderData.surveyNo
      }
      console.log(JSON.stringify(data))
      var requesturl = config.RequestAddressPrefix2 + '/weixin/survey/api/v1/web/surveyor/dismiss';
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
          }
        },
        fail: function () {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    },
    // 获取推流地址
    getPushURL: function () {
      var self = this;
      setTimeout(function () {
        if (codeStatuse == ''){
          self.dismiss()
          wx.navigateBack({
            delta: 1
          })
        }
      }, 5000) 
      var self = this;
      console.log('getPushURL1')
      rtcroom.getPushURL({
        success: function (ret) {
          console.log(ret.pushURL,"推流地址")
          self.setData({
            pushURL: ret.pushURL
          });
          self.setListener();
          self.data.role == 'enter' && self.enterRoom();
          // 小程序开发工具测试代码
          // self.data.role == 'enter' && self.joinPusher();
          // self.data.role == 'create' && self.createRoom();
        },
        fail: function (ret) {
          console.log(ret)
          // 触发外部事件
          self.triggerEvent('notify', {
            type: 'onFail',
            errCode: ret.errCode,
            errMsg: ret.errMsg
          }, {});
        }
      });
    },
    // 进入房间
    // enterRoom: function () {
    //   var self = this;
    //   rtcroom.enterRoom({
    //     data: { roomID: self.data.roomid },
    //     success: function () { },
    //     fail: function (ret) {
    //       // 触发外部事件
    //       self.triggerEvent('notify', {
    //         type: 'onFail',
    //         errCode: ret.errCode,
    //         errMsg: ret.errMsg
    //       }, {});
    //     }
    //   });
    // },
    // 进入房间No
    enterRoom: function () {
      var self = this;
      console.log("加入房间的房间ID：" + self.data.roomid);

      rtcroom.enterWebrtcRoom({
        data: {
          roomid: self.data.roomid
        },
        success: function (ret) {
          // 创建房间成功之后操作
          if (ret.code == 0) {
            console.log("加入房间成功后获得到的推流地址：" + ret.webRTCpushURL);

            self.setData({
              pushURL: ret.webRTCpushURL
            })

            rtcroom.pusherHeartbeat();

            wx.hideLoading();
          } else {
            wx.showToast({
              title: '房间不存在',
            })
          }
        },
        fail: function (ret) {
          wx.hideLoading();
          // 触发外部事件
          self.triggerEvent('notify', {
            type: 'onFail',
            errCode: ret.errCode,
            errMsg: ret.errMsg
          }, {});
        }
      });

      // rtcroom.enterWebrtcRoom( self.data.roomid,
      //   function (res) {
      //     console.log("进入房间方法enterRoom：" + res.data.privMapEncrypt);

      //   },
      //   function (res) {
      //     console.error(self.data.ERROR_CREATE_ROOM, '进入房间失败[' + res.errCode + ';' + res.errMsg + ']')
      //     self.onRoomEvent({
      //       detail: {
      //         tag: 'error',
      //         code: -999,
      //         detail: '进入房间失败[' + res.errCode + ';' + res.errMsg + ']'
      //       }
      //     })
      //   });
    },
    changeLingkLoading: function(){
      var self = this;
      if (getApp().data.changeLingkLoading == false){
        self.setData({ showLoading: false });
      }
       self.setData({ 
         LoadingtakePhone: getApp().data.LoadingtakePhone 
        })
    },
    // 加入推流
    joinPusher: function() {
      var self = this;
      console.log('self.data.pushURL'+self.data.pushURL)
      rtcroom.joinPusher({
        data: {
          roomID: self.data.roomid,
          pushURL: self.data.pushURL
        },
        success: function (ret) {
          // wx.hideLoading();
          // self.setData({ showLoading: false });
         
        },
        fail: function (ret) {
          // wx.hideLoading();
          // self.setData({ showLoading: false });
          // 触发外部事件
          self.triggerEvent('notify', {
            type: 'onFail',
            errCode: ret.errCode,
            errMsg: ret.errMsg
          }, {});
        }
      });
    },
   
    // 创建房间
    createRoom: function () {
      var self = this;
      rtcroom.createRoom({
        data: {
          roomName: self.data.roomname,
          pushURL: self.data.pushURL
        },
        success: function (ret) {
          // setTimeout(self.changeLingkLoading(),30000)
          // 创建房间成功之后操作
          // wx.hideLoading();
          // self.setData({ showLoading: false });

          // 创建房间成功之后操作
          console.log("创建房间成功后获得到的推流地址：" + ret.webRTCpushURL);

          self.setData({
            pushURL: ret.webRTCpushURL
          })
          //开始心跳
          rtcroom.pusherHeartbeat();
          
          wx.hideLoading();
        },
        fail: function (ret) {
          // wx.hideLoading();
          // self.setData({ showLoading: false });
          // 触发外部事件
          self.triggerEvent('notify', {
            type: 'onFail',
            errCode: ret.errCode,
            errMsg: ret.errMsg
          }, {});
        }
      });
    },
    // 退出房间
    exitRoom: function() {
      //退出房间
      var data  = {}
      data.hangup = "hangup"
      webimhandler.sendCustomMsgtext(JSON.stringify(data))
      rtcroom.exitRoom({});
    },
    // 推流事件 
    onPush: function(e) {
      console.log("触发推流事件")
      var self = this;
      if (!self.data.pusherContext) {
        self.data.pusherContext = wx.createLivePusherContext('rtcpusher');
      }
      var code;
      if (e.detail) {
        code = e.detail.code;
      } else {
        code = e;
      }
      //待定
      if (flag) {
        flag = false;
        this.init();
      }

      getApp().globalData.changeCamera();
      console.log('推流情况：', code); 
      codeStatuse = code;
      switch (code) {
        case 1002: {
        
          // if (!self.data.isInRoom) {
          //   self.setData({ isInRoom: true });
          //   if (self.data.role == 'enter') {
          //     self.joinPusher();
          //   } else {
          //     self.createRoom();
          //   }
          // }
          break;
        }
        case -1301: {
          console.log('打开摄像头失败: ', code);
          // 触发外部事件
          self.triggerEvent('notify', {
            type: 'onFail',
            errCode: -9,
            errMsg: '打开摄像头失败，请再次尝试'
          }, {});
          break;
        }
        case -1302: {
          console.log('打开麦克风失败: ', code);
          // 触发外部事件
          self.triggerEvent('notify', {
            type: 'onFail',
            errCode: -9,
            errMsg: '打开麦克风失败，请再次尝试'
          }, {});
          wx.navigateBack({
            delta: 1
          })
          break;
        }
        case -1307: {
          console.log('推流连接断开: ', code);
          // 推流连接断开就做退房操作
          self.exitRoom();
          // 触发外部事件
          self.triggerEvent('notify', {
            type: 'onFail',
            errCode: -9,
            errMsg: '推流已断开，请检查网络状态后重试'
          }, {});
          wx.navigateBack({
            delta: 1
          })
          break;
        }
        case 5000: {
          console.log('收到5000: ', code);
          // 收到5000就退房
          self.exitRoom();
          // 触发外部事件
          self.triggerEvent('notify', {
            type: 'onFail',
            errCode: 5000,
            errMsg: '你已退出'
          }, {});
          break;
        }
        case 1018:
          {
            console.log('进房成功', code);
            break;
          }
        case 1019:
          {
            console.log('退出房间', code);
            break;
          }
        //可以获取成员列表
        case 1020:
          {
            console.log('成员列表', code);
            self.onWebRTCUserListPush(e.detail.message);
            break;
          }
        case 1021:
          {
            console.log('网络类型发生变化，需要重新进房', code);
            //先退出房间
            self.exitRoom();

            //再重新进入房间
            this.setData({
              retryIndex: 5,
            })
            self.enterRoom();

            break;
          }
        case 2007:
          {
            console.log('视频播放loading: ', e.detail.code);
            break;
          };
        case 2004:
          {
            console.log('视频播放开始: ', e.detail.code);
            break;
          };
        default: {
          // console.log('推流情况：', code);
        }
      }
    },
    //xz 对拉流地址进行处理
    onWebRTCUserListPush: function (msg) {
      var self = this;

      if (!msg) {
        return;
      }

      var jsonDic = JSON.parse(msg);
      if (!jsonDic) {
        return;
      }

      console.log("onWebRTCUserListPush.jsonDict:", jsonDic);
      var newUserList = jsonDic.userlist;
      if (!newUserList) {
        return;
      }

      var pushers = [];
      newUserList && newUserList.forEach(function (val) {
        var pusher = {
          userID: val.userid,
          accelerateURL: val.playurl
        };
        pushers.push(pusher);
      });

      self.onWebrtcPusherJoin({
        pushers: pushers
      });

      self.onWebrtcPusherQuit({
        pushers: pushers
      });
    },
    //xz 对拉流地址进行处理
    //将在res.pushers中，但不在self.data.members中的流，加入到self.data.members中
    onWebrtcPusherJoin: function (res) {
      rtcroom.wetrtcMergePushers(res);
    },
    //xz 对拉流地址进行处理
    //将在self.data.members中，但不在res.pushers中的流删除
    onWebrtcPusherQuit: function (res) {
      var self = this;
      for (var i = 0; i < self.data.members.length; i++) {
        var needDelete = true;
        for (var j = 0; j < res.pushers.length; j++) {
          if (self.data.members[i].userID == res.pushers[j].userID) {
            needDelete = false;
          }
        }
        if (needDelete) {
          self.data.members[i] = {};
        }
      }
      self.setData({
        members: self.data.members
      });


    },

    delWebrtcPusher: function (pusher) {
      var self = this;
      for (var i = 0; i < self.data.members.length; i++) {
        if (self.data.members[i].userID == pusher.userID) {
          self.data.members[i] = {};
        }
      }
      self.setData({
        members: self.data.members
      });
    },
    // 标签错误处理
    onError: function(e) {
      var self = this;
      console.log('错误处理',e);
      e.detail.errCode == 10001 ? (e.detail.errMsg = '未获取到摄像头功能权限，请删除小程序后重新打开') : '';
      e.detail.errCode == 10002 ? (e.detail.errMsg = '未获取到录音功能权限，请删除小程序后重新打开') : '';
      // 触发外部事件
      self.triggerEvent('notify', {
        type: 'onFail',
        errCode: e.detail.errCode,
        errMsg: e.detail.errMsg || '未获取到摄像头、录音功能权限，请删除小程序后重新打开'
      }, {});
    },
    // 发送评论
    sendRoomTextMsg: function(msg) {
      // 评论为空则不发布，trim评论信息
      if (!msg.replace(/^\s*|\s*$/g, '')) return;
      rtcroom.sendRoomTextMsg({
        data: { msg: msg },
        success: function (ret) {
          console.log('发送评论成功');
         
        }
      });
    },
    // 设置监听函数
    setListener: function () {
      console.log(777767)
      var self = this;
      rtcroom.setListener({
        onGetPusherList: self.onGetPusherList.bind(self),
        onPusherJoin: self.onPusherJoin.bind(self),
        onPhserQuit: self.onPhserQuit.bind(self),
        onRoomClose: self.onRoomClose.bind(self),
        onRecvRoomTextMsg: self.onRecvRoomTextMsg.bind(self)
      });
    },
    // 初始化成员列表
    onGetPusherList: function (ret) {
      var self = this;
      console.log('初始化成员列表: ', ret);
      // 保存信息
      self.data.members = ret.pushers;
      // 触发外部事件
      self.triggerEvent('notify', {
        type: 'onGetMemberList',
        members: self.data.members
      }, {});
    },
    // 有人进群通知
    onPusherJoin: function (ret) {
      var self = this;
      console.log('收到进房消息：', ret);
      self.data.members.concat(ret.pushers);

      // 触发外部事件
      self.triggerEvent('notify', {
        type: 'onMemberJoin',
        members: ret.pushers
      }, {});
    
    },
    // 有人退群通知
    onPhserQuit: function (ret) {
      var self = this;
      console.log('收到进房消息：', ret);
      self.data.members.concat(ret.pushers);

      // 触发外部事件
      self.triggerEvent('notify', {
        type: 'onMemberQuit',
        members: ret.pushers
      }, {});
    },
    // 房间解散通知
    onRoomClose: function (ret) {
      var self = this;
      console.log('收到解散通知');   
    
      // 触发外部事件
      self.triggerEvent('notify', {
        type: 'onRoomClose',
        errCode: ret.errCode,
        errMsg: ret.errMsg
      }, {}); 
    },
    // 评论消息通知
    onRecvRoomTextMsg: function(ret) {
      var self = this;
      // 触发外部事件
      self.triggerEvent('notify', {
        type: 'onRecvRoomTextMsg',
        content: ret
      }, {});  
    }
  },
 
  // 组件布局完成
  ready: function () {
    console.log('初始化data',this.data);
    this.setData({ showLoading: true });
    
    // wx.showLoading({
    //   title: '连线中'
    // })
    // 布局完成开始初始化
    this.init();
  },
  // 组件实例被从页面节点树移除
  detached: function () {
    getApp().data.changeLingkLoading = true;
    // clearInterval(this.timer);
    console.log('组件实例被从页面节点树移除');
    flag = true;
    this.exitRoom();
  }
})
