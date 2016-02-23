# draba-injector #

依赖注入模块，用来分离应用程序中的组件，或用来测试。

require是nodejs默认的模块加载组件，耦合性非常强，非常不利于单元测试。

下面介绍一个简单的例子来展示此模块的用法（具体代码见tests目录）

目录结构

    /example
        /recursive
            entityA.js
            entityB.js
            entityC.js
            entityD.js

依赖关系：

    entityA依赖entityB
    entityB依赖entityC和entityD

entityA.js的内容

    module.exports = ['example.recursive.entityB', function (entityB) {
    }];

entityB.js的内容

    module.exports = ['example.recursive.entityC', 'example.recursive.entityD', function (entityC, entityD) {
    }];

entityC.js的内容

    module.exports = [function () {
        return 4;
    }];

entityD.js的内容

    module.exports = [function () {
        return 8;
    }];

如何加载使用

    var Inject = require('draba-injector');
    var injector = new Injector(__dirname+'/tests');
    var app = injector.inject(['example.recursive.entityA', function (entityA) {
        return {entityA:entityA};
    }]);

## 规则 ##

### 目标： ###

格式如下：

    [entityName1, entityName2,..., function (entity1, entity2,...) {
    }]

### 实体： ###

等同于组件

格式如下：

    实体名称格式为 RegExp('^[0-9a-z_$\-]+([.][0-9a-z_$\-]+)*(:[0-9a-z_$\-]+)*$', 'i')
    实体名称会被解析成路径，每一个"."被替解析成“/”，加上basePath前缀做路径得到实体的文件路径

## Api ##

### Constructor Injector ###

params:

    @basePath <string> the basePath of the Injector

### Injector.prototype.inject ###

params:

    @target <array> the main component which will be injected
    @injectionData <undefined|object> the predefined data that will be injected to the target