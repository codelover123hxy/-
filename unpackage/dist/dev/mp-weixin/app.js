"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/login/login.js";
  "./pages/register/register.js";
  "./pages/protocol/protocol.js";
  "./pages/index/index.js";
  "./pages/personal-center/personal-center.js";
  "./pages/talking-area/talking-area.js";
  "./pages/search/search.js";
  "./pages/article/article.js";
  "./pages/suggestion/suggestion.js";
  "./pages/change-info/change-info.js";
  "./pages/my-collection/my-collection.js";
  "./pages/member/member.js";
  "./pages/detail/detail.js";
  "./pages/advanced-search/advanced-search.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/hxy123/Documents/HBuilderProjects/医智搜系统/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
