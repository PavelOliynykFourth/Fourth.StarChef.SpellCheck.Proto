/*! HTML5 Spell Checker component - v0.0.1 - 2015-11-30
* https://github.com/Skypus/Spell.Checker
* Copyright (c) 2015 Pavel Oliynyk; Licensed MIT */
// Spell Checker Manager: each spell checker control must be created via manager
 var scManager = {};

(function($) {

  scManager.Controls = [];

  scManager.Register = function(id){
      for(var i = 0; i < scManager.Controls.length; i++)
      {
        if ( scManager.Controls[i].Id === id)
        {
          return;
        }
      }

      //<div id="spellCheckPanel" style="height: 26px; width:350px; border: 1px solid lightgray; position: relative; top: -1px;"  oncontextmenu=" model.Suggestions()"  data-bind="visible: isSelected() == false "></div>
      var staticPanel = document.createElement("div");
      var inputCtr = document.getElementById(id);
      var inputCtrlParent = document.getElementById(id).parentNode;

      inputCtr.setAttribute("onblur", "scManager.OnInputComplete('" + id + "') ");

      var staticPanelId = "StaticPanel" + scManager.Controls.length;
      staticPanel.id = staticPanelId;

      var style = "height : " + $("#" + inputCtr.id).height() + "px; ";
      style += "width: " + $("#" + inputCtr.id).width() + "px;";
      style += "width: " + $("#" + inputCtr.id).width() + "px;";
      style += "border: 1px solid lightgray;";

      staticPanel.setAttribute("style",  style );
      staticPanel.setAttribute("position",  "relative; top: -1px" );
      //staticPanel.setAttribute("oncontextmenu",  " scManager.onContextMenu(event, '" + scManager.Controls.length + "')" );

      inputCtrlParent.appendChild(staticPanel);
      $("#" + staticPanelId).hide();

      // State: 0 - input on; 1 - show static text/input off;
      var ctrl = { Id: id, StaticPanelId:  staticPanelId, Words: [], State: 0, Index: scManager.Controls.length };
      scManager.Controls.push(ctrl);
  };

  scManager.OnInputComplete = function(id){
    var val = document.getElementById(id).value;
    var item = scManager.GetById(id);
    var words = val !== undefined && val !== '' ? val.split(" ") : [];

    item.Words = [];

    for(var i = 0; i < words.length; i++)
    {
      item.Words.push(words[i]);
    }

    scManager.setStaticPanel(id);
  };

  scManager.setStaticPanel = function(id){
    var item = scManager.GetById(id);

    var staticPanel = $("#" + item.StaticPanelId);
    var parent = $("#" + id);
    staticPanel.empty();

    for(var i = 0; i < item.Words.length; i++)
    {
      var word = item.Words[i];

      scManager.SpellCheck( i, item, word, function(pos, Item, Word, Data){
        var divStyle = "";
        var div = document.createElement("div");
        div.id = Item.StaticPanelId + Word;
        div.className = "dropdown";
        divStyle = "display: inline; ";
        div.setAttribute("oncontextmenu", " scManager.onContextMenu(event, '{ \"ControlIndex\": \"" + Item.Index + "\", \"WordIndex\": \"" + pos + "\" }' ); ");
        staticPanel.append(div);
        div.innerHTML = "&nbsp;" + Word;

        if (Data.isCorrect === 0)
        {
          divStyle += "color: red; ";
          var ul = document.createElement("ul");
          ul.id = Item.StaticPanelId + Word + "Suggestions";
          document.getElementById(Item.StaticPanelId + Word).appendChild( ul );

          for (var j = 0; j < Data.suggestions.length; j++) {
            var li = document.createElement("li");
            var a = document.createElement("a");

            ul.appendChild(li);
            ul.setAttribute("class", "dropdown-menu");

            a.innerHTML = Data.suggestions[j];
            a.setAttribute("href", "#");
            //a.setAttribute("onclick", "return model.ReplaceWord(" + pos + ", " + i + ", '" + data.suggestions[i] + "')");

            li.appendChild(a);
          }
        }
        div.setAttribute('style', divStyle);

      });

    }

    staticPanel.show();
    parent.hide();
    item.Status = 1;
  };

  scManager.SpellCheck = function(pos, item, word, callbackFun){
    //var item = scManager.GetById(id);
    var d = { 'method': "checkSpelling", 'text':  word };
    $.ajax({
           type: "POST",
           url: "/SpellChecker.ashx",
           data: JSON.stringify(d),
           contentType: "application/json; charset=utf-8",
           dataType: "json",
           async: false,
           success: function (data) {
               callbackFun(pos, item, word, data);
           },
           error: function () {
           }
       });
  };

  scManager.onContextMenu = function(event, jsonStr){
    if (event !== undefined) {
      event.preventDefault();
      //console.log(index);
      var context =  jQuery.parseJSON(jsonStr);
      var item = scManager.GetByIndex( parseInt(context.ControlIndex) );
      var id = item.StaticPanelId + item.Words[ parseInt(context.WordIndex) ] + "Suggestions";

      if (scManager.SelectedPopUp !== undefined)
      {
        scManager.SelectedPopUp.hide();
      }
      scManager.SelectedPopUp = $("#" + id);
      scManager.SelectedPopUp.show();
    }
  };

  scManager.GetById = function(id){
    for(var i = 0; i < scManager.Controls.length; i++)
    {
      if ( scManager.Controls[i].Id === id)
      {
        return scManager.Controls[i];
      }
    }
    return undefined;
  };

  scManager.GetByIndex = function(index){
    return scManager.Controls[index];
  };

  scManager.Apply = function(){
    $(".spellCheckerControl").each(function (index, element) {
        scManager.Register(element.id);
    });
  };

  scManager.setInputFocus = function(elementId){
      var index = elementId.replace("StaticPanel", "");
      $("#" + elementId).hide();
      var item = scManager.GetByIndex( index );
      item.Status = 0;
      $("#" + item.Id ).show();
      $("#" + item.Id ).focus();
  };

  // Collection method.
  $.fn.Spell_Checker = function() {

    return this.each(function(i) {
      // Do something awesome to each selected element.
      $(this).html('awesome' + i);
    });
  };

  // Static method.
  $.Spell_Checker = function(options) {
    // Override default options with passed-in options.
    options = $.extend({}, $.Spell_Checker.options, options);
    // Return something awesome.
    return 'awesome' + options.punctuation;
  };

  // Static method default options.
  $.Spell_Checker.options = {
    punctuation: '.'
  };

  // Custom selector.
  $.expr[':'].Spell_Checker = function(elem) {
    // Is this element awesome?
    return $(elem).text().indexOf('awesome') !== -1;
  };

}(jQuery));



function onDocumentClick(e){
      if (scManager !== undefined && scManager){

        if (scManager.SelectedPopUp !== undefined)
        {
          scManager.SelectedPopUp.hide();
        }

        if (e.target.parentElement != null && e.target.parentElement.localName === "li") {
              e.preventDefault();
              return;
        } else if (e.target.id !== undefined && (e.target.id.indexOf("StaticPanel")  >= 0 || (e.target.parentNode.id !== undefined && e.target.parentNode.id.indexOf("StaticPanel")  >= 0) )  ) {
              var index = -1;
              var elementId;
              if (e.target.id.indexOf("StaticPanel")  >= 0)
              {
                var innerHTML = e.target.innerHTML !== undefined ? e.target.innerHTML.replace("&nbsp;", "").trim(): undefined;
                index = e.target.id.replace("StaticPanel", "");
                index = innerHTML !== undefined && innerHTML.length > 0 ? index.replace(innerHTML, "") : index;
                elementId = innerHTML !== undefined ? e.target.id.replace(innerHTML, "") : e.target.id;
              }
              else if (e.target.parentNode.id.indexOf("StaticPanel")  >= 0)
              {
                index = e.target.parentNode.id.replace("StaticPanel", "");
                elementId = e.target.parentNode.id;
              }

              var item = scManager.GetByIndex(index);
              if (item !== undefined && item.Status === 1)
              {
                scManager.setInputFocus(elementId);
              }
        }
        return;
      }
  }

  document.onclick = onDocumentClick;
