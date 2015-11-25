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

/*ul > li
{    
  background-color: lightgray;
  width: 350px;
}*/

    </style>

    <script>

        

        function SpellCheckViewCtrl3() {

            this.isSelected = ko.observable(true);
            this.Words = ko.observableArray();

            this.instantaneousValue = ko.observable();

            this.throttledValue = ko.computed(this.instantaneousValue)
                                    .extend({ throttle: 3500 });
            
            this.loggedValues = ko.observableArray([]);

            this.throttledValue.subscribe(function (val) {

                if (val === undefined || this.Words.length > 0)
                    return;

                var words = val.split(' ');

                $("#spellCheckPanel").empty();
                for (var i = 0; i < words.length; i++) {

                    this.Words.push(words[i]);

                    spellChecker.Spell(i, words[i], function (pos, w, data) {
                        if (data !== undefined) {

                            var d = document;
                            var div = d.createElement("div");
                            div.style.display = "inline";

                            $("#spellCheckPanel").append(div);

                            if (data.isCorrect == 0) {
                                //div.style.color = "red";
                                console.log(data);
                                div.className = "dropdown";

                                var button = d.createElement("button");
                                button.type = "button";
                                button.setAttribute("id", "spellButton" + pos);
                                button.setAttribute("type", "button");
                                button.setAttribute("class", "btn btn-danger btn-xs");
                                button.setAttribute("data-toggle", "dropdown");
                                button.setAttribute("aria-haspopup", "true");
                                button.setAttribute("aria-expanded", "false");
                                button.setAttribute("background-color", "red");
                                button.setAttribute("background-color", "red");

                                div.innerHTML = "&nbsp;&nbsp;"

                                button.innerHTML = w;

                                div.appendChild(button);

                                var ul = d.createElement("ul");
                                //ul.style.display = "inline";
                                ul.setAttribute("class", "dropdown-menu");
                                //ul.setAttribute("class", "nav nav-pills");
                                //ul.setAttribute("role", "tablist");

                                div.appendChild(ul);

                                var oli = d.createElement("li");
                                var ao = d.createElement("a");

                                ul.appendChild(oli);

                                ao.innerHTML = w;
                                ao.setAttribute("href", "#");
                                ao.setAttribute("onclick", "return model.ReplaceWord(" + pos + ", " + 0 + ", '" + w  + "')");

                                oli.appendChild(ao);

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

                    $("#spellCheckPanel").width($("#spellCheckInput").width());
                    this.isSelected(false);

                }

            }, this);

            this.setFocus = function (e) {

                //e.preventDefault();

                this.instantaneousValue(this.GetSentence());

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
                //button.setAttribute("class", "btn btn-danger btn-xs");                
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
                <div class="col-lg-6">
                    Demo A: SpellCheckerTextBox control: 
                    - if user entered sentence: last word will be spell checked!
                </div>
                <div class="col-lg-6">
                    <sc:SpellCheckerTextBox SpellingEnabled="true" runat="server" Width="250px" ID="spellcheckerFirst"/>                     
                </div>
            </div>

            <div class="row">
                <div class="col-lg-12">                  
                </div>                
            </div>

            <div class="row">
                <div class="col-lg-6">
                    Demo B: SpellCheckerTextBox 
                    
                </div>
                <div class="col-lg-6">
                    <sc:SpellCheckerTextBoxV2 SpellingEnabled="true" runat="server" Width="250px" ID="SpellCheckerTextBox2"/>                     

                    <div class="modal fade" id="spellCheckModal">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                    <h4 class="modal-title">Custom Spell Checker</h4>
                                </div>
                                <div class="modal-body" >
                                    <div class="container-fluid">
                                        <div class="row">
                                            <div class="col-lg-8" id="spellCheckResult">
                                                Spell Check Results ...
                                            </div>
                                            <div class="col-lg-4" >       
                                                <ol id="listOfOptions"></ol>                                        
                                                <%--<textarea id="spellCheckCorrect" cols="15" rows="5"></textarea>--%>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-lg-8" id="Div1">
                                                <textarea id="spellCheckCorrect" cols="15" rows="5"></textarea>
                                            </div>
                                            <div class="col-lg-4" >                                                       
                                                
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-primary">Save</button>
                                </div>
                            </div>
                            <!-- /.modal-content -->
                        </div>
                        <!-- /.modal-dialog -->
                    </div>


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
                    <input data-bind='value: instantaneousValue, valueUpdate: "afterkeydown", visible: isSelected() == true' id="spellCheckInput" style="width:350px"/></p>                    
                    <div id="spellCheckPanel" style="height: 26px; width:350px; border: 1px solid lightgray; position: relative; top: -10px;" oncontextmenu="return model.setFocus();"  data-bind="visible: isSelected() == false "></div>
                </div>                
            </div>

            <div class="row">
                <div class="col-lg-6">                  
                    Demo D: to be designed ..
                </div>                
                <div class="col-lg-6" >                    
                    Input control will be placed here ..
                </div>                
            </div>

        </div>
                
    </form>
</body>
</html>

