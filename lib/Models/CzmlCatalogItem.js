'use strict';

/*global require*/

var CzmlDataSource = require('terriajs-cesium/Source/DataSources/CzmlDataSource');
var defined = require('terriajs-cesium/Source/Core/defined');
var defineProperties = require('terriajs-cesium/Source/Core/defineProperties');
var DeveloperError = require('terriajs-cesium/Source/Core/DeveloperError');
var knockout = require('terriajs-cesium/Source/ThirdParty/knockout');
var when = require('terriajs-cesium/Source/ThirdParty/when');

var Metadata = require('./Metadata');
var TerriaError = require('../Core/TerriaError');
var CatalogItem = require('./CatalogItem');
var inherit = require('../Core/inherit');
var proxyCatalogItemUrl = require('./proxyCatalogItemUrl');
var readJson = require('../Core/readJson');

/**
 * A {@link CatalogItem} representing Cesium Language (CZML) data.
 *
 * @alias CzmlCatalogItem
 * @constructor
 * @extends CatalogItem
 *
 * @param {Terria} terria The Terria instance.
 * @param {String} [url] The URL from which to retrieve the CZML data.
 */
var CzmlCatalogItem =  function(terria, url) {
    CatalogItem.call(this, terria);

    this._dataSource = undefined;

    this.url = url;

    /**
     * Gets or sets the CZML data, represented as a binary Blob, JSON object or array literal, or a Promise for one of those things.
     * If this property is set, {@link CatalogItem#url} is ignored.
     * This property is observable.
     * @type {Blob|Object|Promise|Array}
     */
    this.data = undefined;

    /**
     * Gets or sets the URL from which the {@link CzmlCatalogItem#data} was obtained.  This will be used
     * to resolve any resources linked in the CZML file, if any.
     * @type {String}
     */
    this.dataSourceUrl = undefined;

    knockout.track(this, ['data', 'dataSourceUrl']);

};

inherit(CatalogItem, CzmlCatalogItem);

defineProperties(CzmlCatalogItem.prototype, {
    /**
     * Gets the type of data member represented by this instance.
     * @memberOf CzmlCatalogItem.prototype
     * @type {String}
     */
    type : {
        get : function() {
            return 'czml';
        }
    },

    /**
     * Gets a human-readable name for this type of data source, 'Cesium Language (CZML)'.
     * @memberOf CzmlCatalogItem.prototype
     * @type {String}
     */
    typeName : {
        get : function() {
            return 'Cesium Language (CZML)';
        }
    },

    /**
     * Gets the metadata associated with this data source and the server that provided it, if applicable.
     * @memberOf CzmlCatalogItem.prototype
     * @type {Metadata}
     */
    metadata : {
        get : function() {
            var result = new Metadata();
            result.isLoading = false;
            result.dataSourceErrorMessage = 'This data source does not have any details available.';
            result.serviceErrorMessage = 'This service does not have any details available.';
            return result;
        }
    },
    /**
     * Gets the data source associated with this catalog item.
     * @memberOf CzmlCatalogItem.prototype
     * @type {DataSource}
     */
    dataSource : {
        get : function() {
            return this._dataSource;
        }
    }
});

CzmlCatalogItem.prototype._getValuesThatInfluenceLoad = function() {
    return [this.url, this.data];
};

CzmlCatalogItem.prototype._load = function() {
    var dataSource = new CzmlDataSource();
    this._dataSource = dataSource;

    var that = this;

    if (defined(that.data)) {
        return when(that.data, function(data) {
            if (typeof Blob !== 'undefined' && data instanceof Blob) {
                return readJson(data).then(function(data) {
                    return dataSource.load(data, proxyCatalogItemUrl(that, that.dataSourceUrl)).then(function() {
                        doneLoading(that);
                    });
                }).otherwise(function() {
                    errorLoading(that);
                });
            } else if (data instanceof String || typeof data === 'string') {
                return dataSource.load(JSON.parse(data), proxyCatalogItemUrl(that, that.dataSourceUrl)).then(function() {
                    doneLoading(that);
                });
            } else {
                return dataSource.load(data, proxyCatalogItemUrl(that, that.dataSourceUrl)).then(function() {
                    doneLoading(that);
                });
            }
        }).otherwise(function() {
            errorLoading(that);
        });
    } else {
        return dataSource.load(proxyCatalogItemUrl(that, that.url)).then(function() {
            doneLoading(that);
        }).otherwise(function() {
            errorLoading(that);
        });
    }
};

CzmlCatalogItem.prototype._enable = function() {
};

CzmlCatalogItem.prototype._disable = function() {
};

CzmlCatalogItem.prototype._show = function() {
    if (!defined(this._dataSource)) {
        throw new DeveloperError('This data source is not enabled.');
    }

    var dataSources =  this.terria.dataSources;
    if (dataSources.contains(this._dataSource)) {
        throw new DeveloperError('This data source is already shown.');
    }

    dataSources.add(this._dataSource);
};

CzmlCatalogItem.prototype._hide = function() {
    if (!defined(this._dataSource)) {
        throw new DeveloperError('This data source is not enabled.');
    }

    var dataSources =  this.terria.dataSources;
    if (!dataSources.contains(this._dataSource)) {
        throw new DeveloperError('This data source is not shown.');
    }

    dataSources.remove(this.dataSource, false);
};

function doneLoading(czmlItem) {
    czmlItem.clock = czmlItem._dataSource.clock;
    czmlItem.terria.currentViewer.notifyRepaintRequired();
}

function errorLoading(czmlItem) {
    var terria = czmlItem.terria;
    throw new TerriaError({
        sender: czmlItem,
        title: 'Error loading CZML',
        message: '\
An error occurred while loading a CZML file.  This may indicate that the file is invalid or that it \
is not supported by '+terria.appName+'.  If you would like assistance or further information, please email us \
at <a href="mailto:'+terria.supportEmail+'">'+terria.supportEmail+'</a>.'
    });
}

module.exports = CzmlCatalogItem;
