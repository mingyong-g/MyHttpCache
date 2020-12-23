# MyHttpCache

> 基于 map 设计的前端接口请求缓存方案

## 特点

1. 基于 map 实现缓存池，无法离线缓存，窗口关闭和浏览器刷新等均会到导致缓存失效，下次访问数据时，将向服务器发起请求。
2. 可设置缓存时间，超时后再次访问数据，将向服务器发起请求
3. 同一 API 接口，可根据参数不同而设置不同的缓存对象。
4. 可调用 delete 方法手动清除缓存

## 使用场景

1. token 缓存与更新
2. 组织结构等变动比较下，但使用频繁的数据
3. 其它

## 静态方法

| 方法                  | 方法说明                                                | 参数说明                                                               |
| --------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------- |
| set(key,data,timeout) | 设置缓存                                                | key:map 主键;data:写入的缓存数据;timeout:数据缓存时间/秒(默认 3600 秒) |
| get(key)              | 从缓存池中获取数据，若数据不存在或者缓存过期则返回 null | key:map 主键                                                           |
| delete(key)           | 从缓存池中删除目标数据                                  | key:map 主键                                                           |

## 案例

```js
import MyHttpCache from "MyHttpCache"

async function getData {
  let url = `xxx/api/getData`;
  let data = MyHttpCache.get({ url });
  if (!data) {
    const response = await request({url});
    // 设置缓存有效时间为20min
    MyHttpCache.set({ url }, response,1200);
    data = response;
  }
  return data;
}

```
