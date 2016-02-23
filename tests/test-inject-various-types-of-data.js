var _ = require('underscore');
var expect = require('chai').expect;
var Injector = require('../');

describe('test-inject-various-types-of-data', function () {
    it('It should be ok when injected to array', function () {
        var injector = new Injector(__dirname);
        var data = injector.inject(['example.types.array', _.identity]);
        expect(data).to.be.a('array').and.length(1);
        expect(data[0]).to.equal('The array');
    });
    it('It should be ok when injected to an object', function () {
        var injector = new Injector(__dirname);
        var data = injector.inject(['example.types.object', _.identity]);
        expect(data).to.be.a('object').and.has.property('message', 'The object');
    });
    it('It should be ok when injected an undefined', function () {
        var injector = new Injector(__dirname);
        var data = injector.inject(['example.types.undefined', _.identity]);
        expect(data).to.be.a('undefined');
    });
    it('It should be ok when injected a array with a function in last item', function () {
        var injector = new Injector(__dirname);
        var data = injector.inject(['example.types.arrayForInjector', _.identity]);
        expect(data).to.be.a('string').and.equal('The arrayForInjector');
    });
    it('It should be ok when injected a function', function () {
        var injector = new Injector(__dirname);
        var data = injector.inject(['example.types.function', _.identity]);
        expect(data).to.be.a('string').and.equal('The function');
    });
});