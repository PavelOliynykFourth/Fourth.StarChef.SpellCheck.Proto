using System;
using System.Collections.Generic;
using System.IO;
using System.Web;
using System.Web.Script.Serialization;
using NHunspell;

namespace netspellweb
{
    /// <summary>
    /// Summary description for spellChecker
    /// </summary>
    public class SpellChecker : IHttpHandler
    {
        private JavaScriptSerializer _jss;

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/json";

            _jss = new JavaScriptSerializer();
            var json = new StreamReader(context.Request.InputStream).ReadToEnd();

            var sData = _jss.Deserialize<Dictionary<string, string>>(json);

            var text = sData["text"];

            switch (sData["method"])
            {
                case "addWord":
                    AddWordToDictionary(text);
                    break;
                case "removeWord":
                    RemoveWordFromDictionary(text);
                    break;
                case "checkSpelling":
                    CheckSpelling(context, text);
                    break;

                default:
                    throw new ArgumentException("unknown method");
            }
            

            
        }

        private void CheckSpelling(HttpContext context, string textToSpell)
        {
            bool correct = Global.SpellEngine["en"].Spell(textToSpell);
            if (correct)
            {
                context.Response.Write(
                        _jss.Serialize(
                            new
                            {
                                isCorrect = 1
                            }
                        )
                    );
            }
            else
            {
                List<string> suggestions = Global.SpellEngine["en"].Suggest(textToSpell);
                context.Response.Write(
                    _jss.Serialize(
                        new
                        {
                            isCorrect = 0,
                            suggestions = suggestions.ToArray()
                        }
                    )
                );
            }
        }

        private void AddWordToDictionary(string word)
        {
            Global.SpellEngine["en"].Add(word);
        }

        private void RemoveWordFromDictionary(string word)
        {
            Global.SpellEngine["en"].Remove(word);
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}