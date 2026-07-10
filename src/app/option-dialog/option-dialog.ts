/* Input: Daten die von aussen reinkommen (vom Order-Component)
   Output: Ereignisse die nach aussen gesendet werden (Auswahl oder Abbrechen) */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/* dieser Dialog funktioniert genau wie das OptionWindow aus meinem alten
   Avalonia-Projekt: zeigt einen Titel und ne Liste von Auswahl-Buttons, klickt
   man auf einen Button wird die Auswahl nach aussen gesendet */
@Component({
  selector: 'app-option-dialog',
  imports: [CommonModule],
  templateUrl: './option-dialog.html',
  styleUrl: './option-dialog.css',
})
export class OptionDialog {

  // Der Titel oben im Dialog, z.B. "Welche Pommes-Größe?"
  @Input() title = '';

  // Die Liste der Optionen, z.B. ['Klein', 'Mittel', 'Groß (+0,50 €)']
  @Input() options: string[] = [];

  // Wird ausgelöst wenn der Nutzer eine Option wählt – sendet den gewählten Text zurück
  @Output() chosen = new EventEmitter<string>();

  // Wird ausgelöst wenn der Nutzer auf "Abbrechen" klickt
  @Output() cancelled = new EventEmitter<void>();
}
