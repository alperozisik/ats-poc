/* globals lang */
require("i18n/i18n.js"); // Generates global lang object

const Application = require("sf-core/application");

// Set uncaught exception handler, all exceptions that are not caught will
// trigger onUnhandledError callback.
Application.onUnhandledError = function(e) {
    alert({
        title: lang.applicationError,
        message: e.message + "\n\n*" + e.sourceURL + "\n*" + e.line + "\n*" + e.stack
    });
};


const Router = require("sf-core/ui/router");
const stylerBuilder = require("library/styler-builder");
const settings = require("./settings.json");
stylerBuilder.registerThemes(settings.config.theme.themes || "Defaults");
stylerBuilder.setActiveTheme(settings.config.theme.currentTheme);
require("sf-extension-utils");

Application.onReceivedNotification = function(e) {
    e && e.remote && alert("Notification: " + JSON.stringify(e.remote), "Notification recieved");
};


Router.add("pgLogin", require("./pages/pgLogin"), true);
Router.add("pgFeed", require("./pages/pgFeed"), true);
Router.add("pgDoctorAppointment", require("./pages/pgDoctorAppointment"));
Router.add("pgBookAppointment", require("./pages/pgBookAppointment"));
Router.add("pgBookAppointmentDate", require("./pages/pgBookAppointmentDate"));

Router.go("pgLogin", {
    appStart: true
});
/**/
/*
Router.add("pgCalendar", require("./pages/pgCalendar"));
Router.go("pgCalendar", {
    appStart: true
});

/**/
