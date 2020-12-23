/****************************************************
 * @Author       mingyong.g
 * @Date         2020-12-23 12:47:27
 * @LastEditors   mingyong.g
 * @LastEditTime  2020-12-23 21:26:48
 * @Description  前端请求缓存方案
 * @FilePath     :\MyHttpCache\myHttpCache.js
 ****************************************************/

/****************************************************
 * @description  缓存数据类，用于存放后台响应数据和缓存时间
 * @param { any } data 后台响应数据
 * @param { number } timeout 数据缓存时间，过期则重新请求
 * @author mingyong.g
 * @Date 2020-12-23 14:51:24
 ****************************************************/

class ItemCache {
	constructor(data, timeout) {
		this.data = data;

		// 设置缓存时间
		this.timeout = timeout;

		// 获取数据存储时间
		this.cachetime = new Date().getTime();
	}
}

/****************************************************
 * @description 基于 Map 封装缓存方案
 * @param {*}
 * @return {*}
 * @author mingyong.g
 * @Date 2020-12-23 14:53:02
 ****************************************************/
class HttpCache {
	// static cachemap = new Map();

	// 判断缓存是否超时 => 超时则返回 true
	static isOverTime(name) {
		const data = HttpCache.cachemap.get(name);

		// 没有数据一定超时
		if (!data) return true;
		const currenttime = new Date().getTime();

		// 计算数据在缓存中存在的时间
		const timedif = (currenttime - data.cachetime) / 1000;

		// 如果过去的秒数大于当前的超时时间，返回true让其去服务端取数据
		if (Math.abs(timedif) > data.timeout) {
			// 清除缓存池中已经超时的数据
			HttpCache.cachemap.delete(name);
			return true;
		}

		return false;
	}

	// 目前数据是否在缓存池中存在
	static has(name) {
		return !HttpCache.isOverTime(name);
	}

	// 删除缓存池中的数据
	static delete(key) {
		let name = generateKey(key);
		return HttpCache.cachemap.delete(name);
	}

	// 从缓存池中取数据
	static get(key) {
		let name = generateKey(key);
		const hasdata = HttpCache.has(name);
		return hasdata ? HttpCache.cachemap.get(name).data : null;
	}

	// 默认存储60分钟
	static set(key, data, timeout = 3600) {
		let name = generateKey(key);
		// 设置 itemCache
		const itemCache = new ItemCache(data, timeout);
		//缓存
		HttpCache.cachemap.set(name, itemCache);
	}
}

HttpCache.cachemap = new Map();

// 生成key值错误
const generateKeyError = new Error("Can't generate key from name and argument");

// 生成key值
function generateKey(key) {
	try {
		// 将参数转换为JSON字符串返回，以便可以存储任意类型的数据
		return JSON.stringify(key);
	} catch (err) {
		// 返回生成key错误
		return generateKeyError;
	}
}

export default HttpCache;
