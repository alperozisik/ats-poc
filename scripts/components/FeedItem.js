const extend = require('js-base/core/extend');
const FlexLayout = require('sf-core/ui/flexlayout');
const FeedItemDesign = require('library/FeedItem');

const FeedItem = extend(FeedItemDesign)(function(_super, props, pageName) {
        _super(this, props || FeedItemDesign.defaults);
        const feedItem = this;
        feedItem.pageName = pageName;
        for(let childName in feedItem.children) {
            let child = feedItem.children[childName];
            child.touchEnabled = false;
        }
    }
);

Object.assign(FeedItemDesign.defaults, {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    positionType: FlexLayout.PositionType.ABSOLUTE,
    width: NaN,
    height: NaN,
    designHeight: FeedItemDesign.defaults.height
});

module && (module.exports = FeedItem);
