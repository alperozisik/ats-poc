const extend = require('js-base/core/extend');
const FlexLayout = require('sf-core/ui/flexlayout');
const ListViewLoadItemDesign = require('library/ListViewLoadItem');

const ListViewLoadItem = extend(ListViewLoadItemDesign)(
    //constructor
    function(_super, props, pageName) {
        // initalizes super class for this scope
        _super(this, props || ListViewLoadItemDesign.defaults);
        this.pageName = pageName;
    }

);

Object.assign(ListViewLoadItemDesign.defaults, {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    positionType: FlexLayout.PositionType.ABSOLUTE,
    width: NaN,
    height: NaN,
    designHeight: ListViewLoadItemDesign.defaults.height
});

module && (module.exports = ListViewLoadItem);
