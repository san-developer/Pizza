(function () {
    var app = angular.module("App");
    app.factory("Phrases", function () {

        function Phrases() {
            this.List = [];
            this.Sync = {};
        }

        return (Phrases);
    });

    app.factory("Languages", function () {
        function Languages() {
            this.AvailableLanguages = [];
            this.CurrentLang = null;
        }
        Languages.prototype.GetLangByAbbr = function (abbr) {
            return this.AvailableLanguages.length > 0 ? _.find(this.AvailableLanguages, function (item) { return item.Abbreviature == abbr }) : null;
        }

        return (Languages);

    });

    app.factory("Language", function (AppSvc) {

        function Language(id, abbr) {
            var _this = this;
            this.Abbreviature = abbr;
            this.ID = id;
            this.GetPhrase = function (phrase) {
                var _obj = _.find(AppSvc.Phrases.List, function (p) { return p.Name.toLowerCase() == phrase.toLowerCase() });
                if (_obj) {
                    var _langObj = _.find(_obj.Values, function (item) {
                        return item.LangID == _this.ID;
                    });
                }
                return _langObj ? _langObj.Value : '';
            };
        }

        return (Language);

    });

})();