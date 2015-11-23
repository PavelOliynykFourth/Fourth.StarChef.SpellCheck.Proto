<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="netspellweb.Default" %>
<%@ Register TagPrefix="sc" Namespace="CustomControls" Assembly="CustomControls" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Spell Check</title>
    
    <script src="scripts/jquery-1.9.1.js"></script>
    <link href="Content/bootstrap.css" rel="stylesheet" />
    <script src="scripts/bootstrap.js"></script>    
    <script>

        var spellChecker = {};

    </script>
    <script src="scripts/spellchecker.js"></script>

    <style>

ul > li
{    
  background-color: lightgray;
  width: 350px;
}

    </style>
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

        </div>
        
    </form>
</body>
</html>
