$(document).ready(function () {
    $(".add-card").hide();
    $("#add-button").click(function () {
        $(".add-card").toggle();
    });

    //optimised search
    var $searchInput = $(".search-wrapper input#search");
    var initialSearchKey = $searchInput.val().trim().toLowerCase();
    var finalSearchKey;
    $searchInput.keyup(function (event) {
        finalSearchKey = $(this).val().trim().toLowerCase();
        // console.log(initialSearchKey);
        if (initialSearchKey !== finalSearchKey)
        // fetchSkills(finalSearchKey);  // unoptimised search
            search(finalSearchKey);         //optimised
        initialSearchKey = finalSearchKey;
    });
    // new skill addition
    $(".add-card input.new-submit").click(function () {
        var $inputText = $("input#name", $(this).parent());
        var skillName = $inputText.val();
        if (skillName.trim() === "") {
            alert("Skill should not be empty");
        } else {
            postSkill(skillName, function (skill) {
                $inputText.val("");
                addSkillToList(skill);
                updateListeners();
                // fetchSkills();
                makeToast('New skill added');
            });
        }
    });
    fetchSkills();
});

function search(searchKey) {
    // console.log(searchKey);
    $("input#name").each(function () {
        var skill = $(this).val();
        console.log(skill);
        if (skill.toLowerCase().indexOf(searchKey) < 0) {
            $(this).parent().parent().parent().hide();
        }
        else {
            $(this).parent().parent().parent().css("display", "block");
        }
    });
}

function fetchSkills(searchQuery) {
    var url = "/api/skill";
    if (searchQuery != null) {
        url += "?q=" + encodeURI(searchQuery);
    }
    $(".skills-list-card").html($(""));
    $.ajax(
        {
            url: url,
            type: "GET",
            success: function (result) {
                $(result).each(function (i, skill) {
                    addSkillToList(skill);
                });
                updateListeners();
            },
            error: function (xhr, status, err) {
                console.log(err);
                errorAlert();
            }
        });
}

function addSkillToList(skill) {
    var $skillBox = $('<div class="card skill z-depth-0"><div class="row"><div class="input-field col s4"><input id="name" placeholder="Name" name="name" type="text" ' +
        'disabled="disabled"></div><span class ="options"><i class="material-icons edit">edit</i><i class="material-icons delete">delete</i></span><input type="submit" class="flat-btn submit"><div class="approve"><i class="material-icons">done</i><span id="txt">Approve</span></div><div class="reject"> <i class="material-icons">clear</i><span id="txt">Reject</span></div></div></div>');
    $("input#name", $skillBox).val(skill.name);
    if (skill.approved) {
        $(".approve", $skillBox).css("color", "#42b85f");
        $(".approve span#txt", $skillBox).text("Approved");
    } else {
        $(".reject", $skillBox).css("color", "#f0463b");
        $(".reject span#txt", $skillBox).text("Rejected");
    }
    $("input.submit", $skillBox).data("id", skill.id);
    $("input.submit", $skillBox).data("approved", skill.approved);
    $(".skills-list-card").prepend($skillBox);
}

function updateSkill(id, updatedName, onSuccess) {
    var url = "/api/skill/" + id;
    var csrftoken = Cookies.get('csrftoken');
    $.ajax(
        {
            url: url,
            type: "PATCH",
            data: {"name": updatedName},
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRFToken', csrftoken);
            },

            success: function () {
                onSuccess();
            },
            error: function (xhr, status, err) {
                console.log(err);
                errorAlert();
            }
        });

}

function updateSkillStatus(id, status, onSuccess) {
    var url = "/api/skill/" + id;
    var csrftoken = Cookies.get('csrftoken');
    console.log(id, status);
    $.ajax(
        {
            url: url,
            type: "PATCH",
            data: {"approved": status},
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRFToken', csrftoken);
            },

            success: function () {
                onSuccess();
            },
            error: function (xhr, status, err) {
                console.log(err);
                errorAlert();
            }
        });
}

function postSkill(skillName, onSuccess) {
    var url = "/api/skill";
    var csrftoken = Cookies.get('csrftoken');
    $.ajax(
        {
            url: url,
            type: "POST",
            data: {"name": skillName, "approved": true},
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRFToken', csrftoken);
            },
            success: function (result) {
                onSuccess(result);
            },
            error: function (xhr, status, err) {
                console.log(err);
                errorAlert();
            }
        });
}

function deleteSkill(id, onSuccess) {
    var url = "/api/skill/" + id;
    var csrftoken = Cookies.get('csrftoken');
    $.ajax(
        {
            url: url,
            type: "DELETE",
            // data: {"name": skillName,"approved":true},
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRFToken', csrftoken);
            },
            success: function () {
                onSuccess();
            },
            error: function (xhr, status, err) {
                console.log(err);
                errorAlert();
            }
        });
}

function updateListeners() {
    $(".skill").hover(function () {
        if ($("input.submit", this).css("display") === "none") {
            $("span.options", this).css("display", "inline-block");
        }
    }, function () {
        $("span.options", this).css("display", "none");
    });

    $("i.edit").unbind().click(function () {
        var $parent = $(this).parent();
        console.log($parent);
        $("div input#name", $parent.parent()).prop('disabled', false);
        $("input.submit", $parent.parent()).css("display", "inline-block");
        // $(this).hide();
        $parent.hide();//parent is span.options
    });

    //update skill listener
    $(".skill input.submit").unbind().click(function () {
        var $self = $(this);
        var $inputText = $("input#name", $self.parent());
        var newName = $inputText.val();
        if (newName.trim() === "") {
            alert("Skill should not be empty");
        } else {
            updateSkill($(this).data("id"), newName, function () {
                $self.hide();
                $("span.options",$self.parent()).prop("display","inline-block");
                $inputText.prop('disabled', true);
                makeToast('changes made');
            });
        }
    });

    //approve listener
    $(".skill .approve").unbind().click(function () {
        var $submit = $("input.submit", $(this).parent());
        var isApproved = $submit.data("approved");
        if (!isApproved) {
            updateSkillStatus($submit.data("id"), true, function () {
                $(".reject", $submit.parent()).css("color", "#b2b4b6");
                $(".reject span#txt", $submit.parent()).text("Reject");
                $(".approve", $submit.parent()).css("color", "#42b85f");
                $(".approve span#txt", $submit.parent()).text("Approved");
                $submit.data("approved", true);
                makeToast('changed skill status');
            });

        }
    });

    //rejection listener
    $(".skill .reject").unbind().click(function () {
        var $submit = $("input.submit", $(this).parent());
        var isApproved = $submit.data("approved");
        if (isApproved) {
            updateSkillStatus($submit.data("id"), false, function () {
                $(".reject", $submit.parent()).css("color", "#f0463b");
                $(".reject span#txt", $submit.parent()).text("Rejected");
                $(".approve", $submit.parent()).css("color", "#b2b4b6");
                $(".approve span#txt", $submit.parent()).text("Approve");
                $submit.data("approved", false);
                makeToast('changed skill status');
            });
        }
    });

    //delete skill
    $("i.delete").unbind().click(function () {
        var $parent = $(this).parent();
        var $submit = $("input.submit", $parent.parent());
        deleteSkill($submit.data("id"), function () {
            $parent.parent().parent().remove();   //final parent is skill div
            makeToast('Skill deleted');
        });
    });

}

function makeToast(msg) {
    M.Toast.dismissAll();
    M.toast({html: msg});
}
function errorAlert(){
    alert("Some error occurred");
}