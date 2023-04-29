<template>
	<view class="content" @click="isShow=false">
		<scroll-view class="suggestions" scroll-y="true">
			<template class="" v-for="(item,index) in suggestions">
				<view class="" style="margin: 40rpx auto;border-bottom: 1rpx solid rgba(0,0,0,0.2);">
				    <view class="">
				    	<text style="font-weight: bold;">建议:</text>{{item.content}}
				    </view>	
					<view class="" style="margin:15rpx auto">
						<text style="font-weight: bold;">答复:</text>{{item.reply!=''?item.reply:'未处理'}}
					</view>					
				</view>
			</template>
		</scroll-view>
		<view class="submit-btn" @click.stop="isShow=true">
		 	写建议
		</view>
		<view v-if="isShow" class="submit-suggestion" @click.stop>
			<view class="" style="margin: 30rpx;">
				产品建议
			</view>
			<textarea placeholder="请描述问题和建议" v-model="suggestion" name="" id="" cols="30" rows="20" maxlength="200"
			 style="width:500rpx;height:300rpx;margin:0 auto;padding:30rpx;border: solid 1rpx rgba(0,0,0,0.2);border-radius: 30rpx;"></textarea>
			<view class="" style="margin-left: 550rpx;color:grey">
			 	0/{{suggestion.length}}
			</view>	
			<view class="submit-btn" style="background-color: rgb(0, 223, 100);" @click="submitSuggestion">
			 	提交建议
			</view>		
		</view>
	</view>
</template>

<script>
	import config from '../../config.js'
	export default {
		data() {
			return {
				suggestion:'',
				suggestions:'',
				isShow:'',
				query:{
					page:1,
					pageSize:10
				}
			}
		},
		methods: {
			submitSuggestion(){
				const userId=uni.getStorageSync('userId');
				uni.request({
					url:config.url+'/advise/post',
					method:'POST',
					data:{
						userId:userId,
						content:this.suggestion
					},
					success:(res)=>{
						console.log(res);
						if (res.data.code==1){
							uni.showToast({
								title:'发送成功',
								icon:'success'
							})
						}
					}
				})
			}
		},
			
		onLoad(option){
			uni.request({
				url:config.url+'/advise/list?page='+this.query.page+'&pageSize='+this.query.pageSize,
				method:'GET',
				success:(res)=>{
					console.log(res);
					if (res.data.code==1)
						this.suggestions=res.data.data.records;
				}
			})
		},
		
		
	}
</script>

<style>
	.submit-btn{
		background-color:rgb(29, 169, 255);
		width: 500rpx;
		color:white;
		font-weight: 700;
		position: absolute;
		bottom:100rpx;
		left:50%;
		transform: translate(-50%);
		height:80rpx;
		border-radius: 40rpx;
		text-align: center;
		line-height: 80rpx;
	}
	
	.suggestions{
		margin:50rpx auto;
		width:600rpx;
		height: 900rpx;
		border-radius: 30rpx;
		border:1rpx solid grey;
		padding: 40rpx;
		box-sizing: border-box;
	}
	
	.submit-suggestion{
		position: fixed;
		top:200rpx;
		z-index: 10;
		width: 90%;
		left:50%;
		transform: translate(-50%);
		border: 1rpx solid grey;
		border-radius: 30rpx;
		height: 60%;
		background-color: white;
	}
</style>
