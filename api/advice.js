import request from '@/util/request.js';

function getAdvice(query){
	return request({
		method:'get',
		url:'/advise/list',
		data:query
	})
}

function addAdvice(data){
	return request({
		method:'post',
		url:'/advise/post',
		data:data
	})
}