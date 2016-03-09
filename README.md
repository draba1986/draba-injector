# draba-injector #

dependent injection module, used to help isolating components which will become more easily test
依赖注入模块，用来分离应用程序中的组件，或用来测试。

"require" is the default module in Node.js, but more dependencies, and hard to test
require是nodejs默认的模块加载组件，耦合性非常强，非常不利于单元测试。

follow is a example, more code in the "tests" directory
下面介绍一个简单的例子来展示此模块的用法（具体代码见tests目录）

directory
目录结构

    /example
        /recursive
            entityA.js
            entityB.js
            entityC.js
            entityD.js

dependency:
依赖关系：

    "entityA" dependents to "entityB"
    "entityB" dependents to "entityC" and "entityD"

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

how to use
如何加载使用

    var Inject = require('draba-injector');
    var injector = new Injector(__dirname+'/tests');
    var app = injector.inject(['example.recursive.entityA', function (entityA) {
        return {entityA:entityA};
    }]);

## rule规则 ##

### target目标： ###

格式如下：

    [entityName1, entityName2,..., function (entity1, entity2,...) {
    }]

### entity实体： ###

same to component
等同于组件

格式如下：

    format is RegExp('^[0-9a-z_$\-]+([.][0-9a-z_$\-]+)*(:[0-9a-z_$\-]+)*$', 'i')
    实体名称格式为 RegExp('^[0-9a-z_$\-]+([.][0-9a-z_$\-]+)*(:[0-9a-z_$\-]+)*$', 'i')
    entity name will be parsed to a path by replace "." to "/"
    实体名称会被解析成路径，每一个"."被替解析成“/”，加上basePath前缀做路径得到实体的文件路径

## Api ##

### Constructor Injector ###

params:

    @basePath <string> the basePath of the Injector

### Injector.prototype.inject ###

params:

    @target <array|other> the main component which will be injected;if not an array, directly return
    @injectionData <undefined|object> the predefined data that will be injected to the target