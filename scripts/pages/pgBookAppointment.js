const extend = require('js-base/core/extend');
const PgBookAppointmentDesign = require('ui/ui_pgBookAppointment');
const Color = require('sf-core/ui/color');
const Router = require("sf-core/ui/router");
const FlCardDesign = require('library/FlCard');
const flCardPlaceHeight = (FlCardDesign.defaults.height || 0) + (FlCardDesign.defaults.marginTop || 0) + (FlCardDesign.defaults.marginBottom || 0);
const Animator = require('sf-core/ui/animator');
const System = require('sf-core/device/system');
const Picker = require("sf-core/ui/picker");

const departments = [
    "Department A",
    "Department B",
    "Department C",
    "Department D",
    "Department E",
];

const doctors = [
    "Doctor 1",
    "Doctor 2",
    "Doctor 3",
    "Doctor 4",
    "Doctor 5",
];

const appointmentType = [
    "Appointment Type X",
    "Appointment Type Y",
    "Appointment Type Z",
];

const PgBookAppointment = extend(PgBookAppointmentDesign)(
    // Constructor
    function(_super) {
        _super(this);
        this.onShow = onShow.bind(this, this.onShow.bind(this));
        this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
        const page = this;

        page.flCardDepartment.lblTitle.text = "Select Department";
        page.flCardDoctor.lblTitle.text = "Select Doctor";
        page.flCardAppointmentType.lblTitle.text = "Select Appointmnet Type";
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

    if (data.new) {
        page.btnNext.height = 0;
        let svCardsPaddingTop = isNaN(page.svCards.layout.paddingTop) ? 20 : page.svCards.layout.paddingTop;
        page.flCardDoctor.initialTop = (svCardsPaddingTop + flCardPlaceHeight * 2) * 1;
        page.flCardAppointmentType.initialTop = (svCardsPaddingTop + flCardPlaceHeight * 3) * 1;

        page.flCardDoctor.top = page.flCardDoctor.initialTop;
        page.flCardAppointmentType.top = page.flCardAppointmentType.initialTop;
        page.svCards.layout.applyLayout();
    }
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
    superOnLoad();
    const page = this;
    page.headerBar.itemColor = Color.create("#104682");
    page.android.onBackButtonPressed = function() { Router.goBack() };

    const animationRootView = System.OS === "iOS" ? page.layout : page.svCards.layout;
    page.flCardDepartment.btnSelect.onPress = function() {
        var pickerOptions = {
            items: departments
        };
        var index = departments.indexOf(page.flCardDepartment.btnSelect.text);
        if (index !== -1)
            pickerOptions.currentIndex = index;
        var myPicker = new Picker(pickerOptions);

        function okCallback(params) {
            page.flCardDepartment.btnSelect.text = departments[params.index];
            page.btnNext.height = 0;
            var svCardsPaddingTop = isNaN(page.svCards.layout.paddingTop) ? 20 : page.svCards.layout.paddingTop;
            page.flCardDoctor.top = svCardsPaddingTop + flCardPlaceHeight;
            page.flCardDoctor.btnSelect.text = "Select";
            page.flCardDoctor.alpha = 0.2;
            page.flCardAppointmentType.top = page.flCardAppointmentType.initialTop;
            Animator.animate(animationRootView, 250, function() {
                page.flCardDoctor.top = -5;
                page.flCardDoctor.alpha = 1;
            }).then(80, function() {
                page.flCardDoctor.top = 4;
            }).then(60, function() {
                page.flCardDoctor.top = -4;
            }).then(30, function() {
                page.flCardDoctor.top = 3;
            }).then(20, function() {
                page.flCardDoctor.top = +3;
            }).then(15, function() {
                page.flCardDoctor.top = 2;
            }).then(10, function() {
                page.flCardDoctor.top = -2;
            }).then(5, function() {
                page.flCardDoctor.top = 1;
            }).complete(function() {
                page.flCardDoctor.top = 0;
            });
        }
        myPicker.show(okCallback, cancelCallback);
    };

    page.flCardDoctor.btnSelect.onPress = function() {
        var pickerOptions = {
            items: doctors
        };
        var index = doctors.indexOf(page.flCardDoctor.btnSelect.text);
        if (index !== -1)
            pickerOptions.currentIndex = index;
        var myPicker = new Picker(pickerOptions);

        function okCallback(params) {
            page.flCardDoctor.btnSelect.text = doctors[params.index];
            page.btnNext.height = 0;
            var svCardsPaddingTop = isNaN(page.svCards.layout.paddingTop) ? 20 : page.svCards.layout.paddingTop;
            page.flCardAppointmentType.top = svCardsPaddingTop + (flCardPlaceHeight * 2);
            page.flCardAppointmentType.btnSelect.text = "Select";
            page.flCardAppointmentType.alpha = 0.2;
            // page.flCardAppointmentType.top = page.flCardAppointmentType.initialTop;
            Animator.animate(animationRootView, 250, function() {
                page.flCardAppointmentType.top = -5;
                page.flCardAppointmentType.alpha = 1;
            }).then(80, function() {
                page.flCardAppointmentType.top = 4;
            }).then(60, function() {
                page.flCardAppointmentType.top = -4;
            }).then(30, function() {
                page.flCardAppointmentType.top = 3;
            }).then(20, function() {
                page.flCardAppointmentType.top = +3;
            }).then(15, function() {
                page.flCardAppointmentType.top = 2;
            }).then(10, function() {
                page.flCardAppointmentType.top = -2;
            }).then(5, function() {
                page.flCardAppointmentType.top = 1;
            }).complete(function() {
                page.flCardAppointmentType.top = 0;
            });
        }
        myPicker.show(okCallback, cancelCallback);
    };

    page.flCardAppointmentType.btnSelect.onPress = function() {
        var pickerOptions = {
            items: appointmentType
        };
        var index = appointmentType.indexOf(page.flCardAppointmentType.btnSelect.text);
        if (index !== -1)
            pickerOptions.currentIndex = index;
        var myPicker = new Picker(pickerOptions);

        function okCallback(params) {
            page.flCardAppointmentType.btnSelect.text = appointmentType[params.index];

            Animator.animate(page.layout, 250, function() {
                page.btnNext.height = 70;
            });
        }
        myPicker.show(okCallback, cancelCallback);
    };

    page.btnNext.onPress = function() {
        Router.go("pgBookAppointmentDate");
    };
}

function cancelCallback() {}

module && (module.exports = PgBookAppointment);
