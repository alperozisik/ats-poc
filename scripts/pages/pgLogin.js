/* globals SMF*/
const extend = require('js-base/core/extend');
const PgLoginDesign = require('ui/ui_pgLogin');
const fingerprint = require("sf-extension-utils").fingerprint;
const Router = require('sf-core/router');
const rau = require("sf-extension-utils").rau;
const userService = require("../services/user");
const appData = require("../lib/appData");

const PgLogin = extend(PgLoginDesign)(
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
function onShow(superOnShow, data = {}) {
    superOnShow();
    const page = this;

    if (data.appStart) {
        fingerprint.init({
            userNameTextBox: page.userNameInput,
            passwordTextBox: page.passwordInput,
            autoLogin: true,
            callback: fingerprintCallback.bind(page)
        });
        rau.checkUpdate({
            silent: false,
        });
    }

    SMF.i18n.bindLanguage("pgLogin", page);

    appData.patientId = null;
    page.aiLogin.visible = false;
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
    superOnLoad();

    this.imgLogo.onTouchEnded = () => {
        this.userNameInput.text = "smartface";
        this.passwordInput.text = "123456";
    };

    this.btnLogin.onPress = () => {
        fingerprint.loginWithFingerprint();
    };
}


function fingerprintCallback(err, fingerprintResult) {
    const page = this;
    var password;
    if (err)
        password = page.passwordInput.text;
    else
        password = fingerprintResult.password;
    if (!password)
        return alert("password is required");
    page.aiLogin.visible = true;
    page.btnLogin.enabled = false;
    loginWithUserNameAndPassword(page.userNameInput.text, password, function(err, patientId) {
        page.aiLogin.visible = false;
        page.btnLogin.enabled = true;
        if (err)
            return alert("Cannot login. Check user name and password. Or system is down");
        fingerprintResult && fingerprintResult.success(); //Important!
        Router.go('pgFeed', {
            patientId
        });
    });
}

function loginWithUserNameAndPassword(username, password, callback) {

    userService.login(username, password).then((patientId) => {
        callback(null, patientId);
    }).catch((err) => {
        if (err.message) {
            alert(err.message);
        }
        else {
            alert("cannot login");
        }
    });
}

module && (module.exports = PgLogin);
