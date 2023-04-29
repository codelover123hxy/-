import request from '@/util/request.js';

function getNouns(){
	return request({
		method:'get',
		url:'/searchNoun/list',
	})
}

function getHotArticles(){
	return request({
		method:'get',
		url:'/article/hot'
	})
}

function getNewArticles(){
	return request({
		method:'get',
		url:'/article/new'
	})
}

function getHotWords(){
	return request({
		method:'get',
		url:'/searchWord/hot'
	})
}

function likeArticle(data){
	return request({
		method:'post',
		url:'/article/approve',
		data:data
	})
}

function favorArticle(data){
	return request({
		method:'post',
		url:'/article/star',
		data:data
	})
}

function clickArticle(query){
	return request({
		method:'post',
		url:'/article/click',
		data:query
	})
})

function getFavorites(query){
	return request({
		method:'get',
		url:'/star/list',
		data:query
	})
}

function getLikes(query){
	return request({
		method:'get',
		url:'/like/list',
		data:query
	})
}

function getOwnArticles(query){
	return request({
		method:'get',
		url:'/article/getOwnFile',
		data:query
	})
}

export default{getNouns,getFavorites,getHotArticles,getHotWords,getOwnArticles,
getNewArticles,getLikes,likeArticle,clickArticle,favorArticle}