const extend = require('js-base/core/extend');
const PgBookAppointmentDesign = require('ui/ui_pgBookAppointment');
const Color = require('sf-core/ui/color');
const Router = require("sf-core/ui/router");
const FlCardDesign = require('library/FlCard');
const flCardPlaceHeight = (FlCardDesign.defaults.height || 0) + (FlCardDesign.defaults.marginTop || 0) + (FlCardDesign.defaults.marginBottom || 0);
const Animator = require('sf-core/ui/animator');
const System = require('sf-core/device/system');
const Picker = require("sf-core/ui/picker");
const cardService = require("../services/cards");

const PgBookAppointment = extend(PgBookAppointmentDesign)(
    // Constructor
    function(_super) {
        _super(this);
        this.onShow = onShow.bind(this, this.onShow.bind(this));
        this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
        const page = this;

        page.cards = [
            page.flCardDepartment,
            page.flCardDoctor,
            page.flCardAppointmentType,
            page.flCardPeriod
        ];
        page.contextData = [];


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
        page.cards.forEach((card, index) => {
            if (index === 0) {
                card.initialTop = 0;
            }
            else {
                card.initialTop = (svCardsPaddingTop + flCardPlaceHeight * (index + 1)) * 1;
            }
            card.top = card.initialTop;
            card.cardList = page.cards;
        });

        page.flCardDepartment.name = "flCardDepartment";
        page.flCardDoctor.name = "flCardDoctor";
        page.flCardAppointmentType.name = "flCardAppointmentType";
        page.flCardPeriod.name = "flCardPeriod";

        page.flCardDepartment.servicePromise = cardService.getClinic;
        page.flCardDoctor.servicePromise = cardService.getDoctorOfDepartments;
        page.flCardAppointmentType.servicePromise = cardService.getAppointmentsCategories;
        page.flCardPeriod.servicePromise = cardService.getAppointmentsPeriods;


        console.log(`flCardDepartment has servicePromise? ${!!page.flCardDepartment.servicePromise}`);
        console.log(`flCardDoctor has servicePromise? ${!!page.flCardDoctor.servicePromise}`);
        console.log(`flCardAppointmentType has servicePromise? ${!!page.flCardAppointmentType.servicePromise}`);
        console.log(`flCardPeriod has servicePromise? ${!!page.flCardPeriod.servicePromise}`);
        setTimeout(() => { loadDataToCard(page.cards[0], page.contextData, page); }, 450);

        page.svCards.layout.applyLayout();

        global.SMF.i18n.bindLanguage("pgBookAppointment", page);
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

    page.btnNext.onPress = function() {
        Router.go("pgBookAppointmentDate", {
            contextData: {
                clinicNo : page.contextData[0].clinicNo,
                doctorId: page.contextData[1].resourceId,
                categoryNo: page.contextData[2].categoryNo,
                periodNo: page.contextData[3].periodNo
            }
        });
    };
    page.cards.forEach((card, index) => {
        card.btnSelect.onPress = cardSelect.bind(page, card, index);
        card.servicePromise = null;
        card.setButtonVisible(false);
    });

}

function cardSelect(card, cardIndex) {
    const page = this;
    const cards = page.cards;
    const animationRootView = System.OS === "iOS" ? page.layout : page.svCards.layout;

    var pickerOptions = {
        items: card.data.texts
    };
    var pickerIndex = card.data.texts.indexOf(page.flCardDepartment.btnSelect.text);
    if (pickerIndex !== -1)
        pickerOptions.currentIndex = pickerIndex;
    var myPicker = new Picker(pickerOptions);
    var nextCard = cards[cardIndex + 1];
    var futureCards = cards.slice(cardIndex + 2);

    function okCallback(params) {
        card.btnSelect.text = card.data.texts[params.index];
        page.contextData[cardIndex] = card.data.full[params.index];
        page.contextData.length = cardIndex + 1;
        page.btnNext.height = 0;
        var svCardsPaddingTop = isNaN(page.svCards.layout.paddingTop) ? 20 : page.svCards.layout.paddingTop;
        futureCards.forEach(fCard => {
            fCard.top = fCard.initialTop;
        });
        if (nextCard) {
            nextCard.top = svCardsPaddingTop + flCardPlaceHeight;
            nextCard.btnSelect.text = "Select";
            nextCard.alpha = 0.2;
            Animator.animate(animationRootView, 250, function() {
                nextCard.top = -5;
                nextCard.alpha = 1;
            }).then(80, function() {
                nextCard.top = 4;
            }).then(60, function() {
                nextCard.top = -4;
            }).then(30, function() {
                nextCard.top = 3;
            }).then(20, function() {
                nextCard.top = +3;
            }).then(15, function() {
                nextCard.top = 2;
            }).then(10, function() {
                nextCard.top = -2;
            }).then(5, function() {
                nextCard.top = 1;
            }).complete(function() {
                loadDataToCard(nextCard, page.contextData, page);
                nextCard.top = 0;
            });
        }
        else {
            Animator.animate(page.layout, 250, function() {
                page.btnNext.height = 70;
            });
        }
    }
    myPicker.show(okCallback, cancelCallback);
}

function cancelCallback() {}

function loadDataToCard(card, contextData, page) {
    card.setButtonVisible(false);
    card.servicePromise && card.servicePromise(contextData).then(data => {
        card.btnSelect.text = global.lang.cardSelect;
        card.setButtonVisible(true);
        card.data = data;
    }).catch(err => {
        //card.setButtonVisible(true);
        console.log(`${card.name} data load error`);
    });
    page.svCards.layout.applyLayout();
    console.log(`${card.name} has servicePromise? ${!!card.servicePromise}`);
}

module && (module.exports = PgBookAppointment);
