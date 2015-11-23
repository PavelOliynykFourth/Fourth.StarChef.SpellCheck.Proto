function checkSpelling(id) {
    var selector = '#' + id;


    var d = {};
    d['text'] = $(selector).val();
    d['method'] = 'checkSpelling';
    $.ajax({
        type: "POST",
        url: "/SpellChecker.ashx",
        data: JSON.stringify(d),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            console.log(data);

            if (!data.isCorrect) {
                $(selector).css("text-decoration", "underline");
                $(selector).css("color", "red");
                $('#addButton').removeAttr("disabled");
                $('#removeButton').attr("disabled", "disabled");

                $('ul.optionsList').empty();

                $.each(data.suggestions, function (i, item) {
                    $('<li />', { html: item }).appendTo('ul.optionsList');
                });
            }
            else {
                $('ul.optionsList').empty();
                $(selector).css("text-decoration", "none");
                $(selector).css("color", "black");
                $('#addButton').attr("disabled", "disabled");
                if ($(selector).val() != "") {
                    $('#removeButton').removeAttr("disabled");
                } else {
                    $('#removeButton').attr("disabled", "disabled");
                }

            }

        },
        error: function (data) {
            //alert("Error");
            console.log(data);
        }
    });
}

function addWordToDictionary(id) {
    var selector = '#' + id;
    var d = {};
    d['text'] = $(selector).val();
    d['method'] = 'addWord';
    $.ajax({
        type: "POST",
        url: "/SpellChecker.ashx",
        data: JSON.stringify(d),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            console.log(data);
            checkSpelling(id);

        },
        error: function (data) {
            //alert("Error");
            console.log(data);
        }
    });
}

function removeWordFromDictionary(id) {
    var selector = '#' + id;
    var d = {};
    d['text'] = $(selector).val();
    d['method'] = 'removeWord';
    $.ajax({
        type: "POST",
        url: "/SpellChecker.ashx",
        data: JSON.stringify(d),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            console.log(data);
            checkSpelling(id);

        },
        error: function (data) {
            //alert("Error");
            console.log(data);
        }
    });
}