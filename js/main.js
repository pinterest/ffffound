window.pAsyncInit = function() {
    PDK.init({
        appId: "4895760147810366778",
        cookie: true
    });
};

(function(d, s, id){
    var js, pjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://assets.pinterest.com/sdk/sdk.js";
    pjs.parentNode.insertBefore(js, pjs);
}(document, 'script', 'pinterest-jssdk'));

function importFFFFound(username) {
    var data = {'ffffound_username': username};
    PDK.request('/me/ffffound/', 'POST', data, function(response) {
        if (!response || response.error) {
            setErrorUnknownMessage();
            hideLoadingScreen();
            return;
        }

        var data = response.data;
        if (data['success'] != true && data['reason'] != undefined) {
            setErrorMessage(data['reason']);
            hideLoadingScreen();
        }
        else if (data['success'] != true) {
            setErrorUnknownMessage();
            hideLoadingScreen();
        }
        else {
            urlForImportBoard(function(url) {
                $('#success .button').attr('href', url);
                transitionToStepThree()
            });
        }
    });
}

function setErrorMessage(text) {
    $('#ffffound_error').text(text);
}

function setErrorUnknownMessage() {
    setErrorMessage('An unknown error occurred. Please try again!');
}

function transitionToStepTwo(animated) {
    var duration = animated? 200: 0;
    $('#intro').fadeOut(duration, function() {
        $('#ffffound').fadeIn(duration);
    });
}

function transitionToStepThree() {
    var duration = 200;
    $('#ffffound').fadeOut(duration, function() {
        $('#success').fadeIn(duration);
    });
}

function showLoadingScreen(completion) {
    $('#loading_screen').fadeIn(200, completion);
}

function hideLoadingScreen() {
    $('#loading_screen').fadeOut(200);
    $('#loading_screen').css('display', 'none');
}

function urlForImportBoard(completion) {
    PDK.me(function(response) {
        if (!response || response.error) {
            setErrorUnknownMessage();
            hideLoadingScreen();
            return;
        }

        var url = response.data.url + 'ffffound-import/'
        completion(url);
    });
}

$(function() {
    $('#login').click(function() {
        PDK.login({
            scope: "write_public,read_public",
            redirect_uri: "https://pinterest.github.io/ffffound"
        }, function(session) {
            if (session == undefined) {
                alert('There was a problem authenticating with Pinterest. Please try again!');
            }
            else {
                transitionToStepTwo(true);
            }
        });
    });

    $('#ffffound_import').click(function() {
        var username = $('#username').val();
        if (username.length == 0) {
            setErrorMessage('Please enter a username.')
            return;
        }

        setErrorMessage('');
        showLoadingScreen(function () {
            importFFFFound(username);
        });
    });
});

