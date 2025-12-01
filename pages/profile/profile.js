Page({
  data: {
    loggedIn: false,
    loginCode: '',
    points: 0,
    streak: 0,
    lastCheckIn: '',
    stars: []
  },

  onLoad() {
    this.loadRewards();
  },

  onShow() {
    this.loadRewards();
  },

  loadRewards() {
    const stored = wx.getStorageSync('userRewards') || {};
    const loginStatus = wx.getStorageSync('loggedIn') || false;
    this.setData({
      loggedIn: !!loginStatus,
      points: stored.points || 0,
      streak: stored.streak || 0,
      lastCheckIn: stored.lastCheckIn || '',
      stars: stored.stars || []
    });
  },

  login() {
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.setStorageSync('loggedIn', true);
          this.setData({ loggedIn: true, loginCode: res.code });
          wx.showToast({ title: '登录成功', icon: 'success' });
        } else {
          wx.showToast({ title: '登录失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '登录失败', icon: 'none' });
      }
    });
  },

  formatDate(date) {
    const pad = (num) => String(num).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  },

  formatTimestamp(date) {
    const pad = (num, len = 2) => String(num).padStart(len, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`;
  },

  checkIn() {
    if (!this.data.loggedIn) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    const today = new Date();
    const todayStr = this.formatDate(today);
    if (this.data.lastCheckIn === todayStr) {
      wx.showToast({ title: '今日已打卡', icon: 'none' });
      return;
    }
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const streak = this.data.lastCheckIn === this.formatDate(yesterday) ? this.data.streak + 1 : 1;
    let points = this.data.points + 10;
    let bonus = 0;
    if (streak % 3 === 0) {
      points += 20;
      bonus = 20;
    }
    const rewards = {
      points,
      streak,
      lastCheckIn: todayStr,
      stars: this.data.stars
    };
    wx.setStorageSync('userRewards', rewards);
    this.setData({ points, streak, lastCheckIn: todayStr });
    const toastText = bonus ? `打卡成功 +${10 + bonus}积分` : '打卡成功 +10积分';
    wx.showToast({ title: toastText, icon: 'success' });
  },

  convertStar() {
    if (!this.data.loggedIn) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    if (this.data.points < 50) {
      wx.showToast({ title: '积分不足 50', icon: 'none' });
      return;
    }
    const points = this.data.points - 50;
    const newStar = { id: `star-${Date.now()}`, timestamp: this.formatTimestamp(new Date()) };
    const stars = [newStar, ...this.data.stars];
    const rewards = {
      points,
      streak: this.data.streak,
      lastCheckIn: this.data.lastCheckIn,
      stars
    };
    wx.setStorageSync('userRewards', rewards);
    this.setData({ points, stars });
    wx.showModal({ title: '兑换成功', content: '请截图保存你的星星', showCancel: false });
  }
});
