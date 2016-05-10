var _ = require('underscore');
var expect = require('chai').expect;
var Injector = require('../');

describe('test-inject-with-more-base-path', function () {
    it('It should has injected correct value when supply more basePath', function () {
        var entityName = 'example.types.array';
        var target = [entityName, function (arr) {
            return arr;
        }];

        var injector = new Injector(__dirname);
        var arr = injector.inject(target, {});
        expect(arr[0]).equals('The array');

        injector = new Injector(__dirname + '/example');
        var arr = injector.inject(target, {});
        expect(arr[0]).equals('The array inner');

        injector = new Injector([__dirname, __dirname + '/example']);
        var arr = injector.inject(target, {});
        expect(arr[0]).equals('The array');

        injector = new Injector([__dirname + '/example', __dirname]);
        var arr = injector.inject(target, {});
        expect(arr[0]).equals('The array inner');
    });
});