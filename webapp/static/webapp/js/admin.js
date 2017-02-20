$(document).ready(function() {

    var client_id = "f8tBA9Iu5Pc5WuexrsxwWvHmIKQuwCIyLdfdfrIW"
    var client_secret = "cqv8cmrKUQjG6r5JyoFcrvB1M6epBe9MoPFlnlToSQueQqKTd1rvTwHOZQ14FtYwiGyDgDwGAxm7QqbB3cPTLShV1OxsuPuAGg4mfsWqkhYIEtBh1lBAYNE9tTUwzNr0"

    $own_table_content = $('#own-table-content');

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

    $.displayJSONUser = function(listOfJson) {

        // check for any children elements if there then first delete them all
        if ($own_table_content.children().length > 0) {
            $own_table_content.hide();
            $own_table_content.empty();

        }

        $own_table_content.append("<div class='ui icon input'><input type='text' placeholder='Search all users...'' id='search_input_user'><i class='search link icon' id='search_button_user'></i></div><div class='ui right floated small primary labeled icon button own-add-user'><i class='user icon'></i> Add User</div><table class='ui compact celled definition green table'><thead class='full-width'><tr><th></th><th>User Name</th><th>First Name</th><th>Last Name</th><th>Email Address</th><th>Action</th></tr></thead><tbody>")

        $.each(listOfJson, function(i, item) {
            $('table').append("<tr id='" + listOfJson[i].id + "'><td class='collapsing'><div class='ui fitted slider checkbox'><input type='checkbox' id='user_check'><label></label></div></td><td class='user_name_a'>" + listOfJson[i].username + "</td><td class='first_name'>" + listOfJson[i].first_name + "</td><td class='last_name'>" + listOfJson[i].last_name + "</td><td class='email_address'>" + listOfJson[i].email + "</td><td><button class='ui mini button' id='own-edit-button' style='background: #00ab6b; color:white'>Edit</button><button class='ui mini red button' id='own-delete-button'>Delete</button></td></tr>");
        });

        $('table').append("</tbody><tfoot class='full-width'><th></th><th colspan='5'><div class='ui small  button'>Approve</div><div class='ui small  disabled button'>Approve All</div></th></tr></tfoot></table>")


        $own_table_content.fadeIn(500);
    }

    $.displayJSONUserMang = function(listOfJson) {

        // check for any children elements if there then first delete them all
        if ($own_table_content.children().length > 0) {
            $own_table_content.hide();
            $own_table_content.empty();

        }

        $own_table_content.append("<div class='ui icon input'><input type='text' placeholder='Search all managers...'' id='search_input_um'><i class='search link icon' id='search_button_um'></i></div><div class='ui right floated small primary labeled icon button own-add-um'><i class='user icon'></i> Add User Manager</div><table class='ui compact celled definition green table'><thead class='full-width'><tr><th></th><th>User Name</th><th>First Name</th><th>Last Name</th><th>Email Address</th><th>Action</th></tr></thead><tbody>")

        $.each(listOfJson, function(i, item) {
            $('table').append("<tr id='" + listOfJson[i].id + "'><td class='collapsing'><div class='ui fitted slider checkbox'><input type='checkbox'><label></label></div></td><td class='um_user_name'>" + listOfJson[i].username + "</td><td class='um_first_name'>" + listOfJson[i].first_name + "</td><td class='um_last_name'>" + listOfJson[i].last_name + "</td><td class='um_email_address'>" + listOfJson[i].email + "</td><td><button class='ui mini button' id='own-edit-um-button' style='background: #00ab6b; color:white'>Edit</button><button class='ui mini red button' id='own-delete-um-button'>Delete</button></td></tr>");
        });

        $('table').append("</tbody><tfoot class='full-width'><th></th><th colspan='5'><div class='ui small  button'>Approve</div><div class='ui small  disabled button'>Approve All</div></th></tr></tfoot></table>")

        $own_table_content.fadeIn(500);
    }

    $.displayJSONTrips = function(listOfJson) {

        // check for any children elements if there then first delete them all
        if ($own_table_content.children().length > 0) {
            $own_table_content.hide();
            $own_table_content.empty();
        }

        $own_table_content.append("<div class='ui icon input'><input type='text' placeholder='Search all trips...'' id='search_input_trips'><i class='search link icon' id='search_button_trips'></i></div><div class='ui right floated small primary labeled icon button own-add-trip'><i class='user icon'></i> Add Trip</div><table class='ui compact celled definition green table'><thead class='full-width'><tr><th></th><th>Destination</th><th>Start Date</th><th>End Date</th><th>Mode</th><th>Comment</th><th>Action</th></tr></thead><tbody>")

        $.each(listOfJson, function(i, item) {
            $('table').append("<tr id='" + listOfJson[i].id + "'><td class='trip_destination'> "+ listOfJson[i].owner+" </td><td class='trip_destination'>" + listOfJson[i].destination + "</td><td class='trip_start_date'>" + listOfJson[i].start_date + "</td><td class='trip_end_date'>" + listOfJson[i].end_date + "</td><td class='trip_mode'>" + listOfJson[i].mode + "</td><td class='trip_comment'>" + listOfJson[i].comment + "</td><td><button class='ui mini button' id='own-edit-trip' style='background: #00ab6b; color:white'>Edit</button><button class='ui mini red button' id='own-delete-trip-button'>Delete</button></td></tr>");
        });

        $('table').append("</tbody><tfoot class='full-width'><th></th><th colspan='6'><div class='ui small  button'>Approve</div><div class='ui small  disabled button'>Approve All</div></th></tr></tfoot></table>")

        $own_table_content.fadeIn(500);
    }

    $.getAllUsers = function() {
        var settings = {
            "async": true,
            "crossDomain": false,
            "url": "/api/v1/admin/users/",
            "method": "GET",
            "headers": {
                "authorization": "Bearer " + localStorage.accessToken,
                "cache-control": "no-cache",
            },
            "contentType": "application/json",
        };

        $.ajax(settings).done(function(response) {

            $.displayJSONUser(response);
        })
    }

    $.getAllTrips = function() {
        var settings = {
            "async": true,
            "crossDomain": false,
            "url": "/api/v1/admin/trips/",
            "method": "GET",
            "headers": {
                "authorization": "Bearer " + localStorage.accessToken,
                "cache-control": "no-cache",
            },
            "contentType": "application/json",
        };

        $.ajax(settings).done(function(response) {

            $.displayJSONTrips(response);
        })

    }

    $.mainFunction = function() {

        $.getAllUsers();

        var $own_get_user_mang = $('.own-get-user-mang');
        var $own_get_users = $('.own-get-users');
        var $own_get_all_trips = $('.own-get-all-trips');
        var $own_edit_trip_modal = $('.own-edit-trip-button');

        /* $("#own-start-time").datetimepicker();
        $("#own-end-time").datetimepicker();
        */
        $("#own-edit-start-time").datetimepicker();
        $("#own-edit-end-time").datetimepicker();
        $('.own-edit-mode-trans-dropdown').dropdown();


        $("#own-add-start-time").datetimepicker();
        $("#own-add-end-time").datetimepicker();
        $('.own-add-mode-trans-dropdown').dropdown();

        $own_get_users.on('click', function(data, response, xhr) {
            // ajax call for getting all the users
            var settings = {
                "async": true,
                "crossDomain": false,
                "url": "/api/v1/admin/users/",
                "method": "GET",
                "headers": {
                    "authorization": "Bearer " + localStorage.accessToken,
                    "cache-control": "no-cache",
                },
                "contentType": "application/json",
            };

            $.ajax(settings).done(function(response) {

                $.displayJSONUser(response);
                $own_get_users.addClass('active');
                $own_get_user_mang.removeClass('active');
                $own_get_all_trips.removeClass('active');
            })

        });

        // Get all the user managers
        $own_get_user_mang.on('click', function() {

            var settings = {
                "async": true,
                "crossDomain": false,
                "url": "/api/v1/admin/staff/",
                "method": "GET",
                "headers": {
                    "authorization": "Bearer " + localStorage.accessToken,
                    "cache-control": "no-cache",
                },
                "contentType": "application/json",
            };

            $.ajax(settings).done(function(response) {

                $.displayJSONUserMang(response);
                $own_get_user_mang.addClass('active');
                $own_get_users.removeClass('active');
                $own_get_all_trips.removeClass('active');
            })
        })

        // add user

        $(document).on('click', '.own-add-user', function(data, response, xhr) {
            $('.own-add-users-modal')
                .modal({
                    blurring: false
                })
                .modal('show');
        });

        $(document).on('click', '#logout_button', function(data, response, xhr) {
            logout(); //  logout 
        });

        $(document).on('click', '.own-add-user-button', function(data, response, xhr) {

            var form = $(".own-add-user-form").serializeArray();
            var data = {};
            for (e of form) {
                data[e.name] = e.value;
            }
            data = JSON.stringify(data);
            console.log(data);
            // ajax call to add the user
            var url = "/api/v1/admin/users/";
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
                // notification upon success
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

            var user_info = $('#' + edit_users_id).find('td').slice(1, 6);
            $('#own-edit-user-name').val(user_info[0].innerText);
            $('#own-edit-first-name').val(user_info[1].innerHTML);
            $('#own-edit-last-name').val(user_info[2].innerHTML);
            $('#own-edit-email').val(user_info[3].innerHTML);
            $('#own-edit-password').val(user_info[4].innerHTML);

        })

        $(document).on('click', '.own-edit-user-button', function(data, response, xhr) {
            // ajax call to edit the contents
            var form = $(".own-edit-user-form").serializeArray();
            var data = {};
            for (e of form) {
                data[e.name] = e.value;
            }
            data = JSON.stringify(data);
            var url = "/api/v1/admin/users/" + edit_users_id + "/";
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": url,
                "method": "PUT",
                "headers": {
                    "authorization": "Bearer " + localStorage.accessToken,
                    "cache-control": "no-cache",
                },
                "contentType": "application/json",
                "data": data,

            }

            $.ajax(settings).done(function(response) {

                $.getAllUsers();
            });

            /*
                        // change the relevant fields to reflect the change upon success
                        $('#' + edit_users_id).find('.user_name_a')[0].innerHTML = $('#own-edit-user-name').val();
                        $('#' + edit_users_id).find('.first_name')[0].innerHTML = $('#own-edit-first-name').val();
                        $('#' + edit_users_id).find('.last_name')[0].innerHTML = $('#own-edit-last-name').val();
                        $('#' + edit_users_id).find('.email_address')[0].innerHTML = $('#own-edit-email').val();*/

        })

        // deleting a user

        $(document).on('click', '#own-delete-button', function(data, response, xhr) {
            // get the id of the user
            var user_id_delete = $(this).closest('tr').attr('id');

            // ajax call to delete the user
            var url = "/api/v1/admin/users/" + user_id_delete
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
                // update the container on success
                $('#' + user_id_delete).hide(500, function() { $('#' + user_id_delete).remove(); });
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

            // ajax call to add the user manager
            $('#own-add-um-user-name').val();
            $('#own-add-um-first-name').val();
            $('#own-add-um-last-name').val();
            $('#own-add-um-email').val();

            // notification upon success
            alert('user manager added');

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

                // change the relevant fields to reflect the change upon success
                $('#' + edit_um_id).find('.um_user_name')[0].innerHTML = $('#own-edit-um-user-name').val();
                $('#' + edit_um_id).find('.um_first_name')[0].innerHTML = $('#own-edit-um-first-name').val();
                $('#' + edit_um_id).find('.um_last_name')[0].innerHTML = $('#own-edit-um-last-name').val();
                $('#' + edit_um_id).find('.um_email_address')[0].innerHTML = $('#own-edit-um-email').val();

            })
            // delete a user manager

        $(document).on('click', '#own-delete-um-button', function(data, response, xhr) {
            // get the id of the user manager
            var um_id_delete = $(this).closest('tr').attr('id');

            // ajax call to delete the user


            // update the container on success
            $('#' + um_id_delete).hide(500, function() { $('#' + um_id_delete).remove(); });
        })

        // add a user trip

        $(document).on('click', '.own-add-trip', function(data, response, xhr) {

            $('.own-add-trips-modal')
                .modal({
                    blurring: false
                })
                .modal('show');

        });

        $(document).on('click', '.own-add-trip-button', function(data, response, xhr) {

            var form = $(".own-add-trip-form").serializeArray();
            var data = {};
            for (e of form) {
                data[e.name] = e.value;
            }
            data = JSON.stringify(data);
            console.log(data);
            // ajax call to add the user
            var url = "/api/v1/admin/trips/";
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
                // notification upon success
                $.getAllTrips();
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
            $('#own-edit-owner').val(trip_info[0].innerHTML);
            $('#own-edit-destination').val(trip_info[1].innerHTML);
            $('#own-edit-start-time').val(trip_info[2].innerHTML);
            $('#own-edit-end-time').val(trip_info[3].innerHTML);
            $('#own-edit-transport-mode').val(trip_info[4].innerHTML);
            $('#own-edit-comment').val(trip_info[5].innerHTML);

        })

        // Modal Edit Form Submitted
        $(document).on('click', '.own-edit-trip-button', function(data, response, xhr) {
            // get the id of the trip            
            $('#' + trip_id_edit).find('.trip_destination')[0].innerHTML = $('#own-edit-destination').val();
            $('#' + trip_id_edit).find('.trip_start_date')[0].innerHTML = $('#own-edit-start-time').val();
            $('#' + trip_id_edit).find('.trip_end_date')[0].innerHTML = $('#own-edit-end-time').val();
            $('#' + trip_id_edit).find('.trip_mode')[0].innerHTML = $('#own-edit-transport-mode').val();
            $('#' + trip_id_edit).find('.trip_comment')[0].innerHTML = $('#own-edit-comment').val();
        })

        // delete a user trip
        $(document).on('click', '#own-delete-trip-button', function(data, response, xhr) {
            // get the id of the user manager
            var trip_id_delete = $(this).closest('tr').attr('id');

            // ajax call to delete the user
            var url = "/api/v1/admin/trips/" + trip_id_delete
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
                // update the container on success
                $('#' + trip_id_delete).hide(500, function() { $('#' + trip_id_delete).remove(); });
            });

            // update the container on success
            $('#' + user_um_id_delete).hide(500, function() { $('#' + user_um_id_delete).remove(); });
        })


        $(document).on('click', '.own-get-all-trips', function(data, response, xhr) {

            // get the id of the user
            var user_trip_id = $(this).closest('tr').attr('id');

            // ajax call to get all the trips
            var url = "/api/v1/admin/trips/";
            var settings = {
                "async": true,
                "crossDomain": false,
                "url": url,
                "method": "GET",
                "headers": {
                    "authorization": "Bearer " + localStorage.accessToken,
                    "cache-control": "no-cache",
                },
                "contentType": "application/json",
            };

            $.ajax(settings).done(function(response, err) {
                $own_get_user_mang.removeClass('active');
                $own_get_users.removeClass('active');
                $own_get_all_trips.addClass('active');
                $.displayJSONTrips(response);
            });

        });

        $(document).on('click', '#search_button_user', function(data, response, xhr) {
            alert($('#search_input_user').val());
        });
        $(document).on('click', '#search_button_um', function(data, response, xhr) {
            alert($('#search_input_um').val());
        });
        $(document).on('click', '#search_button_trips', function(data, response, xhr) {
            alert($('#search_input_trips').val());
        });
    }
    $.mainFunction();

});
