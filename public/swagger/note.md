#API文档方案
> 文档记录；code->doc doc->code
[swagger](http://www.razorer.com/2016/10/16/swagger-intro/)
> 以文档为接口契约核心（而非code）
+ swagger-ui
+ swagger-editor
+ swagger-codegen

### 设计协议，生成server代码（mocker）
	build swagger-ui
	build swagger-editor
	修改默认模版，在editor的spec-files下
	生成nodejsserver
		调整yaml里的baseurl和schema
		generate server->[对应的版本]

## slate
