$(document).ready(function() {

    /*  Dependency functions */
    var client_id = "f8tBA9Iu5Pc5WuexrsxwWvHmIKQuwCIyLdfdfrIW"
    var client_secret = "cqv8cmrKUQjG6r5JyoFcrvB1M6epBe9MoPFlnlToSQueQqKTd1rvTwHOZQ14FtYwiGyDgDwGAxm7QqbB3cPTLShV1OxsuPuAGg4mfsWqkhYIEtBh1lBAYNE9tTUwzNr0"

    function logout() {
        var url = "/api/v1/auth/revoke-token?client_id=" + client_id + "&client_secret=" + client_secret + "&token=" + localStorage.accessToken
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": url,
            "method": "POST",
            "headers": {
                "authorization": "Bearer " + localStorage.accessToken,
                "cache-control": "no-cache",
            },
        }

        $.ajax(settings).done(function(response) {
            window.location.href = '/login';
        });
    }

    function getUserInfo() {
        var url = "/api/v1/user/info"
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": url,
            "method": "GET",
            "headers": {
                "authorization": "Bearer " + localStorage.accessToken,
                "cache-control": "no-cache",
            },
            "success": function(response) {
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
            },
            "error" :  function(response){
                window.location.href = '/login';
            }
        }

        $.ajax(settings);
    }

    getUserInfo();

    var currentTrips;
    var url = "/api/v1/trips/";
    var settings = {
        "async": true,
        "crossDomain": false,
        "url": url,
        "method": "GET",
        "headers": {
            "authorization": "Bearer " + localStorage.accessToken,
            "cache-control": "no-cache"
        }
    };

    $.ajax(settings).done(function(response) {
        currentTrips = response;
        console.log(response);
        $.mainFunction();
    })

    var $own_list_of_trips = $(".own-list-of-trips");

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
            $own_list_of_trips.append("<div class='item trip_item' id='" + listOfJson[i].id + "'><div class='ui small image'><img src='http://www.parisattitude.com/images/monuments.jpg'></div><div class='content'><a class='header' style='color: #00ab6b'>" + listOfJson[i].destination + "</a><i class='right " + listOfJson[i].mode + " big icon' style='color: grey'></i><div class='meta'><a>" + listOfJson[i].start_date + "</a><a>- " + listOfJson[i].end_date + "</a></div><div class='description'> " + listOfJson[i].comment + "</div><div class='extra'>" + noOfDays + "<div class='ui right floated icon'><div class='ui dropdown own-action-dropdown'><i class='right angle down large icon'></i><div class='menu'><div class='item edit_icon'><i class='edit icon'></i> Edit</div><div class='item delete_icon'> <i class='delete icon'></i> Delete</div></div></div></div></div></div></div>");
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


    /* Main Function */

    $.mainFunction = function() {

        /*  Infinite Scrolling using https://www.sitepoint.com/jquery-infinite-scrolling-demos/ */

        // display all the trips from the start

        $.displayJSON(currentTrips);
        $("#own-start-time").datetimepicker();
        $("#own-end-time").datetimepicker();
        $("#own-edit-start-time").datetimepicker();
        $("#own-edit-end-time").datetimepicker();

        $(document).on('click', '#logout_button', function(data, response, xhr) {
            logout();
        });

        $(document).on('click', '.button_admin', function(data, response, xhr) {
            window.location.href = '/admin';
        });

        $(document).on('click', '.button_staff', function(data, response, xhr) {
            window.location.href = '/manager';
        });




        /* Get the trips for a particular month */
        var $own_month_dropdown = $('.own-month-dropdown');
        $own_month_dropdown.dropdown('setting', 'onChange', function(month) {
            $.getDataForMonth(month);

        });

        /* Get the trips for a particular mode */
        var $own_mode_dropdown = $(".own-mode-dropdown");
        $own_mode_dropdown.dropdown('setting', 'onChange', function(mode) {
            $.getDataForMode(mode);
        });

        /* Get the Trips : Past or All*/
        var $own_trip_dropdown = $('.own-trip-dropdown');
        $own_trip_dropdown.dropdown('setting', 'onChange', function(trip_filter) {
            $.getDataForPast(trip_filter);

        });

        $('.own-action-dropdown').dropdown();
        $('#logout_dropdown').dropdown();

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


        /* Add Button Clicked */

        $own_add_button.on('click', function(data, response, xhr) {
            $own_add_modal
                .modal({
                    blurring: false
                })
                .modal('show');
        });

        // Delete a particular trip

        $(document).on('click', '.delete_icon', function(data, response, xhr) {

            // detect the delete button click for which id of the trip
            var trip_id_delete = $(this).closest('.trip_item').attr('id');

            // delete from the database
            var url = "/api/v1/trips/" + trip_id_delete
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": url,
                "method": "DELETE",
                "headers": {
                    "authorization": "Bearer " + localStorage.accessToken,
                    "cache-control": "no-cache",
                },
            }

            $.ajax(settings).done(function(response) {
                // delete from the currentTrips list
                $.each(currentTrips, function(i, item) {
                    if (item.id == parseInt(trip_id_delete)) {
                        currentTrips.splice(i, 1);
                        return false;
                    }
                });

                // delete from the DOM
                $('#' + trip_id_delete).hide('slow', function() { $('#' + trip_id_delete).remove(); });
            });
        });

        // Edit a particular trip

        // Edit Button Clicked for a particular Element .... get its Id
        var edit_trip_id;
        $(document).on('click', '.edit_icon', function(data, response, xhr) {

            edit_trip_id = $(this).closest('.trip_item').attr('id');
            $own_edit_modal
                .modal({
                    blurring: false
                })
                .modal('show');

            $.each(currentTrips, function(i, item) {
                if (item.id == parseInt(edit_trip_id)) {
                    $('#own-edit-destination').val(item.destination);
                    $('#own-edit-start-time').val(item.start_date);
                    $('#own-edit-end-time').val(item.end_date);
                    $('#own-edit-transport-mode').val(item.mode);
                    $('#own-edit-comment').val(item.comment);
                    return false;
                }
            });
        });

        $(document).on('click', '.own-edit-trip-button', function(data, response, xhr) {

            // edit from the database

            var url = "/api/v1/trips/" + edit_trip_id + "/";
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": url,
                "method": "PUT",
                "headers": {
                    "authorization": "Bearer " + localStorage.accessToken,
                    "cache-control": "no-cache",
                },
            }

            $.ajax(settings).done(function(response) {
                // edit from the currentTrips list
                $.each(currentTrips, function(i, item) {
                    if (item.id == parseInt(edit_trip_id)) {
                        item.destination = $('#own-edit-destination').val();
                        item.start_date = $('#own-edit-start-time').val();
                        item.end_date = $('#own-edit-end-time').val();
                        item.mode = $('#own-edit-transport-mode').val();
                        item.comment = $('#own-edit-comment').val();
                        return false;
                    }
                });

                // delete from the DOM
                $.displayJSON(currentTrips);
            });


        });

        var $own_mode_trans_dropdown = $(".own-mode-trans-dropdown");
        var $own_edit_mode_trans_dropdown = $(".own-edit-mode-trans-dropdown");

        $own_mode_trans_dropdown.dropdown('setting', 'onChange', function(mode) {;
        })
        $own_edit_mode_trans_dropdown.dropdown('setting', 'onChange', function(mode) {;
        })

        $(document).on('click', '#add-trip-btn', function(data, response, xhr) {
            var form = $("#add-trip-form").serializeArray();
            var data = {};
            for (e of form) {
                data[e.name] = e.value;
            }
            data = JSON.stringify(data);
            console.log(data);

            var url = "/api/v1/trips/";
            var settings = {
                "async": true,
                "crossDomain": false,
                "url": url,
                "method": "POST",
                "headers": {
                    "authorization": "Bearer " + localStorage.accessToken,
                    "cache-control": "no-cache",
                },
                "contentType": "application/json",
                "data": data,
            };

            $.ajax(settings).done(function(response, err) {
                console.log(err);
                currentTrips.unshift({
                    'id': response.id,
                    'destination': response.destination,
                    'start_date': response.start_date,
                    'end_date': response.end_date,
                    'mode': response.mode,
                    'comment': response.comment,
                })
                $.displayJSON(currentTrips);

            });
        })

    };

})
