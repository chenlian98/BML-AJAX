function  _ajax(options) {
    //①.method 请求的方法 默认是你传入的方式，或者GET  不去传入参数就是GET
   let method = options.method || 'GET';
   //②.url 地址
   let url = options.url;
   //③.有就是你传入的数据，没有发送的数据就是空的
   let data = options.data ? JSON.stringify(options.data) : null;
    //④.创建 AJAX实列
   let xhr = new XMLHttpRequest()
       //⑤.初始化操作
       xhr.open(method,url)
      //⑥.设置头信息
       xhr.setRequestHeader('Content-Type','application/json; chest=utf-8')
       //⑦.发送数据
       xhr.send(data)
       //⑧.把接收到的数据字符串 转为 json 对象
       xhr.responseType = 'json'
    //⑨. 状态改变时 增加的处理
   xhr.onreadystatechange =  function () {
       if(xhr.readyState === 4){ //状态值 = 4
           if (xhr.status === 200){ //状态 = 200为成功
               //给对象里面定义一个成功的方法,并且定义 形参
               options.success(xhr.response)
           }else {
               //给对象里面定义错误的方法
              options.error(xhr)
           }
       }
   }

}






let height = $('#data')
let weight = $('#data2')
let bmi_span = $('#bmi-span') //BMI的span
let table_arrow = $('#table_arrow') //表格箭头
let btn = $('.content .form .wrap-button button'); //点击按钮
let bml = $('#BMI') //bml --弹窗
let empty = document.querySelector('#empty') //表格父容器

function  showPopUp(msg ,timeout = 1500) {
    let div = document.createElement('div')
    div.classList.add('pop-up')
    document.body.append(div)
    let pop_up = $('.pop-up'); //错误的时候的提示框
    pop_up.style.display = 'block'
    pop_up.innerHTML = msg
    setTimeout(function (){
        pop_up.style.display = 'none'
    },timeout)
}
// 进行计算的方法
function calc(){
        //结果保留一个小数点
        result = (weight.value / (height.value ** 2) * 10000).toFixed(1); /*公式（BMI）=体重（kg）÷身高/2（m）*/
        function valuee(num,scope) {
            bmi_span.innerText = '你的 BMI 值:' + result + ',身体状态：'+ scope + ' '
            table_arrow.style.top = num + '%'
        }
        valuee(36,'偏瘦')
        if(!height.value || !weight.value) {
         return  showPopUp('不能是空的',2000)
        }else if(isNaN(height.value) || isNaN(weight.value)) {
         return  showPopUp('不是数字',2500)
        }else {
                if (result <= 18.4) {
                    postTable()
                    valuee(36,'偏瘦')
                } else if (result >= 18.5 && result <= 23.9) {
                    valuee(52,'正常')
                    postTable()
                } else if (result >= 24.0 && result <= 27.9) {
                    valuee(71,'过重')
                    postTable()
                } else if (result >= 28) {
                    postTable()
                    valuee(86,'肥胖')
                }
                bml.style.display = 'block'
                table_arrow.style.display = 'block' //表格箭头
            table() //表格
        }
}
//点击按钮执行的事件
btn.onclick = calc
//键盘事件 --回车按钮
weight.addEventListener('keypress',function (event){
        if (event.keyCode === 13) {
            calc()
        }
 })
// //获得本地时间 年月日时分秒
// function down_timer(now = null) {
//     let  nowTimer = new Date();
//     let  y = nowTimer.getFullYear() //年
//     let  m = nowTimer.getMonth()+1//月
//     m = m< 10 ? `0${m}`: m
//     let  d = nowTimer.getDate()//日
//     d = d< 10 ? `0${d}`: d
//     let  h = nowTimer.getHours()//时
//     h = h< 10 ? `0${h}`: h
//     let  minute = nowTimer.getMinutes()//分
//     minute = minute< 10 ? `0${minute}`: minute
//     let  sed = nowTimer.getSeconds()//秒
//     sed = sed < 10 ? `0${sed}`:sed
//     now = `${y}年${m}月${d}日${h}:${minute}:${sed}`
//     return now
// }

// setInterval(function (){
//    // console.log(down_timer())
// },1000)

//把获取的时间转成2020-05-06
function dataTimer(timer) {
    let  sj = new Date(timer)
    sj = ` ${sj.getFullYear()}-${sj.getMonth() +1}-${sj.getDay()}`
    return sj
}

// console.log(dataTimer('2021-05-23T13:16:33.079Z'))
//POST 请求
function postTable() {
     _ajax({
         method:'POST',
         url: 'http://veihwwnelcwq.leanapp.cn/bmi',
         data: {
              height: height.value,
              weight: weight.value
         },
         success(res) {
             console.log(res)
         },
         error(err) {
             console.log('错误')
         }
     })
}


//GET 请求
function table() {
            _ajax({
                url:'http://veihwwnelcwq.leanapp.cn/bmi',
                success(res){
                    console.log(res)
                      // let record = document.querySelector('#record') //record记载
                      // record.style.display = 'none' //记录消失
                      empty.innerHTML = ''
                      let table = document.createElement('table')
                           empty.append(table)
                          res.data.forEach(function (item,index){
                              table.innerHTML +=
                                  ` <tr>
                                           <td>${index + 1}</td>
                                           <td>${dataTimer(item.updatedAt)}</td>
                                           <td>${item.height}</td>
                                           <td>${item.weight}</td>
                                           <td>${item.bmi}</td>
                                           <td>
                                              <a href="javascript:void(0)" data-id="${item.objectId}">删除</a>
                                           </td>
                                       </tr>
                                 `
                      })
                },
                error(err) {
                    console.log(err)
                }
            })

}table()


//删除 事件委托-通过父亲来找到孩纸
empty.addEventListener('click',function (event){
   // console.log(event.target.tagName)
   if (event.target.tagName === 'A'){
       let _this = event.target;
       let id = _this.getAttribute('data-id')
       // console.log(id)
       _ajax({
        method: 'DELETE',
        url: 'http://veihwwnelcwq.leanapp.cn/bmi',
        data:{
            id:id
        },
        success() {
            table()
        },
       //  error() {
       //
       //  }
       })
   }
})
