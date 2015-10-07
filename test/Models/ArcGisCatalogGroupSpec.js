'use strict';

/*global require,describe,it,expect,beforeEach*/
var ArcGisCatalogGroup = require('../../lib/Models/ArcGisCatalogGroup');
var createCatalogMemberFromType = require('../../lib/Models/createCatalogMemberFromType');
var Terria = require('../../lib/Models/Terria');

describe('ArcGisCatalogGroup', function() {
    var terria;
    var group;
    beforeEach(function() {
        terria = new Terria({
            baseUrl: './'
        });
        group = new ArcGisCatalogGroup(terria);
    });

    it('should have hiearchy', function(done) {
        group.url = "test/GetCapabilities/example.json";

        group.load().then(function() {
            expect(group.items.length).toBe(9);
            var first = group.items[0];
            expect(first.items.length).toBe(5);
            expect(first.items[0].name).toContain('All');

            done();
        });

    });
});
