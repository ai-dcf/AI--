const app = getApp<IAppOption>()

Component({
  data: {
    isLoggedIn: false,
    userInfo: {
      avatarUrl: '',
      nickName: '',
    },
    stats: {
      works: 0,
      likes: 0,
      favorites: 0,
    },
    myGallery: [] as string[],
  },

  lifetimes: {
    attached() {
      this.checkLogin()
    },
  },

  pageLifetimes: {
    show() {
      this.checkLogin()
    },
  },

  methods: {
    checkLogin() {
      const userInfo = app.globalData.userInfo
      if (userInfo) {
        this.setData({
          isLoggedIn: true,
          userInfo: {
            avatarUrl: userInfo.avatarUrl,
            nickName: userInfo.nickName,
          },
          stats: { works: 12, likes: 36, favorites: 5 },
          myGallery: Array.from({ length: 9 }, (_, i) =>
            `https://picsum.photos/300/300?random=${i + 10}`
          ),
        })
      }
    },

    onWechatLogin() {
      wx.getUserProfile({
        desc: '用于展示个人信息',
        success: (res) => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            isLoggedIn: true,
            userInfo: {
              avatarUrl: res.userInfo.avatarUrl,
              nickName: res.userInfo.nickName,
            },
            stats: { works: 12, likes: 36, favorites: 5 },
            myGallery: Array.from({ length: 9 }, (_, i) =>
              `https://picsum.photos/300/300?random=${i + 10}`
            ),
          })
        },
        fail: () => {
          console.log('用户取消登录')
        },
      })
    },

    onGalleryItemTap(e: any) {
      const { index } = e.currentTarget.dataset
      console.log('gallery item tap:', index)
    },

    onViewAllTap() {
      console.log('view all')
    },

    onCreateTap() {
      wx.navigateTo({ url: '/pages/create/create' })
    },

    onHistoryTap() {
      console.log('history')
    },

    onPrivacyTap() {
      console.log('privacy')
    },

    onHelpTap() {
      console.log('help')
    },
  },
})
