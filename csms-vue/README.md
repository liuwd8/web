# 汽车销售管理系统

> 一个汽车销售管理系统

**使用之前需要先安装mysql，需要先使用csms.sql生成相应的表**

初次使用可以在``server/db.js``文件最后取消注释，这样将生成一个该应用的`root`用户。

```js
/***
 * 
 * server/db.js
 */

// db.createRoot = function (username, password) {
//   var str = 'insert into users values(\''+username+'\', \''+password+'\', 0)';
//   conn.query(str, (err, data) => {
//     console.log(err, data)
//   });
// }
// db.createRoot('administor', '123456')
exports = module.exports = db;
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run server
node server/index.js
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
