const { jobs } = require('../../data/jobs');

Page({
  data: {
    job: null
  },

  onLoad(options) {
    const { id } = options || {};
    if (id) {
      try {
        const jobId = decodeURIComponent(id);
        const job = jobs.find((item) => item.id === jobId);
        if (job) {
          this.setData({ job });
          wx.setNavigationBarTitle({ title: job.title });
        }
      } catch (error) {
        console.error('解析岗位信息失败', error);
      }
    }
  },

  openLink() {
    if (!this.data.job || !this.data.job.link) return;
    wx.navigateTo({ url: `/pages/webview/webview?src=${encodeURIComponent(this.data.job.link)}` });
  }
});
