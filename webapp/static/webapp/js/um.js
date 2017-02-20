$(document).ready(function() {

    $own_table_content = $('#own-table-content');
    $.displayJSONUser = function(listOfJson) {

        // check for any children elements if there then first delete them all
        if ($own_table_content.children().length > 0) {
            $own_table_content.hide();
            $own_table_content.empty();
        }

        $own_table_content.append("<table class='ui compact celled definition green table'><thead class='full-width'><tr><th></th><th>User Name</th><th>First Name</th><th>Last Name</th><th>Email Address</th><th>Action</th></tr></thead><tbody>")

        $.each(listOfJson, function(i, item) {
            $('table').append("<tr id='" + listOfJson[i].id + "'><td class='collapsing'><div class='ui fitted slider checkbox'><input type='checkbox' id='user_check'><label></label></div></td><td class='user_name_a'>" + listOfJson[i].user_name + "</td><td class='first_name'>" + listOfJson[i].first_name + "</td><td class='last_name'>" + listOfJson[i].last_name + "</td><td class='email_address'>" + listOfJson[i].email + "</td><td><button class='ui mini button' id='own-edit-button' style='background: #00ab6b; color:white'>Edit</button><button class='ui mini red button' id='own-delete-button'>Delete</button></td></tr>");
        });

        $('table').append("</tbody><tfoot class='full-width'><th></th><th colspan='5'><div class='ui right floated small primary labeled icon button own-add-user'><i class='user icon'></i> Add User</div><div class='ui small  button'>Approve</div><div class='ui small  disabled button'>Approve All</div></th></tr></tfoot></table>")
        $own_table_content.fadeIn(500);
    }

    $.mainFunction = function() {

        // ajax call for getting all the users
        $.displayJSONUser(users);

        var $own_get_users = $('.own-get-users');

        // get all the users
        $own_get_users.on('click', function(data, response, xhr) {
            // ajax call
            $.displayJSONUser(users);
        });

        // add user

        $(document).on('click', '.own-add-user', function(data, response, xhr) {

            $('.own-add-users-modal')
                .modal({
                    blurring: false
                })
                .modal('show');

        });

        $(document).on('click', '.own-add-user-button', function(data, response, xhr) {

            // ajax call to add the user
            $('#own-add-user-name').val()
            $('#own-add-first-name').val()
            $('#own-add-last-name').val()
            $('#own-add-email').val()
                // notification upon success
            alert('user added');

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

            var user_info = $('#' + edit_users_id).find('td').slice(1, 5);
            $('#own-edit-user-name').val(user_info[0].innerText);
            $('#own-edit-first-name').val(user_info[1].innerHTML);
            $('#own-edit-last-name').val(user_info[2].innerHTML);
            $('#own-edit-email').val(user_info[3].innerHTML);

        })

        $(document).on('click', '.own-edit-user-button', function(data, response, xhr) {
            // ajax call to edit the contents

            // change the relevant fields to reflect the change upon success
            $('#' + edit_users_id).find('.user_name_a')[0].innerHTML = $('#own-edit-user-name').val();
            $('#' + edit_users_id).find('.first_name')[0].innerHTML = $('#own-edit-first-name').val();
            $('#' + edit_users_id).find('.last_name')[0].innerHTML = $('#own-edit-last-name').val();
            $('#' + edit_users_id).find('.email_address')[0].innerHTML = $('#own-edit-email').val();

        })

        // deleting a user

        $(document).on('click', '#own-delete-button', function(data, response, xhr) {
            // get the id of the user
            var user_id_delete = $(this).closest('tr').attr('id');

            // ajax call to delete the user



            // update the container on success
            $('#' + user_id_delete).hide(500, function() { $('#' + user_id_delete).remove(); });
        });
    }
    
    $.mainFunction()

});
