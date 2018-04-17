let config = require('../../../config');
var context = null;// 使用 wx.createContext 获取绘图上下文 context
var isButtonDown = false;
var arrx = [];
var arry = [];
var arrz = [];
var canvasw = 0;
var canvash = 0;
Page({
    data: {
        detailData:{},
        detailPhotoList:[],
        thirdPartyList:[],
        showSignFlag:false,
        context:null,
        signStatus:0,
        signImgUrl:'',
        agreeThird:0,
        surveyOrderNo:''
        // isButtonDown:false,
        // arrx:[],
        // arry:[],
        // arrz:[],
        // canvasw:0,
        // canvash: 0,
    },
    gotolink: function(event){
        console.log(event.currentTarget.id);
        var licenseNo = event.currentTarget.dataset.licenseno;
        var idStr = String(event.currentTarget.id).replace('photoButton','');

        if(idStr=='0'){
            if(this.data.detailPhotoList.length == 0) {
                wx.showToast({
                    title: '此车暂无照片',
                    duration: 1500
                })
            }else{
                wx.setStorageSync('showPhotoList', this.data.detailPhotoList);
                wx.navigateTo({
                    url: '../photoList/photoList?licenseNo='+licenseNo
                })
            }
        }else{
            idStr = Number(idStr)-1;
            if(this.data.thirdPartyList[idStr].photoList.length == 0){
                wx.showToast({
                    title: '此车暂无照片',
                    duration: 1500
                })
            }else{
                wx.setStorageSync('showPhotoList', this.data.thirdPartyList[idStr].photoList);
                wx.navigateTo({
                    url: '../photoList/photoList?licenseNo='+licenseNo
                })
            }
        }


    },
    onLoad(options){
        var self = this;
        console.log(options)
        self.setData({
            surveyOrderNo:options.surveyOrderNo
        })
        wx.request({
          url: config.RequestAddressPrefix2+"/survey_detail/v1/getDetail",
            data:{
                'surveyNo':options.surveyOrderNo,
            },
            method:'POST',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success:res=>{
                console.log(res);
                self.setData({
                    detailData:res.data,
                    detailPhotoList:res.data.targetVehicle.photoList,
                    thirdPartyList:res.data.thirdPartyList,
                    signStatus:res.data.detail.signStatus,
                    signImgUrl:res.data.detail.signUrl,
                    agreeThird:res.data.detail.isAgreeThird
                })
                console.log(res.data.thirdPartyList)
            }
        })
        self.initSignCanvas();
    },
    showSignDiv(){
        this.setData({
            showSignFlag:true
        })
    },
    hideSignDiv(){
        this.setData({
            showSignFlag:false
        })
        this.clearDraw()
    },
    changeAgreeThird(){
        if(this.data.agreeThird == 0){
            this.setData({
                agreeThird:1
            })
        }else{
            this.setData({
                agreeThird:0
            })
        }
    },
    initSignCanvas(){

        // 使用 wx.createContext 获取绘图上下文 context
        context = wx.createCanvasContext('myCanvas');
        context.beginPath()
        context.setStrokeStyle('#000000');
        context.setLineWidth(4);
        context.setLineCap('round');
        context.setLineJoin('round');
    },
    canvasStart: function (event){
        isButtonDown = true;
        arrz.push(0);
        arrx.push(event.changedTouches[0].x);
        arry.push(event.changedTouches[0].y);
        //context.moveTo(event.changedTouches[0].x, event.changedTouches[0].y);

    },
    canvasMove: function (event) {
        if (isButtonDown) {
            arrz.push(1);
            arrx.push(event.changedTouches[0].x);
            arry.push(event.changedTouches[0].y);
            // context.lineTo(event.changedTouches[0].x, event.changedTouches[0].y);
            // context.stroke();
            // context.draw()

        };

        for (var i = 0; i < arrx.length; i++) {
            if (arrz[i] == 0) {
                context.moveTo(arrx[i], arry[i])
                //context.moveTo(arry[i],arrx[i])

            } else {
                context.lineTo(arrx[i], arry[i])
                //ontext.lineTo(arry[i], arrx[i])
            };

        };
        context.clearRect(0, 0, canvasw, canvash);
        context.stroke();

        context.draw(true);
    },
    canvasEnd: function (event) {
        isButtonDown = false;
    },
    clearDraw: function () {
        //清除画布
        arrx = [];
        arry = [];
        arrz = [];
        context.clearRect(0, 0, 790, 450);
        context.draw(true);
    },
    getImg: function(){
        var self = this;
        var isAgreeThird = self.data.agreeThird;
        var surveyOrderNo = self.data.surveyOrderNo;
        if (arrx.length==0){
            wx.showModal({
                title: '提示',
                content: '签名内容不能为空！',
                showCancel: false
            });
            return false;
        };
        //生成图片
        wx.canvasToTempFilePath({
            canvasId: 'myCanvas',
            success: function (res) {
                console.log(res.tempFilePath);
                wx.showLoading({
                    title: '上传签名中...',
                })
                //存入服务器
                wx.uploadFile({
                    url: 'http://192.168.1.27:9099/boot-xcx-survey-api'+'/survey_sign/v1/save', //接口地址
                    filePath: res.tempFilePath,
                    name: 'photo',
                    formData: {                 //HTTP 请求中其他额外的 form data
                        'surveyNo': surveyOrderNo,
                        'isAgreeThird':isAgreeThird,
                    },
                    success: function (res) {
                        console.log(JSON.parse(res.data));
                        var x = JSON.parse(res.data);
                        if(x.rescode=='200'){
                            console.log(1)
                            self.setData({
                                showSignFlag:false,
                                signStatus:1,
                                signImgUrl:x.data
                            });
                            wx.hideLoading()
                        }

                    },
                    fail: function (res) {
                        console.log(res);
                    },
                    complete: function (res) {

                    }
                });
            }
        })

    },
})