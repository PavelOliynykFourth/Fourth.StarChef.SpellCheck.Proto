if (typeof spellChecker !== undefined) {    

    var self = spellChecker;

    self.addWordToDictionary = function (id) {
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
    };

    self.removeWordFromDictionary = function (id) {
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
    };

    self.checkSpelling = function (id) {
        var selector = '#' + id;


        var d = {};

        var textToCheck = $(selector).val();
        var words = textToCheck.split(" ");

        d['text'] = words != undefined && words.length > 0 ? words[words.length - 1] : '';
        d['method'] = 'checkSpelling';

        console.log(d['text']);

        if (d['text'] === '')
            return;

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
    };

}





