<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Integration.aspx.cs" Inherits="netspellweb.Integration" %>
<%@ Register TagPrefix="sc" Namespace="CustomControls" Assembly="CustomControls" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <script src="scripts/jquery-1.9.1.js"></script>
    <script src="scripts/jquery.Spell.Checker.js"></script>

    <script>
        $(document).ready(function () {

            scManager.Apply();

        });
    </script>
    <link href="css/Spell.Checker.css" rel="stylesheet" />
</head>
<body>
    <form id="form1" runat="server">
    <div>
            
        <table style="width:50%; border: solid 1px;">
            <tr>
                <td>
                    &nbsp;
                </td>
                <td>
                    &nbsp;
                </td>
            </tr>
            <tr>
                <td>
                    Data to be entered:
                </td>
                <td>
                    <sc:ChangeTrackerTextBox ID="txtInternalCode" Runat="server" ReadOnly="False" MaxLength="50" Style="width: 250px" SpellingEnabled="true"></sc:ChangeTrackerTextBox>
                </td>
            </tr>
            <tr>
                <td>
                    &nbsp;
                </td>
                <td>
                    &nbsp;
                </td>
            </tr>            
        </table>

    </div>
    </form>
</body>
</html>
