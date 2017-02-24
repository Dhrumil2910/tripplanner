$(document).ready(function() {

    /* Main Function */

    $.mainFunction = function() {


        // display all the trips from the start

        $.displayJSON(currentTrips);
        $("#own-start-time").datetimepicker();
        $("#own-end-time").datetimepicker();
        $("#own-edit-start-time").datetimepicker();
        $("#own-edit-end-time").datetimepicker();


        $(document).on('click', '.button_admin', function(data, response, xhr) {
            window.location.href = '/dev?type=admin';
        });

        $(document).on('click', '.button_staff', function(data, response, xhr) {
            window.location.href = '/dev?type=staff';
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


        /* Add Button Clicked */

        $own_add_button.on('click', function(data, response, xhr) {
            $own_add_modal
                .modal({
                    blurring: false
                })
                .modal('show');
        });

        $(document).on('click', '#add-trip-btn', function(data, response, xhr) {
            var form = $("#add-trip-form").serializeArray();
            var data = {};
            for (e of form) {
                data[e.name] = e.value;
            }
            data = JSON.stringify(data);
            var url = "/api/v1/trips/";
            $.ajaxCall(url, "POST", data, function(response) {
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

        // Delete a particular trip

        $(document).on('click', '.delete_icon', function(data, response, xhr) {

            // detect the delete button click for which id of the trip
            var trip_id_delete = $(this).closest('.trip_item').attr('id');

            // delete from the database
            var url = "/api/v1/trips/" + trip_id_delete
            $.ajaxCall(url, "DELETE", "", function(response) {
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

            var form = $("#edit-trip-form").serializeArray();
            var data = {};
            for (e of form) {
                data[e.name] = e.value;
            }
            data = JSON.stringify(data);
            // edit from the database

            var url = "/api/v1/trips/" + edit_trip_id + "/";
            $.ajaxCall(url, "PUT", data, function(response) {
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

    };
    $.getUserInfo();
    $.getAllTrips();


})
