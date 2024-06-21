# go语言学习

## 项目创建



set GONOPROXY="https://goproxy.cn,direct"



go get命令会将依赖包下载到$GOPATH/pkg/mod目录下，并且按照依赖包的版本分别存放


###### 传统包管理
源码文件放在 $GOPATH/src，引入的包下载到 GOPATH/pkg
不方便控制依赖包版本，一次包升级，所有依赖的项目都升级；
每个 import github 的包都要 go get 下载

###### module包管理
任意位置新建一个项目文件夹，可以对应一个GitHub repo



###### vender方案
每个项目创建一个vendor文件夹，就不用把包都下到GOPATH中去，使用包优先从vendor找，但会造成相同的库存在于多个目录。

######  GoModules 方案
项目可以放在任意位置

```cmd
go env
set GO111MODULE=auto
# 如果有mod文件就根据mod下载依赖，on 启用，off gopath模式
go env -w GO111MODULE=on


go mod download    // 下载依赖的module到本地（默认为$GOPATH/pkg/mod目录）
go mod edit        // 编辑go.mod文件
go mod graph       // 打印模块依赖图
go mod init        // 初始化当前文件夹, 创建go.mod文件
go mod tidy        // 增加缺少的module，删除无用的module
go mod vendor      // 将依赖复制到vendor下
go mod verify      // 校验依赖
go mod why         // 解释为什么需要依赖
```
`go mod edit -replace=*@v` 替换版本

`go mod init <name>` 在目录下创建mod文件，模块名尽量和文件夹名相同



创建项目文件夹，mod init，创建main.go




go install运行时跟src/bin/pkg关联.而go run/go build就不管工作目录了.只在当前目录下工作.



GO111MODUL

goroot 和 gopath
GOPATH src pkg bin
go install
建文件夹
vscode打开
调出终端
go mod init github.com/hello
go run .

<span style="color:##ef49ad;">饿哦们</span>

```
go mod init
```

新建项目文件夹，在其下传创建src


## 声明

### 变量 
```go
var name,name,name type = expr
name := expr // 由输入决定
```
`p := &x` 获得一个指向x的指针 p，通过`*p` 读写 p == 读写x 

`func fn() retType { }` 比如 *int 表示 返回必须是整型指针（对一个整型变量&操作）
传递指针可以在函数作用域内修改它处变量（指针即别名）

`p := new(type)` 相当于的创建了没有名字的变量并取其指针，此时指针是唯一读写途径
多重赋值概念类似解构赋值，`_` 跳过赋值

### 常量

`const (c,c,c)`

#### iota 生成器

首次出现代表0，用于创建枚举（常量集），之后的值逐项加1
只有常量可以无类型，因为它的值是固定的
 


### 类型

`type name underlying-type` 

位运算：& and | or  ^ xor &^ 位清空 and not << >>
数据类型：
    int8|16|32|64 uint8|16|32|64 int unit 视平台  rune=int32 byte=uint8 uintptr
    float32 float64 complex64|128 bool(true false ||逻辑加 &&逻辑乘) 布尔不能隐式转为数值
    +Inf -Inf NaN  0开头不带o的八进制（推断）唯一用途是权限掩码 0x 0X十六
    string len(s) +串接 字串不能通过索引改变，可以用索引安全引用和复制片段
    "literal string" 可以插值转义字符\xhh \uhhhh \Uhhhhhh.. unicode字符 
    \`...` 原生字串不能插值转义字符

字串操作：bytes strings strconv unicode

类型转换 `typeto(typefromval)` b := []byte(s)

#### 复合数据类型

##### 数组 
`[len]type` 数组  `[...]type}{el,el,..}` 长度由元素决定 长度也是类型的一部分

##### 切片
slice [idx] [B:E] 
```go
make([]T,len,cap)
```
.data内容 en()实际元素数量 cap() 最大容量  append(slice, eltoapp1, eltoapp2, ...)

##### 散列表
map 字典、哈希、关联数组
```go
var m map[keyType]valueType
m := make(map[keyType]valueType)
m := map[keyType]valueType{key1: value1, key2: value2, ...}

delete(map, key)  append(map, key) map[key]
```

##### 结构体

struct 相当于接口，里面只放类型声明
```go
type P struct {}
p := P{} // 通过结构体字面量创建对象，通过.访问属性

type Point struct {
    X float64
    Y float64
}
```
结构体嵌套 
声明时，属性的类型是另一个结构体
赋值时，结构体中键的值是一个结构体字面量
（匿名结构体）声明时只有类型，相当于把另一个结构体的定义展开了 

###### 指针类型的字段

用于在引用上层作用域的变量值，
```go
    name := "Alice"
    person := Person{
        name: &name,
        age:  25,
    }
```
读取这种字段时必须在对象前面加*，`*person.name`，
赋变量值时也要取地址 `person.name = &newName`


赋值为匿名结构体可以在定义后面直接{}再穿实例值 

```go

cases := []struct {
		Name           string
		A, B, Expected int
	}{
		{"pos", 2, 3, 6},
		{"neg", 2, -3, -6},
		{"zero", 2, 0, 0},
	}

```


##### JSON
字段标签为字段附加元数据。它写在字段声明后面，用反引号 ` 括起
```go
type Person struct {
    Name  string `json:"name"`
    Age   int    `json:"age"`
    Email string `json:"email,omitempty"`
    // omitempty 选项表示 JSON 序列化中，字段值为空则忽略该字段，不包含在生成的 JSON 中
}
```
### 函数
可递归，可返回多个值，`_`跳过，`if err != nil { } else { }`
如果函数由命名的返回值，即retli中是有名称有类型注释的，则直接return不用写返回的操作数

```go
func name(paramli)(retli){body}
func(paramli)(retli){body} // 匿名函数
func name(vals ...type) // 变长函数，参数数量不定，0到多个
```
函数也可以作变量类型
#### defer
defer语句在函数返回之前执行，后进先出，先defer的最后执行，
用于成对操作，或者清理，比如文件的打开关闭


#### panic 和 recover
panic运行时错误，不是立即停止程序，return不成，defer还是执行的，最终终止程序并打印 panic 错误信息
recover()表示回复程序的panic()，让程序正常执行

```go
panic("Something went wrong!") // 引发 panic

```
recover() 用于从 panic 中恢复并继续程序执行
只能在 defer 函数中调用，用于捕获 panic，并返回 panic 的值
```go
defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered:", r) // 恢复并打印 panic 的值
		}
        fmt.Println("Deferred") // 在 recover 后继续执行
	}()
```
recover() 函数的返回值被赋值给一个变量 r，然后通过条件判断 r != nil 来检查是否发生了 panic

recover()停止 panic 的传播，并返回 panic 的值。
但不能将程序回退到 panic 发生的位置，
而是继续执行当前 defer 函数体内后面代码
至于程序中的其它部分不会执行


## 继承

go语言放弃了继承的写法，

### 值接收者的方法

```go
func (obj type) name(pali)(retli){body} // 将方法绑定到函数名前面的类型上
```
一个类型拥有的方法名必须唯一

### 指针接收者的方法

指针接收者允许方法修改接收者所指向的值，而不仅仅是对接收者的副本进行操作
```go
func (p *Person) setName(newName string) {
    p.name = newName
}
```
大概的意思是，将方法绑定到某个类型的对象上，但对象的类型声明是指针
这样就能直接操作该类型实例的内容，相当于传了this

### 方法变量

就是把某个调用存在变量里，用()传参执行

### 方法表达式

必须声明接收者，调用时(&v, args)

### 位向量

一组二进制值序列
长度为8的位向量， 比特位索引 7-0 ，每个索引的位置值要么是1要么是0

byte等价于uint8 ，所以创建位向量用uint类型，uint几看长度需求
位向量可以用来表达状态

```go

numBlocks := (size + 63) / 64
bits := make([]uint64, numBlocks)

/*
每个 uint64 类型的整数可存储 64 个比特位，将位向量的大小 size 加上 63，
然后除以 64 来计算所需的整数块数量。
这样确保如果 size 不是 64 的倍数，也能够容纳足够的整数块来存储所有比特位
*/

```
搞不懂，用到再查

## 封装

封装是以包为单位的

结构体中大写开头字段外部可见，或用公开方法，即指针类型接收者的方法才操作字段

通过接口，只操作实现了接口的对象，不暴露接口


## 接口类型

```go
type Intfs  interface{
    fn(paramtypeli) (retTypeli)
}

type IntfsImpl struct {
    func (obj IntfsImpl) fn(paramtypeli) (retTypeli){
        return .. 
    }
}

```
所有成员都是函数，但没有方法体，接口字段的类型等于函数的返回值类型
接口通过结构体实现：结构体的成员都是方法定义，且绑定到该类型结构体的对象实例
（方法的接收者，是该结构体类型的对象）

### 多态

基于接口，不同结构体有不同实现，就算是多态了

interface{}代表任意类型

### 动态类型和动态值

把一个变量的类型声明为接口，一个变量有不同的结构体实现
然后把不同结构体类型的值，赋值给这个接口类型的变量
就是动态类型变量和动态值

### 泛型

```go
func fn(arg1 T, arg2 T) T{return arg1 + arg2} // 既可以用于数值，也可以用于字串

// 创建一个新类型 Slice[T]，使用时 Slice[int]  Slice[float32] —— 一次定义等于创建三种类型
type Slice[T int|float32|float64 ] []T // T后面的是类型约束，收窄泛型范围

type MyMap[KEY int | string, VALUE float32 | float64] map[KEY]VALUE 
```
泛型写在名字后面 struct 、 interface、chan等关键字前

匿名结构体不支持泛型；

给泛型receiver加方法，好处也是一次定义，批量绑定


## 断言

将接口值转换为具体类型，在一个接口类型的值后面`.(string)`转换为具体的类型

```go
value := interfaceValue.(ConcreteType)

value, ok := x.(type)
if !ok { .. }

// 参看
if err != nil { } else { }
```
## new 方法

`ptr := new(Type)` 创建指针用的






## goroutine

并发活动即go协程

```go
func main() {
	go task1() // 创建一个新的 goroutine 并发执行 myFunction
    go task2()
	go task3()
	// 主 goroutine 继续执行其他操作
}
```

### 通道

并发的协程可以通过通道传输数据

```go
func main() {
	ch := make(chan int) // 创建一个整数类型的通道
	go func() {
		ch <- 42 // 向通道发送数据
	}()
	result := <-ch // 从通道接收数据，这是一个阻塞操作
	fmt.Println(result)
}


// 协程同步
func main() {
	ch := make(chan bool)
	go func() {
		// 执行一些耗时的操作
		ch <- true // 操作完成后向通道发送信号
	}()
	// 等待操作完成
	<-ch // 阻塞直到从通道接收到信号
	fmt.Println("操作完成")
}
```

不同的 goroutine 可以创建多个通道来进行数据传递和互相通信


### 缓冲通道
```go
ch := make(chan int, bufferSize)


func main() {
	ch := make(chan int, 2) // 创建一个缓冲区大小为 2 的整数类型通道

	ch <- 42 // 发送操作，不会阻塞
	ch <- 43 // 发送操作，不会阻塞

	result1 := <-ch // 接收操作，不会阻塞
	result2 := <-ch // 接收操作，不会阻塞
	fmt.Println(result1, result2)
}


func main() {
	ch := make(chan int, 2) // 创建一个缓冲区大小为 2 的整数类型通道

	ch <- 42 // 发送操作，不会阻塞
	ch <- 43 // 发送操作，不会阻塞

	// 尝试向已满的缓冲通道发送数据
	ch <- 44 // 发送操作，阻塞

	fmt.Println("发送操作被阻塞")
}
```
有缓冲大小，视不同类型，达到type*size后，发送阻塞，直到接受操作把通道取空


### 双向通道

限制为单向通道 
```go
ch := make(chan<- int) // 只允许发送
ch := make(<-chan int) // 只允许接收


func sendData(ch chan<- int) {
	for i := 1; i <= 5; i++ {
		ch <- i // 发送数据到通道
	}
	close(ch) // 关闭通道
}

func main() {
	ch := make(chan int)
	go sendData(ch)

	// 从通道接收数据
	for value := range ch {
		fmt.Println(value)
	}
}
```

单向通道可用于从函数获得返回值
不带限制的通道就是双向的

### range

range 关键字用于迭代各种数据结构，例如数组、切片、映射和通道

```go
func sendData(ch chan<- int) {
	for i := 1; i <= 5; i++ {
		ch <- i // 发送数据到通道
	}
	close(ch) // 关闭通道
}

func receiveData(ch <-chan int) {
	for value := range ch {
		fmt.Println(value) // 打印接收到的数据
	}
}

func main() {
	ch := make(chan int)
	go sendData(ch)
	receiveData(ch)
}



ages := map[string]int{
    "Alice": 25,
    "Bob":   30,
    "Eve":   28,
}
for name, age := range ages {
    fmt.Println(name, age)
}

nums := []int{1, 2, 3, 4, 5}
for index, value := range nums {
    fmt.Println(index, value)
}


ch := make(chan int)
go func() {
    ch <- 1
    ch <- 2
    ch <- 3
    close(ch)
}()
for value := range ch {
    fmt.Println(value)
}
```

### 并行循环

循环是重复执行一段代码的结构。而并行循环是指同时执行多个循环迭代

将工作分配给多个 goroutine 并在它们之间进行通信，
可以实现并行执行循环迭代的效果

```go
func squareWorker(input <-chan int, output chan<- int) {
	for num := range input {
		square := num * num
		output <- square
	}
}

func main() {
	input := make(chan int)
	output := make(chan int)

	// 启动多个工作者 goroutine
	for i := 0; i < 5; i++ {
		go squareWorker(input, output)
	}

	// 向输入通道发送数据
	for i := 1; i <= 10; i++ {
		input <- i
	}
	close(input)

	// 从输出通道接收结果
	for i := 1; i <= 10; i++ {
		result := <-output
		fmt.Println(result)
	}
	close(output)
}
```

### sync.WaitGroup 

创建一个 sync.WaitGroup 对象
在每个任务开始执行之前，调用 Add 方法增加计数器的值
在每个任务完成时，调用 Done 方法减少计数器的值
在需要等待所有任务完成的地方，调用 Wait 方法阻塞等待，直到计数器的值变为零
当所有任务都完成时，Wait 方法会返回，可以继续执行后续操作

```go
func worker(id int, wg *sync.WaitGroup) {
	defer wg.Done()
	fmt.Printf("Worker %d starting\n", id)
	// 模拟一些工作
	fmt.Printf("Worker %d done\n", id)
}

func main() {
	var wg sync.WaitGroup

	for i := 1; i <= 5; i++ {
		wg.Add(1)
		go worker(i, &wg)
	}

	wg.Wait()
	fmt.Println("All workers done")
}
```

### select

需要同时监听多个通道的操作时，可以使用 select 来选择第一个准备好的操作进行处理
select 语句会阻塞，直到其中一个通道操作可以进行

```go
select {
case <-ch1:
	// ch1 通道有数据可读取，执行相关操作
case data := <-ch2:
	// ch2 通道有数据可读取，执行相关操作，同时将数据存储到 data 变量中
case ch3 <- data:
	// 将数据发送到 ch3 通道，执行相关操作
default:
	// 如果没有通道可读写，则执行 default 分支
}
```

#### 取消协程

通过空return退出

```go
func worker(cancel chan bool) {
	for {
		select {
		default:
			// 执行协程的工作任务
			fmt.Println("Working...")
			time.Sleep(1 * time.Second)
		case <-cancel:
			// 收到取消信号，退出协程
			fmt.Println("Cancellation received. Exiting...")
			return
		}
	}
}

func main() {
	cancel := make(chan bool)

	// 启动协程执行工作任务
	go worker(cancel)

	// 模拟一段时间后取消协程
	time.Sleep(5 * time.Second)
	close(cancel) // 关闭取消通道

	// 等待一段时间以观察协程是否已退出
	time.Sleep(2 * time.Second)
	fmt.Println("Program finished.")
}
```

### 共享变量与互斥锁

`var mutex   sync.Mutex` 创建一个锁对象
在读写某个变量前`mutex.Lock()`，之后`mutex.Unlock()`


```go	
for i := 0; i < 5; i++ {
		mutex.Lock() // 获取互斥锁
		counter++
		mutex.Unlock() // 释放互斥锁
		time.Sleep(time.Millisecond * 100)
	}
```

sync.RWMutex 允许多个协程同时读取共享资源，但只允许一个协程进行写操作

```go
var rwMutex sync.RWMutex
// 获取读锁
rwMutex.RLock()
// 读取共享资源
// ...
// 释放读锁
rwMutex.RUnlock()

// 获取写锁
rwMutex.Lock()
// 写入共享资源
// ...
// 释放写锁
rwMutex.Unlock()
```
多个协程可以同时获取读锁（RLock()）


#### sync.Once

当多个协程调用 Do 方法时，只有第一个调用会执行函数，而其他调用会忽略

比如init就是这种原理，只初始化一次

```go
var once  sync.Once

//...
once.Do(fn)

```


全局变量和全局锁，保证协程不再同一时间操作同一变量

### sync.Pool

缓存已分配但未使用的对象，以便稍后重用，从而减轻垃圾收集器的压力

```go


type SomeObject struct { }

pool := &sync.Pool{
    // 当get多于put，就new一个
    New: func() interface {} {
        return struct{}{} // return &SomeObject{}
    }
}

// 从池中获取一个对象，并将其断言为SomeObject类型
obj := pool.Get().(SomeObject) 

// 使用对象进行操作
obj.DoSomething()

// 将对象放回池中，以便重用
pool.Put(obj)

```


用完放回池子里，就不会被GC，能反复用，

### sync.Cond

协调想要访问的共享资源
如协程A结束后协程B收到消息自动继续

```go
import (
	"fmt"
	"sync"
	"time"
)

func main() {

	// 用一个锁来创建调度
	var locker sync.Mutex
	cond := sync.NewCond(&locker)

	go func() {
		// 在代码两端加锁/解锁
		cond.L.Lock()
		defer cond.L.Unlock()

		fmt.Println("Waiting...")

		// 等待cond.Signal()或cond.Broadcast()方法
		// 必须在加锁状态调用
		cond.Wait()

		// 被 cond.Wait 阻塞直到 被信号接触阻塞
		fmt.Println("Woken up!")

	}()

	time.Sleep(time.Second)

	cond.L.Lock()
	fmt.Println("Signaling...")

	// 必须在加锁状态调用
	// 唤醒其中一个等待的goroutine
	// cond.Broadcast()用于向等待的所有goroutine发通知
	// 其中一个协程会成功获取锁，并继续执行后续的代码，而其他协程则会继续等待
	cond.Signal()

	cond.L.Unlock()

	time.Sleep(time.Second)
}

```

## 包

go build 编译cli参数中的每一个包，跳过库
包名是main的，创建可执行文件
每个目录一个包

目录层级中创建一个internal目录，其下的包只能被另一个包导入
这个叫内部包

go list 查询工作空间中的包




### 用模块创建项目

`go mod init name`


## 模块

模块mod 是 pkg(包) 的集合 
`go mod init name` 初始化一个模块，在项目根目录下创建go.mod文件，记录直接或间接依赖的hash

`go get github.com/*@v` 依赖第三方包（下载非内置库）
go.sum 文件锁定当前项⽬依赖的所有模块版本

```cmd
go mod init        // 初始化当前文件夹, 创建go.mod文件
go mod download    // 下载依赖的module到本地（默认为$GOPATH/pkg/mod）
go mod edit        // 编辑go.mod文件
go mod graph       // 打印模块依赖图
go mod tidy        // 增加缺少的module，删除无用的module
go mod vendor      // 将依赖复制到vendor下
go mod verify      // 校验依赖
go mod why         // 解释为什么需要依赖
```
`go mod edit -replace=*@v` 替换依赖版本，用本地包替代

### 包






包可以是一个业务文件，也可以是纯粹的定义文件（没有逻辑的执行），后者没有main
`package name` 尽量和文件夹名一致

`import( alias "pkgpath)" ` 导入包时，如果文件都是放在 $GOPATH/src，包路径就从 src 的下一级开始写
之后就能使用 包名.标识符 来使用其中定义的对象（首字母 *大写* 的标识符才对外可见 `// Identifier 说明` 写提示）
导入包时会自动执行包内的 init() 函数 ，`import( _ "pkgpath)" ` 匿名导入包表示只执行init，不使用其中标识符
init写在文件内哪个位置都行，执行顺序：全局声明的内容→init→main

#### main
作为独立程序（业务文件），变为为exe的，要写main，作为入口
作为库（定义文件）调用的，不用写mian

### 其


项目文件夹-包文件夹-.go文件
主入口文件才需要main，其它正常定义变量或函数



`go buiild` 编译可执行文件



## 测试

`_test.go`

创建一个对应 mycode.go  的  mycode_test.go 


```go

package main

func Add(a int, b int) int {
    return a + b
}
func Mul(a int, b int) int {
    return a * b
}


package main
import "testing"

// 测试用例名称一般命名为 Test 加上待测试的方法名
// 测试用的参数有且只有一个，在这里是 t *testing.T
func TestAdd(t *testing.T) {
	if ans := Add(1, 2); ans != 3 {
		t.Errorf("1 + 2 expected be 3, but %d got", ans)
	}
	if ans := Add(-10, -20); ans != -30 {
		t.Errorf("-10 + -20 expected be -30, but %d got", ans)
	}
}

$ go test

```

子测试:对一个函数以不同条件测试

```go
func TestMul(t *testing.T) {
	t.Run("pos", func(t *testing.T) {
		if Mul(2, 3) != 6 {
			t.Fatal("fail")
		}

	})
	t.Run("neg", func(t *testing.T) {
		if Mul(2, -3) != -6 {
			t.Fatal("fail")
		}
	})
}

```

可以用range循环


## 反射


reflect.TypeOf()
reflect.ValueOf()



## 桌面软件开发

```go
go install github.com/wailsapp/wails/v2/cmd/wails@latest

wails doctor // 验证安装


wails init -n myproject -t vanilla
// 或
wails init -n myproject -t vanilla-ts


wails dev  // 运行
wails build // 编译项目

```

gcc-g++ 
gcc-core package

https://www.msys2.org/  
```cmd
pacman -Syu
pacman -S mingw-w64-x86_64-gcc mingw-w64-x86_64-gcc-fortran
```


`go mod init name` 这里的name即module名和编译后exe时的命名

主包=index.js，用main声明



## GUI界面开发

```cmd

go install github.com/wailsapp/wails/v2/cmd/wails@latest

wails doctor

wails init -n myproject -t vanilla
wails init -n myproject -t vanilla-ts

```




## 网络应用



## GO 内置包学习



### net/http

用go将目录
```go
// 用于将特定URL 模式与处理函数进行关联 支持通配符，但不支持正则
func HandleFunc(pattern string, handler func(ResponseWriter, *Request))
// 将特定 URL 模式与实现了 http.Handler 接口的对象关联
func Handle(pattern string, handler Handler)

// 手动写入内容
func index(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello, World!")
}
http.HandleFunc("/", index) "/" // 根路径=网站首页 调用index函数写入客户端访问站点时的响应
// 或实用已有的html 文件
// 如果指定目录下有"index.html"，访问根路径时将返回该文件的内容
dir := "."
fs := http.FileServer(http.Dir(dir)) 
http.Handle("/", fs)
```

```go
func Get(url string) (resp *Response, err error)
func Head(url string) (resp *Response, err error)
func Post(url, contentType string, body io.Reader) (resp *Response, err error)
func PostForm(url string, data url.Values) (resp *Response, err error)

resp, err := http.<METHOD>(ARGS)


```