/**
 * This provides the principal function to make a call to the API. Basically
 * a fancy wrapper around XHR/JSONP/etc.
 */

goog.provide('api');
goog.require('utils');
goog.require('goog.json');
goog.require('storage'); // jshint unused:false

var _jsonp_callback_index = 0;

/**
 * @param {Object} obj
 * @param {string} prefix
 */
function serializeObject(obj, prefix) {
	var pairs = [];
	if (obj instanceof Array) {
		for (var i = 0; i < obj.length; i++) {
			pairs.push(encodeURIComponent(prefix) + '[]=' + encodeURIComponent(obj[i]));
		}
	}
	else {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				if (obj[prop] instanceof Array || typeof obj[prop] == 'object') {
					pairs.push(serializeObject(obj[prop], prefix ? prefix + '.' + prop : prop));
				}
				else {
					pairs.push(encodeURIComponent(prefix ? prefix + '.' + prop : prop) + '=' + encodeURIComponent(obj[prop]));
				}
			}
		}
	}
	return pairs.join('&');
}

/**
 * @param {utils.resource} resource
 * @param {Object.<string, *>} data
 */
function getUrl(resource, data) {
	var k;
	var url = resource.destination + resource.endpoint;
	if (resource.queryPart) {
		for (k in resource.queryPart) {
			if (resource.queryPart.hasOwnProperty(k)) {
				resource.queryPart[k](resource.endpoint, k, data[k]); // validate -- will throw
				url += '/' + data[k];
			}
		}
	}
	var d = { };
	for (k in resource.params) {
		if (resource.params.hasOwnProperty(k)) {
			var v = resource.params[k](resource.endpoint, k, data[k]);
			if (!(typeof v == 'undefined' || v === '' || v === null)) {
				d[k] = v;
			}
		}
	}
	return { data: serializeObject(d, ''), url: url };
}

/**
 * @param {string} url
 * @param {{ onSuccess:Function, onTimeout:Function, timeout:number, data:Object, method:utils._httpMethod }} options
 */
var jsonpRequest = function(url, options) {
	var callback = 'branch_callback__' + (_jsonp_callback_index++);
	// options.onSuccess = options.onSuccess || function() { };
	// options.onTimeout = options.onTimeout || function() { };

	var postPrefix = (url.indexOf('api.branch.io') >= 0) ? '&data=' : '&post_data=',
		postData = (options.method == 'POST') ? encodeURIComponent(utils.base64encode(goog.json.serialize(options.data))) : "";
	var timeout = options.timeout || 10; // sec

	var timeout_trigger = window.setTimeout(function() {
		window[callback] = function() { };
		options.onTimeout();
	}, timeout * 1000);

	window[callback] = function(data) {
		window.clearTimeout(timeout_trigger);
		options.onSuccess(data);
	};

	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.async = true;
	script.src = url + (url.indexOf('?') < 0 ? '?' : '') + (postData ? postPrefix + postData : '') + '&callback=' + callback + (url.indexOf('/c/') >= 0 ? '&click=1' : '');

	document.getElementsByTagName('head')[0].appendChild(script);
};

/**
 * @param {string} requestURL
 * @param {Object} requestData
 * @param {utils._httpMethod} requestMethod
 * @param {function(?Error,*=)=} callback
 */
var jsonpMakeRequest = function(requestURL, requestData, requestMethod, callback) {
	jsonpRequest(requestURL, {
		onSuccess: function(json) {
			callback(null, json);
		},
		onTimeout: function() {
			callback(new Error(utils.messages.timeout));
		},
		timeout: 10,
		data: requestData,
		method: requestMethod
	});
};

/**
 * @param {string} url
 * @param {Object} data
 * @param {utils._httpMethod} method
 * @param {BranchStorage} storage
 * @param {function(?Error,*=)=} callback
 */
var XHRRequest = function(url, data, method, storage, callback) {
	var req = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	req.onreadystatechange = function() {
		if (req.readyState === 4 && req.status === 200) {
			try {
				callback(null, goog.json.parse(req.responseText));
			}
			catch (e) {
				callback(null, { });
			}
		}
		else if (req.readyState === 4 && req.status === 402) {
			callback(new Error('Not enough credits to redeem.'));
		}
		else if (req.readyState === 4 && (req.status.toString().substring(0, 1) == "4" || req.status.toString().substring(0, 1) == "5")) {
			callback(new Error('Error in API: ' + req.status));
		}
	};

	try {
		req.open(method, url, true);
		req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		req.send(data);
	}
	catch (e) {
		storage['setItem']('use_jsonp', true);
		jsonpMakeRequest(url, data, method, callback);
	}
};

/**
 * @param {utils.resource} resource
 * @param {Object.<string, *>} data
 * @param {BranchStorage} storage
 * @param {function(?Error,*=)=} callback
 */
api = function(resource, data, storage, callback) {
	var u = getUrl(resource, data);
	var url, postData = '';
	if (resource.method == 'GET') {
		url = u.url + '?' + u.data;
	}
	else {
		url = u.url;
		postData = u.data;
	}
	if (storage['getItem']('use_jsonp') || resource.jsonp) {
		jsonpMakeRequest(url, data, resource.method, callback);
	}
	else {
		XHRRequest(url, postData, resource.method, storage, callback);
	}
};
