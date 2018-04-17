var config = require('../../../config');
Page({
    data: {
        cliamList: [],
        toLinkUrl: '../fieldViewRecord/fieldViewRecord',
        windowHeight: '',
        allPages: '',
        currentPageNum: 1,
        hideBottom: false,
        loadMoreData: '加载更多……',
        hideHeader: true,
        pageSize: 10,
        openid: '',
        statusObj: {
            '06': '新案件',
            '07': '查勘中',
            '08': '查勘完成',
            '11': '已取消',
        },
        colorObj: {
            '06': '#ff9c00',
            '07': '#01c66c',
            '08': '#ff7171',
            '11': '#01c66c',
        },
        classObj: {
            '06': 'color06',
            '07': 'color07',
            '08': 'color08',
            '11': 'color11',
        }
    },
    gotolink: function (event) {
        var surveyOrderNo = event.currentTarget.id;

        if (event.currentTarget.dataset.status == '08') {
            wx.navigateTo({
                url: this.data.toLinkUrl + '?surveyOrderNo=' + surveyOrderNo
            })
        }

    },
    onLoad() {
        console.log(getApp().data.userId);
        this.getData();
        var that = this;
        //获取屏幕高度
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    windowHeight: res.windowHeight
                })

            }
        })


    },
  
    scroll(e) {
        //console.log(e)
    },
    // 上拉加载更多
    loadMore() {
        var self = this;
        console.log(self.data.currentPageNum);
        console.log(self.data.allPages);
        // 当前页是最后一页
        if (self.data.currentPageNum == self.data.allPages) {
            self.setData({
                hideBottom: false,
                loadMoreData: '全部加载完成'
            })
            return;
        }
        self.setData({
            hideBottom: false
        })
        setTimeout(function () {
            console.log('上拉加载更多');
            var tempCurrentPage = self.data.currentPageNum;
            self.setData({
                currentPageNum: ++tempCurrentPage,
            })
            self.getData();
        }, 300);
    },
    getData() {
        var that = this;
        var pageIndex = that.data.currentPageNum;
        var openid = wx.getStorageSync('openid');
        console.log(openid)
        wx.request({
            url: config.RequestAddressPrefix2 + "/weixin/user/api/v1/list/order",
            data: {
              'openId': openid,
              // 'openId': wx.getStorage(openid),
                'pageNo': pageIndex,
                'pageSize': this.data.pageSize
            },
            method: 'POST',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: res => {
                console.log(res);
                if (res.statusCode == '200') {
                    // if(pageIndex == 1){ // 下拉刷新
                    //     let list = res.data.data.records;
                    //     list.forEach((i,n)=>{
                    //         i.accidentTime = this.handleTimeStr(i.accidentTime)
                    //     })
                    //     self.setData({
                    //         allPages: res.data.data.total,
                    //         cliamList: list,
                    //         hideHeader: true
                    //     })
                    // }else{ // 加载更多
                    console.log('加载更多');
                    let list = res.data.data.records;
                    list.forEach((i, n) => {
                        i.accidentTime = that.handleTimeStr(i.accidentTime)
                    });
                    list = that.data.cliamList.concat(list);
                    that.setData({
                        allPages: res.data.data.pages,
                        cliamList: list,
                        hideBottom: true
                    })
                    //}

                }
            }
        })

    },
    //onLoad: function(){
        // try {
        //     let value = wx.getStorageSync('openid')
        //     if (value) {
        //         // Do something with return value
        //         console.log(value);
        //         this.setData({
        //             openid:value
        //         })
        //         let that = this;
        //
        //     }
        // } catch (e) {
        //     // Do something when catch error
        // }
        // var that = this;
        // wx.request({
        //     url:config.RequestAddressPrefix2+"/boot-xcx-survey-api/weixin/user/api/v1/list/order",
        //     data:{
        //         'openId':'b9239ab8-be29-41b9-8a32-a3c43383a2e6',
        //         'pageNo':1,
        //         'pageSize':20
        //     },
        //     method:'POST',
        //     header: {
        //         'content-type': 'application/json' // 默认值
        //     },
        //     success:res=>{
        //         console.log(res);
        //         if(res.statusCode == '200'){
        //             let list = res.data.data.records;
        //             list.forEach((i,n)=>{
        //                 i.accidentTime = this.handleTimeStr(i.accidentTime)
        //             })
        //             console.log(list)
        //             that.setData({
        //                 'cliamList':list
        //             })
        //
        //         }
        //     }
        // })
    //},
    handleTimeStr(xx){
        return String(xx).substring(0, xx.length - 2)
    }
})