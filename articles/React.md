# 安装
前置环境: node
next
```
npx create-next-app@latest
```
mobx
```
npm install mobx mobx-react-lite
```
### **1. `mobx-react-lite` vs `mobx-react`**

|特性|`mobx-react-lite` (轻量版)|`mobx-react` (完整版)|
|---|---|---|
|**体积**|~1.5KB (更小)|~5KB (更大)|
|**支持组件类型**|仅函数组件 + Hooks|类组件 + 函数组件|
|**API 复杂度**|更简单（只有 `observer`）|包含 `Provider`/`inject` 等旧 API|
|**性能**|更高（无类组件开销）|略低|
|**Next.js 兼容性**|更适合 App Router|需要额外配置|

---

### **2. 为什么推荐 `mobx-react-lite`？**

- **现代 React 的标配**：  
    如果你只用函数组件（99% 的新项目），`mobx-react-lite` 的 `observer` 配合 `useContext` 完全够用。
    
- **更小的包体积**：  
    减少最终打包体积，提升加载速度。
    
- **更简单的心智模型**：  
    无需处理类组件的 `inject`/`Provider` 复杂逻辑。
# 基础
## 组件
react组件是返回标签的js函数
```
function MyButton(){
	return(
		<button>my buton</button>
	)
}
```

React 组件必须以大写字母开头
组件内只能有一个根元素
## 插值
```
export default function About() {

	var start = false
	titletxt="666"

	var title = ""

	var html = ""

	if (start) {

		title = "i am about"

		html = <span>i am span</span>

	} else {

		title = "i am upabout"

		html = <p>i am p</p>

}

return (

	<div>
		//这里的“{}”就是插值,可以用在clss和内容里
		<h1 title={titletxt}>{title}</h1>
		//插的值可以直接是html标签
		<div>{html}</div>

	</div>

)

}
```
## 列表渲染
使用arr.map方法遍历数组并返回处理后的数组
```
//按照之前学习的标准es6箭头函数写法:"()=>{}"
var arrlist=arr.map((item)=>{
	<li key={item}>{item}</li>
})
//有问题,不渲染
//因为箭头函数会隐式地返回位于 `=>` 之后的表达式，所以可以省略 `return` 语句
//不过，如果 `=>` 后面跟了一对花括号 `{` ，那你必须使用 `return` 来指定返回值!
//所以应改为:
var arrlist=arr.map((item)=>{

return(

<li key={item}>{item}</li>

)})
//或者简写:
var arrlist=arr.map((item)=><li key={item}>{item}</li>)
//每个元素要有一个key
```

```
export default function About() {

// const { oneS } = oneStore()

var arr = [1,2,3,4,5,6,7,8,9,0]

var arrlist=arr.map((item)=><li key={item}>{item}</li>)
//jsx中只能有有个根元素,如果要在添加一个元素的话,需要用<Fragment>组件包裹,没有绑定值的要求可以简写为:<></>
var arrlist=arrtwo.map((item)=>(

	<Fragment key={item.id}>

		<li key={item.id}>{item.name}</li>

		<li>-------------------------</li>

	</Fragment>

))

return (

<div>

<ul>{arrlist}</ul>

</div>

)

}
```
## 状态管理(响应式)
```
export default function About() {

//解构不是固定的,也可以是[user,userData][active,activeData]
const [data,setData]=useState({

title:"i am title",

cotent:"i am cotent"

})

const [arr,setArr]=useState([1,2,3,4,5])

function btnFun(e){

//仅修改cotent,不改其他属性
setData({

...data,

cotent:"i am new cotent"

})

};
//如果是数组操作,添加/删除某项
//添加,这里的...arr不能是...data,固定写法只是...,后面是原变量
setArr([
	...arr,
	6
])
//删除(过滤),使用js语法💦
setArr(arr.filter(item=>item!=2))

return (

<div>

<h1 title={data.title}>{data.cotent}</h1>

<button onClick={btnFun}>onClick</button>

</div>

)

}
```
## 组件传值
父传子(props)
```
//父组件About
export default function About() {

const [arr,setArr]=useState([1,2,3,4])
return (
	<div>
		<Contact ctx={arr}></Contact>
	</div>
)}
//子组件Contact
export default function Contact(props){//这里也可以用解构,Contact({ctx}){
return(
	<div>{props.ctx}</div>//渲染成功
)}
```
子传父
```
//父组件About
export default function About() {
	const porp=""
	function porpFun(porps){
		porp=porps
	}
return (
<>
<Contact porpFunBox={porpFun}></Contact>
<div>父组件拿到的参数:{porp}</div>
</>
)}
//子组件Contact
export default function Contact({porpFunBox}){

function contactClik(){
console.log("子组件拿到的参数:"+porpFunBox);
porpFun("参数1")
}
return(
	<button onClick={contactClik}>onClick</button>
)}
```
同级传值,利用父组件中转
跨层级
```

```
children
## mobx
## Hooks
### useState()状态管理钩子
上面已经用到了,状态管理(响应式)
### useContext()共享状态钩子
```
import { createContext } from "react"


const ContextBox=createContext()//创建状态容器


export default function Father(){//父组件

const data="i am data"//定义数据

return(

<>

<ContextBox.Provider value={data}>//用固定语法包裹并传值

<Son></Son>

</ContextBox.Provider>

</>

)}

function Son(){//儿组件

return(

<>

<Grandson></Grandson>

</>

)}

function Grandson(){//孙组件

const getData=useContext(ContextBox)

return(

<>

<p>{getData}</p>//获取数据

</>

)}
```

### useReducer()action 钩子
### useEffect()## 副作用钩子
### 自定义Hooks