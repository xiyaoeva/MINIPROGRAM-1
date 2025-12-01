const { categories } = require('../../data/tag-categories');
const { jobs } = require('../../data/jobs');

Page({
  data: {
    categories,
    expanded: {},
    selectedTags: [],
    filteredJobs: [],
    hasSelection: false
  },

  onLoad() {
    const initialExpanded = {};
    categories.forEach((cat) => {
      initialExpanded[cat.key] = false;
    });
    this.setData({ expanded: initialExpanded });
  },

  toggleCategory(event) {
    const { key } = event.currentTarget.dataset;
    const expanded = { ...this.data.expanded, [key]: !this.data.expanded[key] };
    this.setData({ expanded });
  },

  toggleTag(event) {
    const { tag } = event.currentTarget.dataset;
    const selected = new Set(this.data.selectedTags);
    if (selected.has(tag)) {
      selected.delete(tag);
    } else {
      selected.add(tag);
    }
    this.setData({ selectedTags: Array.from(selected) }, () => {
      this.filterJobs();
    });
  },

  resetFilters() {
    const collapsed = {};
    categories.forEach((cat) => {
      collapsed[cat.key] = false;
    });
    this.setData({ selectedTags: [], filteredJobs: [], hasSelection: false, expanded: collapsed });
  },

  filterJobs() {
    const { selectedTags } = this.data;
    if (!selectedTags.length) {
      this.setData({ filteredJobs: [], hasSelection: false });
      return;
    }
    const filtered = jobs.filter((job) => selectedTags.every((tag) => job.tags.includes(tag)));
    this.setData({ filteredJobs: filtered, hasSelection: true });
  },

  goProfile() {
    wx.navigateTo({ url: '/pages/profile/profile' });
  },

  onJobTap(event) {
    const { id } = event.currentTarget.dataset;
    const job = jobs.find((item) => item.id === id);
    if (!job) return;
    wx.navigateTo({ url: `/pages/detail/detail?job=${encodeURIComponent(JSON.stringify(job))}` });
  }
});
