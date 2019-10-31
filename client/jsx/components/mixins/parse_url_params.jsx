

module.exports = {

	getParams: function() {

		let queryStr = location.search.substring(1);
                let paramDict = {};
                if (queryStr) {
                   let params = queryStr.split('&');
                   for (let i = 0; i < params.length; i++) {
                       let pair = params[i].split('=');
		       let key = pair[0];
		       let value = pair[1].replace(/\+/g, ' ');
		       if (paramDict[key]) {
		       	    paramDict[key] = paramDict[key] + ' ' + value;
		       }
		       else {
                       	    paramDict[key] = value;
		       }
                   }
                }
                return paramDict;
		
	}
};
