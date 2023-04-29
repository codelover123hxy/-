<template>
	<view class="content">
		<view class="header">
			<view class="left" @click="multiSearch">复合检索</view>
			<view class="right" @click="searchByImage" >图片检索</view>
		</view>
		
		<view class="" v-if="searchMethods==1">
			<view class="header">
					点击上传需要检索的图片
				</view>
				<view class="" style="margin: 0 auto;width: fit-content;">
					<van-uploader capture="camera" v-model="fileList" accept="image/*"  preview-image="true" type="primary" upload-icon="plus" upload-text="图片搜索"
					     use-before-read @before-read="beforeRead" @after-read="afterRead" :show-upload="true">
					</van-uploader>
				</view>		
				<view class=""  v-if="searchMethods==1" >
					<view class="" style="font-weight: 700;">
					检索结果
					</view>
					<template v-for="(item,index) in results">
						<view style="width:700rpx;margin: 0 auto;">{{item.filename}}</view>
						<text style="margin-left: 25rpx;">图片详情:</text>
						<view class="" style="margin:0 auto;width: fit-content;">
							<image :src="['http://8.130.109.84:8080/images/pdfImg/'+item.picName]" @click="previewImg(item.picName,index)" mode="widthFix"
							style="width: 600rpx;"></image>				
						</view>
					</template>
				</view>
				
			</view>
		</view>
		
		<view class=""  v-if="searchMethods==0" style="margin:0 auto;width:fit-content">
			<view class="" style="display: flex;">内容<input style="margin-left: 20rpx;" v-model="content" type="text" placeholder="请输入检索关键词"></view>
			<view class="" style="display: flex;">标题<input style="margin-left: 20rpx;" v-model="title" type="text" placeholder="请输入检索关键词"></view>
			<view class="" style="display: flex;">作者<input style="margin-left: 20rpx;" v-model="author" type="text" placeholder="请输入检索关键词"></view>
			<view class="" style="display: flex;">关键词<input style="margin-left: 20rpx;" v-model="keyword" type="text" placeholder="请输入检索关键词"></view>
			<view class="left" style="margin: 0 auto;" @click="handleSearch">复合检索</view>
			<view class=""  v-if="searchMethods==0">			
				<template v-for="(item,index) in results">
					<view class=" "   @click="click(item)">
						<view style="width:700rpx;margin:30rpx auto;width:fit-content;font-weight: bold;color: #85a97b;">{{item.filename.length>18?item.filename.substring(0,18)+'…':item.filename}}</view>
						<view class="" style="display: flex;justify-content: space-evenly;font-size: small;">
							<view class="icon" @click="like(item)"><image src="../../static/like.png" style="height: 40rpx;" mode="heightFix"></image>点赞:{{item.likeCount}}</view>
							<view class="icon"><image src="../../static/click.png" style="height: 40rpx;" mode="heightFix"></image>点击:{{item.clickCount}}</view>
							<view class="icon" @click="favor(item)"><image src="../../static/favorite.png" style="height: 40rpx;" mode="heightFix"></image>收藏:{{item.favoriteCount}}</view>
						</view>	
						<view class="" style="display: flex;margin: 10rpx auto;width: fit-content;">
							<text style="width:140rpx;text-align: center;background-color:rgb(140,191,156);color:white" @click="download(item.filename)">立即下载</text>
							<text style="width:140rpx;text-align: center;background-color:rgb(140,191,156);color:white;margin-left: 20rpx;" @click="preview(item.filename)">查看PDF</text>
						</view>
						<view style="font-size: small;width:650rpx;margin:0 auto">
							{{item.abs.length>300?item.abs.substring(0,300):item.abs}}
						</view>		
					</view>
				</template>
			</view>
		</view>
		
		
</template>

<script>
	import config from '../../config.js'
	export default {
		data() {
			return {
				searchMethods:'',
				results:[],
				content:'',
				title:'',
				author:'',
				keyword:''
			}
		},
		onLoad(option){
		
		},
		methods: {
			handleSearch(){
				uni.request({
					url:config.url + '/search/comSearch?title='+this.title+'&content='+this.content+'&author='+this.author
					+'&keyword='+this.keyword+'&page=1&pageSize=100',
					method:'GET',
					success:(res)=>{
						console.log(res);
						if (res.data.code==1)
						    this.results=res.data.data.records;
						else{
							uni.showToast({
								title:res.data.msg,
								icon:'error'
								
							})
						}
					}
				})
			},
			multiSearch(){
				this.searchMethods=0;
				this.results=[];
			},
			searchByImage(){
				this.searchMethods=1;
				this.results=[];
			},
			previewImg(imageUrl,index){
				console.log(imageUrl);
				let imgs=[];
				this.results.forEach((item,index)=>{
					imgs.push('http://8.130.109.84:8080/images/pdfImg/' + item.picName);
				})
				uni.previewImage({
					urls:imgs,
					current:index  //点击图片传过来的下标
				})
			},
			beforeRead(e){
				const { file, callback } = e.detail;
				console.log(file.url);
				uni.showLoading({
					title:'图片正在上传'
				})
				const userId=uni.getStorageSync('userId')				
				uni.uploadFile({
					url:config.url+'/search/imageSearch',
					filePath:file.url,
					name:'file',
					header:{
						'Cookie':uni.getStorageSync('cookie')
					},
					success:(res)=>{
						console.log(JSON.parse(res.data))
						uni.hideLoading();
						if (JSON.parse(res.data).code==1){							
							this.results=JSON.parse(res.data).data
						}
					}
				})
				
			},
			afterRead(e){
				console.log(e)
			},
			preview(name){
				console.log(name)
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
			download(name){
				console.log(name)
				uni.showLoading({
					title:'正在下载'
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
								uni.showToast({
									title:'下载成功',
									icon:'success'
								})
					        }
						})
					}
				})
			},
			like(item){
				const filename=item.filename;
				const userId=uni.getStorageSync('userId');
				uni.request({
					url:config.url + '/article/approve',
					method:'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded' 
					},
					data:{
						filename:filename,
						userId:userId
					},
					success:(res)=>{
						console.log(res);
						if (res.data.code==1){
							if (res.data.data=='喜欢成功'){
								item.likeCount++;
							}
							else if(res.data.data=='取消喜欢'){
								item.likeCount--;
							}
						}
					}
				})
			},	
			click(item){
				const filename=item.filename;
				const keyword=this.content;
				uni.request({
					url:config.url + '/article/click?filename='+filename+'&keyword'+keyword,
					method:'POST',
					success:(res)=>{
						console.log(res);
						if (res.data.code==1){
							item.clickCount++;
						}
					}
				})
			},
			favor(item){
				const filename=item.filename;
				const userId=uni.getStorageSync('userId');
				uni.request({
					url:config.url + '/article/star',
					method:'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded' 
					},
					data:{
						filename:filename,
						userId:userId
					},
					success:(res)=>{
						console.log(res);
						if (res.data.code==1){						
							if (res.data.code==1){
								if (res.data.data=='收藏成功'){
									uni.showToast({
										title:res.data.data,
										icon:'success'
									})
									item.favoriteCount++;
								}
								else if(res.data.data=='取消收藏'){
									item.favoriteCount--;
									uni.showToast({
										title:res.data.data,
										icon:'success'
									})
								}
							}
						}
					}
				})
			},
		}
	}
</script>

<style>
	.content{
		padding: 20rpx;
	}
	
	.results{
		margin-top: 50rpx;
		height:900rpx;
	}
	.upload-btn{
		width:200rpx;
		height:70rpx;
		background-color: aliceblue;
		margin: 50rpx auto;
		text-align: center;
		line-height: 70rpx;
	}
	
	.list{
		padding: 30rpx;
		box-sizing: border-box;
		width:650rpx;
		height:700rpx;
		border: solid 1rpx;
		border-radius: 20rpx;
		margin: 100rpx auto;
	}
	
	.left,.right{
		text-align: center;
		line-height: 50rpx;
		width:150rpx;
		height:50rpx;
		background-color: #85a97b;
		margin:10rpx;
	}
	
	.header{
		display: flex;
		margin:20rpx auto;
		width: fit-content;
	}
</style>
