const STYLE_TAGS = [
  { label: '写实', icon: '🎨', selected: false },
  { label: '动漫', icon: '🌸', selected: false },
  { label: '电影感', icon: '🎬', selected: false },
  { label: '梦幻', icon: '✨', selected: false },
  { label: '油画', icon: '🖌️', selected: false },
  { label: '水彩', icon: '💧', selected: false },
]

type CreateState = 'input' | 'generating' | 'complete'

Component({
  data: {
    currentState: 'input' as CreateState,
    prompt: '',
    negativePrompt: '',
    styleTags: STYLE_TAGS,
    generatedImageUrl: '',
    progress: 0,
  },

  methods: {
    onPromptChange(e: any) {
      this.setData({ prompt: e.detail.value })
    },

    onNegativePromptChange(e: any) {
      this.setData({ negativePrompt: e.detail.value })
    },

    onStyleTagTap(e: any) {
      const { index } = e.currentTarget.dataset
      const tags = this.data.styleTags.slice()
      tags[index].selected = !tags[index].selected
      const selectedStyles = tags
        .filter(t => t.selected)
        .map(t => t.label)
        .join('、')
      const currentPrompt = this.data.prompt
      const basePrompt = currentPrompt.replace(/[,，]\s*(写实|动漫|电影感|梦幻|油画|水彩)(?:[,，]\s*(写实|动漫|电影感|梦幻|油画|水彩))*$/, '').trim()
      this.setData({
        styleTags: tags,
        prompt: selectedStyles ? `${basePrompt}${basePrompt ? '，' : ''}${selectedStyles}` : basePrompt,
      })
    },

    onGenerate() {
      if (!this.data.prompt.trim()) {
        this.showMessage('请输入画面描述', 'warning')
        return
      }
      this.setData({
        currentState: 'generating',
        progress: 0,
      })
      this.simulateProgress()
    },

    simulateProgress() {
      let progress = 0
      const timer = setInterval(() => {
        progress += Math.random() * 15 + 5
        if (progress >= 100) {
          progress = 100
          clearInterval(timer)
          setTimeout(() => {
            this.setData({
              currentState: 'complete',
              generatedImageUrl: `https://picsum.photos/800/800?random=${Date.now()}`,
            })
          }, 300)
        }
        this.setData({ progress: Math.min(Math.round(progress), 100) })
      }, 500)
    },

    onRegenerate() {
      this.setData({
        currentState: 'input',
        progress: 0,
        generatedImageUrl: '',
      })
    },

    onPublish() {
      this.showMessage('发布成功', 'success')
      setTimeout(() => {
        wx.switchTab({ url: '/pages/home/home' })
      }, 1000)
    },

    onInspirationTap() {
      this.showMessage('灵感推荐功能开发中', 'info')
    },

    showMessage(content: string, type: string) {
      const msg = this.selectComponent('#t-message')
      if (msg) {
        msg.show({ content, type, duration: 2000 })
      }
    },
  },
})
