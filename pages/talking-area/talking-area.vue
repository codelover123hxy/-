<template>
	<view class="content" @click="isCommentViewShow=false">
		<view class="" style="height: fit-content;">
			<template v-for="(item,index) in postList" >
				<view class="wrap" style="gap:20rpx" @click="clickPost(index)">
					<view class="" style="flex:0;padding-left: 10rpx;">
						<view class="profile" >
							<image :src="['http://8.130.109.84:8080/images/nick/' + item.userPic]"  style="margin:0;height:80rpx;width:80rpx;border-radius: 40rpx;"></image>
						</view>
					</view>
					<view class="left" style="flex:auto;padding-right: 10rpx;">
						<view class="header" style="display: flex;justify-content:space-between">
							<view class="">
								<view class="username" style="display: inline;">
									{{item.userName}}
								</view>
								<view class="creat-time"  style="display: inline;margin-left: 15rpx;">
									{{item.time}}				
								</view>	
							</view>
							<view class="delete-post" @click="deletePost(index)" >
								<image src="../../static/delete.png" mode="heightFix" style="height: 50rpx;"></image>
							</view>
						</view>
						<view class="body" style="width:80%">
							<view class="post-content">
								{{item.content}}
							</view>
						</view>
						<view class="footer" style="display: flex;justify-content: space-between;">
							<view class="clickNum">
								点击数:{{item.click}}
							</view>	
							<view class="" style="display: flex;justify-content: space-between;width:230rpx">
								<view class="like"  @click="likePost(index)">
									<image :src="item.likeStatus" mode="heightFix" style="height: 50rpx;"></image>
									<span v-if="item.likes!=0">{{item.likes}}</span>
								</view>
								<view class="comment-btn"  @click.stop="comment='';isCommentViewShow=!isCommentViewShow;currentPostId=postList[index].id">
									<image src="../../static/comment.png" mode="heightFix" style="height:50rpx"></image>
								</view>		
							</view>																		
						</view>
					</view>					
				</view>
				<view class="show-comment" @click="showComment(index)" v-if="item.count>0">
					{{item.btnName}} (共{{item.count}}条)
				</view>
				<view class="" v-if="item.btnName=='收起评论'">			
					<template v-for="(item,index2) in item.comment">
						<view class="comment-view" style="padding:15rpx 15rpx;display: flex;gap:20rpx">
							<view class="comment-profile">
								<image :src="['http://8.130.109.84:8080/images/nick/' + item.userPic]"  style="height:50rpx;width:50rpx;border-radius: 25rpx;"></image>
							</view>							
							<view class="">
								<view class="">
									<view class="comment-username" style="display: inline">
										{{item.username}}
									</view>
									<view class="comment-time" style="display: inline;margin:0 15rpx">
										{{item.time}}
									</view>
								</view>								
								<view class="comment-content">
									{{item.content}}
								</view>
								<view class="" style="display: flex;justify-content: flex-end;">
									<view class="comment-like" @click="likeComment(index,index2)">
										<span v-if="item.likes!=0">{{item.likes}}</span>
										<image src="../../static/like.png" mode="heightFix" style="height:30rpx;margin:0 20rpx"></image>
									</view>
									<view class="delete-comment" @click="deleteComment(index,index2)">
										<image src="../../static/delete.png" mode="heightFix" style="height:30rpx"></image>
									</view>
								</view>								
							</view>							
						</view>
					</template>
					<view v-if="item.count>item.commentPage*10" class="comment-more" @click="showMoreComment(index)">
						查看更多评论
					</view>
				</view>
			</template>
		</view>
		<view class="add-btn" @click="this.isShow=true">
			+
		</view>
		<view class="mask" v-if="isShow">
			<view class="" style="position: absolute;right:20rpx;top:0rpx">
				<image @click="this.isShow=false" src="../../static/close.png" mode="heightFix" style="height:25rpx;"></image>
			</view>
			<text style="font-weight: 700;margin-left:50rpx;">欢迎您发布相关讨论</text>
			<view class="mask-content">
				<textarea v-model="content"  placeholder="在此处输入正文" />
			</view>
			<view class="warning">
				请务必遵守规范，切勿发布违规信息。
			</view>
			<view class="submit-btn" @click="submitPost">
				发布
			</view>
		</view>
		<view v-if="isCommentViewShow" @click.stop  class="comment">
			<input type="text" focus="auto" v-model="comment">
			<button v-bind:type="comment==''?'default':'primary'" style="width:120rpx;height:50rpx;font-size: xx-small;line-height: 50rpx;
			" @click="submitComment">发送</button>
		</view>
	</view>
</template>

<script>	
	import config from '../../config.js'
	import {likePost,likeComment,deletePost,deleteComment,addPost,addComment,click, getPost} from '../../api/talk.js'
	export default {

		data() {
			return {
				postList:'',
				isShow:'',
				isCommentViewShow:'',
				content:'',
				comment:'',
				currentPostId:'',
				page:1,
				commentPage:1
			}
		},		
		
		methods: {
			clickPost(index){
				const id=this.postList[index].id;
				uni.request({
					url:config.url+'/question/click',
					header: {
					    'content-type': 'application/x-www-form-urlencoded',
						'Cookie':uni.getStorageSync('cookie')
					},
					method:'POST',
					data:{
						questionId:id
					},
					success:(res)=>{
						console.log(res);
						if (res.data.code==1)
							this.postList[index].click++;
					}
				})
			},
			likePost(index){				
				const id=this.postList[index].id;
				uni.request({
					url:config.url+'/question/approve',
					header: {
					    'content-type': 'application/x-www-form-urlencoded',
						'Cookie':uni.getStorageSync('cookie')
					},
					method:'POST',
					data:{
						questionId:id
					},
					success:(res)=>{
						console.log(res);
						if (res.data.code==1)
							this.postList[index].likes++;
					}
				})
			},
			deletePost(index){
				const postId=this.postList[index].id;	
				const userId=uni.getStorageSync('userId');
				uni.showModal({
					title:'提示',
					content:'确认删除',
					cancelText:'取消',
					confirmText:'确认',
					showCancel:true,
					success:(res)=>{
						if (res.confirm){
							uni.request({
								url:config.url+'/question/deleteQuestion?questionId=' + postId+'&userId='+userId,
								method:'DELETE',
								header:{
									'Cookie':uni.getStorageSync('cookie')
								},
								success:(res)=>{
									console.log(res);
									if(res.data.code==1){
										uni.showToast({
										title:'删除成功',
										icon:'success'
									})
										this.postList.splice(index,1);
									}
									else if(res.data.code==0){
										uni.showToast({
											title:'删除失败',
											icon:'error'
										})
									}
								}
							})
						}
					}
				})		
			},
			likeComment(index,index2){
				const commentId=this.postList[index].comment[index2].id;
				uni.request({
					url:config.url+'/comment/approve',
					method:'POST',
					header: {
					    'content-type': 'application/x-www-form-urlencoded',
						'Cookie':uni.getStorageSync('cookie')
					},
					data:{
						commentId:commentId
					},
					success:(res)=>{
						console.log(res);
						if (res.data.code==1)
							this.postList[index].comment[index2].likes++;
					}
				})				
			},
			deleteComment(index,index2){
				const commentId=this.postList[index].comment[index2].id;
				const userId=uni.getStorageSync('userId');
				uni.showModal({
					title:'提示',
					content:'确认删除',
					cancelText:'取消',
					confirmText:'确认',
					showCancel:true,
					success:(res)=>{
						if (res.confirm){
							uni.request({
								url:config.url+'/comment/delete?commentId=' + commentId +'&userId=' +userId,
								method:'DELETE',
								header:{
									'Cookie':uni.getStorageSync('cookie')
								},
								success:(res)=>{
									if (res.data.code==1){
										uni.showToast({
											title:'删除成功',
											icon:'success'
										})
										this.postList[index].comment.splice(index2,1);
									}
									else if(res.data.code==0){
										uni.showToast({
											title:'删除失败',
											icon:'error'
										})
									}
								}
							})
						}
					}
				})				
			},
			showComment(index){
				this.clickPost(index);
				const id=this.postList[index].id;
				this.currentPostId=id;
				const commentPage=this.postList[index].commentPage;
				if (this.postList[index].btnName=='查看评论'){
					uni.request({
						url:config.url + '/comment/list?questionId='+id+'&page='+commentPage+'&pageSize=10',
						method:'GET',
						header:{
							'Cookie':uni.getStorageSync('cookie')
						},
						success:(res)=>{
							console.log(res);
							if (res.data.code==1){
								if (res.data.data.records.length!=0){
									this.postList[index].comment=res.data.data.records;
									this.postList[index].btnName='收起评论';
								}
								else{
									uni.showToast({
										title:'该帖子无评论',
										icon:'none'
									})
								}
							}							
						}
					})
					uni.request({
						url:config.url+'/comment/total?questionId='+id,
						method:'GET',
						header:{
							'Cookie':uni.getStorageSync('cookie')
						},
						success:(res)=>{
							console.log(res);
							if (res.data.code==1){
								let totalComment=res.data.data;
								this.postList[index].count=totalComment;
							}
						}
					})
				}
				else if (this.postList[index].btnName=='收起评论'){
					this.postList[index].btnName='查看评论';
					this.postList[index].commentPage=1;
				}
			},
			showMoreComment(index){
				this.postList[index].commentPage++;
				const id=this.postList[index].id;
				const commentPage=this.postList[index].commentPage;
				uni.request({
					url:config.url + '/comment/list?questionId='+id+'&page='+commentPage+'&pageSize=10',
					method:'GET',
					header:{
						'Cookie':uni.getStorageSync('cookie')
					},
					success:(res)=>{
						console.log(res);
						if (res.data.code==1){
							if (res.data.data.records.length!=0)
								this.postList[index].comment.push(...res.data.data.records);
							else {
								uni.showToast({
									title:'无更多评论',
									icon:'none'
								})
								this.postList[index].commentPage--;	
							}
						}							
					}
				})
			},
			submitPost(){
				const userId=uni.getStorageSync('userId');
				const nickName=uni.getStorageSync('nickName');
				// let that=this;
				const data={
					content:this.content,
					userId:userId,
					username:nickName
				}
				// addPost(data).then(res=>{
				// 	if(res.data.code==1){
				// 		uni.showToast({
				// 			title:'发布成功',
				// 			icon:'success'
				// 		})
				// 		this.isShow=false;
				// 		this.content='';
				// 		that.onLoad();
				// 	}
				// })
				uni.request({
					url:config.url+'/question/postQuestion',
					method:'POST',
					header: {
					    'content-type': 'application/x-www-form-urlencoded',
						'Cookie':uni.getStorageSync('cookie')
					},
					data:{
						content:this.content,
						userId:userId,
						username:nickName
					},
					success:(res)=>{
						console.log(res);
						if(res.data.code==1){
							uni.showToast({
								title:'发布成功',
								icon:'success'
							})
							this.isShow=false;
							this.content='';
							this.page=1;
							const query={
								page:this.page,
								pageSize:10
							}
							getPost(query).then(res=>{
								console.log(res)
								if (res.data.code==1){
									this.postList=res.data.data.records;
									console.log(this.postList)
									this.postList.forEach((item,index)=>{
										console.log(item);
										item.btnName='查看评论';
										item.likeStatus='../../static/like.png';
										item.commentPage=1;
									})
								}
							})
						}
					}
				})
			},

			submitComment(){
				const userId=uni.getStorageSync('userId');
				const data={
					content:this.comment,
					userId:userId,
					questionId:this.currentPostId
				}
				// FormData formData=new FormData();
				// addComment(data).then(res=>{
				// 	if (res.data.code==1){
				// 		this.isCommentViewShow=false;
				// 		this.comment='';
				// 	}	
				// })
				if (this.comment!=''){
					uni.request({
						url:config.url+'/comment/postComment',
						method:'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded',
							'Cookie':uni.getStorageSync('cookie')
						},
						data:{
							content:this.comment,
							userId:userId,
							questionId:this.currentPostId
						},
						success:(res)=>{
							console.log(res);
							if (res.data.code==1){
								this.isCommentViewShow=false;
								this.comment='';
								uni.showToast({
									title:'评论成功',
									icon:'success'
								})
							}						
						}
					})
				}
			}
		},
				
		onPullDownRefresh(){
			this.page=1;
			const query={
				page:this.page,
				pageSize:10
			}
			getPost(query).then(res=>{
				console.log(res)
				if (res.data.code==1){
					this.postList=res.data.data.records;
					console.log(this.postList)
					this.postList.forEach((item,index)=>{
						console.log(item);
						item.btnName='查看评论';
						item.likeStatus='../../static/like.png';
						item.commentPage=1;
					})
					uni.stopPullDownRefresh();
				}
			})
		},
		
		
		
		onReachBottom() {
			this.page++;
			const query={
				page:this.page,
				pageSize:10
			}
			getPost(query).then(res=>{
				console.log(res)
				if (res.data.code==1){
					let newPostList=res.data.data.records;
					if (newPostList.length!=0){
						newPostList.forEach((item,index)=>{
							item.btnName='查看评论';
							item.likeStatus='../../static/like.png';
							item.commentPage=1;
						})
						this.postList.push(...newPostList);
					}
				}
				else{
					console.log('没有更多了');
					uni.showToast({
						title:'没有更多了',
						icon:'none'
					})
					this.page--;
				}
			})
		},
		
	
		
		onLoad(option){
			this.isShow=false;
			const query={
				page:this.page,
				pageSize:10
			}
			getPost(query).then(res=>{
				console.log(res)
				if (res.data.code==1){
					this.postList=res.data.data.records;
					console.log(this.postList)
					this.postList.forEach((item,index)=>{
						console.log(item);
						item.btnName='查看评论';
						item.likeStatus='../../static/like.png';
						item.commentPage=1;
					})
				}
			})
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
	}
</script>

<style>
	.content{
		width: 100%;
	}
	
	.comment-more{
		text-align: center;
		font-size: small;
	}
	
	.mask{
		position: fixed;
		z-index: 3;
		width:100%;
		height: 100%;
		top:0;
		background-color:rgb(248, 248, 248);
	}
	
	.mask-content{
		position: absolute;
		top:200rpx;
		padding: 20rpx;
		background-color: white;
		left:50%;
		transform: translate(-50%);
	}
	
	.mask-content textarea{
		height:400rpx;
	}
	
	.comment{
		z-index:2;
		position: fixed;
		height:100rpx;
		bottom:300rpx;
		padding-left: 35rpx;
		box-sizing: border-box;
		display: flex;
		vertical-align: middle;
		align-items: center;
		background-color:rgb(245, 245, 245);
		width:100%;
	}
	
	.comment input{
		background-color: white;
		width:500rpx;
		/* position: absolute; */
		/* left:50%; */
		/* transform: translate(-60%); */
		/* top:30rpx; */
		height: 60rpx;
		/* padding:5rpx; */
		box-sizing: border-box;
	}
	
	.delete-post{
		right:50rpx;
		top:20rpx;
	}
	
	.delete-comment{
		right:90rpx;
		top:50rpx;
	}
	
	.warning{
		font-size: small;
		position:absolute;
		bottom:400rpx;
		width:500rpx;
		left:50%;
		transform: translate(-50%);
	}
	
	.submit-btn{
		position: absolute;
		bottom:200rpx;
		left:50%;
		transform: translate(-50%);
		text-align: center;
		color:white;
		font-weight: 600;
		line-height: 80rpx;
		width:700rpx;
		height:80rpx;
		background-color: aqua;
		border-radius: 40rpx;
	}
	
	.wrap{
		display: flex;
		padding:20rpx 0;
		box-sizing: border-box;
	}
	
	.wrap .creat-time{
		font-size: small;
		bottom:20rpx;
		color:grey;
	}
	
	.wrap .username{
		flex:auto;
		color:cornflowerblue;
	}
	
	.wrap .clickNum{
		bottom: 20rpx;
		left:300rpx;
		font-size: small;
		color:grey;
	}
	
	.wrap .post-content{
		overflow-wrap: anywhere;
	}
	
	.wrap .profile{
		flex:0;
		vertical-align: middle;
		border-radius: 40rpx;
		height:80rpx;
		width: 80rpx;
		border: solid 1rpx grey;
	}
	
	.wrap .like{
		right:150rpx;
		bottom:10rpx;
	}
	
	.wrap .comment-btn{
		width:100rpx;
		height:45rpx;
		border-radius: 30rpx;
		text-align: center;
	}
	.add-btn{
		position: fixed;
		font-size: xx-large;
		text-align: center;
		line-height: 75rpx;
		bottom: 40rpx;
		right: 40rpx;
		width:80rpx;
		height:80rpx;
		border-radius: 50rpx;
		border:1rpx solid;
		background-color: aqua;
		color:white;
	}
	
	.show-comment{
		text-align: center;
	}
	
	.comment-view{
		position: relative;
		background-color: rgb(245, 245, 245);
	}
	
	.comment-view .comment-time{
		font-size: small;
	}
	.comment-view .comment-profile{
		width:50rpx;
		height: 50rpx;
		border-radius: 25rpx;
		border:1rpx solid grey;
	}
	
	.comment-view .comment-content{
		overflow-wrap: anywhere;
		width:630rpx;
	}
	
	.comment-view .comment-like{
		right:20rpx;
		top:50rpx;
	}
</style>
