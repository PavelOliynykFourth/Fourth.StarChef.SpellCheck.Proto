using System;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CustomControls
{
    public class SpellCheckerTextBoxV2 : TextBox
    {
        public string SpellingEnabled { get; set; }


        protected override void Render(HtmlTextWriter output)
        {
            var id = this.ClientID;

            if (SpellingEnabled == "true")
            {
                this.Attributes.Add("onclick", String.Format("  spellChecker.Show('{0}')", id));
                base.Render(output);                
            }

            else base.Render(output);
            
        } 
    }
}
