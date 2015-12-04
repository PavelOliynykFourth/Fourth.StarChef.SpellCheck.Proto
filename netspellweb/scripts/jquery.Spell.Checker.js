/*! HTML5 Spell Checker component - v0.0.1 - 2015-12-03
* https://github.com/Skypus/Spell.Checker
* Copyright (c) 2015 Pavel Oliynyk; Licensed MIT */
/*! HTML5 Spell Checker component - v0.0.1 - 2015-12-03
* https://github.com/Skypus/Spell.Checker
* Copyright (c) 2015 Pavel Oliynyk; Licensed MIT */

function SpellCheckerManager()
{
    var self = this;

    self.Controls = [];

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                Public Methods
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    self.SetLocation = function(serviceUrl){
        self.ServiceLocation = serviceUrl;
    }

    self.Register = function(id){

        for(var i = 0; i < self.Controls.length; i++)
        {
          if ( self.Controls[i].Id === id)
          {
            return;
          }
        }

        //<div id="spellCheckPanel" style="height: 26px; width:350px; border: 1px solid lightgray; position: relative; top: -1px;"  oncontextmenu=" model.Suggestions()"  data-bind="visible: isSelected() == false "></div>
        var staticPanel = document.createElement("div");
        var inputCtr = document.getElementById(id);
        var inputCtrlParent = document.getElementById(id).parentNode;

        inputCtr.setAttribute("onblur", "scManager.OnInputComplete('" + id + "') ");
        //inputCtr.setAttribute("onblur", "onCustomBlur(event)");

        scManager.TabIndex = self.TabIndex === undefined ? 100 : self.TabIndex + 1;
        inputCtr.setAttribute("tabIndex", self.TabIndex);
        //inputCtr.setAttribute("onfocusout", "scManager.OnInputComplete('" + id + "') ");

        var staticPanelId = "StaticPanel" + self.Controls.length;
        staticPanel.id = staticPanelId;
        staticPanel.setAttribute("onclick", "scManager.onCustomClick(event, '" + id + "') ");

        var style = "height : " + $("#" + inputCtr.id).height() + "px; ";
        style += "width: " + $("#" + inputCtr.id).width() + "px;";
        style += "width: " + $("#" + inputCtr.id).width() + "px;";
        style += "border: 1px solid lightgray;  background-color: white; ";

        staticPanel.setAttribute("style",  style );
        staticPanel.setAttribute("position",  "relative; top: -1px" );
        //staticPanel.setAttribute("oncontextmenu",  " scManager.onContextMenu(event, '" + scManager.Controls.length + "')" );

        inputCtrlParent.appendChild(staticPanel);
        $("#" + staticPanelId).hide();

        // State: 0 - input on; 1 - show static text/input off;
        var ctrl = { Id: id, StaticPanelId:  staticPanelId, Words: [], State: 0, Index: self.Controls.length };
        self.Controls.push(ctrl);
    }

    self.OnInputComplete = function(id){
      var val = document.getElementById(id).value;

      var item = GetById(id);

      $("#" + item.StaticPanelId).height( $("#" + id).height() );
      $("#" + item.StaticPanelId).width( $("#" + id).width() );

      var words = val !== undefined && val !== '' ? val.split(" ") : [];

      item.Words = [];

      for(var i = 0; i < words.length; i++)
      {
        item.Words.push(words[i]);
      }

      setStaticPanel(id);
    }

    self.onContextMenu = function(event, jsonStr){
      if (event !== undefined) {

        event.preventDefault ? event.preventDefault() : event.returnValue = false;

        //console.log(index);
        var context =  jQuery.parseJSON(jsonStr);
        var item = GetByIndex( parseInt(context.ControlIndex) );
        var id = item.StaticPanelId + "_" + parseInt(context.WordIndex) + "Suggestions";

        if (self.SelectedPopUp !== undefined)
        {
          self.SelectedPopUp.hide();
        }
        self.SelectedPopUp = $("#" + id);
        self.SelectedPopUp.show();
      }
    }

    self.Apply = function(){
      var list = $(".spellCheckerControl");
      if ( list !== undefined)
      {
          for(var i = 0; i < list.length; i++)
          {
              var element = list[i];
              if (element !== undefined && element.id !== undefined)
              {
                self.Register(element.id)
              }
          }
      }
    };

    self.onCustomClick = function(event, idx){
          if (self !== undefined && self){

            if (self.SelectedPopUp !== undefined)
            {
              self.SelectedPopUp.hide();
            }

            if (event.target && event.target.parentElement != null && event.target.parentElement.localName === "li") {
                  event.preventDefault ? event.preventDefault() : event.returnValue = false;
                  return;
            } else if (event.target && event.target.id !== undefined && (event.target.id.indexOf("StaticPanel")  >= 0 || (event.target.parentNode.id !== undefined && event.target.parentNode.id.indexOf("StaticPanel")  >= 0) )  ) {
                  var index = -1;
                  var elementId;
                  if (event.target.id.indexOf("StaticPanel")  >= 0)
                  {
                    var innerHTML = event.target.innerHTML !== undefined ? event.target.innerHTML.replace("&nbsp;", "").trim(): undefined;
                    index = event.target.id.replace("StaticPanel", "");
                    index = innerHTML !== undefined && innerHTML.length > 0 ? index.replace(innerHTML, "") : index;
                    elementId = innerHTML !== undefined ? event.target.id.replace(innerHTML, "") : event.target.id;
                  }
                  else if (event.target.parentNode.id.indexOf("StaticPanel")  >= 0)
                  {
                    index = event.target.parentNode.id.replace("StaticPanel", "");
                    elementId = event.target.parentNode.id;
                  }

                  var item = GetByIndex(index);
                  if (item !== undefined && item.Status === 1)
                  {
                    setInputFocus(elementId);
                  }
            } else if (event.srcElement) {
              var id = event.srcElement.id;

              if (id !== undefined && id.indexOf("SpellHref") >= 0)
              {

                return;
              } else {

                var item = GetById( idx );

                var elementId = item.StaticPanelId;

                setInputFocus(elementId);

              }
            }
            return;
          }
      }

    self.CheckAll = function(){
        for(var i = 0; i < self.Controls.length; i++)
        {
          var value = $("#" + self.Controls[i].Id ).val();
          if (value !== undefined && value.length > 1)
          {
            self.OnInputComplete( self.Controls[i].Id );
          }
        }
    }

    self.Fix = function(jsonStr){

        var context =  jQuery.parseJSON(jsonStr);

        var item = GetByIndex( parseInt(context.ControlIndex) );

        // Item.StaticPanelId + "_" + pos + "Span";
        var id = item.StaticPanelId + "_" + context.WordIndex + "Span";

        $("#" + id ).html("&nbsp;" + context.ReplaceWith);

        item.Words[ parseInt( context.WordIndex ) ] = context.ReplaceWith;

        $("#" + item.Id ).val( GetSentance(item) );

    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                Private Methods
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function setStaticPanel(id){
      var item = GetById(id);

      var staticPanel = $("#" + item.StaticPanelId);
      var parent = $("#" + id);
      staticPanel.empty();

      for(var i = 0; i < item.Words.length; i++)
      {
        var word = item.Words[i];

        SpellCheck( i, item, word, function(pos, Item, Word, Data){
          var divStyle = "";
          var div = document.createElement("div");
          div.id = Item.StaticPanelId + "_" + pos;
          div.className = "dropdown";
          divStyle = "display: inline;";
          div.setAttribute("oncontextmenu", " scManager.onContextMenu(event, '{ \"ControlIndex\": \"" + Item.Index + "\", \"WordIndex\": \"" + pos + "\" }' ); ");
          staticPanel.append(div);

          //div.innerHTML = "&nbsp;" + Word;
          var span = document.createElement("span");
          span.id = Item.StaticPanelId + "_" + pos + "Span";
          span.innerHTML = "&nbsp;" + Word;
          div.appendChild(span);

          if (Data.isCorrect === 0)
          {
            divStyle += "color: red; ";
            var ul = document.createElement("ul");
            ul.id = Item.StaticPanelId + "_" + pos + "Suggestions";
            document.getElementById(div.id).appendChild( ul );

            for (var j = 0; j < Data.suggestions.length; j++) {
              var li = document.createElement("li");
              var a = document.createElement("a");
              a.id = Item.StaticPanelId + "_" + pos + "SpellHref" + "_" + j ;
              ul.appendChild(li);
              ul.setAttribute("class", "dropdown-menu");

              a.innerHTML = Data.suggestions[j];
              a.setAttribute("href", "#");
              a.setAttribute("onclick", "return scManager.Fix('{ \"ControlIndex\": \"" + Item.Index + "\", \"WordIndex\": \"" + pos + "\", \"ReplaceWith\": \"" + Data.suggestions[j] + "\" }' ); ");

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

    function SpellCheck (pos, item, word, callbackFun){

      var d = { 'method': "checkSpelling", 'text':  word };
      $.ajax({
             type: "POST",
             url: self.ServiceLocation !== undefined ? self.ServiceLocation : "/SpellChecker.ashx",
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
    }

    function GetById(id){
      for(var i = 0; i < self.Controls.length; i++)
      {
        if (self.Controls[i].Id === id)
        {
          return self.Controls[i];
        }
      }
      return undefined;
    }

    function GetByIndex(index){
      return self.Controls[index];
    }

    function setInputFocus(elementId){
        var index = elementId.replace("StaticPanel", "");
        $("#" + elementId).hide();
        var item = GetByIndex( index );
        item.Status = 0;
        $("#" + item.Id ).show();
        $("#" + item.Id ).focus();
    };

    function GetSentance (item){
      var result = "";
      for(var i = 0; i < item.Words.length; i++)
      {
        result += (" " + item.Words[i]);
      }
      return result;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    return self;
}

var scManager = new SpellCheckerManager();
