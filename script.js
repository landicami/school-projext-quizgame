// Funktion för att shuffle flags array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

//klona students för att undvika att ändra den ursprungliga arrayen
const copyOfStudents = shuffle([...flags]); 

//referenser till DOM
const gameDiv = document.querySelector(".game");
const startaSpelBox = document.querySelector(".startaSpelBox");
const buttonContainer = document.querySelector(".button-container");

//lägg till en räknare som ska visa antalet gissningar
let counter = 0;
//korrekträknare
let counterCorrect = 0;
//rätt gissning är
let correctGuess = copyOfStudents[0].name;
// mina knappar
const guessButtons = [
  document.querySelector(".guess-1"),
  document.querySelector(".guess-2"),
  document.querySelector(".guess-3"),
  document.querySelector(".guess-4")
];

// variabel för valt antal gissningar
let chosenValue;
//starta spel eventlistener och spel
document.querySelector(".startaSpelBox").addEventListener("click", e => { 
  //chosen value = dynamiskt beroende på vad jag klickar på
  if (e.target.tagName === "BUTTON") {

    // om innehåller är Alla, räkna ursprungs-students array längd
    if (e.target.innerText === "Alla") {
      chosenValue = flags.length;
    } else {
      //annars gör om chosenvalue till det jag klickade på till ett nummer
      chosenValue = Number(e.target.innerText);
    }

      let chances = chosenValue;
      document.querySelector("h3").innerHTML = `<h3>Vilket är landet?</h3><br> <p>Du har ${chances} chanser att gissa.</p>`;
      // göm spelstartaren och öppna spelet med chosenValue-gissningar
      gameDiv.classList.remove("hide");
      startaSpelBox.classList.add("hide"); 
    

    //gör en eventlyssnare på button-container vid gissning
    buttonContainer.addEventListener("click", e => {
      
    //gör en kontroll om det jag klickar på är rätt eller fel gissning
      if (e.target.innerText === correctGuess) {
          //räkna 1+ på räknaren
          counter++;
          //räkna 1+ på rätt gissning
          counterCorrect++;

          document.querySelector("h3").innerHTML = `<h3>Vad heter studenten på bilden?</h3><br> <p>Rätt svar! Du har ${--chances} chanser kvar  att gissa.</p>`;
          
            //visa grön bakgrund som symboliserar rätt
            buttonContainer.classList.add("greenBackground");
            setTimeout(function() {
            // Ta bort klassen för att efterlikna en blinkning
            buttonContainer.classList.remove("greenBackground");
            }, 100);              
          removeGuess();
      } else {
          counter++;
          document.querySelector("h3").innerHTML = `<h3>Vad heter studenten på bilden?</h3><br> <p>Fel svar! Du har ${--chances} chanser kvar  att gissa.</p>`;

            buttonContainer.classList.add("redBackground");
            setTimeout(function() {
            buttonContainer.classList.remove("redBackground");
            }, 100);
          removeGuess();
      }
      
      // Är räknaren samma som antalet spel du valde, dags att visa resultat
      if (counter === chosenValue) {
        const finalResult = document.querySelector(".finalresult");
        const reStart = document.querySelector(".restart");

        reStart.classList.remove("hide");
        finalResult.classList.remove("hide")
        finalResult.innerHTML = `<h4>Bra spelat med spelet™</h4><p>Du hade ${counterCorrect} rätt av ${counter} gissningar. Starta om spelet för att spela igen!</p>`;
        gameDiv.classList.add("hide");
        
        //klicklyssnare på starta om spel
        reStart.addEventListener("click", () => {
          window.location.reload();
        });
        } else {
          getNew();
        }
        })
}})

  // funktion för bild och namn
function startGame() {
  // Blanda knapparna för att få olika värden
  shuffle(guessButtons);

  // Ändra knapparna så att de får arrayens namn
  for (let i = 0; i < guessButtons.length; i++) {
    if (copyOfStudents[i]) {
      guessButtons[i].innerText = copyOfStudents[i].name;
    } else {
      //om copyofstudents har för lite namn, sätt namn till ordinare arrays key value namn
      guessButtons[i].innerText = usedNames[i];
    }
  }

  // Sätt img till nytt innehåll 
  // const imgElement = document.querySelector(".picture");
  // imgElement.setAttribute("src", copyOfStudents[0].image);

  const newImage = document.querySelector(".newImage");
  newImage.setAttribute("src", copyOfStudents[0].image);

}
// funktion för nya namn
function getNew() {
    // shuffla igen
    shuffle(copyOfStudents);

    // Filtrera de fyra första objekten från den blandade arrayen
    const selectedfourObjects = copyOfStudents.filter((student, index) => index < 4);
  
  
    // Uppdatera bild och namn
    startGame(selectedfourObjects);
    correctGuess = copyOfStudents[0].name;
}
// Funktion för att ta bort foto från att kunna gissas igen
const usedNames = [];
function removeGuess() {
    // Hitta index för det korrekta namnet
    const indexToRemove = copyOfStudents.findIndex(student => student.name === correctGuess);

    // Pusha det borttagna namnet till usedNames för att unvika konflikt senare
    usedNames.push(copyOfStudents[indexToRemove].name);

    // Ta bort den korrekta gissningen från arrayen shuffled
    copyOfStudents.splice(indexToRemove, 1);
}

// Starta spel
startGame();

