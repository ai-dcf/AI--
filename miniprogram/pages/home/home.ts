const app = getApp<IAppOption>()

Component({
  data: {
    galleryList: [] as Array<{
      id: string
      imageUrl: string
      prompt: string
      avatarUrl: string
      nickName: string
      height: number
    }>,
    loading: true,
    loadingMore: false,
    hasMore: true,
    page: 0,
    pageSize: 10,
  },

  lifetimes: {
    attached() {
      this.loadGalleryList()
    },
  },

  methods: {
    loadGalleryList() {
      this.setData({ loading: true })
      setTimeout(() => {
        const mockData = this.generateMockData()
        this.setData({
          galleryList: mockData,
          loading: false,
          page: 1,
          hasMore: true,
        })
      }, 800)
    },

    generateMockData() {
      const prompts = [
        '一只橘猫坐在窗台上，望着窗外的夕阳，油画风格',
        '赛博朋克城市夜景，霓虹灯，雨后倒影',
        '水墨山水画，远山近水，一叶扁舟，中国风',
        '梦幻森林中的精灵，发光的蘑菇，萤火虫，奇幻插画',
        '宇航员在火星表面行走，电影感，广角镜头',
        '日式拉面特写，热气腾腾，写实摄影风格',
        '一只白狐在雪地中奔跑，动漫风格，飘雪',
        '古风少女撑伞走在石桥上，烟雨江南，工笔画',
      ]
      const names = ['小橘', '数码旅人', '墨白', '林间客', '星际旅者', '食光记', '雪狐', '雨巷']
      const heights = [320, 240, 300, 360, 260, 310, 280, 340]

      return prompts.map((prompt, index) => ({
        id: `mock-${index}`,
        imageUrl: `https://picsum.photos/400/${heights[index]}?random=${index + 1}`,
        prompt,
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${names[index]}`,
        nickName: names[index],
        height: heights[index],
      }))
    },

    onLoadMore() {
      if (this.data.loadingMore || !this.data.hasMore) return
      this.setData({ loadingMore: true })
      setTimeout(() => {
        const nextPage = this.data.page + 1
        const moreData = this.generateMockData().map((item, i) => ({
          ...item,
          id: `mock-${nextPage}-${i}`,
          imageUrl: `https://picsum.photos/400/${item.height}?random=${nextPage * 10 + i}`,
        }))
        this.setData({
          galleryList: [...this.data.galleryList, ...moreData],
          loadingMore: false,
          page: nextPage,
          hasMore: nextPage < 5,
        })
      }, 600)
    },

    onImageTap(e: any) {
      const { id } = e.currentTarget.dataset
      console.log('image tap:', id)
    },

    onFabTap() {
      wx.navigateTo({ url: '/pages/create/create' })
    },

    onScrollToLower() {
      this.onLoadMore()
    },
  },
})
