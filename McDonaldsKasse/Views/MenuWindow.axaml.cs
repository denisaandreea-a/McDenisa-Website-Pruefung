using Avalonia.Controls;
using Avalonia.Interactivity;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace McDonaldsKasse.Views
{
    public partial class MenuWindow : Window
    {
        public ObservableCollection<string> BestellListe { get; set; }

        // Hier merken wir uns die Zahl vom Tastenfeld (Standard ist 1)
        private int _aktuelleMenge = 1;

        public MenuWindow()
        {
            InitializeComponent();
            BestellListe = new ObservableCollection<string>();
            DataContext = this;
        }

        // =========================================================
        // 1. ZAHLEN-LOGIK (Die Buttons 0-9)
        // =========================================================
        private void OnNummerClick(object sender, RoutedEventArgs e)
        {
            var btn = (Button)sender;
            int zahl = int.Parse(btn.Content.ToString());

            if (zahl == 0)
            {
                // BUTTON 0: Löschen
                var listBox = this.FindControl<ListBox>("OrderListBox");
                var ausgewähltesItem = listBox.SelectedItem as string;

                if (ausgewähltesItem != null)
                {
                    BestellListe.Remove(ausgewähltesItem);
                    listBox.SelectedItem = null;
                }
                _aktuelleMenge = 1;
            }
            else
            {
                // BUTTON 1-9: Menge merken
                _aktuelleMenge = zahl;
            }
        }

        // =========================================================
        // 2. GRUPPIEREN (Zusammenfassen statt untereinander)
        // =========================================================
        private void FuegeHinzu(string neuerArtikelText)
        {
            string gefundenerEintrag = null;
            int index = -1;

            // Prüfen, ob Artikel schon da ist
            for (int i = 0; i < BestellListe.Count; i++)
            {
                if (BestellListe[i].EndsWith(" " + neuerArtikelText))
                {
                    gefundenerEintrag = BestellListe[i];
                    index = i;
                    break; 
                }
            }

            if (gefundenerEintrag != null)
            {
                // Vorhanden: Menge erhöhen (z.B. aus 1x wird 2x)
                string[] teile = gefundenerEintrag.Split(new string[] { "x" }, System.StringSplitOptions.None);
                int alteMenge = int.Parse(teile[0]);
                int neueGesamtMenge = alteMenge + _aktuelleMenge;
                BestellListe[index] = $"{neueGesamtMenge}x {neuerArtikelText}";
            }
            else
            {
                // Neu: Hinzufügen
                BestellListe.Add($"{_aktuelleMenge}x {neuerArtikelText}");
            }

            // Zähler zurücksetzen
            _aktuelleMenge = 1;
        }

        // =========================================================
        // 3. PRODUKTE (Deine angepassten Texte)
        // =========================================================
        public async void OnProduktClick(object sender, RoutedEventArgs e)
        {
            var button = (Button)sender;
            if (button.Content == null) return;

            string produktName = button.Content.ToString();
            string bestellText = produktName; 

            // FALL A: Es ist ein MENÜ
            if (produktName.Contains("Menu"))
            {
                string burgerName = produktName.Replace(" Menu", "");
                var dialog = new MenuConfigWindow(burgerName);
                await dialog.ShowDialog(this);

                if (dialog.ResultString != null)
                {
                    FuegeHinzu(dialog.ResultString);
                }
                return;
            }
            
            // HAPPY MEAL (Deine neuen Zutaten)
            else if (produktName.Contains("Happy Meal"))
            {
                string hauptspeise = produktName.Replace("Happy Meal ", "");

                // Deine Liste: Apfeltüte, Fruchtquatsch, McFreezy Eis
                var beilagen = new List<string> { "Apfeltüte", "Fruchtquatsch", "McFreezy Eis" };
                string beilage = await FrageStellen("Wähle ein Nachtisch", beilagen);
                if (beilage == null) return; 

                // Deine Liste: Capri-Sun, Wasser, O-Saft, Bio-Apfelschorle
                var getraenke = new List<string> { "Capri-Sun", "Wasser", "O-Saft", "Bio-Apfelschorle" };
                string getraenk = await FrageStellen("Wähle ein Getränk:", getraenke);
                if (getraenk == null) return; 

                FuegeHinzu($"Happy Meal {hauptspeise} \n ({beilage}, {getraenk})");
            }
            
            // POMMES
            else if (produktName.Contains("Pommes"))
            {
                var optionen = new List<string> { "Klein", "Mittel", "Groß" };
                string wahl = await FrageStellen("Welche Größe?", optionen);
                if (wahl != null) FuegeHinzu($"Pommes ({wahl})");
            }

            // NUGGETS
            else if (produktName.Contains("Nuggets"))
            {
                string menge = await FrageStellen("Wie viele?", new List<string> { "6er", "9er", "20er" });
                if (menge == null) return;
                
                // Deine Soßen-Liste
                string sosse = await FrageStellen("Welche Soße?", new List<string> { "Mayonaisse", "Ketchup", "Süßsauer", "Curry", "BBQ", "Senf" });
                
                if (sosse != null) FuegeHinzu($"Nuggets {menge} \n ({sosse})");
            }

            // EIS / MCFLURRY
            else if (produktName.Contains("Eis") || produktName.Contains("McFlurry"))
            {
                var toppings = new List<string> { "Schokolade Soße", "Karamell Soße", "Ohne Soße" };
                string wahl = await FrageStellen("Topping:", toppings);
                if (wahl != null) FuegeHinzu($"Eis \n ({wahl})");
            }

            // MILKSHAKE
            else if (produktName.Contains("Milkshake"))
            {
                string geschmack = await FrageStellen("Geschmack?", new List<string> { "Vanille", "Schokolade", "Erdbeere" });
                if (geschmack == null) return;
                string groesse = await FrageStellen("Größe?", new List<string> { "Klein", "Mittel", "Groß" });
                if (groesse != null) FuegeHinzu($"Milkshake {geschmack} \n ({groesse})");
            }

            // GETRÄNKE
            else if (produktName.Contains("Getränk") || produktName == "Cola" || produktName == "Fanta")
            {
                // Deine Liste inkl. Ice Tea
                string sorte = produktName == "Getränk" ? await FrageStellen("Sorte:", new List<string> { "Cola", "Fanta", "Sprite", "Ice Tea" }) : produktName;
                if (sorte == null) return;
                string groesse = await FrageStellen("Größe?", new List<string> { "0,25l", "0,4l", "0,5l" });
                if (groesse != null) FuegeHinzu($"{sorte} \n ({groesse})");
            }

            // EXTRA SOßEN
            else if (produktName.Contains("Soße"))
            {
                string wahl = await FrageStellen("Welche Soße?", new List<string> { "Mayonnaise", "Ketchup", "Süßsauer", "BBQ", "Senf" });
                if (wahl != null) FuegeHinzu($" {wahl}");
            }
            
            // MCCAFE
            else if (produktName == "McCafé")
            {
                var kaffees = new List<string> { "Kaffee Crema", "Latte Macchiato", "Cappuccino", "Espresso", "Heiße Schokolade" };
                string wahl = await FrageStellen("Willkommen im McCafé:", kaffees);
                
                if (wahl != null)
                {
                    FuegeHinzu($"{wahl}");
                }
            }
            else
            {
                // Fallback (z.B. Apfeltasche)
                FuegeHinzu(bestellText);
            }
        }

        private async System.Threading.Tasks.Task<string> FrageStellen(string titel, List<string> antworten)
        {
            var fenster = new OptionWindow(titel, antworten);
            await fenster.ShowDialog(this);
            return fenster.SelectedOption;
        }

        private void OnSchliessenClick(object sender, RoutedEventArgs e) { this.Close(); }
        private void OnAbschliessenClick(object sender, RoutedEventArgs e) { BestellListe.Clear(); BestellListe.Add("Danke!"); _aktuelleMenge = 1; }
    }
}