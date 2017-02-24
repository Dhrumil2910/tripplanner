$(document).ready(function() {

    $.mainFunction = function() {

        // Get all the users by default
        $.getAllUsers();

        // Get all the users on click
        $own_get_users.on('click', function(data, response, xhr) {
            // ajax call for getting all the users
            $.ajaxCall("/api/v1/devs/users/", "GET", "", function(output) {
                $.displayJSONUser(output);
                $own_get_users.addClass('active');
                $own_get_user_mang.removeClass('active');
                $own_get_all_trips.removeClass('active');
            });
        });

        // Get all the user managers========================================================================
        $own_get_user_mang.on('click', function() {

            $.ajaxCall("/api/v1/devs/users?staff=true", "GET", "", function(output) {
                $.displayJSONUserMang(output);
                $own_get_user_mang.addClass('active');
                $own_get_users.removeClass('active');
                $own_get_all_trips.removeClass('active');
            });
        })

        // add user manager

        $(document).on('click', '.own-add-um', function(data, response, xhr) {

            $('.own-add-um-modal')
                .modal({
                    blurring: false
                })
                .modal('show');

        });

        $(document).on('click', '.own-add-um-button', function(data, response, xhr) {

            var form = $(".own-add-um-form").serializeArray();
            var data = {};
            for (e of form) {
                data[e.name] = e.value;
            }
            data = JSON.stringify(data);
            // ajax call to add the user
            var url = "/api/v1/devs/users?staff=true";
            $.ajaxCall(url, "POST", data, function(output) {
                alert('user manager added');
                $.getAllUserMang();
            });
        });

        //edit the info of user
        var edit_um_id;

        $(document).on('click', '#own-edit-um-button', function(data, response, xhr) {
            // get the id of the user
            edit_um_id = $(this).closest('tr').attr('id');

            $('.own-edit-um-modal')
                .modal({
                    blurring: false
                })
                .modal('show');

            var um_info = $('#' + edit_um_id).find('td').slice(1, 5);
            $('#own-edit-um-user-name').val(um_info[0].innerText);
            $('#own-edit-um-first-name').val(um_info[1].innerHTML);
            $('#own-edit-um-last-name').val(um_info[2].innerHTML);
            $('#own-edit-um-email').val(um_info[3].innerHTML);

        })

        $(document).on('click', '.own-edit-um-button', function(data, response, xhr) {
                // ajax call to edit the contents

                var form = $(".own-edit-um-form").serializeArray();
                var data = {};
                for (e of form) {
                    data[e.name] = e.value;
                }
                data = JSON.stringify(data);
                // ajax call to add the user
                var url = "/api/v1/devs/users/" + edit_um_id + "/";
                $.ajaxCall(url, "PUT", data, function(output) {
                    alert('user manager added');
                    $.getAllUserMang();
                });

            })
            // delete a user manager

        $(document).on('click', '#own-delete-um-button', function(data, response, xhr) {
            // get the id of the user manager
            var um_id_delete = $(this).closest('tr').attr('id');

            // ajax call to delete the user
            var url = "/api/v1/devs/users/" + edit_um_id + "/";
            $.ajaxCall(url, "DELETE", "", function(output) {
                // update the container on success
                $('#' + um_id_delete).hide(500, function() { $('#' + um_id_delete).remove(); });
            });


        })

        // add a user trip ======================================================================

        $(document).on('click', '.own-add-trip', function(data, response, xhr) {

            $('.own-add-trips-modal')
                .modal({
                    blurring: false
                })
                .modal('show');
            $('#own-add-owner').val(user_trip_name);

        });

        $(document).on('click', '.own-add-trip-button', function(data, response, xhr) {

            var form = $(".own-add-trip-form").serializeArray();
            var data = {};
            for (e of form) {
                data[e.name] = e.value;
            }
            data = JSON.stringify(data);
            // ajax call to add the user
            var url = "/api/v1/devs/trips/";
            $.ajaxCall(url, "POST", data, function(output) {
                var url1 = "/api/v1/devs/users/" + user_trip_id + "/trips/";
                $.ajaxCall(url1, "GET", "", function(output) {
                    // update the container on success
                    $.displayJSONTrips(output);
                });
            });

        });

        // edit a user trip

        var trip_id_edit;
        $(document).on('click', '#own-edit-trip', function(data, response, xhr) {
            // get the id of the trip
            trip_id_edit = $(this).closest('tr').attr('id');

            $('.own-edit-trips-modal').addClass("edit-trip-modal-" + trip_id_edit);

            // open Modal
            $('.own-edit-trips-modal')
                .modal({
                    blurring: false
                })
                .modal('show');

            var trip_info = $('#' + trip_id_edit).find('td').slice(0, 6);
            $('#own-edit-owner').val(user_trip_name);
            $('#own-edit-destination').val(trip_info[1].innerHTML);
            $('#own-edit-start-time').val(trip_info[2].innerHTML);
            $('#own-edit-end-time').val(trip_info[3].innerHTML);
            $('#own-edit-transport-mode').val(trip_info[4].innerHTML);
            $('#own-edit-comment').val(trip_info[5].innerHTML);

        })

        // Modal Edit Form Submitted
        $(document).on('click', '.own-edit-trip-button', function(data, response, xhr) {
            // get the id of the trip            

            var form = $(".own-edit-trip-form").serializeArray();
            var data = {};
            for (e of form) {
                data[e.name] = e.value;
            }
            data = JSON.stringify(data);
            // ajax call to add the user
            var url = "/api/v1/devs/trips/" + trip_id_edit + "/";
            $.ajaxCall(url, "PUT", data, function(output) {
                // update the container on success
                $('#' + trip_id_edit).find('.trip_destination')[0].innerHTML = $('#own-edit-destination').val();
                $('#' + trip_id_edit).find('.trip_start_date')[0].innerHTML = $('#own-edit-start-time').val();
                $('#' + trip_id_edit).find('.trip_end_date')[0].innerHTML = $('#own-edit-end-time').val();
                $('#' + trip_id_edit).find('.trip_mode')[0].innerHTML = $('#own-edit-transport-mode').val();
                $('#' + trip_id_edit).find('.trip_comment')[0].innerHTML = $('#own-edit-comment').val();
            });
        })

        // delete a user trip
        $(document).on('click', '#own-delete-trip-button', function(data, response, xhr) {
            // get the id of the user manager
            var trip_id_delete = $(this).closest('tr').attr('id');

            // ajax call to delete the user
            var url = "/api/v1/devs/trips/" + trip_id_delete
            $.ajaxCall(url, "DELETE", "", function(output) {
                // update the container on success
                $('#' + trip_id_delete).hide(500, function() { $('#' + trip_id_delete).remove(); });
                $('#' + user_um_id_delete).hide(500, function() { $('#' + user_um_id_delete).remove(); });
            });
        })

        $(document).on('click', '.own-get-all-trips', function(data, response, xhr) {

            // get the id of the user
            var user_trip_id = $(this).closest('tr').attr('id');

            // ajax call to get all the trips
            var url = "/api/v1/devs/trips/";
            $.ajaxCall(url, "GET", "", function(output) {
                // update the container on success
                $own_get_user_mang.removeClass('active');
                $own_get_users.removeClass('active');
                $own_get_all_trips.addClass('active');
                $.displayJSONTrips(output);
            });


        });

        $(document).on('click', '#search_button_um', function(data, response, xhr) {
            alert($('#search_input_um').val());
        });
        $(document).on('click', '#search_button_trips', function(data, response, xhr) {
            alert($('#search_input_trips').val());
        });
        var user_trip_id;
        var user_trip_name;

        $(document).on('click', '.user_name_aa', function(data, response, xhr) {

            // get the id of the user
            user_trip_id = $(this).closest('tr').attr('id');
            user_trip_name = $(this).html();

            // ajax call to get all the trips
            var url = "/api/v1/devs/users/" + user_trip_id + "/trips/";
            $.ajaxCall(url, "GET", "", function(output) {
                // update the container on success
                $.displayJSONTrips(output);
            });
        });

        $("#search_input").on("keyup", function(data, response, xhr) {
            var url = "/api/v1/devs/" + search_item + "?search=" + $(this).val();
            $.ajaxCall(url, "GET", "", function(response) {
                if (search_item == "users") {
                    $.displayJSONUser(response);
                } else if (search_item == "managers") {
                    $.displayJSONUserMang(response);
                } else {
                    $.displayJSONTrips(response);
                }
            });
        })


    }
    $.mainFunction();

});
