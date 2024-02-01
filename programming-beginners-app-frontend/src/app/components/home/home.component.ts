import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskTextComponent } from '../task-text/task-text.component';
import { NextButtonComponent } from '../next-button/next-button.component';
import { Router } from '@angular/router';
import { BASE_URL } from '../../../../config/config';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TaskTextComponent, NextButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  showTask: boolean = false;
  taskText: string = "";
  miniTask: string = "";

  constructor(private router: Router) {
    // this.taskText = "Unositi parne brojeve sve dok je njihova suma manja od 58."

    // Dobija zadatak sa backenda
    this.getTask();
  }

  async onNextButtonClick() {
    if (this.showTask) {
      // Dobija uvodni zadatak sa backenda
      await this.getTaskTrainig();

      this.router.navigateByUrl('/task-dialog', {
        state: {
          taskText: this.taskText,
          miniTask: this.miniTask
        }
      });
    }

    this.showTask = true;
  }

  getTask() {
    fetch(BASE_URL + 'sendMessage', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userMessage: "Posalji mi neki zadatak" })
    })
      .then((response) => response.json())
      .then((response) => this.taskText = response.task);
  }

  async getTaskTrainig(): Promise<string> {
    try {
      const response = await fetch(BASE_URL + 'sendMessage', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userMessage: `Posalji mi uvodni zadatak za zadatak ${this.taskText}` })
      });

      const data = await response.json();
      this.miniTask = data.taskTraining;
      return this.miniTask;

    } catch (error) {
      console.error("Došlo je do greške prilikom dohvatanja zadatka:", error);
      throw error; 
    }
  }
}
