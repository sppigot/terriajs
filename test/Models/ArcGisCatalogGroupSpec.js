'use strict';

/*global require,describe,beforeEach,it,afterEach,expect*/
var Terria = require('../../lib/Models/Terria');
var ArcGisCatalogGroup = require('../../lib/Models/ArcGisCatalogGroup');

var loadJson = require('terriajs-cesium/Source/Core/loadJson');

describe('ArcGisCatalogGroup', function() {
    var terria;
    var group;
    beforeEach(function() {
        terria = new Terria({
            baseUrl: './'
        });
        group = new ArcGisCatalogGroup(terria);
    });

    it('creates hierarchy of catalog items', function(done) {
        group.url = 'test/GetCapabilities/example.json';
        group.load().then(function() {
            expect(group.items.length).toBe(9);
            var first = group.items[0];
            expect(first.items.length).toBe(5);
            expect(first.items[0].name).toContain('All');

            done();
        });
    });

    it('creates flat list of catalog items if requested', function(done) {
        group.url = 'test/GetCapabilities/example.json';
        group.flatten = true;

        group.load().then(function() {
            expect(group.items.length).toBe(76);
            done();
        });
    });
});
