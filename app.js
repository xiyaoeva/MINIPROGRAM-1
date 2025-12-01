App({
  onLaunch() {
    // Initialize storage placeholders for rewards if not set
    const stored = wx.getStorageSync('userRewards');
    if (!stored) {
      wx.setStorageSync('userRewards', {
        points: 0,
        streak: 0,
        lastCheckIn: '',
        stars: []
      });
    }
  },
  globalData: {}
});
