<template>
	<view class="content">
		<view class="switch-view">
			<view class="switch" :style="{fontWeight:fontWeight1}" @click="getFavors">
				收藏
			</view>
			<view class="switch" :style="{fontWeight:fontWeight2}" @click="getLikes">
				喜欢
			</view>
		</view>
		<view class="favors">
			<text v-if="favorites.length==0">我的{{fontWeight1==700?'收藏':'喜欢'}}为空</text>
			<template v-for="(item,index) in favorites">
				<view style="width:700rpx;margin:0 auto">
					<text>{{item.fileName.length>16?item.fileName.substring(0,16)+'…':item.fileName}}</text>
					<text style="color:red;position: absolute;right:60rpx;font-size: small;" @click="getDetail(index)">查看PDF</text>
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
				favorites:'',
				fontWeight1:'',
				fontWeight2:''
			}
		},
		methods: {
			getDetail(index){
				const name=this.favorites[index].fileName;
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
			getFavors(){
				const userId=uni.getStorageSync('userId');
				this.fontWeight1=700;
				this.fontWeight2=400;
				console.log(userId);
				uni.request({
					url:config.url + '/star/list?userId=' + userId + '&page=1&pageSize=10',
					method:'GET',
					success:(res)=>{
						console.log(res);
						if (res.data.code==1){
							this.favorites=res.data.data.records;
						}
						else if(res.data.code==0){
							this.favorites=[];
						}	
					}
				})
			},
			getLikes(){
				const userId=uni.getStorageSync('userId');
				this.fontWeight1=400;
				this.fontWeight2=700;
				console.log(userId);
				uni.request({
					url:config.url + '/like/list?userId=' + userId + '&page=1&pageSize=10',
					method:'GET',
					success:(res)=>{
						console.log(res);
						if (res.data.code==1){
							this.favorites=res.data.data.records;							
						}
						else if(res.data.code==0){
							this.favorites=[];
						}
					}
				})
			}
		},
		onLoad(option){
			this.getFavors();
		}
	}
</script>

<style>
	.switch-view{
		display: flex;
		margin:30rpx auto;
		width: fit-content;
	}
	
	.switch{
		margin:10rpx;
	}
	
	.favors{
		padding: 20rpx;
		box-sizing: border-box;
		height:900rpx;
		width:650rpx;
		margin:20rpx auto;
		border-radius: 20rpx;
		border:1rpx solid;
	}
</style>
