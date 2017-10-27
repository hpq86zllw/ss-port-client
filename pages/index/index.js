var authRequest = require('../../utils/AuthRequest');

var app = getApp();
Page({
  data: {
    loaded: false,
    hasPort: false,
    userInfo: null,
    flow: '流量',
    host: '服务器',
    portNo: '端口',
    password: '密码',
    encryptMethod: '加密方式',
    portDetail: {
      usedFlow: null,
      totalFlow: null,
      usedFlowPercent: null,
      host: null,
      portNo: null,
      password: null,
      encryptMethod: null
    },
    deletePort: '删除端口',
    applyPort: '申请端口',
    disabled: false
  },
  onLoad: function(){
    this.setData({
      disabled: true
    });
    this.loadDataWithMask();
  },
  onPullDownRefresh: function(){
    var that = this;
    this.setData({
      disabled: true
    });
    this.loadData(function(){
      wx.stopPullDownRefresh();
      that.setData({
        disabled: false
      });
    });
  },
  onShareAppMessage: function(){
    return {
      title: app.globalData.title,
      page:'pages/index/index'
    };
  },
  loadData: function(callback){

    var that = this;
    app.getUserInfo(function(userInfo){

      authRequest({
        url: app.globalData.server + '/user/port',
        method: 'GET',
        data: {
          r: Math.random()
        },
        success: function(res){

          if(res.data.status == 1){
            that.setData({
              loaded: true,
              hasPort: true,
              userInfo: userInfo,
              portDetail: res.data.data.portDetail
            });
          } else {
            that.setData({
              loaded: true,
              hasPort: false,
              userInfo: userInfo
            });
          }

          if(callback){
            callback();
          }

        }
      });

    });

  },
  loadDataWithMask: function(){

    var that = this;
    wx.showLoading({
      title: '读取中',
      mask: true,
      success: function () {

        that.loadData(function () {
          setTimeout(function () {
            wx.hideLoading();
            that.setData({
              disabled: false
            });
          }, 500);
        });

      }
    });

  },
  applyPort: function(){
    var that = this;
    wx.showModal({
      title: '',
      content: '确定申请端口吗',
      success: function (res) {

        if(res.confirm){

          that.setData({
            disabled: true
          });
          wx.showLoading({
            title: '申请中',
            mask: true,
            success: function(){

              authRequest({
                url: app.globalData.server + '/user/port',
                method: 'POST',
                data: {
                  r: Math.random()
                },
                success: function(res){

                  setTimeout(function() {
                    wx.hideLoading();
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'success',
                      mask: true,
                      success: function () {

                        setTimeout(function () {

                          wx.hideToast();
                          that.loadDataWithMask();

                        }, 1000);

                      }
                    });
                  }, 500);

                }
              });

            }
          });

        }

      }
    });
  },
  deletePort: function(){
    var that = this;
    wx.showModal({
      title: '',
      content: '确定删除端口吗',
      success: function(res){

        if (res.confirm){

          that.setData({
            disabled: true
          });
          wx.showLoading({
            title: '删除中',
            mask: true,
            success: function(){

              authRequest({
                url: app.globalData.server + '/user/port',
                method: 'DELETE',
                data: {
                  r: Math.random()
                },
                success: function(res){

                  setTimeout(function () {
                    wx.hideLoading();
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'success',
                      mask: true,
                      success: function () {

                        setTimeout(function () {

                          wx.hideToast();
                          that.loadDataWithMask();

                        }, 1000);

                      }
                    });
                  }, 500);

                }
              });

            }
          });

        }

      }
    });
  }
});
