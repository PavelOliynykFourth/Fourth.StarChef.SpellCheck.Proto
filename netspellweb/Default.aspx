<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="netspellweb.Default" %>
<%@ Register TagPrefix="sc" Namespace="CustomControls" Assembly="CustomControls" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Spell Check</title>
    <script src="scripts/jquery.min.1.4.js"></script>
    <script src="scripts/spellchecker.js"></script>
    
</head>
<body id="SpellingBody" style="MARGIN: 0px" runat="server">
    <form id="SpellingForm" name="SpellingForm" runat="server">
        <div style="float: left">
           <sc:SpellCheckerTextBox SpellingEnabled="true" runat="server" ID="spellcheckerFirst"/> 
        </div>
    </form>
</body>
</html>
