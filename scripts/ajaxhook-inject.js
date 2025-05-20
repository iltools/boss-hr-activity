// 拦截
// ah.proxy({
//   //请求发起前进入
//   onRequest: (config, handler) => {
//     handler.next(config);
//   },
//   //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
//   onError: (err, handler) => {
//     handler.next(err);
//   },
//   //请求成功后进入
//   onResponse: (res, handler) => {
//     const { url, method } = res?.config || {};
//     handler.next(res)
//     console.log(url, '-----')
//   },
// });