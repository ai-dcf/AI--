App<IAppOption>({
  globalData: {
    userInfo: undefined,
  },
  onLaunch() {
    wx.login({
      success: res => {
        console.log(res.code)
      },
    })
  },
})
