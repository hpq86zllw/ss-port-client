App({
  onLaunch: function(){

    var authKey = wx.getStorageSync('authKey');
    if (authKey){
      this.globalData.authKey = authKey;
    }
    
  },
  getUserInfo: function(callback){

    var that = this;

    if (that.globalData.userInfo) {
      callback(that.globalData.userInfo);
      return;
    }

    that.doGetUserInfo(function (userInfo) {
      callback(userInfo);
    });

  },
  doGetUserInfo: function (callback){

    var that = this;

    wx.getUserInfo({
      withCredentials: false,
      success: function (res) {
        that.globalData.userInfo = res.userInfo;
        callback(that.globalData.userInfo);
      }
    });

  },
  globalData: {
    title: _TITLE_,
    server: _SERVER_,
    userInfo: null,
    authKey: null
  }
})