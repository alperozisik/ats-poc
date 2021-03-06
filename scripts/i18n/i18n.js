/*globals SMF, Device*/
/* 
	"lang" variable is required for things like system level error messages and alert button messages.
	Current implementation tries to load the value found in the variable "Device.language".
	If this value is not defined, "SMF.i18n.switchLanguage" function tries to load the value given with "SMF.i18n.defaultLang", which is originally set to be "en".
	If that fails, first found key in "SMF.i18n.languageKV" is attempted to be loaded, and if nothing is found, then nothing is loaded.
	"SMF.i18n.languageKV" is populated by calling "SMF.i18n.defineLanguage".
	Required for BC
*/

const availbableLanguages = ["en", "ar", "tr"];

global.lang = {};
const dot = require('dot-object');
SMF.i18n = {
	currentLang: null,
	defaultLang: 'en',
	languageKV: {},
	get: function(key, languageCode) {
		languageCode = languageCode || this.currentLang;
		if (typeof this.languageKV[languageCode] === 'undefined') {
			return '';
		}
		return this.languageKV[languageCode][key];
	},
	defineLanguage: function(languageCode, obj) {
		this.languageKV[languageCode] = obj;
	},
	switchLanguage: function(languageCode) {
		if (typeof this.languageKV[languageCode] === 'undefined') {
			if (typeof this.languageKV[this.defaultLang] === 'undefined') {
				var languageCodes = Object.keys(this.languageKV);
				if (languageCodes.length === 0) {
					return;
				}
				// In case default options did not work, pick the first one.
				this.switchLanguage(languageCodes[0]);
			}
			else {
				this.switchLanguage(this.defaultLang);
			}
		}
		this.currentLang = languageCode;
		global.lang = this.languageKV[languageCode];
	},
	bindLanguage: function(baseName, targetObject) {
		const lang = global.lang;
		var keys = Object.keys(lang);
		var target = {};
		target[baseName] = targetObject;
		keys.forEach(key => {
			if (key.startsWith(baseName + ".")) {
				try {
					let valueGiven = dot.pick(key, target);
					let valueShouldBe = lang[key];
					if (valueGiven != valueShouldBe) {
						dot.set(key, valueShouldBe, target);
					}
				}
				catch (ex) {}
			}
		});

	}
};


availbableLanguages.forEach((lng) => require(`./${lng}`));
require('i18n/en.js');
require('i18n/tr.js');
require('i18n/ar.js');


SMF.i18n.switchLanguage(availbableLanguages.indexOf(Device.language) > -1 ? Device.language : availbableLanguages[0]);
