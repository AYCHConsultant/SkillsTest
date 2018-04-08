$(document).ready(function() {
    // $(".add-card").hide();
    $("#add-button").click(function () {
        $(".add-card").toggle();
    });
    fetchSkills();
});

function fetchSkills(searchQuery) {
    var url = "/api/skill";
    if (searchQuery != null) {
        url += "?q=" + encodeURI(searchQuery);
    }
    $.ajax(
        {
            url: url,
            type: "GET",
            success: function(result) {
                $(result).each(function (i, skill) {
                    var $skillBox = $('<div class="card skill"><div class="row"><div class="input-field col s4"><input id="name" name="name" type="text" ' +
                        'disabled="disabled"></div><i class="material-icons edit">edit</i><input type="submit" class="flat-btn submit"></div></div>');
                    $("input#name", $skillBox).val(skill.name);
                    $("input.submit", $skillBox).data("id", skill.id);
                    $(".skills-list-card").append($skillBox);
                });
                updateListeners();
            },
            error: function (xhr, status, err) {
                console.log(err);
            }
        });
}

function updateSkill(id, updatedName, onSuccess) {
    var url = "/api/skill/" + id;
    $.ajax(
        {
            url: url,
            type: "PATCH",
            data: {"name": updatedName},
            success: function() {
                onSuccess();
            },
            error: function (xhr, status, err) {
                console.log(err);
            }
        });

}

function updateListeners() {
    $(".skill").hover(function () {
        if ($("input.submit", this).css("display") === "none") {
            $("i.edit", this).css("display", "inline-block");
        }
    }, function () {
        $("i.edit", this).css("display", "none");
    });

    $("i.edit").click(function () {
        var $parent = $(this).parent();
        $("div input#name", $parent).prop('disabled', false);
        $("input.submit", $parent).show();
        $(this).hide();
    });

    $(".skill input.submit").click(function () {
        var $self = $(this);
        var $inputText = $("input#name", $self.parent());
        var newName = $inputText.val();
        updateSkill($(this).data("id"), newName, function () {
            $self.hide();
            $inputText.prop('disabled', true);
        });
    })
}