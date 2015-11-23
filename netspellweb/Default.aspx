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

        </div>
        
    </form>
</body>
</html>
