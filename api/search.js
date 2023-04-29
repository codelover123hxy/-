import request from '@/util/request.js';

function searchNoun(query){
	return request({
		method:'get',
		url:'/searchNoun/explanation',
		data:query
	})
}

function searchByContent(query){
	return request({
		method:'get',
		url:'/search/content',
		data:query
	})
}

function searchByTitle(query){
	return request({
		method:'get',
		url:'/search/title',
		data:query
	})
}
function searchByKeyword(query){
	return request({
		method:'get',
		url:'/search/keyword',
		data:query
	})
}

// function searchByImage(data){
// 	return request({
// 		method:'get',
// 		url:'/search/content',
// 		data:query
// 	})
// }

function getDetail(query){
	return request(({
		method:'get',
		url:'/dataPdf/detail',
		data:query
	}))
}

export default {searchNoun,searchByContent,searchByTitle,searchByKeyword,getDetail}
