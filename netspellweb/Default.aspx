<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="netspellweb.Default" %>
<%@ Register TagPrefix="sc" Namespace="CustomControls" Assembly="CustomControls" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Spell Check</title>
    
    <script src="scripts/jquery-1.9.1.js"></script>
    <link href="Content/bootstrap.css" rel="stylesheet" />
    <script src="scripts/bootstrap.js"></script>    
    <script src="scripts/knockout-3.4.0.debug.js"></script>
    
    <script>
        var spellChecker = {};
    </script>
    <script src="scripts/spellchecker.js"></script>        
    <style>

    </style>

    <script>

        

        function SpellCheckViewCtrl3() {

            this.isSelected = ko.observable(true);
            this.Words = ko.observableArray();

            this.textToSpellCheck  = ko.observable();

            this.Run = function (val) {
                var words = val.split(' ');

                $("#spellCheckPanel").empty();
                for (var i = 0; i < words.length; i++) {

                    var word = words[i].trim();

                    if (word.length == 0)
                        return;

                    this.Words.push(words[i]);

                    spellChecker.Spell(i, words[i], function (pos, w, data) {
                        if (data !== undefined) {

                            var d = document;
                            var div = d.createElement("div");
                            div.style.display = "inline";

                            $("#spellCheckPanel").append(div);

                            if (data.isCorrect == 0) {

                                div.className = "dropdown";

                                var button = d.createElement("button");
                                button.type = "button";
                                button.setAttribute("id", "spellButton" + pos);
                                button.setAttribute("type", "button");
                                button.setAttribute("class", "btn btn-danger btn-xs");                                
                                button.setAttribute("oncontextmenu", " model.Suggestions(event, " + pos + ") ");
                                

                                div.innerHTML = "&nbsp;&nbsp;"

                                button.innerHTML = w;

                                div.appendChild(button);

                                var ul = d.createElement("ul");
                                ul.setAttribute("id", "dropDownMenu" + pos);                                
                                ul.setAttribute("class", "dropdown-menu");
                               
                                div.appendChild(ul);                                

                                for (var i = 0; i < data.suggestions.length; i++) {
                                    var li = d.createElement("li");
                                    var a = d.createElement("a");

                                    ul.appendChild(li);

                                    a.innerHTML = data.suggestions[i];
                                    a.setAttribute("href", "#");
                                    a.setAttribute("onclick", "return model.ReplaceWord(" + pos + ", " + i + ", '" + data.suggestions[i] + "')");

                                    li.appendChild(a);
                                }

                            } else {
                                div.innerHTML = "&nbsp;" + w;
                            }
                        }
                    });

                    $("#spellCheckPanel").height($("#spellCheckInput").height() + 5);
                    $("#spellCheckPanel").width($("#spellCheckInput").width());

                    this.isSelected(false);

                }
            };

            this.Suggestions = function (e, id) {
                
                if (e !== undefined) {
                    e.preventDefault();
                
                    if (this.SelectedDropDown !== undefined)
                        this.SelectedDropDown.hide();

                    this.SelectedDropDown = $("#dropDownMenu" + id);

                    $("#dropDownMenu" + id).show();

                }
                                
            };

            this.SelectedDropDown;

            this.SpellCheck = function () {
                if (this.textToSpellCheck() != "")
                    this.Run(this.textToSpellCheck());
            };

            this.setFocus = function (e) {

                this.textToSpellCheck(this.GetSentence());

                $("#spellCheckPanel").empty();

                $("#spellCheckPanel").select();

                this.isSelected(true);

                $("#spellCheckInput").focus();

                return false
            };

            this.GetSentence = function () {
                var s = "";
                for (var i = 0 ; i < this.Words().length; i++) {
                    if (i == 0)
                        s += this.Words()[i];
                    else 
                        s += " " + this.Words()[i];

                }
                this.Words.removeAll();
                return s + " ";
            };

            this.ReplaceWord = function (pos, i, word) {

                if (this.SelectedDropDown !== undefined)
                    this.SelectedDropDown.hide();
                
                document.getElementById("spellButton" + pos).removeAttribute("class");
                document.getElementById("spellButton" + pos).setAttribute("class", "btn btn-success btn-xs");
                document.getElementById("spellButton" + pos).innerHTML = word;
                this.Words()[pos] = word;
            };

        }


        var model = new SpellCheckViewCtrl3();

        $(document).ready(function () {
           
            ko.applyBindings(model, document.getElementById("SpellCheckViewCtrl3"));

        });


        $(document).click(function (e) {

            if (e.target.parentElement != null && e.target.parentElement.localName == "li") {
                e.preventDefault();
                return;
            } else if (e.target.id == "spellCheckPanel") {
                model.setFocus();
            }

            if (model.SelectedDropDown !== undefined)
                model.SelectedDropDown.hide();

        });
        
    </script>
</head>
<body id="SpellingBody" style="MARGIN: 0px" runat="server">
    <form id="SpellingForm" name="SpellingForm" runat="server">
        
        <div class="container-fluid">

            <div class="row">
                <div class="col-lg-12">
                    SpellChecker Demo                    
                </div>                
            </div>
        
            <div class="row">
                <div class="col-lg-12">                  
                </div>                
            </div>
        
            <div class="row">
                <div class="col-lg-12">                  
                    &nbsp;
                </div>                
            </div>

            <div class="row">
                <div class="col-lg-6">                  
                    Demo C: SpellCheckerTextBox 
                </div>                
                <div class="col-lg-6" id="SpellCheckViewCtrl3">                    
                    <textarea  cols="25" rows="5" data-bind='value: textToSpellCheck, visible: isSelected() == true' id="spellCheckInput" style="width:350px" onblur=" model.SpellCheck(); "></textarea>
                    <div id="spellCheckPanel" style="height: 26px; width:350px; border: 1px solid lightgray; position: relative; top: -1px;"  oncontextmenu=" model.Suggestions()"  data-bind="visible: isSelected() == false "></div>
                </div>                
            </div>          

        </div>
                
    </form>
</body>
</html>

