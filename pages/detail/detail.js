Page({
  data: {
    job: null
  },

  onLoad(options) {
    if (options.job) {
      try {
        const job = JSON.parse(decodeURIComponent(options.job));
        this.setData({ job });
        wx.setNavigationBarTitle({ title: job.title });
      } catch (error) {
        console.error('解析岗位信息失败', error);
      }
    }
  },

  openLink() {
    if (!this.data.job || !this.data.job.link) return;
    wx.navigateTo({ url: `/pages/webview/webview?src=${encodeURIComponent(this.data.job.link)}` });
  },

  copyLink() {
    if (!this.data.job || !this.data.job.link) return;
    wx.setClipboardData({ data: this.data.job.link });
  }
});
