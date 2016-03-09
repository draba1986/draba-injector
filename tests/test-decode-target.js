var _ = require('underscore');
var expect = require('chai').expect;
var Injector = require('../');

describe('test-decode-target', function () {
    it('It should be ok when passed an constant target', function () {
        _.each([
            undefined,
            'string',
            1,
            {type:'object'},
            ['without a function in the last item']
        ], function (value) {
            var entityObject = Injector.decodeTarget(value);
            expect(entityObject.functionInjected()).to.equal(value);
        });
    });
    it('It should be ok when passed an array target', function () {
        var entityName1 = 'a.b.c';
        var entityName2 = 'b.c.d';
        var func = function () {};
        var target = [entityName1, entityName2, func];
        var entityObject = Injector.decodeTarget(target);
        expect(entityObject.dependencies).to.has.length(2);
        expect(entityObject.dependencies[0]).to.has.property('entityName', entityName1);
        expect(entityObject.dependencies[1]).to.has.property('entityName', entityName2);
        expect(entityObject.functionInjected).to.equal(func);
    });
    it('It should be ok when passed an function target', function () {
        var target = function () {};
        var entityObject = Injector.decodeTarget(target);
        expect(entityObject.dependencies).to.has.length(0);
        expect(entityObject.functionInjected()).to.equal(target);
    });
});