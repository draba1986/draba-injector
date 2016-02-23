var expect = require('chai').expect;
var Injector = require('../');

describe('test-decode-entity-name', function () {
    it('It should be ok when passed a valid entity name', function () {
        expect(function () {
            expect(Injector.decodeEntityName('app.abc.edf')).has.property('entityName', 'app.abc.edf');
            expect(Injector.decodeEntityName('app.abc.edf')).has.property('propertyNames').that.is.a('array').and.length(0);
            expect(Injector.decodeEntityName('app.abc.edf')).has.property('entityFilename', 'app/abc/edf');
            expect(Injector.decodeEntityName('$app.abc.edf')).has.property('entityFilename', '$app/abc/edf');
            expect(Injector.decodeEntityName('app$.abc.edf')).has.property('entityFilename', 'app$/abc/edf');
            expect(Injector.decodeEntityName('app.abc.edf:a:b:c')).has.property('entityFilename', 'app/abc/edf');
            expect(Injector.decodeEntityName('app.abc.edf:a:b:c')).has.property('propertyNames').that.is.a('array').and.to.deep.equal(['a', 'b', 'c']);
        }).to.not.throws();
    });
    it('It should throw an error when passed a invalid entity name', function () {
        expect(function () {
            Injector.decodeEntityName('.app.abc.edf');
        }).to.throws();
        expect(function () {
            Injector.decodeEntityName('app.abc.edf.');
        }).to.throws();
        expect(function () {
            Injector.decodeEntityName('app..abc.edf');
        }).to.throws();
        expect(function () {
            Injector.decodeEntityName('app/abc.edf');
        }).to.throws();
        expect(function () {
            Injector.decodeEntityName('app.abc.edf:');
        }).to.throws();
    });
});