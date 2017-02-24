// All the common variables
var client_id = setting['client_id'];
var client_secret = setting['client_secret'];
var $own_table_content = $('#own-table-content');
var $own_get_users = $('.own-get-users');


// All the common functions

$.ajaxCall = function(url, method, data, handleData) {
    var settings = {
        "async": true,
        "crossDomain": false,
        "url": url,
        "method": method,
        "headers": {
            "authorization": "Bearer " + localStorage.accessToken,
            "cache-control": "no-cache",
        },
        "contentType": "application/json",
        "data": data,
        success: function(response) {
            handleData(response);
        }
    };

    $.ajax(settings)
}

$.logout = function() {
    var url = "/api/v1/auth/revoke-token?client_id=" + client_id + "&client_secret=" + client_secret + "&token=" + localStorage.accessToken

    var res = $.ajaxCall(url, "POST", "", function(response){
        window.location.href = '/login';
    })
};

$.displayJSONUser = function(listOfJson) {

    // check for any children elements if there then first delete them all
    if ($own_table_content.children().length > 0) {
        $own_table_content.hide();
        $own_table_content.empty();
    }

    $own_table_content.append("<div class='ui right floated small primary labeled icon button own-add-user' style='margin-bottom: 2em'><i class='user icon'></i> Add User</div><table class='ui compact celled definition green table'><thead class='full-width'><tr><th>User Name</th><th>First Name</th><th>Last Name</th><th>Email Address</th><th>Action</th></tr></thead><tbody>")

    $.each(listOfJson, function(i, item) {
        $('table').append("<tr id='" + listOfJson[i].id + "'><td class='user_name_a'><a href='#' class='user_name_aa'>" + listOfJson[i].username + "</a></td><td class='first_name'>" + listOfJson[i].first_name + "</td><td class='last_name'>" + listOfJson[i].last_name + "</td><td class='email_address'>" + listOfJson[i].email + "</td><td><button class='ui mini button' id='own-edit-button' style='background: #00ab6b; color:white'>Edit</button><button class='ui mini red button' id='own-delete-button'>Delete</button></td></tr>");
    });

    $('table').append("</tbody><tfoot class='full-width'><th></th><th colspan='5' style='color:grey'>Can only be seen by admin and user managers </th></tr></tfoot></table>")

    $own_table_content.fadeIn(300);
}

$.getAllUsers = function() {

    $.ajaxCall("/api/v1/devs/users/", "GET", "", function(output) {
        $.displayJSONUser(output);
    });
}

// All the common "on" functions
$(document).on('click', '#logout_button', function(data, response, xhr) {
    $.logout(); //  logout 
});

$(document).on('click', '.own-add-user', function(data, response, xhr) {
    $('.own-add-users-modal')
        .modal({
            blurring: false
        })
        .modal('show');
});


$(document).on('click', '.own-add-user-button', function(data, response, xhr) {

    var form = $(".own-add-user-form").serializeArray();
    var data = {};
    for (e of form) {
        data[e.name] = e.value;
    }
    data = JSON.stringify(data);
    // ajax call to add the user
    var url = "/api/v1/devs/users/";
    $.ajaxCall(url, "POST", data, function(output) {
        alert('user added');
        $.getAllUsers();
    });
});


//edit the info of user
var edit_users_id;

$(document).on('click', '#own-edit-button', function(data, response, xhr) {
    // get the id of the user
    edit_users_id = $(this).closest('tr').attr('id');

    $('.own-edit-users-modal')
        .modal({
            blurring: false
        })
        .modal('show');

    var user_info = $('#' + edit_users_id).find('td').slice(0, 5);
    $('#own-edit-user-name').val(user_info[0].innerText);
    $('#own-edit-first-name').val(user_info[1].innerHTML);
    $('#own-edit-last-name').val(user_info[2].innerHTML);
    $('#own-edit-email').val(user_info[3].innerHTML);

})

$(document).on('click', '.own-edit-user-button', function(data, response, xhr) {
    // ajax call to edit the contents
    var form = $(".own-edit-user-form").serializeArray();
    var data = {};
    for (e of form) {
        data[e.name] = e.value;
    }
    data = JSON.stringify(data);
    var url = "/api/v1/devs/users/" + edit_users_id + "/";
    $.ajaxCall(url, "PUT", data, function(output) {
        $.getAllUsers();
    });

})

// deleting a user

$(document).on('click', '#own-delete-button', function(data, response, xhr) {
    // get the id of the user
    var user_id_delete = $(this).closest('tr').attr('id');

    // ajax call to delete the user
    var url = "/api/v1/devs/users/" + user_id_delete
    $.ajaxCall(url, "DELETE", "", function(output) {
        $('#' + user_id_delete).hide(500, function() { $('#' + user_id_delete).remove(); });
    });
})

/*$(document).on('click', '#search_button_user', function(data, response, xhr) {
    alert($('#search_input_user').val());
});*/
