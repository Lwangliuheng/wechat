
Page({
    data: {
        imgUrls: [
            'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
        ],
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        duration: 1000,
        bigPhotoShowFlag:false,
        showPhotoList:[],
        currentIndex:0,
        licenseNo:''
    },
    onLoad(options){
        console.log(options)
        this.setData({
            licenseNo:options.licenseNo
        })
        this.initData();
    },
    initData(){
        try {
            var value = wx.getStorageSync('showPhotoList')
            if (value) {
                // Do something with return value
                this.setData({
                    showPhotoList:value
                })
            }
        } catch (e) {
            // Do something when catch error
        }
    },
    changeAutoplay: function(e) {
        this.setData({
            autoplay: !this.data.autoplay
        })
    },
    intervalChange: function(e) {
        this.setData({
            interval: e.detail.value
        })
    },
    durationChange: function(e) {
        this.setData({
            duration: e.detail.value
        })
    },
    showBigPhoto:function(event){
        console.log(event.currentTarget.id)
        this.setData({
            bigPhotoShowFlag:true,
            currentIndex:event.currentTarget.id
        })
    },
    hideBigPhoto:function(){
        this.setData({
            bigPhotoShowFlag:false
        })
    }
})