import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TaskTextComponent } from '../task-text/task-text.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [CommonModule, TaskTextComponent, FormsModule],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.css'
})
export class TaskDialogComponent {
  url: string = "http://localhost:3000/";
  taskText!: string;
  miniTask!: string;
  userMessage: string = "";
  text!: string;
  numbers: number[] = [];
  owlImage: string = "assets/images/owl-happy.gif";
  goalValue!: number;
  currentSum: number = 0;
  currentNumbers: number[] = [];
  selectedNumbers: number[] = [];
  disableInput: boolean = false;
  disableButton: boolean = false;
  isFirstPartFinished: boolean = false;
  firstStepStartFlag: boolean = true;
  firstStepAnswer: boolean = false;
  firstStepAgain: boolean = false;
  secondStepStartFlag: boolean = true;
  secondStepAnswer: boolean = false;
  secondStepAgain: boolean = false;

  constructor(private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
      this.taskText = state['taskText'];
      this.miniTask = state['miniTask'];
    }

    // this.numbers = this.getNumbersFromString(this.miniTask);
    // if(this.numbers.length !== 0) {
    //   this.text = this.miniTask.split(':')[0] + ':';  // Backend vraca ceo tekst mini zadatka sa nizom koji sledi nakon ':'
    // } else {
    //   this.text = this.miniTask;
    // }
    this.text = this.miniTask;

    // this.text = "Sada možemo da krenemo sa igrom pomoću koje ćeš razumeti logiku zadatka! <br><br> Ti ćeš da unosiš brojeve, a ja ću ti davati objašnjenja i reći kada je trenutak da se program završi na osnovu uslova zadatka. <br><br> Je l' može? "

    // this.goalValue = this.getNumberFromText(this.taskText);
  }

  sendMessage() {
    this.owlImage = "assets/images/owl-happy.gif";

    fetch(this.url + 'sendMessage', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userMessage: this.userMessage })

    })
      .then((response) => response.json())
      .then((response) => this.text = response.message);

    this.userMessage = "";
    // this.firstStepStartFlag = false;
  }

  goHome() {
    this.router.navigateByUrl('/');
  }

  

  selectNumber(num: number) {
    const index = this.selectedNumbers.indexOf(num);

    if (index === -1) {
      this.selectedNumbers.push(num);
    } else {
      this.selectedNumbers.splice(index, 1);
    }
  }

}
