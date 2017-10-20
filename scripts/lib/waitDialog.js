const Dialog = require("sf-core/ui/dialog");
const ActivityIndicator = require('sf-core/ui/activityindicator');
const Color = require("sf-core/ui/color");
const FlexLayout = require('sf-core/ui/flexlayout');
const getCombinedStyle = require("library/styler-builder").getCombinedStyle;
const Screen = require('sf-core/device/screen');

const waitDialog = module.exports = exports = new Dialog();

Object.assign(waitDialog.layout, {
    backgroundColor: Color.create(60, 240, 240, 240),
    //alignContent: FlexLayout.AlignContent.CENTER,
    alignItems: FlexLayout.AlignItems.CENTER,
    justifyContent: FlexLayout.JustifyContent.CENTER,
    //height: Screen.height
});

var aiWait = new ActivityIndicator(getCombinedStyle(".activityIndicator",{
}));
aiWait.ios.type = ActivityIndicator.iOS.Type.WHITELARGE;    


waitDialog.layout.addChild(aiWait);
waitDialog.layout.applyLayout();