$(document).ready(function (){
    xcaptchaChangeCaptchaImage();
});

function init()
{
    $('#MessageDiv').empty();
    $('#MessageDiv').hide();
}
function SendMessageMsg() {
    var Attempt = $("#Attempt").val();

        if (!Attempt) {
            $("#captchavalidation").show();
            return false;
        }
        $('#MessageDiv').empty();
        $('#MessageDiv').hide();
        $("#SendMessageWaitSpinner").show();
        $('#ButtonDiv').hide();
        $("#captchavalidation").empty();
        $("#divcaptcha").hide();

  
    
        var result = false;     
        result= isValidCaptcha();
      

        return result;
        
    }
function DisplaySendMessageMsg(result) { 
    $('#MessageDiv').html(result.Message); 
    $('#MessageDiv').show();

    $("#SendMessageWaitSpinner").hide();
    $('#ButtonDiv').show();

    if ($('#contactfrm').length > 0) {
        document.getElementById("contactfrm").reset();
    }
    $('#Name').val('');
    $('#Email').val('');
    $('#Message').val('');
    $('#Attempt').val('');
    if ($("#Subject").length) {
        $('#Subject').val('');
    }
    GetImage();
    window.setTimeout("init()", 4000);
    $('#SendMessageBtn').prop('disabled', false);
}



    $(function () {
        $("#-xcaptcha-refresh").hide();
        $("#-xcaptcha-image").css({ height: "33px" });
    })


    function noenter() {
        // if (window.event.keyCode==8 || window.event.keyCode==46)

        $("#captchavalidation").hide();
        $('#SendMessageBtn').prop('disabled', false);
    return !(window.event && window.event.keyCode == 13);
}
    $('#Attempt').mousedown(function () {
        $("#captchavalidation").hide();
        $('#SendMessageBtn').prop('disabled', false);

    })

    function GetImage() {
    var solutionUrl = '/Account/EncryptedCaptchaSolution';
    var imageUrl = '/Account/CaptchaImage' + '?solution=';
    $.get(solutionUrl, null, function (data) {
        var src = imageUrl + data;
        $('#-xcaptcha-hidden').val(data);
        $('#-xcaptcha-image').attr("src", src);
    });
}


    function xcaptchaSetCaptchaImage(solutionUrl, imageUrl) {


        $.ajaxSetup({ cache: false });
        $.get(solutionUrl, null,

            function (data) {

                var src = imageUrl + data;

                $('#-xcaptcha-hidden').val(data);

                $('#-xcaptcha-image').attr("src", src);

            });
    }

    function xcaptchaChangeCaptchaImage() {
        var s = '/Account/EncryptedCaptchaSolution';
        var i = '/Account/CaptchaImage?encryptedSolution=';
        xcaptchaSetCaptchaImage(s, i);

    };
    $('#-xcaptcha-refresh').click(function () {


        xcaptchaChangeCaptchaImage();
        return false;

    });
              
 
    function isValidCaptcha() {
        var Captchtext = $("#CaptchaTextResource").val();
        var EncrypedSolution = $("#-xcaptcha-hidden").val();
        var Attempt = $("#Attempt").val();
        var result = false;
         var CaptchaObject = new Object();
        CaptchaObject.Attempt = Attempt;
        CaptchaObject.EncrypedSolution = EncrypedSolution;
       

        $('#SendMessageBtn').prop('disabled', true);
        $("#ButtonDiv").hide();
        $("#registerProcess").show();
        $.ajax({
            async: false,
            type: 'POST',
            url: '/UserJoin/isCaptchaValid',
            data: JSON.stringify(CaptchaObject),
            contentType: "application/json",
            dataType: 'json',
            success: function (response) {
                var str = $(response.Message).text().replace(/[^a-zA-Z ]/g, "");
                var res = str.slice(str.length - 7);
               
                if (response.IsValid == false) {
                    if (res == "invalid") {
                        $("#captchavalidation").html(Captchtext);

                    }
                    else {
                        $("#captchavalidation").html($(response.Message).text());
                    }
                   
                    $("#divcaptcha").show();
                    $("#captchavalidation").show();
                    $("#SendMessageWaitSpinner").hide();
                    $('#ButtonDiv').show();
                }
                else
                {
                    result = true;
                    $('#SendMessageBtn').prop('disabled', false);
                }

            },
            error: function (xhr) {
                //alert("Something went wrong while getting profile details, Please refresh the page");
            }
        });

        return result;
    }

    

