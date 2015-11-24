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
    
    <script src="scripts/SpellCheckCtrl3View.js" type="text/javascript"></script>
    <style>

ul > li
{    
  background-color: lightgray;
  width: 350px;
}

    </style>

    <script>

        $(document).ready(function () {

            function SpellCheckViewCtrl3() {
                this.isSelected = ko.observable(true);                
                this.instantaneousValue = ko.observable();

                this.throttledValue = ko.computed(this.instantaneousValue)
                                        .extend({ throttle: 2500 });

                // Keep a log of the throttled values
                this.loggedValues = ko.observableArray([]);

                this.throttledValue.subscribe(function (val) {                    

                    if (val === undefined)
                        return;

                    var words = val.split(' ');

                    

                    $("#spellCheckPanel").empty();
                    for (var i = 0; i < words.length; i++) {

                        spellChecker.Spell(words[i], function (w, data) {
                            if (data !== undefined) {
                                
                                var d = document;
                                var e = d.createElement("font");
                                if (data.isCorrect == 0) {
                                    e.style.color = "red";                                    
                                }
                                e.innerHTML = "&nbsp;" + w;
                                $("#spellCheckPanel").append(e);
                            }
                        });
                        this.isSelected(false);
                        

                    }

                }, this);
                
                this.setFocus = function () {
                    $("#spellCheckPanel").empty();
                    $("#spellCheckInput").focus();
                    this.isSelected(true);
                    console.log( this.isSelected() );
                };
            }

            var model = new SpellCheckViewCtrl3();
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

                    <p>Type stuff here:
                    <input data-bind='value: instantaneousValue, valueUpdate: "afterkeydown", visible: isSelected() == true' id="spellCheckInput" style="width:350px"/></p>                    
                    <div id="spellCheckPanel" style="width:350px; border: thin; position: relative; top: -32px; left: 100px" data-bind="click: setFocus, visible: isSelected() == false "></div>

                </div>                
            </div>

        </div>
        
        <input id="fakeMe" type="button"/>
    </form>
</body>
</html>

