"use strict";const e=require("../../common/vendor.js"),s={data:()=>({}),methods:{chooseWeChatMessage(){e.index.chooseMessageFile({count:10,type:"type",success:s=>{const o=s.tempFiles;console.log(s.tempFiles),(s.type="file")&&e.index.openDocument({filePath:o[0].path,showMenu:!1,success:e=>{console.log("打开文档成功")}})}})}}};const o=e._export_sfc(s,[["render",function(s,o,t,c,n,a){return{a:e.o(((...e)=>a.chooseWeChatMessage&&a.chooseWeChatMessage(...e)))}}]]);wx.createPage(o);