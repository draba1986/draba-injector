var path = require('path');
var fs = require('fs');

var _ = require('underscore');
var DepGraph = require('dependency-graph').DepGraph;

var ROOT_ENTITY_NAME = '.';

var Injector = function (basePath) {
    basePath = _.isString(basePath) ? [basePath] : basePath;
    this._basePath = basePath;
};
Injector.prototype._basePath = [];
var decodeEntityName = Injector.decodeEntityName = (function () {
    var dotRegex = new RegExp('[.]', 'g');
    var entityNameRegex = new RegExp('^[0-9a-z_$\-]+([.][0-9a-z_$\-]+)*(:[0-9a-z_$\-]+)*$', 'i');
    return function (entityName) {

        if (!_.isString(entityName) || !entityNameRegex.test(entityName)) {
            throw new TypeError('Invalid entityName!');
        }
        var itemSplit = entityName.split(':');
        var entityObject = {
            entityName: entityName
        };
        entityObject.entityFilename = itemSplit[0].replace(dotRegex, '/');
        entityObject.propertyNames = itemSplit.slice(1);
        return entityObject;
    }
}());
var decodeTarget = Injector.decodeTarget = function (target) {
    var entityObject = {
        dependencies: [],
        functionInjected: _.constant(target)
    };
    if (_.isArray(target)) {
        var last = _.last(target);
        if (_.isFunction(last)) {
            entityObject.dependencies = _.chain(target)
                .initial()
                .map(decodeEntityName)
                .value();
            entityObject.functionInjected = last;
        }
    }
    return entityObject;
};
Injector.prototype.inject = function (target, injectionData) {
    var that = this;
    var graph = new DepGraph();
    var currentEntityObject = _.extend({
        entityName: ROOT_ENTITY_NAME
    }, decodeTarget(target));
    var functionInjected = currentEntityObject.functionInjected;
    var dependencyIndexed = {};
    dependencyIndexed[currentEntityObject.entityName] = currentEntityObject;
    var dependency = [currentEntityObject];
    injectionData = injectionData || {};
    injectionData = _.map(injectionData, function (data, entityName) {
        dependencyIndexed[entityName] = _.extend(decodeEntityName(entityName), decodeTarget([_.constant(data)]));
        dependency.push(dependencyIndexed[entityName]);
    });
    var extensions = _.chain(require.extensions)
        .keys()
        .unshift('')
        .value();
    for (var i = 0; i < dependency.length; i++) {
        var entityObject = dependency[i];
        graph.addNode(entityObject.entityName);
        _.each(entityObject.dependencies, function (dependentTo) {
            var entityName = dependentTo.entityName;
            if (!(entityName in dependencyIndexed)) {
                var filename = _.chain(that._basePath)
                    .map(function (basePath) {
                        return _.map(extensions, function (ext) {
                            var filename = path.join(basePath, dependentTo.entityFilename + ext);
                            return filename;
                        });
                    }).flatten()
                    .filter(function (filename) {
                        try {
                            var fileStats = fs.statSync(filename);
                            return true;
                        } catch (err) {
                            return false;
                        }
                    }).first().value();
                if (!filename) {
                    throw new Error('Can not find module<' + entityName + '>');
                }
                var target = require(filename);
                dependencyIndexed[entityName] = _.extend(dependentTo, decodeTarget(target));
                dependency.push(dependencyIndexed[entityName]);
            }
        });
    }
    _.each(dependency, function (entityObject) {
        _.each(entityObject.dependencies, function (dependentTo) {
            graph.addDependency(entityObject.entityName, dependentTo.entityName);
        });
    });
    _.each(graph.overallOrder(), function (entityName) {
        var injection = _.map(dependencyIndexed[entityName].dependencies, function (dependentTo) {
            return _.reduce(dependentTo.propertyNames, function (memo, propertyName) {
                return _.isObject(memo) ? memo[propertyName] : memo;
            }, injectionData[dependentTo.entityName]);
        });
        injectionData[entityName] = dependencyIndexed[entityName].functionInjected.apply(null, injection);
    });
    return injectionData[currentEntityObject.entityName];
};
module.exports = Injector;