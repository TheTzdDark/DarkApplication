$.ajax({
    url: "http://localhost:8080/api/admin/users",
    method: 'get',
    dataType: 'json',
    success: function(users){
        for (user of users) {
            $("#usersBody").append(createUserRow(user));
        }
    }
});

//Открытие модалки удаления
$(document).on("click", "#deleteButton", function() {
    const id = this.getAttribute("userid");
    $.get(
        "http://localhost:8080/api/admin/user",
        {"id": id},
        function(user) {
            $("#formIdDelete").attr("placeholder", user.id);
            $("#formUsernameDelete").attr("placeholder", user.username);
            $("#formAgeDelete").attr("placeholder", user.age);
            $("#formEmailDelete").attr("placeholder", user.email);
            $("#formStatusDelete").attr("placeholder", user.status);

            for (role of user.roles) {
                $("#formRoleSelectDelete").append("<option value='" + role.id + "'>" + role.name.substring(5) + "</option>");
            }

            $("#buttonDeleteUser").attr("userid",user.id);
        },
        "json"
    );
});

//Очистка формы при закрытии модалки удаления
$("#deleteModal").on("hidden.bs.modal", function (event) {
    $("#formIdDelete").removeAttr("placeholder");
    $("#formUsernameDelete").removeAttr("placeholder");
    $("#formAgeDelete").removeAttr("placeholder");
    $("#formEmailDelete").removeAttr("placeholder");
    $("#formStatusDelete").removeAttr("placeholder");
    $("#formRoleSelectDelete").empty();
})

//Удаление юзера
$(document).on("click", "#buttonDeleteUser", function() {
    const id = this.getAttribute("userid");
    $.post(
        "http://localhost:8080/api/admin/delete",
        {"id": id},
        function(data) {
            $("#userrow" + id).remove();;
        },
        "json"
    );
})

//Открытие модалки редактирования
$(document).on("click", "#editButton", function() {
    const id = this.getAttribute("userid");
    $.get(
        "http://localhost:8080/api/admin/user",
        {"id": id},
        function(user) {
            $("#formIdEdit").attr("value", user.id);
            $("#formUsernameEdit").attr("value", user.username);
            $("#formAgeEdit").attr("value", user.age);
            $("#formEmailEdit").attr("value", user.email);
            $("#formStatusEdit").attr("value", user.status);

            getRowAllRoles(function(roles) {
                for (role of roles) {
                    $("#formRoleSelectEdit").append("<option value='" + role.id + "'>" + role.name.substring(5) + "</option>");
                }
            });

            $("#editForm").attr("userid",user.id);
        },
        "json"
    );
});

//Очистка формы при закрытии модалки редактирования
$("#editModal").on("hidden.bs.modal", function (event) {
    $("#formIdEdit").removeAttr("value");
    $("#formUsernameEdit").removeAttr("value");
    $("#formAgeEdit").removeAttr("value");
    $("#formEmailEdit").removeAttr("value");
    $("#formStatusEdit").removeAttr("value");
    $("#formPasswordEdit").removeAttr("value");
    $("#formRoleSelectEdit").empty();
})

//Отправка формы редактирования
$("#editForm").on("submit", function() {
    const id = this.getAttribute("userid");
    $.ajax({
        url: "http://localhost:8080/api/admin/edit",
        method: "post",
        dataType: "json",
        data: $(this).serialize() + "&id=" + id,
        success: function(user) {
            $("#editModal").modal("hide");            
            $("#userrow" + user.id).replaceWith(createUserRow(user));
        }
    });

    return false;
});

//Открытие вкладки нового юзера
$('a[data-toggle="tab"]').on("shown.bs.tab", function (event) {
    if (event.target.id === "nav-new-user-tab") {
        getRowAllRoles(function(roles) {
            for (role of roles) {
                $("#formRoleSelectInput").append("<option value='" + role.id + "'>" + role.name.substring(5) + "</option>");
            }
        });
    }
});

//Отправка формы нового юзера
$("#newUserForm").on("submit", function() {
    $.ajax({
        url: "http://localhost:8080/api/admin/new",
        method: "post",
        dataType: "json",
        data: $(this).serialize(),
        success: function(user) {
            $("#usersBody").append(createUserRow(user));
            $("#nav-users-table").tab("show");
            $("#nav-new-user").attr("class", "tab-pane fade");
            $("#nav-users-table-tab").attr("class", "nav-item nav-link active");
            $("#nav-users-table-tab").attr("aria-selected", true);
            $("#nav-new-user-tab").attr("class", "nav-item nav-link");
            $("#nav-new-user-tab").attr("aria-selected", false);
        }
    });
    
    return false;
});

function getRowAllRoles(callback) {
    $.get("http://localhost:8080/api/admin/roles", function(data) {
        callback(data);
    }, "json");
}

function getRoles(roles) {
    let roleNames = "";
    for (role of roles) {
        roleNames += role.name.substring(5) + " ";
    }

    return roleNames;
}

function createUserRow(user) {
    let newRow = $("<tr id='userrow" + user.id + "'>");
    newRow.append("<td>" + user.id + "</td>")
        .append("<td>" + user.username + "</td>")
        .append("<td>" + user.age + "</td>")
        .append("<td>" + user.email + "</td>")
        .append("<td>" + user.status + "</td>")
        .append("<td>" + getRoles(user.roles) + "</td>")
        .append("<td><button id='editButton' type='button' class='btn btn-info' data-toggle='modal' data-target='#editModal' userid='" + user.id + "'>Edit</button></td>")
        .append("<td><button id='deleteButton' type='submit' class='btn btn-danger' data-toggle='modal' data-target='#deleteModal' userid='" + user.id + "'>Delete</button></td>");
    newRow.addClass("table-striped");
    
    return newRow;
}