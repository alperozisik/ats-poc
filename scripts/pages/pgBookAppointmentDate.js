/*globals Device */
const extend = require('js-base/core/extend');
const PgBookAppointmentDateDesign = require('ui/ui_pgBookAppointmentDate');
const Router = require("sf-core/ui/router");
const Calendar = require("@smartface/sf-calendar-component/components/Calendar");
const FlexLayout = require('sf-core/ui/flexlayout');
const Animator = require('sf-core/ui/animator');
const appointmentService = require("../services/appointment");
const Color = require('sf-core/ui/color');
const Picker = require("sf-core/ui/picker");
const waitDialog = require("../lib/waitDialog");
const System = require('sf-core/device/system');

const PgBookAppointmentDate = extend(PgBookAppointmentDateDesign)(
    // Constructor
    function(_super) {
        // Initalizes super class for this page scope
        _super(this);
        this.onShow = onShow.bind(this, this.onShow.bind(this));
        this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
        const page = this;
        const calendar = new Calendar();
        Object.assign(calendar, {
            width: NaN,
            top: NaN,
            bottom: NaN,
            left: NaN,
            right: NaN,
            height: NaN,
            flexGrow: 1,
            positionType: FlexLayout.PositionType.RELATIVE
        });
        page.calendar = calendar;
        page.flCalendarPlaceholder.addChild(calendar);
        page.flCalendarPlaceholder.removeChild(page.flWait);
        page.flCalendarPlaceholder.addChild(page.flWait);

        calendar.addStyles({
            ".calendar": {
                ".day": {
                    "parent": {
                        touchEnabled: false
                    },
                    "&-specialDay": {
                        backgroundColor: "#9DE188",
                        parent: {
                            touchEnabled: true
                        },

                    },
                    "&-weekend": {
                        "borderWidth": 0,
                        "textColor": "#111111"
                    }
                }
            }
        });


        calendar.onDaySelect = function(date) {
            hideBookButton(page);
            page.lblTime.text = global.lang["pgBookAppointmentDate.lblTime.text"];

            if (date.dayInfo.specialDay.length === 0) {
                page.calendar.setDate({ month: date.date.month, year: date.date.year });
                page.flTimePick.visible = false;
                hideBookButton(page);

                return;
            }
            if (!page.dateSelected) { //first time date selected in page
                page.data.date = `${date.date.year}-${date.date.month}-${date.date.day}`;
                page.flTimePick.visible = true;
                showTimePicker.call(page, page.data.date);
            }
        };

        calendar.onMonthChange = function(monthChangeArgs) {
            setAvailableDates.call(page, monthChangeArgs.year, monthChangeArgs.month);
        };

        calendar.onBeforeMonthChange = function(monthChangeArgs) {
            //return true;
            var dCurrent = new Date();
            dCurrent = new Date(`${dCurrent.getFullYear()}-${dCurrent.getMonth() + 1}-01`);
            var dNew = new Date(`${monthChangeArgs.year}-${monthChangeArgs.month}-01`);
            var result = Number(dNew) >= Number(dCurrent);
            return result;
        };
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
    global.SMF.i18n.bindLanguage("pgBookAppointmentDate", page);
    page.headerBar.itemColor = Color.create("#104682");
    page.data = data.contextData || {};
    var lang = Device.language;
    lang = lang === "ar" ? "ar-sa" : "en";
    page.calendar.changeCalendar(lang, lang === "en" ? "gregorian" : "hijri");
    setTimeout(() => {
        setAvailableDates.call(page);
    }, 450);
    page.flWait.visible = true;
    page.btnPickTime.visible = false;
    page.layout.applyLayout();

    /*System.OS === "iOS" && Animator.animate(page.layout, 100, function() {
        page.btnBook.height = 0.5;
    }).complete(function() { page.btnBook.height = 0; });*/

}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
    superOnLoad();
    const page = this;
    page.android.onBackButtonPressed = function() { Router.goBack() };
    page.btnBook.bottom = -70;

    page.btnBook.onPress = function() {
        waitDialog.show();
        appointmentService.bookAppointment(
            page.data.doctorId,
            page.data.slotSerial,
            page.data.categoryNo
        ).then(result => {

            waitDialog.hide();
            Router.goBack("pgFeed");
        }).catch(err => {
            waitDialog.hide();
            if (err.message)
                alert(err.message);
        });
    };


    page.flTimePick.visible = false;

}

function setAvailableDates(year, month) {
    const page = this;
    const data = page.data;
    var d = new Date();
    year = year || d.getFullYear();
    month = month || d.getMonth() + 1;
    // var lang = Device.language;
    // if(lang === "ar") {
    //     month--;
    // }

    page.flWait.visible = true;
    page.btnPickTime.visible = true;
    appointmentService.getAppointmentCount(data.clinicNo, data.doctorId, year, month).then(
        (result) => {
            let specialDays = {
                byMonths: [{
                    month: month,
                    days: []
                }]
            };
            result.forEach((dayData) => {
                if (dayData.apptAvailable > 0) {
                    let specialDateTempalte = {
                        "day": dayData.monthDay,
                        "calendars": {
                            "*": {
                                "availableLangs": "*",
                                "text": {
                                    "*": String(dayData.apptAvailable)
                                }
                            }
                        },
                        "length": 1
                    };
                    specialDays.byMonths[0].days.push(specialDateTempalte);
                }
            });

            var lang = Device.language; //System.language.subStr(0, 2);
            lang = lang === "ar" ? "ar-sa" : "en";
            page.calendar.changeCalendar(lang, lang === "en" ? "gregorian" : "hijri", specialDays);
            page.calendar.setDate({ month, year });
            page.flWait.visible = false;
        }).catch((err) => {});
}


function showTimePicker(date) {
    const page = this;
    page.flWaitTime.visible = true;
    page.btnPickTime.visible = false;
    const data = page.data;
    var doctorId = data.doctorId;
    var period = data.periodNo;
    appointmentService.getSlotTime(doctorId, period, date).then((result) => {
        /*var data = {
            full: result,
            texts: []
        };*/
        page.flWaitTime.visible = false;
        page.btnPickTime.visible = true;

        var pickerOptions = {
            items: result.texts
        };

        var pickerIndex = result.texts.indexOf(page.lblTime.text);
        if (pickerIndex !== -1)
            pickerOptions.currentIndex = pickerIndex;
        var myPicker = new Picker(pickerOptions);

        function okCallback(params) {
            page.lblTime.text = result.texts[params.index];
            page.data.slotSerial = result.full[params.index].slotSerial;
            showBookButton(page);
        }
        page.btnPickTime.onPress = function() {
            myPicker.show(okCallback, cancelCallback);
        };

    }).catch((err) => {

    });
}

function showBookButton(page) {
    Animator.animate(page.layout, 250, function() {
        page.btnBook.bottom = 0;
    });
}

function hideBookButton(page) {
    page.btnBook.bottom = -70;
    page.layout.applyLayout();
}

function cancelCallback() {}

module && (module.exports = PgBookAppointmentDate);
