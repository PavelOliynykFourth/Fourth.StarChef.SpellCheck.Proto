if (typeof spellChecker !== undefined) {    

    var self = spellChecker;

    self.ClientId = "UnKnown";

    self.SetClient = function (client) {
        self.ClientId = client;
    }

    self.addWordToDictionary = function (id) {
        var selector = '#' + id;
        var d = self.GetAction('addWord');

        var word = self.GetLastWord(id);

        if (word === '')
            return;

        d['text'] = word;

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

        var d = self.GetLastWord('removeWord');

        var word = self.GetLastWord(id);

        if (word === '')
            return;

        d['text'] = word;


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

        var d = self.GetAction('checkSpelling');

        d['text'] = self.GetLastWord(id);
        
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

    self.GetLastWord = function (id) {

        var selector = '#' + id;
        
        var textToCheck = $(selector).val();

        var words = textToCheck.split(" ");

        return words != undefined && words.length > 0 ? words[words.length - 1] : '';        
    };

    self.GetAction = function (action) {
        var d = {};
        d['method'] = action;
        d['clientId'] = self.ClientId;
        return d;
    };

    self.Show = function (id) {

        $('#listOfOptions').empty();
        $("#spellCheckResult").empty();

        var textToCheck = $("#" + id).val();

        if (textToCheck === '')
            return;

        $('#spellCheckModal').modal('show');

        var textToCheck = $("#" + id).val();
        
        var d = self.GetAction('checkSpellingAll');
        d["text"] = textToCheck;

            $.ajax({
                type: "POST",
                url: "/SpellChecker.ashx",
                data: JSON.stringify(d),
                contentType: "application/json; charset=utf-8",
                dataType: "json",               
                success: function (data) {

                    //if (!data.isCorrect) {
                    //}                    

                    $("#spellCheckResult").html(data.Result);
                    $("#spellCheckCorrect").html(data.Origin);

                },
                error: function (data) {
                   
                    console.log(data);
                }
            });
             
      
        //spellCheckResult
     
    };

    self.SuggetSome = function (word) {

        var d = self.GetAction('Suggest');

        d['text'] = word;

        if (d['text'] === '')
            return;

        $.ajax({
            type: "POST",
            url: "/SpellChecker.ashx",
            data: JSON.stringify(d),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                
                $('#listOfOptions').empty();

                $.each(data.suggestions, function (i, item) {
                    $('<li />', { html: item }).appendTo('#listOfOptions');
                });
                                               
            },
            error: function (data) {
                //alert("Error");
                console.log(data);
            }
        });

    };

    self.Spell = function (word, callBack) {
        var d = self.GetAction('checkSpelling');

        d['text'] = word;

        $.ajax({
            type: "POST",
            url: "/SpellChecker.ashx",
            data: JSON.stringify(d),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                callBack(word, data);
            },
            error: function (data) {
                alert("Error");                
            }
        });
    }
}





