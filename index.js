const grid = require('./Models/Grid')
const gridHeader = require('./Models/GridHeader')
const $ = require('jquery')

$.fn.cBoard = (data, gridHeader, take) => {
    const g = new grid(data, gridHeader, take)
    return g.build()
}

(function( $ ){
    $.extend($.fn, {
        cBoard: function(data, headers, take){
            const g = new grid(data, headers, take)
            this.append(g.build())
        }
    });
})( jQuery );

module.exports = {
    Grid: grid,
    GridHeader: gridHeader,
    jquery: $,
}