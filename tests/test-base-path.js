var path = require('path');

var expect = require('chai').expect;
var Injector = require('../');

describe('test-base-path', function () {
    it('It should be the same with _basePath and basePath which passed by parameter', function () {
        expect(Injector.prototype._basePath).to.equal('./');
        var basePath = __dirname;
        var injector = new Injector(basePath);
        expect(injector._basePath).to.equal(basePath);
    });
    it('It should be ok when inject a single file witch exists without any dependency', function () {
        var injector = new Injector(__dirname);
        var injected = injector.inject(['example.types.undefined', function (undefinedValue) {
            expect(undefinedValue).to.be.a('undefined');
        }]);
    });
    it('It should throw a Error when inject a single file that not in the path', function () {
        var injector = new Injector(path.dirname(__dirname));
        expect(function () {
            var injected = injector.inject(['example.types.undefined', function (undefinedValue) {
                expect(undefinedValue).to.be.a('undefined');
            }]);
        }).to.throws();
    });
});