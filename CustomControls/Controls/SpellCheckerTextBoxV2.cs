using System;
using System.ComponentModel;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CustomControls
{
    /// <summary>
    /// This is an extended version of the standard TextBox control, which handles the OnChange event
    /// client-side, and sets a javascript variable called _isDirty.
    /// NB. This client side event is fired once the textbox loses focus.
    /// </summary>
    public class ChangeTrackerTextBox : System.Web.UI.WebControls.TextBox
    {
        //private LocalizedPage _basePage;
        private const string _clientScriptName = "ChangeTrackerTextBox_ScriptBlock";

        [Bindable(false),
        Category("Appearance"),
        DefaultValue("false"),
        Description("Used Enable Spell Checker functionality")]
        public bool SpellingEnabled
        {
            get
            {
                return (ViewState["SpellingEnabled"] == null ? false : bool.Parse(ViewState["SpellingEnabled"].ToString()));
            }

            set
            {
                ViewState["SpellingEnabled"] = value;
            }
        }

        [Bindable(false),
        Category("Appearance"),
        DefaultValue(""),
        Description("Used to restrict allowable input to predefined types.")]
        public string InputMask
        {
            get
            {
                return (ViewState["InputMask"] == null ? string.Empty : ViewState["InputMask"].ToString());
            }

            set
            {
                ViewState["InputMask"] = value;
            }
        }

        [Bindable(false),
        Category("Appearance"),
        DefaultValue(""),
        Description("This is the unit to display as selected.")]
        public string NavigateUrl
        {
            get
            {
                return (ViewState["NavigateUrl"] == null ? string.Empty : ViewState["NavigateUrl"].ToString());
            }

            set
            {
                ViewState["NavigateUrl"] = value;
            }
        }

        [Bindable(false),
        Category("Appearance"),
        DefaultValue(""),
        Description("Used to add additional javascript calculation functions.")]
        public string AuxiliaryMethod
        {
            get
            {
                return (ViewState["AuxiliaryMethod"] == null ? string.Empty : ViewState["AuxiliaryMethod"].ToString());
            }

            set
            {
                ViewState["AuxiliaryMethod"] = value;
            }
        }

        [Bindable(false),
        Category("Appearance"),
        DefaultValue(""),
        Description("")]
        public string View
        {
            get
            {
                return (ViewState["View"] == null ? string.Empty : ViewState["View"].ToString());
            }

            set
            {
                ViewState["View"] = value;
            }
        }

        [Bindable(false),
        Category("Appearance"),
        DefaultValue(""),
        Description("")]
        public string StandardView
        {
            get
            {
                return (ViewState["StandardView"] == null ? string.Empty : ViewState["StandardView"].ToString());
            }

            set
            {
                ViewState["StandardView"] = value;
            }
        }
        #region Overrides
        /// <summary> 
        /// Overrides the AddAttributesToRender method of the Control class, adding an OnChange client side 
        /// event handler.  
        /// </summary>
        /// <param name="writer"> The HtmlTextWriter object which handles the output </param>
        override protected void AddAttributesToRender(HtmlTextWriter writer)
        {
            //if (!this.ReadOnly)
            //{
            //    // add the Onchange attribute to the textbox, so that the javascript is called
            //    switch (InputMask.ToLower())
            //    {
            //        case "integer":
            //            writer.AddAttribute("onkeyup", "checkInt(event);" + AuxiliaryMethod);
            //            break;
            //        case "decimal":
            //            writer.AddAttribute("onkeyup", "checkDecimal(event);" + AuxiliaryMethod);
            //            break;
            //        case "unit":
            //            writer.AddAttribute("onkeyup", "checkUnit(event, " + (DbManager.GetBoolSetting(Constants.ALLOW_FRACTION_INPUT) ? "true" : "false") + ");" + AuxiliaryMethod);
            //            break;
            //    }
            //}

            if (View != string.Empty)
            {
                writer.AddAttribute("view", View);
            }

            if (StandardView != string.Empty)
            {
                writer.AddAttribute("standardView", StandardView);
            }

            if (!this.ReadOnly || View != string.Empty || StandardView != string.Empty)
            {
                // call the base implementation
                base.AddAttributesToRender(writer);
            }
        }

        override protected void Render(HtmlTextWriter output)
        {
            if (this.ReadOnly)
            {
                string validUrl = string.Empty;

                if (NavigateUrl != string.Empty)
                {
                    try
                    {
                        UriBuilder ub = new UriBuilder(NavigateUrl);
                        validUrl = ub.Uri.AbsoluteUri;
                    }
                    catch
                    {
                        // non critical if they enter crap URL ... just display as text
                    }
                }
                if (validUrl != string.Empty)
                {
                    output.WriteBeginTag("a");
                    output.WriteAttribute("id", this.ClientID);
                    output.WriteAttribute("href", validUrl);
                    // default to opening in a new window
                    output.WriteAttribute("target", "_blank");
                    output.Write(HtmlTextWriter.TagRightChar);
                    if (this.Font.Bold == true) output.WriteFullBeginTag("b");
                    output.Write(this.Text);
                    if (this.Font.Bold == true) output.WriteEndTag("b");
                    output.WriteEndTag("a");
                }
                else
                {
                    output.WriteBeginTag("span");
                    output.WriteAttribute("id", this.ClientID);
                    if (View != string.Empty)
                    {
                        if (this.Style["display"] != null && this.Style["display"] == "none")
                            output.WriteAttribute("style", "display: none");
                        else if (this.Style["display"] != null && this.Style["display"] == "block")
                        {
                            output.WriteAttribute("style", "display: block");
                            output.WriteAttribute("visibility", "visible");
                        }
                        output.WriteAttribute("view", View);
                    }
                    if (StandardView != string.Empty)
                    {
                        output.WriteAttribute("standardView", StandardView);
                    }
                    output.Write(HtmlTextWriter.TagRightChar);
                    if (this.Font.Bold == true) output.WriteFullBeginTag("b");
                    if (this.TextMode == TextBoxMode.MultiLine)
                        output.Write(this.Text.Replace("\n", "<br>"));
                    else
                        output.Write(this.Text);
                    if (this.Font.Bold == true) output.WriteEndTag("b");
                    output.WriteEndTag("span");
                }
            }
            else
            {
                base.Render(output);
            }
        }

        override protected void AddParsedSubObject(object obj)
        {
            if (!this.ReadOnly)
            {
                // call the base implementation
                base.AddParsedSubObject(obj);
            }
        }

        /// <summary> 
        /// Overrides the OnInit event handler of the Control class, registering a client side script
        /// block which sets an _isDirty variable on the event  
        /// </summary>
        /// <param name="e"> The System.EventArgs object </param>
        override protected void OnInit(System.EventArgs e)
        {
            //_basePage = (LocalizedPage)(this.Page);
            // call the base implementation
            base.OnInit(e);
        }

        protected override void OnLoad(EventArgs e)
        {
            /* moved to utils.js
			
            // register our javascript which is called on the OnChange event
            if (!this.ReadOnly && !Page.IsClientScriptBlockRegistered(_clientScriptName))
            {
                ResourceManager manager = new ResourceManager( this.GetType() );
                String script = manager.GetResourceSet(System.Globalization.CultureInfo.CurrentCulture, true, true).GetString(_clientScriptName);
                Page.RegisterClientScriptBlock(_clientScriptName, script);
            }*/

            if (this.SpellingEnabled)
                this.CssClass += "spellCheckerControl";

            base.OnLoad(e);
        }

        protected override void OnPreRender(EventArgs e)
        {
            base.OnPreRender(e);
            Page_LocaliseJavascript();
        }


        #endregion

        #region Public Methods
        public bool ValidateNumeric(double minValue, double maxValue)
        {
            string err = string.Empty;

            return ValidateNumeric(string.Empty, minValue, maxValue, true, ref err);
        }

        public bool ValidateNumeric(string label, double minValue, double maxValue, ref string errorDescription)
        {
            return ValidateNumeric(label, minValue, maxValue, true, ref errorDescription);
        }

        public bool ValidateNumeric(string label, double minValue, double maxValue, bool isInclusive, ref string errorDescription)
        {
            double num = 0;
            if (this.Text != string.Empty)
            {
                if (!double.TryParse(this.Text, System.Globalization.NumberStyles.Number, System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat, out num))
                {
                    //errorDescription = _basePage.GetResString("ErrorNonNumeric", new object[] { label });
                    return false;
                }
                else if (isInclusive && (num < minValue || num > maxValue))
                {
                    //errorDescription = _basePage.GetResString("ErrorOutsideBoundsInclusive", new object[] { label, minValue.ToString("N0"), maxValue.ToString("N0") });
                    return false;
                }
                else if (!isInclusive && (num <= minValue || num >= maxValue))
                {
                    //errorDescription = _basePage.GetResString("ErrorOutsideBoundsExclusive", new object[] { label, minValue.ToString("N0"), maxValue.ToString("N0") });
                    return false;
                }
            }
            return true;
        }

        /// <summary>
        /// Checks for valid input based on the InputMask attribute.  Supported masks are currently 'Unit' and 'Integer'
        /// </summary>
        /// <param name="label">Field label used to generate error message</param>
        /// <param name="isRequired">If set, returns false (invalid) for empty string</param>
        /// <param name="errorDescription">Placeholder to return an error message</param>
        /// <param name="minValue">Minimum allowable numeric value</param>
        /// <param name="maxValue">Maximum allowable numeric value</param>
        /// <param name="isInclusive">If set, returns invalid if value is equal to upper or lower bound</param>
        /// <returns></returns>
        public bool ValidateInput(string label, bool isRequired, ref string errorDescription, decimal minValue, decimal maxValue, bool isInclusive)
        {
            //if (this.Text == string.Empty)
            //{
            //    if (isRequired)
            //    {
            //        //errorDescription = _basePage.GetResString("ErrorMissingValue", label);
            //        return false;
            //    }
            //    else
            //    {
            //        return true;
            //    }
            //}
            //decimal val = 0;
            //switch (InputMask.ToLower())
            //{
            //    //case "integer":
            //    //    int ival = 0;
            //    //    if (!UIHelper.IsInteger(this.Text, ref ival))
            //    //    {
            //    //        errorDescription = _basePage.GetResString("ErrorNonNumeric", new object[] { label });
            //    //        return false;
            //    //    }
            //    //    val = Convert.ToDecimal(ival);
            //    //    break;

            //    //case "unit":
            //    //    if (!this.ParseUnitValue(ref val))
            //    //    {
            //    //        errorDescription = _basePage.GetResString("ErrorNonNumeric", new object[] { label });
            //    //        return false;
            //    //    }
            //    //    break;

            //    //case "decimal":
            //    //    if (!UIHelper.IsDecimal(this.Text, ref val))
            //    //    {
            //    //        errorDescription = _basePage.GetResString("ErrorNonNumeric", new object[] { label });
            //    //        return false;
            //    //    }
            //    //    break;

            //}
            //if (isInclusive && (val < minValue || val > maxValue))
            //{
            //    errorDescription = _basePage.GetResString("ErrorOutsideBoundsInclusive", new object[] { label, minValue.ToString("N0"), maxValue.ToString("N0") });
            //    return false;
            //}
            //else if (!isInclusive && (val <= minValue || val >= maxValue))
            //{
            //    errorDescription = _basePage.GetResString("ErrorOutsideBoundsExclusive", new object[] { label, minValue.ToString("N0"), maxValue.ToString("N0") });
            //    return false;
            //}
            return true;
        }

        /// <summary>
        /// Overloaded version of the ValidateInput function which passed in default values based on the InputMask.
        /// Currently only the 'Unit' mask is supported
        /// </summary>
        /// <param name="label">Field label used to generate error message</param>
        /// <param name="isRequired">If set, returns false (invalid) for empty string</param>
        /// <param name="errorDescription">Placeholder to return an error message</param>
        /// <returns></returns>
        public bool ValidateInput(string label, bool isRequired, ref string errorDescription)
        {
            if (this.Visible)
            {
                // default for input mask type unit
                //decimal minValue = 0;
                //decimal maxValue = Constants.UPPER_VALIDATION_THRESHOLD_UNIT;
                bool isInclusive = false;

                //return ValidateInput(label, isRequired, ref errorDescription, minValue, maxValue, isInclusive);
            }
            return true;
        }

        public bool ParseIntegerValue(ref int val)
        {
            //return UIHelper.IsInteger(this.Text, ref val);
            return true;
        }

        public bool ParseUnitValue(ref decimal val)
        {
            //if (!UIHelper.IsDecimal(this.Text, ref val))
            //{
            //    if (DbManager.GetBoolSetting(Constants.ALLOW_FRACTION_INPUT) && !UIHelper.IsFraction(this.Text, ref val))
            //    {
            //        return false;
            //    }
            //}
            return true;
        }

        public bool ParseDecimalValue(ref decimal val)
        {
            //return UIHelper.IsDecimal(this.Text, ref val);
            return true;
        }


        public void SetUnitValue(decimal val, bool showAsFraction)
        {
            //if (showAsFraction)
            //{
            //    this.Text = UIHelper.ConvertToFraction(val);
            //}
            //else
            //{
            //    this.Text = val.ToString("0.####");
            //}
        }

        public void SetValue(int val)
        {
            this.Text = val.ToString();
        }

        public void SetValue(decimal val)
        {
            this.SetValue(val, false);
        }

        public void SetValue(decimal val, bool showAsFraction)
        {
            switch (InputMask.ToLower())
            {
                case "integer":
                    this.Text = val.ToString("N0");
                    break;

                case "unit":
                    this.SetUnitValue(val, showAsFraction);
                    break;

                case "decimal":
                    this.Text = val.ToString("0.###");
                    break;

                default:
                    this.Text = val.ToString();
                    break;
            }
        }

        public bool GetValue(ref int val)
        {
            // should assert input mask here
            if (InputMask.ToLower() == "integer")
                return ParseIntegerValue(ref val);

            return false;
        }

        public bool GetValue(ref decimal val)
        {
            // should assert input mask here
            switch (InputMask.ToLower())
            {
                case "unit":
                    return ParseUnitValue(ref val);

                case "decimal":
                    return ParseDecimalValue(ref val);

                default:
                    return false;
            }
        }


        #endregion

        #region Private Methods

        private void Page_LocaliseJavascript()
        {
            //string[] js_StringKey = new string[5];
            //js_StringKey[0] = "JS_Warning_MustBeNumber";
            //js_StringKey[1] = "JS_Warning_MustBeDecimal";
            //js_StringKey[2] = "JS_Warning_MustBeNumberOrFraction";
            //js_StringKey[3] = "JS_Warning_MustBeWithinTheRange";
            //js_StringKey[4] = "JS_Warning_FieldMustBeWithinTheRange";
            //LocalizedPage.RegisterLocaleResource(js_StringKey);
        }

        #endregion
    }
}
