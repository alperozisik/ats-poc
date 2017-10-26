const extend = require('js-base/core/extend');
const PgLogin2Design = require('ui/ui_pgLogin2');
const Color = require('sf-core/ui/color');
const FlexLayout = require('sf-core/ui/flexlayout');
const TextAlignment = require('sf-core/ui/textalignment');
var usingLtr = true;

const PgLogin2 = extend(PgLogin2Design)(
    // Constructor
    function(_super) {
        // Initalizes super class for this page scope
        _super(this);
        // overrides super.onShow method
        this.onShow = onShow.bind(this, this.onShow.bind(this));
        // overrides super.onLoad method
        this.onLoad = onLoad.bind(this, this.onLoad.bind(this));

    });

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(superOnShow) {
    superOnShow();
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
    superOnLoad();

    const page = this;

    page.layout.backgroundColor = Color.createGradient({
        startColor: Color.create("#72d5ff"),
        endColor: Color.create("#505275"),
        direction: Color.GradientDirection.DIAGONAL_LEFT
    });

    page.btnLogin.backgroundColor = Color.createGradient({
        startColor: Color.create("#acf3e3"),
        endColor: Color.create("#69bcac"),
        direction: Color.GradientDirection.DIAGONAL_LEFT
    });

    page.lblArabic.onTouchEnded = function() {
        if (usingLtr) {
            page.layout.direction = FlexLayout.Direction.RTL;
            setRtl(page);
            page.lblArabic.left = page.lblArabic.right;
            page.lblArabic.right = NaN;
            page.tbUserName.textAlignment = TextAlignment.MIDRIGHT;
            page.tbPassword.textAlignment = TextAlignment.MIDRIGHT;
            page.lblSupport.textAlignment = TextAlignment.MIDRIGHT;
            page.lblSignup.textAlignment = TextAlignment.MIDLEFT;
            page.lblArabic.text = "English";
        }
        else {
            page.layout.direction = FlexLayout.Direction.LTL;
            setLtl(page);
            page.lblArabic.right = page.lblArabic.left;
            page.lblArabic.left = NaN;
            page.tbUserName.textAlignment = TextAlignment.MIDLEFT;
            page.tbPassword.textAlignment = TextAlignment.MIDLEFT;
            page.lblSupport.textAlignment = TextAlignment.MIDLEFT;
            page.lblSignup.textAlignment = TextAlignment.MIDRIGHT;
            page.lblArabic.text = "العربية";
        }
        usingLtr = !usingLtr;
        page.layout.applyLayout();
    };

}

function setRtl(component) {
    if (!component.direction)
        return;
    component.direction = FlexLayout.Direction.RTL;

    if (component.children) {
        for (var i in component.children) {
            setRtl(component.children[i]);
        }
    }
}

function setLtl(component) {
    if (!component.direction)
        return;
    component.direction = FlexLayout.Direction.LTR;

    if (component.children) {
        for (var i in component.children) {
            setLtl(component.children[i]);
        }
    }
}



module && (module.exports = PgLogin2);
