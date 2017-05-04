----------------
[swagger](http://www.jianshu.com/p/d6626e6bd72c)


----------------
//TODO:
用户管理
推送
微信
第三方开放平台
IM
----------------
### 161202:
+ 增加apikey授权认证配置(api_warrant.json)和校验机制
+ 调整api路径和middleware策略
+ 调整error handler错误信息提取规则
+ error handler日志现在区分5xx和非5xx

### 161205
+ now `POY Dashboar` available
---
make a POY DashBoard
	POY营收目标进度概览（revenue target progress overview）
		形式：仪表盘
		按照季度／半年／全年
	POY营收组成组成分析（revenue composition analysis）
		按渠道（实现网，xxx，xxx。。。）
		按类型（兼职，大包，单包）
		按价格（1以下，1-3，3-5，5-10，10以上）
	POY营收趋势（revenue trend）
		柱状图：同比环比

### 161209
增加api-admin配置
添加跨域访问middleware，并允许对api-admin进行跨域访问

###161210
移除error handler中的next()调用
增加data-operator和admin-data-teller，支持通用数据操作(bug have critical security issues!)

### 161213
+ 增加console
+ 增加包含状态机视图的网络功能
+ 增加登录认证，自动跳转至登录／主界面机制
+ 修复getAsync/postAsync中不支持大于两个路由处理端问题
+ 增加对session的支持
+ 现在可以使用admin登录了
+ 为fetch添加credentials: 'include'已支持携带cookie信息


### 161214
+ 跨域问题，见crossOrigin中的配置，注意：如果支持fetch的Credentials验证，Access-Control-Allow-Origin配置成*会失效，必须指定对应的域名才可以
+ 修复：为find和destroy操作增加`paranoid: true`,兼容paranoid规则的设定
+ console支持ExtendOperation了，可以向外打开指定tab和传入指定参数

### 161215
+ 修改登录／注册／修改密码部分，现在能正确触发session更新并返回token了（对应用户信息移到userProfile节点）
+ syncFromPersist现在在server.startup中执行（放在外侧不起作用！）

### 161220
+ 数据详情支持insert／update操作
+ 支持表单上传图片（fake via 桥接）

### 161221
+ 支持列表导出为excel（find的规则，注意要copy {page-fields-config}到`assets/pages-config`下，且命名中的后实体名称部分要与modal的entityName文件名想同（不是表名称））

### 161222
+ data-list支持按照单列排序

### 170217
+ 增加env配置机制
+ 增加针对error日志的appender

### 170218
+ 增加autoapply，可以自动化区分配置
+ 现在apiWarrant的配置由json迁移到自适应环境配置文件
+ 将日志输出和file-session的存储位置配置在env中，dev模式存储于`.tmp`目录中
+ 现在可以在env中配置ugc和admin上传图片的存储路径了
+ admin静态图片访问已经支持middleware的adminAuth授权校验

### 170409
+ fix迁移产生的bug



### Roadmap
+ Step.1:实际业务支撑实战
	+ a).复刻places-server
+ Step.2:深度优化架构
	+ a).微服务化
	+ b).微服务模块部署自动化
	+ c).微服务治理

+ Step.Anytime
	+ a).基准性能benchmark
	+ b).[node-cron](https://github.com/kelektiv/node-cron)
	+ c).通过roadhogrc设置dev web 容器具备代理访问功能


