"use strict";
const common_vendor = require("../../common/vendor.js");
const config = require("../../config.js");
const _sfc_main = {
  data() {
    return {
      isArticlesShow: false,
      isWordsShow: true,
      showBottom: true,
      isShow: true,
      isIntroShow: false,
      currentItem: "",
      avatarUrl: "",
      nickName: "",
      btnName: "",
      fontWeight1: "",
      fontWeight2: "",
      fontWeight3: "",
      articles: "",
      userId: "",
      rotation: [
        {
          id: 1,
          url: "../../static/logo-swiper.jpg"
        },
        {
          id: 2,
          url: "../../static/ad.png"
        }
      ],
      chartData: {},
      //您可以通过修改 config-ucharts.js 文件中下标为 ['word'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
      opts: {
        color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        padding: void 0,
        enableScroll: false,
        extra: {
          word: {
            type: "normal",
            autoColors: false
          }
        }
      }
    };
  },
  onLoad() {
    if (common_vendor.index.getStorageSync("nickName") != null) {
      this.isShow = false;
    } else {
      this.isShow = true;
    }
    common_vendor.index.request({
      url: config.config.url + "/searchNoun/list",
      method: "GET",
      success: (res) => {
        console.log(res);
        let arr = [];
        let list = res.data.data;
        list.filter((item, index) => {
          if (index < 20) {
            let obj = {
              name: item.medicalWord,
              paraphrase: item.paraphrase,
              textSize: 18,
              data: void 0
            };
            arr.push(obj);
          }
        });
        console.log(arr);
        this.chartData.series = arr;
      }
    });
  },
  methods: {
    previewPdf(name) {
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
    onChooseAvatar(e) {
      this.uploadFilePromise(e.detail.avatarUrl);
    },
    onNickName(e) {
      console.log("昵称:", e.detail.value);
    },
    uploadFilePromise(avatarUrl) {
      this.avatarUrl = avatarUrl;
    },
    search() {
      common_vendor.index.navigateTo({
        url: "../search/search"
      });
    },
    getWords() {
      this.fontWeight1 = 700;
      this.fontWeight2 = 400;
      this.fontWeight3 = 400;
      this.isArticlesShow = false;
      this.isWordsShow = true;
    },
    getHotArticles() {
      this.fontWeight1 = 400;
      this.fontWeight2 = 700;
      this.fontWeight3 = 400;
      this.isArticlesShow = true;
      this.isWordsShow = false;
      common_vendor.index.request({
        url: config.config.url + "/article/hot",
        success: (res) => {
          console.log(res.data.data.records);
          if (res.data.code == 1)
            this.articles = res.data.data.records;
        }
      });
    },
    getLatestArticles() {
      this.fontWeight1 = 400;
      this.fontWeight2 = 400;
      this.fontWeight3 = 700;
      this.isArticlesShow = true;
      this.isWordsShow = false;
      common_vendor.index.request({
        url: config.config.url + "/article/new",
        success: (res) => {
          console.log(res.data.data.records);
          if (res.data.code == 1)
            this.articles = res.data.data.records;
        }
      });
    },
    activeWord(e) {
      if (e.currentIndex != -1) {
        let detail = this.chartData.series[e.currentIndex];
        console.log(detail);
        this.currentItem = detail;
        this.isIntroShow = true;
      }
    },
    save() {
      console.log("头像", this.avatarUrl, "昵称", this.nickName);
      common_vendor.index.setStorageSync(
        "avatarUrl",
        this.avatarUrl
      );
      common_vendor.index.setStorageSync(
        "nickName",
        this.nickName
      );
      this.userId = common_vendor.index.getStorageSync("userId");
      common_vendor.index.request({
        url: config.config.url + "/user/setNick",
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded",
          "cookie": common_vendor.index.getStorageSync("cookie")
        },
        data: {
          nick: this.nickName
        },
        success: (res) => {
          console.log(res);
        }
      });
      common_vendor.index.uploadFile({
        url: config.config.url + "/user/saveImage",
        filePath: this.avatarUrl,
        name: "images",
        header: {
          "content-type": "application/x-www-form-urlencoded",
          "cookie": common_vendor.index.getStorageSync("cookie")
        },
        success: (res) => {
          console.log(res);
        }
      });
      this.isShow = false;
    }
  }
};
if (!Array) {
  const _easycom_qiun_data_charts2 = common_vendor.resolveComponent("qiun-data-charts");
  _easycom_qiun_data_charts2();
}
const _easycom_qiun_data_charts = () => "../../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.js";
if (!Math) {
  _easycom_qiun_data_charts();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.rotation, (item, k0, i0) => {
      return {
        a: item.url,
        b: item.id
      };
    }),
    b: $data.isIntroShow
  }, $data.isIntroShow ? {
    c: common_vendor.t($data.currentItem.name),
    d: common_vendor.t($data.currentItem.paraphrase),
    e: common_vendor.o(() => {
    })
  } : {}, {
    f: $data.fontWeight1,
    g: common_vendor.o((...args) => $options.getWords && $options.getWords(...args)),
    h: $data.fontWeight2,
    i: common_vendor.o((...args) => $options.getHotArticles && $options.getHotArticles(...args)),
    j: $data.fontWeight3,
    k: common_vendor.o((...args) => $options.getLatestArticles && $options.getLatestArticles(...args)),
    l: $data.isArticlesShow
  }, $data.isArticlesShow ? {
    m: common_vendor.f($data.articles, (item, index, i0) => {
      return {
        a: common_vendor.t(item.filename.length > 18 ? item.filename.substring(0, 18) + "……" : item.filename),
        b: common_vendor.t(item.click),
        c: common_vendor.t(item.favorite),
        d: common_vendor.t(item.likes),
        e: common_vendor.t(item.updateTime),
        f: common_vendor.o(($event) => $options.previewPdf(item.filename))
      };
    })
  } : {}, {
    n: common_vendor.o((...args) => $options.search && $options.search(...args)),
    o: $data.isWordsShow
  }, $data.isWordsShow ? {
    p: common_vendor.o($options.activeWord),
    q: common_vendor.p({
      type: "word",
      opts: $data.opts,
      chartData: $data.chartData
    }),
    r: common_vendor.o(() => {
    })
  } : {}, {
    s: $data.isShow
  }, $data.isShow ? {
    t: $data.avatarUrl,
    v: common_vendor.o((...args) => $options.onChooseAvatar && $options.onChooseAvatar(...args)),
    w: common_vendor.o((...args) => $options.onNickName && $options.onNickName(...args)),
    x: $data.nickName,
    y: common_vendor.o(($event) => $data.nickName = $event.detail.value),
    z: common_vendor.o((...args) => $options.save && $options.save(...args)),
    A: common_vendor.o(() => {
    })
  } : {}, {
    B: common_vendor.o(($event) => $data.isIntroShow = false)
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/hxy123/Documents/HBuilderProjects/医智搜系统/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
