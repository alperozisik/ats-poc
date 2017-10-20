const extend = require('js-base/core/extend');
const FlexLayout = require('sf-core/ui/flexlayout');
const FeedItemDesign = require('library/FeedItem');
/*const reDate = /^(2\d{3})-([01]?\d)-([0-3]?\d)$/;*/
const FeedItem = extend(FeedItemDesign)(function(_super, props, pageName) {
    _super(this, props || FeedItemDesign.defaults);
    const feedItem = this;
    feedItem.pageName = pageName;
    for (let childName in feedItem.children) {
        let child = feedItem.children[childName];
        child.touchEnabled = false;
    }
    feedItem.bindData = function bindData(data) {
        // reDate.lastIndex = 0;
        // var dateArray = reDate.exec(data.actionDate.split(" ")[0]);
        var actionDate = data.actionDate.split(" ");
        feedItem.lblDate.text = actionDate.length > 0 ? actionDate[0] : "";
        feedItem.lblTitle.text = String(data.categoryDesc);
        feedItem.lblSubtitle.text = String(data.doctorName);
        feedItem.lblDescription.text = String(data.sectionName == 0 ? "" : data.sectionName);
    };
});

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
