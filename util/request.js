const request = (config) => {
	// 处理 apiUrl
	config.url = 'http://8.130.109.84:8080' + config.url;
	if(!config.data){
		config.data = {};
	}
	console.log(JSON.stringify(config.data));
	let promise = new Promise(function(resolve, reject) {
		uni.request(config).then(responses => {
			// 异常
			if (responses[0]) {
				reject({message : "网络超时"});
			} else {
				resolve(responses);
			}
		}).catch(error => {
			reject(error);
		})
	})
	return promise;
};

export default request;
