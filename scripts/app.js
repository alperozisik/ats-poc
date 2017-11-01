/* globals lang */
require("i18n/i18n.js"); // Generates global lang object

const Application = require("sf-core/application");
const Notifications = require("sf-core/notifications");
// Set uncaught exception handler, all exceptions that are not caught will
// trigger onUnhandledError callback.
Application.onUnhandledError = function(e) {
    alert({
        title: lang.applicationError,
        message: e.message + "\n\n*" + e.sourceURL + "\n*" + e.line + "\n*" + e.stack
    });
};
const lng = global.Device.language;
const theme = require("./themes/Defaults.json");
//theme[".flexLayout"].flexProps.direction = lng === "ar" ? "LTR" : "LTR";
theme[".label"].flexProps.textAlignment = lng === "ar" ? "MIDRIGHT" : "MIDLEFT";
theme[".textBox"].flexProps.textAlignment = lng === "ar" ? "MIDRIGHT" : "MIDLEFT";
const Router = require("sf-core/ui/router");
const stylerBuilder = require("library/styler-builder");
const settings = require("./settings.json");
stylerBuilder.registerThemes(settings.config.theme.themes || "Defaults");
stylerBuilder.setActiveTheme(settings.config.theme.currentTheme);
require("sf-extension-utils");

Application.onReceivedNotification = function(e) {
    alert(JSON.stringify(arguments), "Notification recieved arguments");
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

// Router.add("pgLogin2", require("./pages/pgLogin2"), true);
// Router.add("pgAppointments2", require("./pages/pgAppointments2"), true);
// Router.go("pgLogin2", {
//     appStart: true
// });