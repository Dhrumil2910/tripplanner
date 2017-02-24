var $own_get_user_mang = $('.own-get-user-mang');
var $own_get_all_trips = $('.own-get-all-trips');
var $own_edit_trip_modal = $('.own-edit-trip-button');
var search_item = "users";

$("#own-edit-start-time").datetimepicker();
$("#own-edit-end-time").datetimepicker();
$('.own-edit-mode-trans-dropdown').dropdown();
$("#own-add-start-time").datetimepicker();
$("#own-add-end-time").datetimepicker();
$('.own-add-mode-trans-dropdown').dropdown();
$('.own-search-dropdown').dropdown(
    'setting', 'onChange',
    function(filter) {
        search_item = filter;
    });

$.displayJSONUserMang = function(listOfJson) {

    // check for any children elements if there then first delete them all
    if ($own_table_content.children().length > 0) {
        $own_table_content.hide();
        $own_table_content.empty();
    }

    $own_table_content.append("<div class='ui right floated small primary labeled icon button own-add-um' style='margin-bottom: 2em'><i class='user icon'></i> Add User Manager</div><table class='ui compact celled definition green table'><thead class='full-width'><tr><th>User Name</th><th>First Name</th><th>Last Name</th><th>Email Address</th><th>Action</th></tr></thead><tbody>")

    $.each(listOfJson, function(i, item) {
        $('table').append("<tr id='" + listOfJson[i].id + "'><td class='um_user_name'>" + listOfJson[i].username + "</td><td class='um_first_name'>" + listOfJson[i].first_name + "</td><td class='um_last_name'>" + listOfJson[i].last_name + "</td><td class='um_email_address'>" + listOfJson[i].email + "</td><td><button class='ui mini button' id='own-edit-um-button' style='background: #00ab6b; color:white'>Edit</button><button class='ui mini red button' id='own-delete-um-button'>Delete</button></td></tr>");
    });

    $('table').append("</tbody><tfoot class='full-width'><th></th><th colspan='5' style='color:grey'>Can only be seen by admin</th></tr></tfoot></table>")

    $own_table_content.fadeIn(300);

}

$.displayJSONTrips = function(listOfJson) {

    // check for any children elements if there then first delete them all
    if ($own_table_content.children().length > 0) {
        $own_table_content.hide();
        $own_table_content.empty();
    }

    $own_table_content.append("<div class='ui right floated small primary labeled icon button own-add-trip' style='margin-bottom: 2em'><i class='user icon'></i> Add Trip</div><table class='ui compact celled definition green table'><thead class='full-width'><tr><th></th><th>Destination</th><th>Start Date</th><th>End Date</th><th>Mode</th><th>Comment</th><th>Action</th></tr></thead><tbody>")

    $.each(listOfJson, function(i, item) {
        $('table').append("<tr id='" + listOfJson[i].id + "'><td class='trip_owner'> " + listOfJson[i].owner + " </td><td class='trip_destination'>" + listOfJson[i].destination + "</td><td class='trip_start_date'>" + listOfJson[i].start_date + "</td><td class='trip_end_date'>" + listOfJson[i].end_date + "</td><td class='trip_mode'>" + listOfJson[i].mode + "</td><td class='trip_comment'>" + listOfJson[i].comment + "</td><td><button class='ui mini button' id='own-edit-trip' style='background: #00ab6b; color:white'>Edit</button><button class='ui mini red button' id='own-delete-trip-button'>Delete</button></td></tr>");
    });

    $('table').append("</tbody><tfoot class='full-width'><th></th><th colspan='6' style='color:grey'>Can only be seen by admin</th></tr></tfoot></table>")

    $own_table_content.fadeIn(300);
}

$.getAllTrips = function() {
    $.ajaxCall("/api/v1/devs/trips/", "GET", "", function(output) {
        $.displayJSONTrips(output);
    });
}

$.getAllUserMang = function() {
    $.ajaxCall("/api/v1/devs/users?staff=true", "GET", "", function(output) {
        $.displayJSONUserMang(output);
    });
}
