<template>
	<view class="content" @click="isIntroShow=false">
		<view class="uni-margin-wrap">
			<swiper class="swiper" indicator-dots indicator-active-color="#FFFFFF" 
			circular autoplay>
				<swiper-item style="height:300rpx;width:680rpx" v-for="item in rotation" :key="item.id">
					<image :src="item.url" style="height:320rpx;width:680rpx"></image>
				</swiper-item>
			</swiper>
		</view>
		<view  class="wrap" @click.stop v-if="isIntroShow" style="z-index: 10;">
			<view class="intro" style="z-index:10">
				医学名词介绍
			</view>
			<view style="font-weight: 700;margin-top: 20rpx;z-index: 10;">{{currentItem.name}}:</view>
			<scroll-view scroll-y="true" style="height:100rpx">{{currentItem.paraphrase}}</scroll-view>
		</view>
		<view class="switch-view">
			<view class="switch" :style="{fontWeight:fontWeight1}" @click.stop="getWords">
				词云展示
			</view>
			<view class="switch" :style="{fontWeight:fontWeight2}" @click="getHotArticles">
				热门文章
			</view>
			<view class="switch" :style="{fontWeight:fontWeight3}" @click="getLatestArticles">
				最新文章
			</view>
		</view>
		<scroll-view v-if="isArticlesShow" scroll-y="true" class="articles">
			<template v-for="(item,index) in articles">
				<view style="margin:20rpx auto">
					<view class="" style="font-weight: 700;">
						{{item.filename.length>18?item.filename.substring(0,18) + '……'
							:item.filename}}
					</view>
				</view>
				<view class="" style="text-align: center;margin-top:10rpx">
					点击数:{{item.click}}
					收藏数:{{item.favorite}}
					点赞数:{{item.likes}}
				</view>
				<view style="font-size: small;text-align: center;margin-top:10rpx">
					上传时间:{{item.updateTime}}
				</view>
				<view class="" style="margin:10rpx auto;text-align: center;background-color:rgb(141,191,156);width:140rpx;text-align: center;" @click="previewPdf(item.filename)">
					查看PDF
				</view>
			</template>
		</scroll-view>
		<view class="search" @click="search">
			<image src="../../static/search.png" mode="heightFix" style="height:70rpx"></image>
		</view>
		<view class="charts-box" @click.stop v-if="isWordsShow" style="z-index: 2;">
			<view class="" style="text-align: center;font-size: larger;font-weight: 700">
			词云展示
			</view>
			<qiun-data-charts 
			  type="word"
			  :opts="opts"
			  :chartData="chartData"
			  @getIndex="activeWord" 
			/>
		</view>
		<view class="mask" v-if="isShow" @click.stop>
			<view class="" style="font-weight: 700">
				获取您的昵称、头像
			</view>
			<view style="font-size: small;color:grey;padding:10rpx 50rpx;box-sizing:border-box;text-align: left;" class="">
				获取用户头像、昵称信息，主要用于完善个人资料，向用户提供更好使用体验
			</view>
		    <button class="avatar-wrapper"  open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
		        <image class="avatar" mode="heightFix" style="height:100rpx;border-radius: 50rpx;margin:0 auto" :src="avatarUrl"></image>
		    </button>
		    <input type="nickname" class="weui-input" placeholder="请输入昵称" v-model="nickName" @blur="onNickName" />
			<view class="save" @click="save">
				保存
			</view>
		</view>
	</view>
</template>

<script>
	import config from '../../config.js';
	export default {
		data() {
			return {
				isArticlesShow:false,
				isWordsShow:true,
				showBottom:true,
				isShow:true,
				isIntroShow:false,
				currentItem:'',
				avatarUrl: '',
			    nickName: '',
				btnName:'',
				fontWeight1:'',
				fontWeight2:'',
				fontWeight3:'',
				articles:'',
				userId:'',
				rotation:[
					{
						id:1,
						url:'../../static/logo-swiper.jpg',
					},
					{
						id:2,
						url:'../../static/ad.png'
					}
				],		
				chartData: {},
				//您可以通过修改 config-ucharts.js 文件中下标为 ['word'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
				opts: {
					color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
					padding: undefined,
					enableScroll: false,
					extra: {
						word: {
							type: "normal",
							autoColors: false
						}
					}
				}
			}
		},
		onLoad() {
			if (uni.getStorageSync('nickName')!=null){
				this.isShow=false;
			}
			else{
				this.isShow=true;
			}
			uni.request({
				url:config.url+'/searchNoun/list',
				method:'GET',
				success:(res)=>{
					console.log(res);
					let arr=[];
					let list=res.data.data;
					list.filter((item,index)=>{
						if (index<20){
							let obj={
								name:item.medicalWord,
								paraphrase:item.paraphrase,
								textSize:18,
								data:undefined
							}
							arr.push(obj);
						}
					})
					console.log(arr);
					this.chartData.series=arr;
				}
			})  
		},
		methods: {	
			previewPdf(name){
				uni.showLoading({
					title:'加载中'
				})
				uni.downloadFile({
					url:config.url + '/common/download?name='+name,
					success:(res)=>{
						console.log(res);
						if (res.statusCode === 200) {
							console.log('下载成功');
							uni.hideLoading();
						}
						uni.saveFile({
						    tempFilePath: res.tempFilePath,
						    success: function (save) {
						    // 自动打开手机预览文件页面
								uni.openDocument({
									filePath: save.savedFilePath,
									fileType: 'pdf',
									showMenu:'true',
									success: function (open) {
									// 打开文件成功
										console.log(open)
									}
								})
					        }
						})
					}
				})
			},
			onChooseAvatar(e) {
				this.uploadFilePromise(e.detail.avatarUrl);
	        },
	        onNickName(e) {
				console.log('昵称:',e.detail.value);
			},
	        uploadFilePromise(avatarUrl) {   
				this.avatarUrl=avatarUrl;
			},

			search(){
				uni.navigateTo({
					url:'../search/search'
				})
			},
			getWords(){
				this.fontWeight1=700;
				this.fontWeight2=400;
				this.fontWeight3=400;
				this.isArticlesShow=false;
				this.isWordsShow=true;
			},
			getHotArticles(){
				this.fontWeight1=400;
				this.fontWeight2=700;
				this.fontWeight3=400;
				this.isArticlesShow=true;
				this.isWordsShow=false;
				uni.request({
					url:config.url + '/article/hot',
					success:(res)=>{
						console.log(res.data.data.records);
						if (res.data.code==1)
							this.articles=res.data.data.records;
					}
				})
			},
			getLatestArticles(){
				this.fontWeight1=400;
				this.fontWeight2=400;
				this.fontWeight3=700;
				this.isArticlesShow=true;
				this.isWordsShow=false;
				uni.request({
					url:config.url + '/article/new',
					success:(res)=>{
						console.log(res.data.data.records);
						if (res.data.code==1)
							this.articles=res.data.data.records;
					}
				})
			},
			activeWord(e){
				if(e.currentIndex!=-1){
					let detail = this.chartData.series[e.currentIndex]
					console.log(detail)
					this.currentItem=detail;
					this.isIntroShow=true;
				}
			},
			save(){
				console.log('头像',this.avatarUrl,'昵称',this.nickName)
				uni.setStorageSync(
					'avatarUrl',
					this.avatarUrl,
				)
				uni.setStorageSync(
					'nickName',
					this.nickName
				)
				this.userId=uni.getStorageSync('userId');
				uni.request({
					url:config.url+'/user/setNick',
					method:'POST',
					header: {
					    'content-type': 'application/x-www-form-urlencoded',
						'cookie':uni.getStorageSync("cookie")
					},
					data:{
						nick:this.nickName
					},
					success:(res)=>{
						console.log(res);						
					}
				})
				uni.uploadFile({
					url:config.url + '/user/saveImage',
					filePath:this.avatarUrl,
					name:'images',
					header: {
					    'content-type': 'application/x-www-form-urlencoded',
						'cookie':uni.getStorageSync("cookie")
					},
					success:(res)=>{
						console.log(res)
					}
				})
				// uni.request({
				// 	url:config.url+'/user/saveInfo',
				// 	method:'POST',
				// 	header: {
				// 	    'content-type': 'application/x-www-form-urlencoded',
				// 		'cookie':wx.getStorageSync("cookie")
				// 	},
				// 	data:{
				// 		images:this.avatarUrl,
				// 		nick:this.nickName,
				// 		userId:this.userId
				// 	},
				// 	success:(res)=>{
				// 		console.log(res);						
				// 	}
				// })
				this.isShow=false;
			}
		}
	}
</script>

<style>
	.content {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.mask{
		position: fixed;
		bottom:0;
		padding-top: 100rpx;
		z-index:3;
		text-align: center;
		width:600rpx;
		height:400rpx;
		border-radius: 30rpx;
		width:100%;
		background-color: white;
	}
		
	.save{
		width:300rpx;
		height:60rpx;
		line-height: 60rpx;
		background-color: aqua;
		margin: 10rpx auto;
		border-radius:30rpx;
		color:white;
		font-weight: 700;
	}
	
	.weui-input{
		margin-top: 10rpx;
	}
	
	.switch-view{
		display: flex;
	}
	
	.articles{
		border-radius: 30rpx;
		border:1rpx solid;
		padding:20rpx;
		box-sizing: border-box;
		height:500rpx;
		width:700rpx;
		margin:0 auto;
	}
	
	.switch{
		width: 140rpx;
		height:60rpx;
		line-height: 60rpx;
		margin:60rpx auto;
	}
	
	.switch:nth-child(1){
		border-radius:35rpx 0 0 35rpx;
	}
	
	.switch:nth-child(2){
		border-radius: 0 35rpx 35rpx 0;
	}
	
	.avatar-wrapper{
		width:100rpx;
		height:100rpx;
		border-radius: 50rpx;
		padding: 0;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	
	.uni-margin-wrap {
		margin-top: 30rpx;
		width: 680rpx;
		height:320rpx;
		border-radius: 20rpx;
	}
	
	.swiper {
		height: 320rpx;
		border-radius: 20rpx;
	}
	
	.swiper-item {
		display: block;
		height: 320rpx;
		text-align: center;
		border-radius: 20rpx;
	}
	
	.search{
		position: absolute;
		right:50rpx;
		top:380rpx;
		width: 100rpx;
		height:100rpx;
		padding: 10rpx;
		box-sizing: border-box;
		border: 1rpx solid rgba(0,0,0,0.4);
		border-radius: 65rpx;
	}
	
	.wrap{
		z-index:5;
		position: fixed;
		top:200rpx;
		left:50%;
		transform:translate(-50%);
		border-radius: 20rpx;
		padding: 50rpx;
		box-sizing: border-box;
		border:1rpx solid;
		width:600rpx;
		height:300rpx;
		background-color: white;
	}
	  
	.intro{
		text-align: center;
		font-size: larger;
		color:royalblue;
		font-weight: 700;
	}
</style>