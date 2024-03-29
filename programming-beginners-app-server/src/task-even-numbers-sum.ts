import { checkEvenNumbers, generateRandomNumber, generateRandomNumbers, getNumberFromText, getNumbersFromString, isEven } from "./utils";


export class EvenNumbersSum {

    text: string = '';
    goalValue: number = 0;
    currentSum: number = 0;
    currentNumbers: number[] = [];
    numbers: number[] = [];
    trainingText: string = '';

    disableInput: boolean = false;
    disableButton: boolean = false;
    isFirstPartFinished: boolean = false;
    firstStepStartFlag: boolean = true;
    firstStepAnswer: boolean = false;
    firstStepAgain: boolean = false;
    secondStepStartFlag: boolean = true;
    secondStepAnswer: boolean = false;
    secondStepAgain: boolean = false;
    readyForSecondStep: boolean = false;
    finishedTaskTraining: boolean = false;
    task: string = '';
    isEnd: boolean = false;

    constructor(text: string) {
        this.text = text;
        this.goalValue = getNumberFromText(this.text);
        this.numbers = generateRandomNumbers();
        this.trainingText = `Kao što vidiš u tekstu zadatka, potrebna je suma parnih brojeva. Za početak napiši sve parne brojeve od ponuđenih! Ovo su ponuđeni brojevi: ${this.numbers} `;
    }

    getHelp(userMessage: string): string {
        const number = getNumberFromText(userMessage);

        // Vraca pomoc za uvodni zadatak
        if (userMessage.includes(this.trainingText)) {
            return 'Treba da odrediš koji od ponuđenih brojeva su parni. Parni brojevi su oni koji daju ostatak 0 kada se podele sa 2 (npr. 2, 4, 6...). '
        }

        // Odgovor na pitanje da li moze da se krene sa igrom
        if (!this.isFirstPartFinished && this.firstStepStartFlag) {
            return 'U polju za unos teksta napiši svoj odgovor da bi započeo sa zadatkom!';
        }
        // Odgovor na pitanje da li da se menjaju uloge
        else if (!this.isFirstPartFinished && this.firstStepAnswer) {
            return 'Ukoliko si razumeo zadatak, napiši potvrdan odgovor! Ukoliko imaš još nekih nejasnoća, napiši odričan odgovor kako bismo ponovo prošli kroz zadatak! ';
        }
        // Pocetnik unosi brojeve kad je u ulozi korisnika 
        else if (!this.isFirstPartFinished && number === -1) {
            return "Unesi neki broj u polju za unos kako bi nastavio sa rađenjem zadatka! ";
        }
        // Pocetniku je postavljeno pitanje da li je spreman da zamene uloge
        else if (this.readyForSecondStep) {
            return 'U polju za unos teksta napiši svoj odgovor kako bi započeo sa drugim delom zadatka!';
        }

        if (this.isEnd) {
            return 'Završio si sa ovim zadatkom! Ukoliko želiš novi zadatak, klikni na dugme!'
        }

        // Pitanje da li treba ispocetka drugi deo
        if (this.secondStepAnswer) {
            return 'Ukoliko si razumeo zadatak i ne želiš ponovo da radiš ovaj deo, napiši odričan odgovor! Ukoliko imaš još nekih nejasnoća, napiši potvrdan odgovor kako bismo ponovo prošli kroz ovaj deo zadatka! ';

        }

        if (!this.firstStepStartFlag) {
            // Drugi deo - pocetnik u ulozi programa
            if (this.isFirstPartFinished) {
                return 'Prati brojeve koje unosim i njihovu sumu. Ukoliko je ta suma jednaka ili veća od granice koja stoji u tekstu zadatka, to znači da je kraj zadatka! '

            }
            // Prvi deo - pocetnik u ulozi korisnika
            else {
                return "Unesi svoj naredni broj! "
            }
        }

        return '';
    }

    generateReply(userMessage: string): string {
        const number = getNumberFromText(userMessage);

        const lowerCaseUserMessage = userMessage.toLowerCase();
        const positiveKeywords = ['da', 'jeste', 'jesam', 'spreman', 'naravno', 'moze', 'može', 'svakako'];
        const negativeKeywords = ['ne', 'nemam', 'nije', 'ne želim', 'necu', 'neću'];

        const isPositive = positiveKeywords.some(keyword => lowerCaseUserMessage.includes(keyword));
        const isNegative = negativeKeywords.some(keyword => lowerCaseUserMessage.includes(keyword));

        // Odgovor na pitanje da li moze da se krene sa igrom
        if (!this.isFirstPartFinished && this.firstStepStartFlag) {
            if (isPositive) {
                this.text = "Krećemo sa igrom! <br><br> Možeš da uneseš prvi broj!";
            } else {
                this.text = "Očekujem samo potvrdne odgovore! <br><br> Probaj da uneseš prvi broj, neće ništa da boli!";
            }
            this.firstStepStartFlag = false;
            return this.text;
        }
        // Odgovor na pitanje da li da se menjaju uloge
        else if (!this.isFirstPartFinished && this.firstStepAnswer) {
            if (isPositive) {
                this.text = "Odlično! Možemo da promenimo uloge! Sad ti budi program, a ja ću da ti dajem brojeve. Da li si spreman? ";
                this.isFirstPartFinished = true;
                this.readyForSecondStep = true;
            } else if (isNegative) {
                this.text = "Hajmo onda ispočetka! Krećemo ponovo sa igrom! <br><br> Možeš da uneseš prvi broj!";
                this.firstStepAgain = true;
                this.disableInput = true;
            } else {
                this.text = "Nisam siguran šta si hteo da kažeš, napiši potvrdan ili odričan odgovor.";
            }
            this.firstStepAnswer = false;
            return this.text;
        }
        // Pocetnik unosi brojeve kad je u ulozi korisnika 
        else if (!this.isFirstPartFinished && number === -1) {
            this.text = "Moraš uneti neki broj!";
            userMessage = "";
            return this.text;
        }
        // Pocetniku je postavljeno pitanje da li je spreman da zamene uloge
        else if (this.readyForSecondStep) {
            let additionalMessage: string = '';
            if (isPositive) {
                additionalMessage = "U redu, krećemo! ";
            } else {
                this.text = "Ponovo očekujem samo potvrdne odgovore! <br><br> Poslaću ti prvi broj da vidiš da nije strašno! ";
            }
            this.text = this.secondPart(userMessage, additionalMessage);
            this.firstStepAnswer = false;
            this.firstStepStartFlag = false;
            this.readyForSecondStep = false;
            return this.text;
        }


        // Pitanje da li treba ispocetka drugi deo
        if (this.secondStepAnswer) {
            if (isNegative) {
                this.text = "Odlično! Ukoliko želiš da radiš druge zadatke, možeš da klikneš na dugme <i>Novi zadatak<i>.";
                userMessage = "";
                this.disableInput = true;
                this.disableButton = true;
                this.isEnd = true;
                return this.text;
            } else if (isPositive) {
                const additionalMessage: string = "Hajmo onda ispočetka! ";
                this.text = this.secondPart(userMessage, additionalMessage);
                this.secondStepAgain = true;
                this.disableInput = true;
                this.secondStepAnswer = false;
            } else {
                this.text = "Nisam siguran šta si hteo da kažeš, napiši potvrdan ili odričan odgovor.";
            }

            return this.text;
        }

        if (!this.firstStepStartFlag) {
            // Drugi deo - pocetnik u ulozi programa
            if (this.isFirstPartFinished) {
                // Ako se menjaju uloge, posle 4s aplikacija salje prvi broj
                if (!this.firstStepAnswer && !this.secondStepAnswer) {
                    this.text = this.secondPart(userMessage);
                }
            }
            // Prvi deo - pocetnik u ulozi korisnika
            else if (isEven(number)) {
                this.text = this.firstPart(number);
            } else {
                this.firstStepAgain = false;
                if (!this.firstStepAgain) {
                    this.text = "Mislim da si malo pogrešio. Pokušaj ponovo."
                }
            }

            return this.text;
        }

        return this.text;
    }


    // Pocetnik u ulozi korisnika
    firstPart(number: number): string {
        const positiveReplies = ['Sjajno! ', 'Bravo! ', 'Super! ', 'Na pravom si putu! ', 'Odlično! '];
        const nextNumberMessages = ['Možeš da uneseš naredni broj! ', 'Očekujem unos sledećeg parnog broja! ', 'Nastavi sa unosom sledećeg broja! '];

        const positiveReply = positiveReplies[generateRandomNumber(0, positiveReplies.length - 1)];
        const nextNumberMessage = nextNumberMessages[generateRandomNumber(0, nextNumberMessages.length - 1)];

        let feedbackMessage = "";

        this.currentSum += number;
        this.currentNumbers.push(number);

        if (this.currentSum >= this.goalValue) {
            feedbackMessage = `Sada imamo ${this.currentNumbers}, što je ukupno ${this.currentSum}. To prelazi granicu od ${this.goalValue}, što znači da smo došli do kraja programa. <br><br> Da li si shvatio? `;

            this.firstStepAnswer = true;
            this.currentNumbers = [];
            this.currentSum = 0;
        } else {
            feedbackMessage = positiveReply + `Sada imamo ${this.currentNumbers}, što je ukupno ${this.currentSum}. Još uvek nismo prešli granicu od ${this.goalValue}. <br><br>` + nextNumberMessage;
        }

        this.text = feedbackMessage;

        return this.text;
    }

    // Pocetnik u ulozi programa
    secondPart(userMessage: string, additionalMessage?: string): string {
        const lowerCaseUserMessage = userMessage.toLowerCase();

        const positiveKeywords = ['da', 'jeste', 'jesam', 'spreman', 'naravno', 'moze', 'može', 'svakako'];
        const negativeKeywords = ['ne', 'nemam', 'nije', 'ne želim', 'necu', 'neću'];
        const evenKeywords = ['paran'];
        const oddKeywords = ['neparan'];
        const endKeywords = ['kraj', 'kraja', 'gotov', 'gotovo', 'zavrsen', 'zavrseno'];

        const isPositive = positiveKeywords.some(keyword => lowerCaseUserMessage.includes(keyword));
        const isNegative = negativeKeywords.some(keyword => lowerCaseUserMessage.includes(keyword));
        const hasEvenKeyword = evenKeywords.some(keyword => lowerCaseUserMessage.includes(keyword));
        const hasOddKeyword = oddKeywords.some(keyword => lowerCaseUserMessage.includes(keyword));
        const hasEndKeyword = endKeywords.some(keyword => lowerCaseUserMessage.includes(keyword));

        const generatedNumber: number = generateRandomNumber(1, 20);

        if (this.secondStepStartFlag) {
            this.text = additionalMessage + `Prvi broj je: ${generatedNumber}. <br><br> Koji je trenutni zbir i da li je potrebno završiti program? `;
            this.currentNumbers.push(generatedNumber);
            this.secondStepStartFlag = false;

        } else {
            let reply: string = '';
            const usersSum: number = getNumberFromText(userMessage);
            const isEnd: boolean = this.currentSum >= this.goalValue;
            const lastNumber = this.currentNumbers[this.currentNumbers.length - 1];

            if (usersSum !== -1 && usersSum === this.currentSum) {
                reply = `Tačno, trenutna suma je ${this.currentSum}! <br><br>`;
            } else if (usersSum !== -1 && usersSum !== this.currentSum) {
                reply = `Mala greška, trenutna suma nije ${usersSum}, nego ${this.currentSum}! <br><br>`;
            }

            if (!isEnd) {
                if (hasEndKeyword && !isNegative) {
                    reply += `Nije kraj još uvek jer je suma ${this.currentSum}! <br><br>`;
                }
            }

            if (isEnd) {
                if (!hasEndKeyword || (isNegative && hasEndKeyword)) {
                    if(isPositive) {
                        this.text = `Bravo! Zbir koji iznosi ${this.currentSum} sada nije manji od ${this.goalValue}, što znači da si shvatio/la kada je zadatak gotov! <br><br> Čestitam!!! <br><br> Da li je potrebno da radimo ovaj deo ispočetka? `;
                    } else if(isNegative) {
                        this.text = `Trebalo je da kažeš da je kraj programa jer ${this.currentSum} nije manje od ${this.goalValue}! To znači da završavamo sa unosom brojeva! <br><br> Možda nisi shvatio poentu, da li želiš ispočetka? `;
                    } else {
                        this.text = `Trebalo je da kažeš da je kraj programa jer ${this.currentSum} nije manje od ${this.goalValue}! To znači da završavamo sa unosom brojeva! <br><br> Možda nisi shvatio poentu, da li želiš ispočetka? `;
                    }
                } else {
                    this.text = `Bravo! Zbir koji iznosi ${this.currentSum} sada nije manji od ${this.goalValue}, što znači da si shvatio/la kada je zadatak gotov! <br><br> Čestitam!!! <br><br> Da li je potrebno da radimo ovaj deo ispočetka? `;
                }

                this.secondStepAnswer = true;
                this.secondStepStartFlag = true;
                this.currentNumbers = [];
                this.currentSum = 0;

                return this.text;
            } else if (!isEven(lastNumber)) {
                this.currentNumbers.splice(this.currentNumbers.length - 1, 1);
                if (hasOddKeyword || (isNegative && hasEvenKeyword)) {
                    reply += 'Tako je, broj koji je unet nije paran! <br><br>';
                } else {
                    reply += 'Nisi primetio/la da je broj koji je malopre unet neparan! <br><br>';
                }
            } else {
                if (hasOddKeyword || (isNegative && hasEvenKeyword)) {
                    reply += 'Nije bio unet neparan broj! <br><br>';
                } else if (isNegative || (isNegative && hasEndKeyword)) {
                    reply += 'Tako je, još uvek nije potrebno završiti program! <br><br>';
                }
            }

            this.text = reply + `Naredni broj koji unosim je: ${generatedNumber}. Brojevi koji su uneti su: ${this.currentNumbers}. <br><br> Koja je sada suma i da li treba zavrsiti program? `

            this.currentNumbers.push(generatedNumber);


        }

        if (isEven(generatedNumber)) {
            this.currentSum += generatedNumber;
        }
        return this.text;
    }

    getTaskTraining(taskRequest: string): string {
        // Unositi parne brojeve sve dok je njihova suma manja od 58.
        return this.trainingText;

    }

    taskTrainingReply(taskRequest: string, userMessage: string) {
        // Unositi parne brojeve sve dok je njihova suma manja od 58.
        const userNumbers: number[] = getNumbersFromString(userMessage);
        const isValid: boolean = checkEvenNumbers(userNumbers, this.numbers);

        let reply = '';
        if (isValid) {
            reply = "Odlično! Sada možemo da krenemo sa igrom pomoću koje ćeš razumeti logiku zadatka! Ti ćeš da unosiš brojeve, a ja ću ti davati objašnjenja i reći kada je trenutak da se program završi na osnovu uslova zadatka. Je l' može?"
        } else {
            reply = `Izgleda da nisi dobro izabrao parne brojeve... Probaj ponovo! Ovo su brojevi:  ${this.numbers} `;
        }

        return {
            reply: reply,
            success: isValid
        }
    }
}
