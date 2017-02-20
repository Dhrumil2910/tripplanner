var client_id = "f8tBA9Iu5Pc5WuexrsxwWvHmIKQuwCIyLdfdfrIW"
var client_secret = "cqv8cmrKUQjG6r5JyoFcrvB1M6epBe9MoPFlnlToSQueQqKTd1rvTwHOZQ14FtYwiGyDgDwGAxm7QqbB3cPTLShV1OxsuPuAGg4mfsWqkhYIEtBh1lBAYNE9tTUwzNr0"

$(document).ready(function() {
    checkIfAuthenticated();

    jQuery(document).on('click', ".own-login-button", function(data, response, xhr) {
        $('.own-login-modal')
            .modal({
                blurring: true
            })
            .modal('show');
    });

    jQuery(document).on('click', ".own-register-button", function(data, response, xhr) {
        $('.own-register-modal')
            .modal({
                blurring: true
            })
            .modal('show');
    });

    jQuery(document).on('click', "#own-login", function(data, response, xhr) {
        login();
    });

    jQuery(document).on('click', "#facebook-login", function(data, response, xhr) {
        loginFacebook();
    });

    jQuery(document).on('click', "#google-login", function(data, response, xhr) {
        loginGoogle();
    });

    jQuery(document).on('click', "#own-register", function(data, response, xhr) {
        register();
    });

    function checkIfAuthenticated() {
        var url = "/api/v1/user/"
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": url,
            "method": "GET",
            "headers": {
                "authorization": "Bearer " + localStorage.accessToken,
                "cache-control": "no-cache",
            },
        }

        $.ajax(settings).done(function(response) {
            if (response === true) {
                window.location.href = '/';
            }
        });
    }

    function _login(data) {
        var url = "/api/v1/auth/token?client_id=" + client_id + "&client_secret=" + client_secret + "&grant_type=password&username=" + data.username + "&password=" + data.password
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": url,
            "method": "POST",
            "headers": {
                "cache-control": "no-cache",
            }
        }

        $.ajax(settings).done(function(response) {
            localStorage.accessToken = response.access_token;
            window.location.href = "/";
        });
    }

    function login() {
        var form = $("#own-login-form").serializeArray();
        var data = {};
        for (e of form) {
            data[e.name] = e.value;
        }
        console.log(data);
        _login(data);
    }

    function register() {
        var form = $("#own-register-form").serializeArray();
        var data = {};
        for (e of form) {
            data[e.name] = e.value;
        }
        console.log(data);
        var url = "/register";
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": url,
            "method": "POST",
            "headers": {
                "cache-control": "no-cache",
            },
            "data": data
        }

        $.ajax(settings).done(function(response) {
            _login(data);
        });
    }

    function loginGoogle() {
        //
    }

    function loginFacebook() {
        var url = "/api/v1/auth/login/facebook";
        var w = window.open(url, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
    }

    function fetchURL(url) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": url,
            "method": "method",
            "headers": {
                "authorization": "Bearer " + localStorage.accessToken,
                "cache-control": "no-cache",
            },
        }

        $.ajax(settings).done(function(response) {
            console.log(response);
        });
    }

});

function loginFacebookRedirect(token) {
    var data = {
        'token': token,
        'backend': 'facebook',
        'client_secret': client_secret,
        'client_id': client_id,
        'grant_type': 'convert_token',
    }
    var url = "/api/v1/auth/convert-token"

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "post",
        "data": data,
    }

    $.ajax(settings).done(function(response) {
        localStorage.accessToken = response.access_token;
        window.location.href = '/';
    });
}
