


// ----------------------------使用cros-------------------------------------------------

// console.log("我是黑客");
// const request = new XMLHttpRequest();
//
// request.open("GET", "http://qq.com:8888/friends.json");
//
// request.onreadystatechange = () => {
//   if (request.readyState === 4 && request.status === 200) {
//     console.log(request.response);
//   }
// };
// request.send();



// ----------------------------以下全是使用jsonp----------------------------------


//现在的情况是IE没有cors 以上代码就是访问不通的  你不要我访问json，那我访问js总可以吧 ！通过访问friends.js

// window.xxx = (data) => {
//   console.log(data); //这是回调啊！！ 我定义了一个函数，我自己没调，等着qq下面的friends.js 文件来调用xxx，它在调用的时候把数据作为第一个参数传过来，即把data传过来  -----跨域回调
// };
// const script = document.createElement("script");
//
// script.src = "http://qq.com:8888/friends.js";
// // script.onload = () => {
// //   console.log(window.xxx);
// // };
// document.body.appendChild(script);

//------------------------------------------------------------------------------------

//现在不想把xxx写死，因为要提供多个接口，实现多种功能，使用random,这样可以保证永远不会占用其他的，永不重复
//fang.js 请求friends.js  ,friends.js返回了一个window.xxx   现在报错，说window.xxx不是一个函数， 因为我们之前写的是window.xxx = (data) => {,  现在改了, 当然会报错啊！
//我们现在想让这个XXX变成random随机数, 怎么把random给xxx呢？==>使用查询参数

// const random= 'fangJSONPCallback'+Math.random()  //创建随机数
// console.log(random);
// window[random] = (data) => {   //定义一个全局的random
//   console.log(data); //这是回调啊！！ 我定义了一个函数，我自己没调，等着qq下面的friends.js 文件来调用xxx，它在调用的时候把数据作为第一个参数传过来，即把data传过来  -----跨域回调
// };
// const script = document.createElement("script");
//
// script.src = `http://qq.com:8888/friends.js?functionName=${random}`;//查询参数：使用插值的时候记得使用反引号， 现在插进去，怎么渲染到js里面呢？---后端知识，去server.js里改   这个就是query.functionName
// // script.onload = () => {
// //   console.log(window.xxx);
// // };
//
// //每次执行完就删掉script标签， 不然每次就多一个script标签，就会越来越臃肿,所以总的流程就是 ：先创建一个script--再执行这个script---最后就把script删掉，但数据还在的，不用担心。
// script.onload=()=>{
//   script.remove()
// }
//
// document.body.appendChild(script);
//------------------------------------------------------------------------------------

//中级程序员学封装 ，现在来封装一下JSONP吧！
// 返回一个promise ，在拿到数据的时候调用resolve 拿不到数据的时候调用reject 所以jsonp相比ajax天然劣势：只能知道成功或者失败，拿不到状态码

function jsonp(url){
  return new Promise((resolve,reject)=>{
    const random= 'fangJSONPCallback'+Math.random()
    window[random] = (data) => {
      console.log(data);
      resolve(data)//拿到data就成功了
    };
    const script = document.createElement("script");
    script.src = `${url}?callback=${random}`; //约定俗称 jsonp的函数名不叫functionName 叫callback！后端的server,js 也要改成callback
    script.onload=()=>{
 script.remove();
  }
  script.onerror=()=>{
      reject();
  }
    document.body.appendChild(script);
  })
}
//使用jsonp
jsonp('http://qq.com:8888/friends.js').then((data) => {console.log(data)});


