import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TaskTextComponent } from '../task-text/task-text.component';
import { FormsModule } from '@angular/forms';
import { ShapeDividerComponent } from '../shape-divider/shape-divider.component';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [CommonModule, TaskTextComponent, FormsModule, ShapeDividerComponent],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.css'
})
export class TaskDialogComponent {
  url: string = "http://localhost:3000/";
  taskText!: string;
  miniTask!: string;
  userMessage: string = "";
  text!: string;
  owlImage: string = "assets/images/owl1.gif";
  disableInput: boolean = false;
  disableButton: boolean = false;
  disableHelpButton: boolean = false;
  helpMessageTimeout!: any;
  showHelp: boolean = false;
  helpText: string = "Helphlephelphelphelp";

  constructor(private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
      this.taskText = state['taskText'];
      this.miniTask = state['miniTask'];
    }

    this.text = this.miniTask;

    setTimeout(() => {
      this.text += '<br><br> Ako ti je potrebna pomoć, možeš da klikneš na dugme "<i>Pomoć<i>"!';
    }, 5000);
  }

  sendMessage() {
    fetch(this.url + 'sendMessage', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userMessage: this.userMessage })

    })
      .then((response) => response.json())
      .then((response) => {
        this.text = response.message;

        clearTimeout(this.helpMessageTimeout);
        this.helpMessageTimeout = setTimeout(() => {
          this.text += '<br><br> Ako ti je potrebna pomoć, možeš da klikneš na dugme "<i>Pomoć<i>"!';
        }, 5000);

        // Ako je korisnik dosao do kraja, menja se slika sove
        if (response.message.includes("Novi zadatak")) {
          this.owlImage = "assets/images/owl2.gif";
          this.disableButton = true;
          this.disableInput = true;
        }
      });

    this.userMessage = "";
    this.showHelp = false;
    this.disableHelpButton = false;
  }

  help() {
    const additionalInfo: string = this.text.includes(this.miniTask) ? this.miniTask : '';  // Da zna da li da salje pomoc za uvodni zadatak

    fetch(this.url + 'sendMessage', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userMessage: `HELP: ${additionalInfo}` })

    })
      .then((response) => response.json())
      .then((response) => {
        this.helpText = response.message;
        this.showHelp = true;
        this.disableHelpButton = true;  // Samo jednom moze da se klikne na dugme za pomoc
      });
  }

  goHome() {
    this.router.navigateByUrl('/');
  }

}
