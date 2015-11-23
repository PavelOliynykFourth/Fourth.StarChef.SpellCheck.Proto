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
                case "checkSpellingAll":
                    CheckSpellingAll(context, text);
                    break;
                case "Suggest":
                    Suggest(context, text);
                    break;
                default:
                    throw new ArgumentException("unknown method");
            }
            

            
        }

        private void Suggest(HttpContext context, string textToSpell)
        {
            List<string> suggestions = Global.SpellEngine["en"].Suggest(textToSpell.Trim());
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

        private void CheckSpellingAll(HttpContext context, string textToSpell)
        {
            var words = textToSpell.Split(" ".ToCharArray() );
            var result = string.Empty;            
            for (var i = 0; i < words.Length; i++)
            {
                var word = words[i];
                bool correct = Global.SpellEngine["en"].Spell(word);
                if (correct)
                    result += string.Format("&nbsp; {0}", word);
                else
                    result += string.Format("&nbsp;<font color='red' onclick=\"spellChecker.SuggetSome('{0}')\">{1}</font>", word, word);
            }

            context.Response.Write(
                   _jss.Serialize(
                       new
                       {
                           isCorrect = 1,
                           Result = result,
                           Origin = textToSpell
                       }
                   )
               );
          
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