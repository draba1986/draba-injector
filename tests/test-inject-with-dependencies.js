var _ = require('underscore');
var expect = require('chai').expect;
var Injector = require('../');

describe('test-inject-with-dependencies', function () {
    it('It should has injected correct dependencies value', function () {
        var entityName1 = 'a.b.c';
        var entityName2 = 'b.c.d';
        var data = {};
        data[entityName1] = 123;
        data[entityName2] = 456;
        var func = function () {
            expect(arguments[0]).to.equal(data[entityName1]);
            expect(arguments[1]).to.equal(data[entityName2]);
            return data[entityName1] + data[entityName2];
        };
        var target = [entityName1, entityName2, func];
        var injector = new Injector(__dirname);
        var injectedData = injector.inject(target, data);
        expect(injectedData).to.equal(data[entityName1]+data[entityName2]);
    });
    it('It should has injected correct recursive dependencies value', function () {
        var target = ['example.recursive.entityA', function (entityA) {
            return entityA;
        }];
        var injector = new Injector(__dirname);
        var injectedData = injector.inject(target);
        expect(injectedData).to.equal(1|2|4|8);
    });
});