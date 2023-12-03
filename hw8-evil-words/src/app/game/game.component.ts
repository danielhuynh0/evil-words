import { Component, OnInit } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  private url = 'http://localhost:8080/wordle_api.php';
  private word: string;
  userGuess: string = '';
  attempts: string[] = [];
  gameInProgress: boolean = false;
  correct: number = 0;
  totalGuesses: number = 0;
  averageGuesses: number =
    this.correct === 0 ? 0 : this.totalGuesses / this.correct;
  winStreak: number = 0;
  messageColor = 'red';
  messageWeight = 'normal';

  // gameState: GameState | null;

  // ngOnInit(): void {
  //   const storedGameState = localStorage.getItem('gameState');
  //   if (storedGameState !== null) {
  //     this.gameState = JSON.parse(storedGameState);
  //   } else {
  //     console.error('No game state found in localStorage.');
  //   }
  // }

  constructor(private http: HttpClient) {
    this.word = '';

    // const storedGameState = localStorage.getItem('gameState');
    // if (storedGameState !== null) {
    //   this.gameState = JSON.parse(storedGameState);
    // } else {
    //   this.gameState = {
    //     word: '',
    //     attempts: [],
    //     correct: 0,
    //     totalGuesses: 0,
    //     currentGameGuesses: 0,
    //     winStreak: 0,
    //   };
    // }
  }

  submitGuess(): void {
    if (this.gameInProgress == false) {
      return;
    }
    let len = this.word.length;
    var attempt = {
      Word: this.userGuess,
      Status: 'Correct!',
      Char: len,
      Loc: len,
      Length: 'just right',
    };
    var guess = this.userGuess;

    if (this.userGuess === this.word) {
      this.attempts = [];
      this.attempts.push('You are correct!');
      this.messageColor = 'green';
      this.messageWeight = 'bold';
      this.gameInProgress = false;
      this.totalGuesses = this.totalGuesses + 1;
      this.correct = this.correct + 1;
      this.winStreak = this.winStreak + 1;
      this.averageGuesses =
        this.correct === 0 ? 0 : this.totalGuesses / this.correct;
      return;
    } else {
      attempt['Status'] = 'Wrong!';
      this.totalGuesses = this.totalGuesses + 1;
      this.winStreak = 0;
      this.averageGuesses =
        this.correct === 0 ? 0 : this.totalGuesses / this.correct;
      if (guess.length < this.word.length) {
        attempt['Length'] = 'too short';
      }
      if (guess.length > this.word.length) {
        attempt['Length'] = 'too long';
      }
      var countP = 0;
      var countC = 0;
      var index = 0;
      while (index < guess.length && index < this.word.length) {
        if (guess.charAt(index) == this.word.charAt(index)) {
          countP = countP + 1;
        }
        if (this.word.includes(guess.charAt(index))) {
          let sub = guess.substr(0, index);
          if (!sub.includes(guess.charAt(index))) {
            countC = countC + 1;
          }
        }
        index = index + 1;
      }
      attempt['Char'] = countC;
      attempt['Loc'] = countP;
      let message: string =
        'You guessed "' +
        attempt['Word'] +
        '". ' +
        attempt['Status'] +
        ' Your guess had ' +
        attempt['Char'] +
        ' correct characters, ' +
        attempt['Loc'] +
        ' characters were in the right place. In length, the guess was ' +
        attempt['Length'] +
        '.';
      this.attempts.push(message);
      console.log(attempt);
    }
    console.log('submitted form with guess: ' + this.userGuess);
  }

  private getWord(): Observable<string> {
    return this.http.get<string>(this.url);
  }

  newGameClicked(): void {
    console.log('New Game Clicked');
    this.messageColor = 'red';
    this.messageWeight = 'normal';
    this.attempts = [];
    this.gameInProgress = true;
    var guessTextBox = document.getElementById('guessbox');
    if (guessTextBox != null) {
      this.userGuess = '';
    }
    this.getWord().subscribe(
      (data) => {
        this.word = data;
        // this.gameState['word'] = this.word;
        console.log(this.word);
        // this.gameInProgress = true;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }
}

interface GameState {
  word: string;
  attempts: string[];
  correct: number;
  totalGuesses: number;
  currentGameGuesses: number;
  winStreak: number;
}
