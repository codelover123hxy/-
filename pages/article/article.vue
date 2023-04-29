<template>
	<view class="content">
		<view class="" style="margin: 20rpx auto;width: fit-content;">
			<van-uploader  v-model="fileList" accept="" type="primary" upload-icon="plus" upload-text="上传pdf"
			     use-before-read @before-read="beforeRead" @after-read="afterRead" :show-upload="true">
			</van-uploader>
		</view>
		<view class="" style="text-align: center;font-size: small;">
			目前只支持从聊天记录中上传
		</view>
		<scroll-view class="list">
			<text style="font-weight: bold;">已上传列表</text>
			<template v-for="(item,index) in articles"> 
				<view>
					<view class="">
						{{item.filename}}
					</view>
					<view class="" style="display: flex;justify-content: space-evenly;font-size: small;">
						<view class="icon"><image src="../../static/like.png" style="height: 40rpx;" mode="heightFix"></image>点赞:{{item.likes}}</view>
						<view class="icon"><image src="../../static/click.png" style="height: 40rpx;" mode="heightFix"></image>点击:{{item.click}}</view>
						<view class="icon"><image src="../../static/favorite.png" style="height: 40rpx;" mode="heightFix"></image>收藏:{{item.favorite}}</view>
					</view>	
					<view class="" style="margin:0 auto;text-align: center;background-color:rgb(141,191,156);width:140rpx;text-align: center;" @click="previewPdf(item.filename)">
						查看PDF
					</view>
				</view>
			</template>
		</scroll-view>
	</view>
</template>

<script>
	import config from '../../config.js'
	export default {
		data() {
			return {
				fileList:[],
				articles:[]
			}
		},
		onLoad(option){
			const userId=uni.getStorageSync('userId');
			console.log(userId);
			uni.request({
				url: config.url+'/article/getOwnFile?page=1&pageSize=20&userId='+userId,
				method:'GET',
				header:{
					'Cookie':uni.getStorageSync('cookie')
				},
				success:(res)=>{
					console.log(res)
					if (res.data.code==1){
						this.articles=res.data.data.records;
					}
					else if(res.data.code==0){
						uni.showToast({
							title:res.data.msg,
							icon:'error'
						})
					}
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
			beforeRead(e){
				const { file, callback } = e.detail;
				console.log(file.url);
				uni.showLoading({
					title:'正在上传'
				})
				const userId=uni.getStorageSync('userId')				
				uni.uploadFile({
					url:config.url+'/common/newUpload',
					filePath:file.url,
					name:'file',
					formData:{
						'userId':userId
					},
					header:{
						'Cookie':uni.getStorageSync('cookie')
					},
					success:(res)=>{
						console.log(res)						
						if (JSON.parse(res.data).code==1){
							uni.showToast({
								title:'上传成功',
								icon:'success'
							})
							uni.hideLoading();
							uni.request({
								url: config.url+'/article/getOwnFile?page=1&pageSize=20&userId='+userId,
								method:'GET',
								header:{
									'Cookie':uni.getStorageSync('cookie')
								},
								success:(res)=>{
									console.log(res)
									if (res.data.code==1){
										this.articles=res.data.data.records;
									}
									else if(res.data.code==0){
										uni.showToast({
											title:res.data.msg,
											icon:'error'
										})
									}
								}
							})
						}
					}
				})
				
			},
			afterRead(e){
				console.log(e)
			}
		}
	}
</script>

<style>
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
</style>