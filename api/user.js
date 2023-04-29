import request from '@/util/request.js';

function login(query){
	return request({
		method:'get',
		url:'/user/login',
		data:query
	})
}

function register(data){
	return request({
		method:'post',
		url:'/user/register',
		data:data
	})
}

function verifyUsername(query){
	return request({
		method:'get',
		url:'/user/register/verifyUsername',
		data:query
	})
}

function changePwd(data){
	return request({
		method:'post',
		url:'/user/modify',
		data:data
	})
}

function logout(){
	return request({
		method:'get',
		url:'/user/logout',
	})
}

function setNick(data){
	return request({
		method:'post',
		url:'/user/setNick',
		data:data
	})
}

export {login,register};