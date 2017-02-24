// All the global and non changing DOM elements initialization

var currentTrips;
var $own_list_of_trips = $(".own-list-of-trips");
var $own_add_button = $(".own-add-button");
var $own_add_modal = $(".own-add-modal");
var $own_edit_modal = $(".own-edit-modal")
var $own_range_start = $('#own-start-time');
var $own_range_end = $('#own-end-time');
var $own_range_edit_start = $('#own-edit-start-time');
var $own_range_edit_end = $('#own-edit-end-time');
var $own_destination = $('#own-destination');
var $own_edit_destination = $('#own-edit-destination');
var $own_comment = $('#own-comment');
var $own_edit_comment = $('#own-edit-comment');
var $own_transport_mode = $('#own-transport-mode');
var $own_edit_transport_mode = $('#own-edit-transport-mode');
var $own_mode_trans_dropdown = $(".own-mode-trans-dropdown");
var $own_edit_mode_trans_dropdown = $(".own-edit-mode-trans-dropdown");

$own_mode_trans_dropdown.dropdown('setting', 'onChange', function(mode) {;
})
$own_edit_mode_trans_dropdown.dropdown('setting', 'onChange', function(mode) {;
})

$.getNoOfDays = function(date) {
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = d.getFullYear() + '/' +
        (month < 10 ? '0' : '') + month + '/' +
        (day < 10 ? '0' : '') + day;
    var date1 = new Date(output);
    var date2 = new Date(date);
    var actualDiff = date2.getTime() - date1.getTime();
    if (actualDiff < 0) {
        return "<span style='background: #00ab6b; padding: 0.3em; border-radius: 7%'><b style='color:white'>Past Trip</b><span>";
    }
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return "No of Days left: " + diffDays;

}

$.getImageUrl = function(city) {
    // TODO
}

$.displayJSON = function(listOfJson) {

    // check for any children elements if there then first delete them all
    if ($own_list_of_trips.children().length > 0) {
        $own_list_of_trips.hide();
        $own_list_of_trips.empty();
    }

    $.each(listOfJson, function(i, item) {
        var re = /\d{4}\/\d{2}\/\d{2}/;
        var start_date = re.exec(listOfJson[i].start_date);
        var noOfDays = $.getNoOfDays(start_date);
        $own_list_of_trips.append("<div class='item trip_item' id='" + listOfJson[i].id + "'><div class='ui small image'><img src='http://www.parisattitude.com/images/monuments.jpg'></div><div class='content'><a class='header' style='color: #00ab6b'>" + listOfJson[i].destination + "</a><i class='right " + listOfJson[i].mode + " big icon' style='color: grey; margin-left:0.2em'></i><div class='meta'><a>" + listOfJson[i].start_date + "</a><a>- " + listOfJson[i].end_date + "</a></div><div class='description'> " + listOfJson[i].comment + "</div><div class='extra'>" + noOfDays + "<div class='ui right floated icon'><div class='ui dropdown own-action-dropdown'><i class='right angle down large icon'></i><div class='menu'><div class='item edit_icon'><i class='edit icon'></i> Edit</div><div class='item delete_icon'> <i class='delete icon'></i> Delete</div></div></div></div></div></div></div>");
        $own_list_of_trips.fadeIn(500);
        $('.own-action-dropdown').dropdown();
    });
}

$.getDataForMonth = function(month) {
    if (month == "All") {
        $.displayJSON(currentTrips);
    } else {
        // Filter for a particular month
        var reExp = new RegExp("\/" + month + "\/");
        var monthTrips = $(currentTrips).filter(function(i, n) {
            return reExp.test(n.start_date)
        });
        $.displayJSON(monthTrips);
    }
}

$.getDataForMode = function(mode) {
    if (mode == "All") {
        $.displayJSON(currentTrips);
    } else {

        // Filter for a particular mode
        var modeTrips = $(currentTrips).filter(function(i, n) {
            return n.mode === mode
        });
        $.displayJSON(modeTrips);
    }
}

$.getDataForPast = function(trip_filter) {
    if (trip_filter == "All") {
        $.displayJSON(currentTrips);
    } else {
        // Filter for a particular month
        var reExp = new RegExp("Past Trip");
        var filterTrips = $(currentTrips).filter(function(i, n) {
            var re = /\d{4}\/\d{2}\/\d{2}/;
            var start_date = re.exec(n.start_date);
            var no_of_days = $.getNoOfDays(start_date);
            return reExp.test(no_of_days);
        });
        $.displayJSON(filterTrips);
    }
}

$.getUserInfo = function() {
    var url = "/api/v1/user"
    $.ajaxCall(url, "GET", "", function(response) {
        if (response.detail == "Invalid token header. No credentials provided.") {
            window.location.href = '/login';
        }
        if (response.userType == 'admin') {
            $('.own-menu-bar').append("<div class='right menu'><div class='item'> <button class='ui button button_admin'>Go To Admin Portal</button></div><div class='ui item' style='color: grey'><div></div class='ui dropdown logout_dropdown'> Hello! " + response.userName + " <div class='menu'><div class='ui button item' id='logout_button'>Logout</div></div> </div></div>");
        } else if (response.userType == 'staff') {
            $('.own-menu-bar').append("<div class='right menu'><div class='item'> <button class='ui button button_staff'>Go To Staff Portal</button></div><div class='ui item' style='color: grey'><div></div class='ui dropdown logout_dropdown'> Hello! " + response.userName + " <div class='menu'><div class='ui button item' id='logout_button'>Logout</div></div> </div></div>");
        } else {
            $('.own-menu-bar').append("<div class='right menu'><div class='ui item' style='color: grey'><div></div class='ui dropdown logout_dropdown'> Hello! " + response.userName + " <div class='menu'><div class='ui button item' id='logout_button'>Logout</div></div> </div></div>");

        }
    });
}


$.getAllTrips = function() {
    var url = "/api/v1/trips/";
    $.ajaxCall(url, "GET", "", function(response) {
        currentTrips = response;
        $.mainFunction();
    });
}
