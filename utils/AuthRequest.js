var app = getApp();
function authRequest(param){

  wx.checkSession({
    success: function(){
      doAuthRequest(param);
    },
    fail: function(){

      login(function(){
        doAuthRequest(param);
      });

    }
  });

}

function doAuthRequest(param){

  wx.request({
    url: param.url,
    method: param.method,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Auth-Key': app.globalData.authKey
    },
    data: param.data,
    success: function (res) {

      if (res.data.status == -99) {

        login(function(){

          wx.request({
            url: param.url,
            method: param.method,
            header: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Auth-Key': app.globalData.authKey
            },
            data: param.data,
            success: function (res) {
              param.success(res);
            }
          });

        });

      } else {
        param.success(res);
      }

    }
  });

}

function login(callback){

  wx.login({
    success: function(res){

      var code = res.code;
      wx.getUserInfo({
        success: function(res){

          var nickname = res.userInfo.nickName;

          wx.request({
            url: app.globalData.server + '/session',
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            data: {
              code: code,
              nickname: nickname
            },
            success: function (res) {

              app.globalData.authKey = res.data.data.authKey;
              wx.setStorageSync('authKey', app.globalData.authKey);

              callback();

            }
          });

        }
      });

    }
  });

}

module.exports = authRequest;