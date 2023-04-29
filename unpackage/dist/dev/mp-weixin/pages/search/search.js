"use strict";
const common_vendor = require("../../common/vendor.js");
const config = require("../../config.js");
const _sfc_main = {
  data() {
    return {
      isHotWordsShow: "",
      isContentSearch: "",
      isKeywordsSearch: "",
      link: "",
      content: "",
      hotWords: "",
      searchResults: [],
      isMethodsShow: true,
      isNounShow: "",
      keyword: "",
      methods: [
        "内容检索",
        "标题检索",
        "关键词检索",
        "名词检索"
      ],
      searchMethod: "",
      isShow: "",
      currentItem: ""
    };
  },
  onReady() {
    this.getServerData();
  },
  onLoad() {
    common_vendor.index.request({
      url: config.config.url + "/searchWord/hot",
      method: "GET",
      success: (res) => {
        console.log(res);
        if (res.data.code == 1)
          this.hotWords = res.data.data.records.splice(0, 10);
      }
    });
  },
  methods: {
    toAdvancedSearch() {
      common_vendor.index.navigateTo({
        url: "../advanced-search/advanced-search"
      });
    },
    getDetail(item) {
      const filename = item.filename;
      console.log("item", item);
      common_vendor.index.navigateTo({
        url: "/pages/detail/detail?filename=" + filename + "&keyword=" + this.keyword
      });
    },
    searchHotWords(item) {
      const keyword = item.keyword;
      this.keyword = item.keyword;
      this.isContentSearch = false;
      common_vendor.index.request({
        url: config.config.url + "/search/content?keyword=" + keyword + "&page=1&pageSize=10",
        method: "GET",
        success: (res) => {
          console.log(res);
          if (res.data.code == 1) {
            this.searchResults = res.data.data.records;
            this.isHotWordsShow = false;
            this.isContentSearch = true;
            this.isKeywordsSearch = false;
            this.isMethodsShow = false;
          }
        }
      });
    },
    like(item) {
      const filename = item.filename;
      const userId = common_vendor.index.getStorageSync("userId");
      common_vendor.index.request({
        url: config.config.url + "/article/approve",
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          filename,
          userId
        },
        success: (res) => {
          console.log(res);
          if (res.data.code == 1) {
            if (res.data.data == "喜欢成功") {
              item.likeCount++;
            } else if (res.data.data == "取消喜欢") {
              item.likeCount--;
            }
          }
        }
      });
    },
    click(item) {
      const filename = item.filename;
      const keyword = this.content;
      common_vendor.index.request({
        url: config.config.url + "/article/click?filename=" + filename + "&keyword" + keyword,
        method: "POST",
        success: (res) => {
          console.log(res);
          if (res.data.code == 1) {
            item.clickCount++;
          }
        }
      });
    },
    favor(item) {
      const filename = item.filename;
      const userId = common_vendor.index.getStorageSync("userId");
      common_vendor.index.request({
        url: config.config.url + "/article/star",
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          filename,
          userId
        },
        success: (res) => {
          console.log(res);
          if (res.data.code == 1) {
            if (res.data.code == 1) {
              if (res.data.data == "收藏成功") {
                common_vendor.index.showToast({
                  title: res.data.data,
                  icon: "success"
                });
                item.favoriteCount++;
              } else if (res.data.data == "取消收藏") {
                item.favoriteCount--;
                common_vendor.index.showToast({
                  title: res.data.data,
                  icon: "success"
                });
              }
            }
          }
        }
      });
    },
    search() {
      const keyword = this.content;
      let method = "";
      if (this.searchMethod == "名词检索") {
        common_vendor.index.request({
          url: config.config.url + "/searchNoun/explanation?noun=" + keyword,
          method: "GET",
          success: (res) => {
            console.log(res);
            if (res.data.code == 1) {
              this.searchResults = res.data.data;
              this.isContentSearch = false;
              this.isKeywordsSearch = false;
              this.isHotWordsShow = false;
              this.isNounShow = true;
            } else if (res.data.code == 0) {
              common_vendor.index.showToast({
                title: res.data.msg,
                icon: "none"
              });
            }
          }
        });
      } else {
        if (this.searchMethod == "内容检索") {
          this.isContentSearch = true;
          method = "content";
          this.keyword = keyword;
        } else if (this.searchMethod == "标题检索") {
          this.isContentSearch = true;
          method = "title";
        } else if (this.searchMethod == "关键词检索") {
          method = "keyword";
          this.isContentSearch = false;
          this.isKeywordsSearch = true;
        }
        if (method == "") {
          common_vendor.index.showToast({
            title: "请选择检索方式！",
            icon: "none"
          });
        } else {
          console.log(keyword, method);
          common_vendor.index.request({
            url: config.config.url + "/search/" + method + "?keyword=" + keyword + "&page=1&pageSize=10",
            method: "GET",
            success: (res) => {
              console.log(res);
              if (res.data.code == 1) {
                this.searchResults = res.data.data.records;
                this.isHotWordsShow = false;
              }
            }
          });
        }
      }
    },
    preview(name) {
      console.log(name);
      common_vendor.index.showLoading({
        title: "加载中"
      });
      common_vendor.index.downloadFile({
        url: config.config.url + "/common/download?name=" + name,
        success: (res) => {
          console.log(res);
          if (res.statusCode === 200) {
            console.log("下载成功");
            common_vendor.index.hideLoading();
          }
          common_vendor.index.saveFile({
            tempFilePath: res.tempFilePath,
            success: function(save) {
              common_vendor.index.openDocument({
                filePath: save.savedFilePath,
                fileType: "pdf",
                showMenu: "true",
                success: function(open) {
                  console.log(open);
                }
              });
            }
          });
        }
      });
    },
    download(name) {
      console.log(name);
      common_vendor.index.showLoading({
        title: "正在下载"
      });
      common_vendor.index.downloadFile({
        url: config.config.url + "/common/download?name=" + name,
        success: (res) => {
          console.log(res);
          if (res.statusCode === 200) {
            console.log("下载成功");
            common_vendor.index.hideLoading();
          }
          common_vendor.index.saveFile({
            tempFilePath: res.tempFilePath,
            success: function(save) {
              common_vendor.index.showToast({
                title: "下载成功",
                icon: "success"
              });
            }
          });
        }
      });
    },
    confirm() {
      this.isMethodsShow = false;
      this.searchMethod = this.methods[Number(this.link)];
      this.content = "";
    },
    select(index) {
      this.link = index;
    },
    activeWord(e) {
      if (e.currentIndex != -1) {
        let detail = this.chartData.series[e.currentIndex];
        console.log(detail);
        this.currentItem = detail;
        this.isShow = true;
      }
    },
    getServerData() {
      setTimeout(() => {
        let res = {
          series: []
        };
        this.chartData = JSON.parse(JSON.stringify(res));
      }, 500);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.isShow
  }, $data.isShow ? {
    b: common_vendor.t($data.currentItem.name),
    c: common_vendor.t($data.currentItem.paraphrase)
  } : {}, {
    d: common_vendor.t($data.searchMethod),
    e: common_vendor.o((...args) => $options.toAdvancedSearch && $options.toAdvancedSearch(...args)),
    f: common_vendor.o(($event) => $data.isMethodsShow = true),
    g: common_vendor.o((...args) => $options.search && $options.search(...args)),
    h: common_vendor.o(($event) => {
      $data.searchResults = "";
      $data.isHotWordsShow = true;
      $data.isContentSearch = false;
      $data.isKeywordsSearch = false;
    }),
    i: $data.content,
    j: common_vendor.o(($event) => $data.content = $event.detail.value),
    k: common_vendor.o((...args) => $options.search && $options.search(...args)),
    l: $data.searchResults.length == 0
  }, $data.searchResults.length == 0 ? {} : {}, {
    m: $data.isContentSearch
  }, $data.isContentSearch ? {
    n: common_vendor.f($data.searchResults, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.filename.length > 18 ? item.filename.substring(0, 18) + "…" : item.filename)
      }, $data.searchMethod == "内容检索" ? {
        b: common_vendor.o(($event) => $options.getDetail(item))
      } : {}, $data.searchMethod == "内容检索" ? {
        c: common_vendor.t(item.count)
      } : {}, {
        d: common_vendor.t(item.likeCount),
        e: common_vendor.o(($event) => $options.like(item)),
        f: common_vendor.t(item.clickCount),
        g: common_vendor.t(item.favoriteCount),
        h: common_vendor.o(($event) => $options.favor(item))
      }, $data.searchMethod == "内容检索" ? {
        i: common_vendor.t(item.matchScore.toFixed(3)),
        j: common_vendor.t(item.likeScore.toFixed(3)),
        k: common_vendor.t(item.starScore.toFixed(3)),
        l: common_vendor.t(item.scores.toFixed(3))
      } : {}, $data.searchMethod == "标题检索" ? {
        m: common_vendor.o(($event) => $options.download(item.filename)),
        n: common_vendor.o(($event) => $options.preview(item.filename))
      } : {}, $data.searchMethod == "标题检索" ? {
        o: common_vendor.t(item.abs.length > 300 ? item.abs.substring(0, 300) : item.abs)
      } : {}, {
        p: common_vendor.o(($event) => $options.click(item))
      });
    }),
    o: $data.searchMethod == "内容检索",
    p: $data.searchMethod == "内容检索",
    q: $data.searchMethod == "内容检索",
    r: $data.searchMethod == "标题检索",
    s: $data.searchMethod == "标题检索"
  } : {}, {
    t: $data.isNounShow
  }, $data.isNounShow ? {
    v: common_vendor.t($data.searchResults.medicalWord),
    w: common_vendor.t($data.searchResults.paraphrase)
  } : {}, {
    x: $data.isKeywordsSearch
  }, $data.isKeywordsSearch ? {
    y: common_vendor.f($data.searchResults, (item, index, i0) => {
      return {
        a: common_vendor.t(item.filename.length > 18 ? item.filename.substring(0, 18) + "…" : item.filename),
        b: common_vendor.t(item.likeCount),
        c: common_vendor.o(($event) => $options.like(item)),
        d: common_vendor.t(item.clickCount),
        e: common_vendor.t(item.favoriteCount),
        f: common_vendor.o(($event) => $options.favor(item)),
        g: common_vendor.o(($event) => $options.download(item.filename)),
        h: common_vendor.o(($event) => $options.preview(item.filename)),
        i: common_vendor.t(item.abs.length > 300 ? item.abs.substring(0, 300) : item.abs),
        j: common_vendor.o(($event) => $options.click(item))
      };
    })
  } : {}, {
    z: $data.isHotWordsShow
  }, $data.isHotWordsShow ? {
    A: common_vendor.f($data.hotWords, (item, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.t(item.keyword.length > 15 ? item.keyword.substring(0, 15) + "…" : item.keyword),
        c: common_vendor.t(item.click),
        d: common_vendor.o(($event) => $options.searchHotWords(item))
      };
    }),
    B: common_vendor.o(($event) => $data.isMethodsShow = false)
  } : {}, {
    C: $data.isMethodsShow
  }, $data.isMethodsShow ? {
    D: common_vendor.f($data.methods, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: common_vendor.n({
          selected: $data.link == index,
          unselected: $data.link != index
        }),
        c: common_vendor.o(($event) => $options.select(index))
      };
    }),
    E: common_vendor.o((...args) => $options.confirm && $options.confirm(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c10c040c"], ["__file", "C:/Users/hxy123/Documents/HBuilderProjects/医智搜系统/pages/search/search.vue"]]);
wx.createPage(MiniProgramPage);
