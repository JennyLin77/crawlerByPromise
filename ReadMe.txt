这是一个用promise重构的爬虫代码。
其中的课程人数number因为是异步加载的，而http.get()只能获取服务器第一次返回的html代码，所以number值获取不到。
暂无发现其它bug，谢谢。

其中用到的模块有：
http
bluebird（是一个Promise库，也可用其它Promise库）
cheerio（用于操作装载得到的html代码，操作方法类似jquery）