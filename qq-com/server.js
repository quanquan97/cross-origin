var http = require("http");
var fs = require("fs");
var url = require("url");
var port = process.argv[2];

if (!port) {
  console.log("请指定端口号好不啦？\nnode server.js 8888 这样不会吗？");
  process.exit(1);
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true);
  var pathWithQuery = request.url;
  var queryString = "";
  if (pathWithQuery.indexOf("?") >= 0) {
    queryString = pathWithQuery.substring(pathWithQuery.indexOf("?"));
  }
  var path = parsedUrl.pathname;
  var query = parsedUrl.query;
  var method = request.method;

  /******** 从这里开始看，上面不要看 ************/

  console.log("有个傻子发请求过来啦！路径（带查询参数）为：" + pathWithQuery);

  if (path === "/index.html") {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/html;charset=utf-8");
    response.write(fs.readFileSync("./public/index.html"));
    response.end();
  } else if (path === "/qq.js") {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/javascript;charset=utf-8");
    response.write(fs.readFileSync("./public/qq.js"));
    response.end();
  } else if (path === "/friends.json") {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/json;charset=utf-8");
    response.setHeader("Access-Control-Allow-Origin", "http://fang.com:9999");
    response.write(fs.readFileSync("./public/friends.json"));
    response.end();
  } else if (path === "/friends.js") {
    if (request.headers["referer"].indexOf('http://fang.com:9999') === 0) {
      //这里很容易产生一个BUG  我看了一个小时才解决： 在用indexof的时候 这上面写的是'http://fang.com:9999'  也就是说打开黑客网站的时候，一定得把域名改成'http://fang.com:9999'，默认的是localhost 就不匹配！！！ 又踩了一个坑！！ 就因为这里用了indexof！！ 指定一个网站作为朋友，允许他的访问，但其实还是有安全漏洞，即：如果朋友被攻陷，唇亡齿寒，自己也难逃厄运，即：网络安全取决于最弱的一环，bottoleneck.
      response.statusCode = 200;

      response.setHeader("Content-Type", "text/javascript;charset=utf-8");

      const string = `window['{{xxx}}']({{data}})`;
      //现在改了，直接复制过来，不需要读文件 //读完JS内容后， 把它放在一个字符串里面，因为我们想在js里写内容,记得toString()!!!! 手残 打错无数字了 尼玛的!!!!

      const data = fs.readFileSync("./public/friends.json").toString();
      //让占位符变成真正的数据

      console.log(query.functionName);
      const string2 = string.replace("{{data}}", data).replace("{{xxx}}",query.callback);
      response.write(string2);
      //把data塞进字符串里面
      response.end();
    } else {
      response.statusCode = 404;
      response.end()
    }
  } else {
    response.statusCode = 404;
    response.setHeader("Content-Type", "text/html;charset=utf-8");
    response.write('你输入的路径不存在');
    response.end()
  }
})

/******** 代码结束，下面不要看 ************/

server.listen(port);
console.log(
  "监听 " +
    port +
    " 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:" +
    port
);
