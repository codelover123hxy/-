import request from '@/util/request.js';

function getPost(query){
	return request({
		method:'get',
		url:'/question/list',
		data:query
	})
}

function getComment(query){
	return request({
		method:'get',
		url:'/comment/list',
		data:query
	})
}

function likePost(data){
	return request({
		method:"post",
		url:'/question/approve',
		data:data
	})
}

function likeComment(data){
	return request({
		method:"post",
		url:'/comment/approve',
		data:data
	})
}

function addPost(data){
	return request({
		method:'post',
		url:'/question/postQuestion',
		data:data
	})
}

function addComment(data){
	return request({
		method:'post',
		url:'/comment/postComment',
		data:data
	})
}

function deletePost(query){
	return request({
		method:'delete',
		url:'/question/deleteQuestion',
		data:query
	})
}

function deleteComment(query){
	return request({
		method:'delete',
		url:'/comment/delete',
		data:query
	})
}

function click(data){
	return request({
		method:'post',
		url:'/question/click',
		data:data
	})
}

export {getPost,getComment,addPost,addComment,deletePost,deleteComment,likePost,likeComment,click}
