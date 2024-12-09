var JoinSource = $("#JoinSource").val();
var PanelId = $("#PanelId").val();
var IPId = $('#ipid').val();
var SessionId = $('#hdnSessionId').val();
var allowAccounts = [16, 3];

function saveUserJourney(quest) {
    var questtionId = 0;
    var accId = $('#AccountId').val();
    if (allowAccounts.indexOf(parseInt(accId)) < 0) {
        return;
    }
    if (quest.id == 'btnSubmit') {
        quest.value = 'Submit';
    }
    if (quest.value.length > 0) {
        var JSONObj = {};
        JSONObj.AccountId = accId;
        JSONObj.PanelId = $("#PanelId").val();
        JSONObj.IPId = IPId;
        JSONObj.SessionId = SessionId;
        JSONObj.Reason = '';
        var browser = GetBrowser();
        if (quest.id == -5) {
            JSONObj.Answer = quest.value;
            JSONObj.BrowserName = '';
            JSONObj.BrowserVersion = '';
            JSONObj.QuestionId = quest.id;
            $.ajax({
                async: true,
                type: 'POST',
                url: '/UserJoin/DeleteUserJourney',
                data: JSON.stringify({ 'userData': JSON.stringify(JSONObj) }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (response) {

                },
                error: function (xhr) {

                }
            });
            return;
        }

        if (quest.id == 'Attempt' && quest.value.length > 1) {
            questtionId = -1;
        }
        else if (quest.id == 'termsChekBbox') {
            questtionId = -2;
        }
        else if (quest.id == 'yesconsent') {
            questtionId = -3;
            quest.value = 'Yes';
        }
        else if (quest.id == 'noconsent') {
            questtionId = -3;
            quest.value = 'No';
        }
        else if (quest.id == 'btnSubmit') {
            questtionId = 0;
            quest.value = 'Submit';
        }
        else if (quest.id == 'SelectLanguage') {
            questtionId = -4;
            quest.value = $("#SelectLanguage option:selected").val();;
        }
        else if (quest.id == -6) {
            JSONObj.Answer = 'Failed';
            JSONObj.Reason = quest.value;
            questtionId = quest.id;
        }
        else {
            questtionId = quest.id;
        }

        JSONObj.BrowserName = browser.name;
        JSONObj.BrowserVersion = browser.majorVersion;
        JSONObj.QuestionId = questtionId;
        if (quest.multiple) {
            $("#" + quest.id).parent().find('li').each(function () {
                if ($(this).hasClass("active")) {
                    var answer = $(this).children().children().children().val();
                    if (answer != 'multiselect-all') {
                        if (typeof JSONObj.Answer == 'undefined') {
                            JSONObj.Answer = answer;
                        }
                        else {
                            JSONObj.Answer = JSONObj.Answer + "," + answer;
                        }
                    }
                }
            });
        }
        else {
            JSONObj.Answer = quest.value;
        }

        if (typeof JSONObj.Answer != 'undefined' && JSONObj.QuestionId != "reviewAnsVal") {
            if (quest.id == 303 || quest.id == 302) {
                JSONObj.Answer = '';
            }
            $.ajax({
                async: true,
                type: 'POST',
                url: '/UserJoin/SaveUserJourney',
                data: JSON.stringify({ 'userData': JSON.stringify(JSONObj) }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (response) {

                },
                error: function (xhr) {

                }
            });
        }
    }
}

function GetBrowser() {
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName = navigator.appName;
    var fullVersion = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;
    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = nAgt.substring(verOffset + 5);
    }
    // In Chrome, the true version is after "Chrome" 
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset + 7);
    }
    // In Safari, the true version is after "Safari" or after "Version" 
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    // In Firefox, the true version is after "Firefox" 
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset + 8);
    }
    // In most other browsers, "name/version" is at the end of userAgent 
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() == browserName.toUpperCase()) {
            browserName = navigator.appName;
        }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(";")) != -1)
        fullVersion = fullVersion.substring(0, ix);
    if ((ix = fullVersion.indexOf(" ")) != -1)
        fullVersion = fullVersion.substring(0, ix);

    majorVersion = parseInt('' + fullVersion, 10);
    if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }
    return {
        name: browserName,
        majorVersion: majorVersion,
        fullVersion: fullVersion
    };

    //var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    //if (/trident/i.test(M[1])) {
    //    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    //    return { name: 'IE', version: (tem[1] || '') };
    //}
    //if (M[1] === 'Chrome') {
    //    tem = ua.match(/\bOPR|Edge\/(\d+)/)
    //    if (tem != null) { return { name: 'Opera', version: tem[1] }; }
    //}
    //M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    //if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
    //return {
    //    name: M[0],
    //    version: M[1]
    //};
}
