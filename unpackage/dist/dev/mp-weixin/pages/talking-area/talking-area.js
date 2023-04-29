"use strict";
const common_vendor = require("../../common/vendor.js");
const config = require("../../config.js");
const api_talk = require("../../api/talk.js");
require("../../util/request.js");
const _sfc_main = {
  data() {
    return {
      postList: "",
      isShow: "",
      isCommentViewShow: "",
      content: "",
      comment: "",
      currentPostId: "",
      page: 1,
      commentPage: 1
    };
  },
  methods: {
    clickPost(index) {
      const id = this.postList[index].id;
      common_vendor.index.request({
        url: config.config.url + "/question/click",
        header: {
          "content-type": "application/x-www-form-urlencoded",
          "Cookie": common_vendor.index.getStorageSync("cookie")
        },
        method: "POST",
        data: {
          questionId: id
        },
        success: (res) => {
          console.log(res);
          if (res.data.code == 1)
            this.postList[index].click++;
        }
      });
    },
    likePost(index) {
      const id = this.postList[index].id;
      common_vendor.index.request({
        url: config.config.url + "/question/approve",
        header: {
          "content-type": "application/x-www-form-urlencoded",
          "Cookie": common_vendor.index.getStorageSync("cookie")
        },
        method: "POST",
        data: {
          questionId: id
        },
        success: (res) => {
          console.log(res);
          if (res.data.code == 1)
            this.postList[index].likes++;
        }
      });
    },
    deletePost(index) {
      const postId = this.postList[index].id;
      const userId = common_vendor.index.getStorageSync("userId");
      common_vendor.index.showModal({
        title: "提示",
        content: "确认删除",
        cancelText: "取消",
        confirmText: "确认",
        showCancel: true,
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.request({
              url: config.config.url + "/question/deleteQuestion?questionId=" + postId + "&userId=" + userId,
              method: "DELETE",
              header: {
                "Cookie": common_vendor.index.getStorageSync("cookie")
              },
              success: (res2) => {
                console.log(res2);
                if (res2.data.code == 1) {
                  common_vendor.index.showToast({
                    title: "删除成功",
                    icon: "success"
                  });
                  this.postList.splice(index, 1);
                } else if (res2.data.code == 0) {
                  common_vendor.index.showToast({
                    title: "删除失败",
                    icon: "error"
                  });
                }
              }
            });
          }
        }
      });
    },
    likeComment(index, index2) {
      const commentId = this.postList[index].comment[index2].id;
      common_vendor.index.request({
        url: config.config.url + "/comment/approve",
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded",
          "Cookie": common_vendor.index.getStorageSync("cookie")
        },
        data: {
          commentId
        },
        success: (res) => {
          console.log(res);
          if (res.data.code == 1)
            this.postList[index].comment[index2].likes++;
        }
      });
    },
    deleteComment(index, index2) {
      const commentId = this.postList[index].comment[index2].id;
      const userId = common_vendor.index.getStorageSync("userId");
      common_vendor.index.showModal({
        title: "提示",
        content: "确认删除",
        cancelText: "取消",
        confirmText: "确认",
        showCancel: true,
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.request({
              url: config.config.url + "/comment/delete?commentId=" + commentId + "&userId=" + userId,
              method: "DELETE",
              header: {
                "Cookie": common_vendor.index.getStorageSync("cookie")
              },
              success: (res2) => {
                if (res2.data.code == 1) {
                  common_vendor.index.showToast({
                    title: "删除成功",
                    icon: "success"
                  });
                  this.postList[index].comment.splice(index2, 1);
                } else if (res2.data.code == 0) {
                  common_vendor.index.showToast({
                    title: "删除失败",
                    icon: "error"
                  });
                }
              }
            });
          }
        }
      });
    },
    showComment(index) {
      this.clickPost(index);
      const id = this.postList[index].id;
      this.currentPostId = id;
      const commentPage = this.postList[index].commentPage;
      if (this.postList[index].btnName == "查看评论") {
        common_vendor.index.request({
          url: config.config.url + "/comment/list?questionId=" + id + "&page=" + commentPage + "&pageSize=10",
          method: "GET",
          header: {
            "Cookie": common_vendor.index.getStorageSync("cookie")
          },
          success: (res) => {
            console.log(res);
            if (res.data.code == 1) {
              if (res.data.data.records.length != 0) {
                this.postList[index].comment = res.data.data.records;
                this.postList[index].btnName = "收起评论";
              } else {
                common_vendor.index.showToast({
                  title: "该帖子无评论",
                  icon: "none"
                });
              }
            }
          }
        });
        common_vendor.index.request({
          url: config.config.url + "/comment/total?questionId=" + id,
          method: "GET",
          header: {
            "Cookie": common_vendor.index.getStorageSync("cookie")
          },
          success: (res) => {
            console.log(res);
            if (res.data.code == 1) {
              let totalComment = res.data.data;
              this.postList[index].count = totalComment;
            }
          }
        });
      } else if (this.postList[index].btnName == "收起评论") {
        this.postList[index].btnName = "查看评论";
        this.postList[index].commentPage = 1;
      }
    },
    showMoreComment(index) {
      this.postList[index].commentPage++;
      const id = this.postList[index].id;
      const commentPage = this.postList[index].commentPage;
      common_vendor.index.request({
        url: config.config.url + "/comment/list?questionId=" + id + "&page=" + commentPage + "&pageSize=10",
        method: "GET",
        header: {
          "Cookie": common_vendor.index.getStorageSync("cookie")
        },
        success: (res) => {
          console.log(res);
          if (res.data.code == 1) {
            if (res.data.data.records.length != 0)
              this.postList[index].comment.push(...res.data.data.records);
            else {
              common_vendor.index.showToast({
                title: "无更多评论",
                icon: "none"
              });
              this.postList[index].commentPage--;
            }
          }
        }
      });
    },
    submitPost() {
      const userId = common_vendor.index.getStorageSync("userId");
      const nickName = common_vendor.index.getStorageSync("nickName");
      ({
        content: this.content,
        userId,
        username: nickName
      });
      common_vendor.index.request({
        url: config.config.url + "/question/postQuestion",
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded",
          "Cookie": common_vendor.index.getStorageSync("cookie")
        },
        data: {
          content: this.content,
          userId,
          username: nickName
        },
        success: (res) => {
          console.log(res);
          if (res.data.code == 1) {
            common_vendor.index.showToast({
              title: "发布成功",
              icon: "success"
            });
            this.isShow = false;
            this.content = "";
            this.page = 1;
            const query = {
              page: this.page,
              pageSize: 10
            };
            api_talk.getPost(query).then((res2) => {
              console.log(res2);
              if (res2.data.code == 1) {
                this.postList = res2.data.data.records;
                console.log(this.postList);
                this.postList.forEach((item, index) => {
                  console.log(item);
                  item.btnName = "查看评论";
                  item.likeStatus = "../../static/like.png";
                  item.commentPage = 1;
                });
              }
            });
          }
        }
      });
    },
    submitComment() {
      const userId = common_vendor.index.getStorageSync("userId");
      ({
        content: this.comment,
        userId,
        questionId: this.currentPostId
      });
      if (this.comment != "") {
        common_vendor.index.request({
          url: config.config.url + "/comment/postComment",
          method: "POST",
          header: {
            "content-type": "application/x-www-form-urlencoded",
            "Cookie": common_vendor.index.getStorageSync("cookie")
          },
          data: {
            content: this.comment,
            userId,
            questionId: this.currentPostId
          },
          success: (res) => {
            console.log(res);
            if (res.data.code == 1) {
              this.isCommentViewShow = false;
              this.comment = "";
              common_vendor.index.showToast({
                title: "评论成功",
                icon: "success"
              });
            }
          }
        });
      }
    }
  },
  onPullDownRefresh() {
    this.page = 1;
    const query = {
      page: this.page,
      pageSize: 10
    };
    api_talk.getPost(query).then((res) => {
      console.log(res);
      if (res.data.code == 1) {
        this.postList = res.data.data.records;
        console.log(this.postList);
        this.postList.forEach((item, index) => {
          console.log(item);
          item.btnName = "查看评论";
          item.likeStatus = "../../static/like.png";
          item.commentPage = 1;
        });
        common_vendor.index.stopPullDownRefresh();
      }
    });
  },
  onReachBottom() {
    this.page++;
    const query = {
      page: this.page,
      pageSize: 10
    };
    api_talk.getPost(query).then((res) => {
      console.log(res);
      if (res.data.code == 1) {
        let newPostList = res.data.data.records;
        if (newPostList.length != 0) {
          newPostList.forEach((item, index) => {
            item.btnName = "查看评论";
            item.likeStatus = "../../static/like.png";
            item.commentPage = 1;
          });
          this.postList.push(...newPostList);
        }
      } else {
        console.log("没有更多了");
        common_vendor.index.showToast({
          title: "没有更多了",
          icon: "none"
        });
        this.page--;
      }
    });
  },
  onLoad(option) {
    this.isShow = false;
    const query = {
      page: this.page,
      pageSize: 10
    };
    api_talk.getPost(query).then((res) => {
      console.log(res);
      if (res.data.code == 1) {
        this.postList = res.data.data.records;
        console.log(this.postList);
        this.postList.forEach((item, index) => {
          console.log(item);
          item.btnName = "查看评论";
          item.likeStatus = "../../static/like.png";
          item.commentPage = 1;
        });
      }
    });
  }
  // 	uni.request({
  // 		url:'http://8.130.109.84:8080/question/list?page='+this.page+'&pageSize=10',
  // 		method:'GET',
  // 		header: {
  // 			'Cookie':uni.getStorageSync('cookie')
  // 		},
  // 		success:(res)=>{
  // 			console.log(res);
  // 			if (res.data.code==1){
  // 				this.postList=res.data.data.records;
  // 				console.log(this.postList)
  // 				this.postList.forEach((item,index)=>{
  // 					console.log(item);
  // 					item.btnName='查看评论';
  // 					item.likeStatus='../../static/like.png';
  // 					item.commentPage=1;
  // 				})
  // 			}
  // 		}
  // 	})
  // }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.postList, (item, index, i0) => {
      return common_vendor.e({
        a: ["http://8.130.109.84:8080/images/nick/" + item.userPic],
        b: common_vendor.t(item.userName),
        c: common_vendor.t(item.time),
        d: common_vendor.o(($event) => $options.deletePost(index)),
        e: common_vendor.t(item.content),
        f: common_vendor.t(item.click),
        g: item.likeStatus,
        h: item.likes != 0
      }, item.likes != 0 ? {
        i: common_vendor.t(item.likes)
      } : {}, {
        j: common_vendor.o(($event) => $options.likePost(index)),
        k: common_vendor.o(($event) => {
          $data.comment = "";
          $data.isCommentViewShow = !$data.isCommentViewShow;
          $data.currentPostId = $data.postList[index].id;
        }),
        l: common_vendor.o(($event) => $options.clickPost(index)),
        m: item.count > 0
      }, item.count > 0 ? {
        n: common_vendor.t(item.btnName),
        o: common_vendor.t(item.count),
        p: common_vendor.o(($event) => $options.showComment(index))
      } : {}, {
        q: item.btnName == "收起评论"
      }, item.btnName == "收起评论" ? common_vendor.e({
        r: common_vendor.f(item.comment, (item2, index2, i1) => {
          return common_vendor.e({
            a: ["http://8.130.109.84:8080/images/nick/" + item2.userPic],
            b: common_vendor.t(item2.username),
            c: common_vendor.t(item2.time),
            d: common_vendor.t(item2.content),
            e: item2.likes != 0
          }, item2.likes != 0 ? {
            f: common_vendor.t(item2.likes)
          } : {}, {
            g: common_vendor.o(($event) => $options.likeComment(index, index2)),
            h: common_vendor.o(($event) => $options.deleteComment(index, index2))
          });
        }),
        s: item.count > item.commentPage * 10
      }, item.count > item.commentPage * 10 ? {
        t: common_vendor.o(($event) => $options.showMoreComment(index))
      } : {}) : {});
    }),
    b: common_vendor.o(($event) => this.isShow = true),
    c: $data.isShow
  }, $data.isShow ? {
    d: common_vendor.o(($event) => this.isShow = false),
    e: $data.content,
    f: common_vendor.o(($event) => $data.content = $event.detail.value),
    g: common_vendor.o((...args) => $options.submitPost && $options.submitPost(...args))
  } : {}, {
    h: $data.isCommentViewShow
  }, $data.isCommentViewShow ? {
    i: $data.comment,
    j: common_vendor.o(($event) => $data.comment = $event.detail.value),
    k: $data.comment == "" ? "default" : "primary",
    l: common_vendor.o((...args) => $options.submitComment && $options.submitComment(...args)),
    m: common_vendor.o(() => {
    })
  } : {}, {
    n: common_vendor.o(($event) => $data.isCommentViewShow = false)
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/hxy123/Documents/HBuilderProjects/医智搜系统/pages/talking-area/talking-area.vue"]]);
wx.createPage(MiniProgramPage);
