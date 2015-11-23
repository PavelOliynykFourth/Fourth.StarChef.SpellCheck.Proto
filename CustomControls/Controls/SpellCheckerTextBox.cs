using System;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CustomControls
{
    public class SpellCheckerTextBox : TextBox
    {
        public string SpellingEnabled { get; set; }


        protected override void Render(HtmlTextWriter output)
        {
            var id = this.ClientID;

            if (SpellingEnabled == "true")
            {
                this.Attributes.Add("onkeyup", String.Format("  spellChecker.checkSpelling('{0}')", id));
                base.Render(output);
                output.Write("<input type='button' id='addButton' disabled='disabled' value='Add' onclick=\"spellChecker.addWordToDictionary('{0}')\"/> " +
                             "<input type='button' id='removeButton' disabled='disabled' value='Remove' onclick=\"spellChecker.removeWordFromDictionary('{0}');\"/>" +
                             "<ul class='optionsList' stlye='background-color: #FFF;'></ul>", id);
            }

            else base.Render(output);
            
        } 
    }
}
