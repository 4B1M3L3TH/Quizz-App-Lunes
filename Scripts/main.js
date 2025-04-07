   const state = {
     teams: [
     {
       id: 1,
       name: "Equipo 1",
       score: 0,
       hasAnswered: false,
       isAnswering: false,
       history: [] // Array to store answer history
     },
     {
       id: 2,
       name: "Equipo 2",
       score: 0,
       hasAnswered: false,
       isAnswering: false,
       history: [] // Array to store answer history
     }],
     gameStarted: false,
     currentQuestion: null,
     currentQuestionIndex: 0,
     selectedTeam: null,
     selectedAnswer: null,
     incorrectAnswers: [], // Track incorrect answers
     timerSeconds: 30,
     timerInterval: null,
     timeRemaining: 30,
     waitingForTeamSelection: false,
     questions: [
     {
       question: "¿Cuál es el símbolo químico del elemento Carbono?",
       options: ["C", "Ca", "Co", "Cu"],
       correctAnswer: 0
     },
     {
       question: "¿Qué elemento tiene el número atómico 1?",
       options: ["Oxígeno", "Hidrógeno", "Nitrógeno", "Helio"],
       correctAnswer: 1
     },
     {
       question: "¿Cuál es el elemento con el símbolo Au?",
       options: ["Oro", "Plata", "Aluminio", "Cobre"],
       correctAnswer: 0
     },
     {
       question: "¿Qué elemento corresponde al número atómico 8?",
       options: ["Carbono", "Oxígeno", "Nitrógeno", "Azufre"],
       correctAnswer: 1
     },
     {
       question: "¿Cuál es el símbolo del elemento Sodio?",
       options: ["Na", "So", "S", "Si"],
       correctAnswer: 0
     },
     {
       question: "¿Qué elemento se identifica con el símbolo O?",
       options: ["Oxígeno", "Oro", "Osmio", "Óxido"],
       correctAnswer: 0
     },
     {
       question: "¿A qué grupo pertenecen los gases nobles?",
       options: ["Grupo 1", "Grupo 8", "Grupo 18", "Grupo 16"],
       correctAnswer: 2
     },
     {
       question: "¿Qué elemento tiene el símbolo Fe?",
       options: ["Fluor", "Hierro", "Francio", "Fósforo"],
       correctAnswer: 1
     },
     {
       question: "¿Cuál es el número atómico del elemento Nitrógeno (N)?",
       options: ["5", "6", "7", "8"],
       correctAnswer: 2
     },
     {
       question: "¿Qué elemento se representa con el símbolo Hg?",
       options: ["Helio", "Mercurio", "Hafnio", "Hidrógeno"],
       correctAnswer: 1
     }],
     availableQuestions: [],
     usedQuestions: [], // To keep track of questions that have been used
     nextTeamId: 3 // For adding new teams
   };
   
   // DOM Elements
   const elements = {
     setupSection: document.getElementById('setup-section'),
     gameSection: document.getElementById('game-section'),
     teamsContainer: document.getElementById('teams-container'),
     timerSecondsInput: document.getElementById('timer-seconds'),
     confirmTeamsBtn: document.getElementById('confirm-teams'),
     addTeamBtn: document.getElementById('add-team'),
     teamsDisplay: document.getElementById('teams-display'),
     startGameSection: document.getElementById('start-game-section'),
     startGameBtn: document.getElementById('start-game'),
     questionSection: document.getElementById('question-section'),
     currentQuestion: document.getElementById('current-question'),
     answerOptions: document.getElementById('answer-options'),
     gameInstructions: document.getElementById('game-instructions'),
     nextQuestionBtn: document.getElementById('next-question'),
     timer: document.getElementById('timer'),
     gameSummary: document.getElementById('game-summary'),
     winnerAnnouncement: document.getElementById('winner-announcement'),
     finalScores: document.getElementById('final-scores'),
     historyContainer: document.getElementById('history-container'),
     restartGameBtn: document.getElementById('restart-game'),
     themeToggle: document.getElementById('theme-toggle'),
     moonIcon: document.getElementById('moon-icon'),
     sunIcon: document.getElementById('sun-icon'),
     questionManagement: document.getElementById('question-management'),
     manageQuestionsBtn: document.getElementById('manage-questions-btn'),
     backToSetupBtn: document.getElementById('back-to-setup'),
     newQuestionInput: document.getElementById('new-question'),
     correctAnswerSelect: document.getElementById('correct-answer'),
     addQuestionBtn: document.getElementById('add-question'),
     questionList: document.getElementById('question-list')
   };
   
   // Initialize the game
   function init() {
     // Copy questions to available questions
     state.availableQuestions = [...state.questions];
     state.usedQuestions = [];
     
     // Reset team histories
     state.teams.forEach(team => {
       team.history = [];
       team.score = 0;
       team.hasAnswered = false;
       team.isAnswering = false;
     });
     
     // Set up event listeners
     elements.confirmTeamsBtn.addEventListener('click', setupTeams);
     elements.startGameBtn.addEventListener('click', startGame);
     elements.nextQuestionBtn.addEventListener('click', nextQuestion);
     elements.restartGameBtn.addEventListener('click', restartGame);
     elements.addTeamBtn.addEventListener('click', addTeamInput);
     elements.themeToggle.addEventListener('click', toggleTheme);
     elements.manageQuestionsBtn.addEventListener('click', showQuestionManagement);
     elements.backToSetupBtn.addEventListener('click', hideQuestionManagement);
     elements.addQuestionBtn.addEventListener('click', addQuestion);
     
     // Load questions into the question list
     updateQuestionList();
   }
   
   // Toggle dark/light theme
   function toggleTheme() {
     const html = document.documentElement;
     if (html.classList.contains('dark')) {
       html.classList.remove('dark');
       elements.moonIcon.style.display = 'block';
       elements.sunIcon.style.display = 'none';
     } else {
       html.classList.add('dark');
       elements.moonIcon.style.display = 'none';
       elements.sunIcon.style.display = 'block';
     }
   }
   
   // Show question management section
   function showQuestionManagement() {
     elements.setupSection.style.display = 'none';
     elements.questionManagement.style.display = 'block';
   }
   
   // Hide question management section
   function hideQuestionManagement() {
     elements.questionManagement.style.display = 'none';
     elements.setupSection.style.display = 'block';
   }
   
   // Add a new question
   function addQuestion() {
     const questionText = elements.newQuestionInput.value.trim();
     if (questionText === '') {
       alert('Por favor ingresa una pregunta');
       return;
     }
     
     const optionInputs = document.querySelectorAll('.option-input');
     const options = [];
     
     for (let i = 0; i < optionInputs.length; i++) {
       const optionText = optionInputs[i].value.trim();
       if (optionText === '') {
         alert(`Por favor completa la opción ${i + 1}`);
         return;
       }
       options.push(optionText);
     }
     
     const correctAnswer = parseInt(elements.correctAnswerSelect.value);
     
     // Add the new question
     state.questions.push({
       question: questionText,
       options: options,
       correctAnswer: correctAnswer
     });
     
     // Reset the form
     elements.newQuestionInput.value = '';
     optionInputs.forEach(input => {
       input.value = '';
     });
     
     // Update the question list
     updateQuestionList();
     
     // Update available questions
     state.availableQuestions = [...state.questions];
   }
   
   // Update the question list in the UI
   function updateQuestionList() {
     elements.questionList.innerHTML = '';
     
     state.questions.forEach((question, index) => {
       const questionItem = document.createElement('div');
       questionItem.className = 'question-item';
       
       const questionText = document.createElement('div');
       questionText.className = 'question-text-preview';
       questionText.textContent = question.question;
       
       const deleteBtn = document.createElement('button');
       deleteBtn.className = 'btn btn-danger';
       deleteBtn.textContent = 'Eliminar';
       deleteBtn.addEventListener('click', () => deleteQuestion(index));
       
       questionItem.appendChild(questionText);
       questionItem.appendChild(deleteBtn);
       
       elements.questionList.appendChild(questionItem);
     });
   }
   
   // Delete a question
   function deleteQuestion(index) {
     if (confirm('¿Estás seguro de que deseas eliminar esta pregunta?')) {
       state.questions.splice(index, 1);
       updateQuestionList();
       
       // Update available questions
       state.availableQuestions = [...state.questions];
     }
   }
   
   // Add a new team input field
   function addTeamInput() {
     if (state.teams.length >= 4) {
       alert('Máximo 4 equipos permitidos');
       return;
     }
     
     const teamId = state.nextTeamId;
     
     const formGroup = document.createElement('div');
     formGroup.className = 'form-group';
     
     const label = document.createElement('label');
     label.setAttribute('for', `team${teamId}-name`);
     label.textContent = `Nombre del Equipo ${teamId}`;
     
     const input = document.createElement('input');
     input.type = 'text';
     input.id = `team${teamId}-name`;
     input.value = `Equipo ${teamId}`;
     
     formGroup.appendChild(label);
     formGroup.appendChild(input);
     
     elements.teamsContainer.appendChild(formGroup);
     
     // Add team to state
     state.teams.push({
       id: teamId,
       name: `Equipo ${teamId}`,
       score: 0,
       hasAnswered: false,
       isAnswering: false,
       history: []
     });
     
     state.nextTeamId++;
   }
   
   // Set up team names and timer
   function setupTeams() {
     // Get team names from inputs
     for (let i = 0; i < state.teams.length; i++) {
       const teamInput = document.getElementById(`team${state.teams[i].id}-name`);
       if (teamInput) {
         const teamName = teamInput.value.trim();
         if (teamName === "") {
           alert(`Por favor ingresa un nombre para el Equipo ${state.teams[i].id}`);
           return;
         }
         state.teams[i].name = teamName;
       }
     }
     
     const timerSeconds = parseInt(elements.timerSecondsInput.value);
     
     if (isNaN(timerSeconds) || timerSeconds < 5 || timerSeconds > 120) {
       alert("Por favor ingresa un tiempo válido entre 5 y 120 segundos");
       return;
     }
     
     // Update state
     state.timerSeconds = timerSeconds;
     state.timeRemaining = timerSeconds;
     
     // Reset scores
     state.teams.forEach(team => {
       team.score = 0;
     });
     
     // Create team cards
     createTeamCards();
     
     // Show game section
     elements.setupSection.style.display = 'none';
     elements.gameSection.style.display = 'block';
   }
   
   // Create team cards in the game section
   function createTeamCards() {
     elements.teamsDisplay.innerHTML = '';
     
     state.teams.forEach(team => {
       const teamCard = document.createElement('div');
       teamCard.id = `team-${team.id}-card`;
       teamCard.className = `team-card team-${team.id} card`;
       teamCard.addEventListener('click', () => selectTeamToAnswer(team.id));
       
       const cardHeader = document.createElement('div');
       cardHeader.className = 'card-header';
       cardHeader.id = `team-${team.id}-header`;
       cardHeader.textContent = team.name;
       
       const cardContent = document.createElement('div');
       cardContent.className = 'card-content';
       
       const teamScore = document.createElement('div');
       teamScore.id = `team-${team.id}-score`;
       teamScore.className = 'team-score';
       teamScore.textContent = '0';
       
       const teamStatus = document.createElement('div');
       teamStatus.id = `team-${team.id}-status`;
       teamStatus.className = 'team-status';
       teamStatus.textContent = 'Esperando inicio del juego';
       
       cardContent.appendChild(teamScore);
       cardContent.appendChild(teamStatus);
       
       teamCard.appendChild(cardHeader);
       teamCard.appendChild(cardContent);
       
       elements.teamsDisplay.appendChild(teamCard);
     });
   }
   
   // Start the game
   function startGame() {
     state.gameStarted = true;
     
     // Update UI
     elements.startGameSection.style.display = 'none';
     elements.questionSection.style.display = 'block';
     elements.gameSummary.style.display = 'none';
     
     // Select first question
     selectRandomQuestion();
   }
   
   // Select a random question
   function selectRandomQuestion() {
     if (state.availableQuestions.length === 0) {
       // No more questions, show game summary
       showGameSummary();
       return;
     }
     
     const randomIndex = Math.floor(Math.random() * state.availableQuestions.length);
     state.currentQuestion = state.availableQuestions[randomIndex];
     state.currentQuestionIndex = state.questions.findIndex(q => q.question === state.currentQuestion.question);
     
     // Remove the selected question from available and add to used
     state.availableQuestions.splice(randomIndex, 1);
     state.usedQuestions.push(state.currentQuestion);
     
     // Update UI
     elements.currentQuestion.textContent = state.currentQuestion.question;
     
     // Clear and create answer options
     elements.answerOptions.innerHTML = '';
     state.currentQuestion.options.forEach((option, index) => {
       const optionElement = document.createElement('div');
       optionElement.className = 'answer-option';
       optionElement.textContent = option;
       optionElement.dataset.index = index;
       optionElement.addEventListener('click', () => selectAnswer(index));
       elements.answerOptions.appendChild(optionElement);
     });
     
     // Reset round
     resetRound();
   }
   
   // Reset the current round
   function resetRound() {
     // Reset state
     state.teams.forEach(team => {
       team.hasAnswered = false;
       team.isAnswering = false;
     });
     
     state.selectedTeam = null;
     state.selectedAnswer = null;
     state.incorrectAnswers = [];
     state.waitingForTeamSelection = true;
     
     // Update UI
     state.teams.forEach(team => {
       const statusElement = document.getElementById(`team-${team.id}-status`);
       const cardElement = document.getElementById(`team-${team.id}-card`);
       
       if (statusElement) statusElement.textContent = "";
       if (cardElement) cardElement.classList.remove('selected');
     });
     
     // Show instructions, hide answer options
     elements.gameInstructions.style.display = 'block';
     elements.gameInstructions.textContent = 'Haz clic en el equipo que levantó la mano primero';
     elements.answerOptions.style.display = 'none';
     
     // Reset answer options
     const answerOptions = document.querySelectorAll('.answer-option');
     answerOptions.forEach(option => {
       option.classList.remove('selected');
       option.classList.remove('correct');
       option.classList.remove('incorrect');
       option.style.pointerEvents = 'auto';
     });
     
     // Reset timer
     stopTimer();
     state.timeRemaining = state.timerSeconds;
     elements.timer.textContent = state.timeRemaining;
     elements.timer.className = 'timer';
   }
   
   // Select team to answer (when clicking on team card)
   function selectTeamToAnswer(teamId) {
     // Only allow selection if waiting for team selection
     if (!state.waitingForTeamSelection) return;
     
     // Find the team
     const team = state.teams.find(t => t.id === teamId);
     if (!team) return;
     
     // If team has already answered, don't allow selection
     if (team.hasAnswered) return;
     
     state.selectedTeam = teamId;
     state.waitingForTeamSelection = false;
     
     // Update UI for all teams
     state.teams.forEach(t => {
       const statusElement = document.getElementById(`team-${t.id}-status`);
       const cardElement = document.getElementById(`team-${t.id}-card`);
       
       if (t.id === teamId) {
         t.isAnswering = true;
         if (cardElement) cardElement.classList.add('selected');
         if (statusElement) {
           statusElement.textContent = "Respondiendo...";
           statusElement.classList.add('answering');
         }
       } else {
         t.isAnswering = false;
         if (cardElement) cardElement.classList.remove('selected');
         if (statusElement) statusElement.classList.remove('answering');
       }
     });
     
     // Show answer options
     elements.gameInstructions.textContent = `${team.name} está respondiendo`;
     elements.answerOptions.style.display = 'grid';
     
     // Start timer
     startTimer();
   }
   
   // Select an answer
   function selectAnswer(index) {
     if (!state.selectedTeam) return;
     
     state.selectedAnswer = index;
     
     // Find the selected team
     const team = state.teams.find(t => t.id === state.selectedTeam);
     if (!team) return;
     
     // Update UI
     const answerOptions = document.querySelectorAll('.answer-option');
     answerOptions.forEach(option => {
       option.classList.remove('selected');
     });
     
     // Check if the answer is correct
     if (index === state.currentQuestion.correctAnswer) {
       // Mark as correct (green)
       answerOptions[index].classList.add('correct');
       handleCorrectAnswer(team);
     } else {
       // Mark only the selected answer as incorrect (red)
       answerOptions[index].classList.add('incorrect');
       
       // Add to incorrect answers
       state.incorrectAnswers.push(index);
       
       // Mark the team as having answered
       team.hasAnswered = true;
       team.isAnswering = false;
       
       handleIncorrectAnswer(team);
     }
   }
   
   // Handle correct answer
   function handleCorrectAnswer(team) {
     // Stop timer
     stopTimer();
     
     // Award points
     team.score += 10;
     const scoreElement = document.getElementById(`team-${team.id}-score`);
     const statusElement = document.getElementById(`team-${team.id}-status`);
     
     if (scoreElement) scoreElement.textContent = team.score;
     if (statusElement) statusElement.textContent = "¡Respuesta correcta!";
     
     // Add to history
     team.history.push({
       question: state.currentQuestion.question,
       answer: state.currentQuestion.options[state.currentQuestion.correctAnswer],
       correct: true
     });
     
     // Disable answer options
     const answerOptions = document.querySelectorAll('.answer-option');
     answerOptions.forEach(option => {
       option.style.pointerEvents = 'none';
     });
     
     // Update instructions
     elements.gameInstructions.textContent = "¡Respuesta correcta!";
     
     // Wait 2 seconds before moving to next question
     setTimeout(() => {
       selectRandomQuestion();
     }, 2000);
   }
   
   // Handle incorrect answer
   function handleIncorrectAnswer(team) {
     // Stop timer
     stopTimer();
     
     // Update UI for incorrect answer
     const statusElement = document.getElementById(`team-${team.id}-status`);
     if (statusElement) {
       statusElement.textContent = "Respuesta incorrecta";
       statusElement.classList.remove('answering');
     }
     
     // Add to history
     team.history.push({
       question: state.currentQuestion.question,
       answer: state.currentQuestion.options[state.selectedAnswer],
       correct: false
     });
     
     // Check if all teams have answered incorrectly
     const allTeamsAnswered = state.teams.every(t => t.hasAnswered);
     
     if (allTeamsAnswered) {
       // All teams have answered incorrectly, show the correct answer
       const answerOptions = document.querySelectorAll('.answer-option');
       answerOptions[state.currentQuestion.correctAnswer].classList.add('correct');
       
       // Disable answer options
       answerOptions.forEach(option => {
         option.style.pointerEvents = 'none';
       });
       
       // Update instructions
       elements.gameInstructions.textContent = "Todos los equipos respondieron incorrectamente";
       
       // Wait 2 seconds before moving to next question
       setTimeout(() => {
         selectRandomQuestion();
       }, 2000);
     } else {
       // Give the opportunity to another team
       // Find teams that haven't answered yet
       const availableTeams = state.teams.filter(t => !t.hasAnswered);
       
       if (availableTeams.length === 1) {
         // If only one team left, automatically select it
         const nextTeam = availableTeams[0];
         
         // Update instructions
         elements.gameInstructions.textContent = `Turno de ${nextTeam.name}`;
         
         // Reset for other team selection
         state.waitingForTeamSelection = true;
         
         // Give a short pause before auto-selecting the other team
         setTimeout(() => {
           selectTeamToAnswer(nextTeam.id);
         }, 1000);
       } else {
         // Multiple teams available, let user select
         elements.gameInstructions.textContent = "Selecciona el siguiente equipo que levantó la mano";
         state.waitingForTeamSelection = true;
       }
     }
   }
   
   // Start the timer
   function startTimer() {
     // Reset timer
     stopTimer();
     state.timeRemaining = state.timerSeconds;
     elements.timer.textContent = state.timeRemaining;
     elements.timer.className = 'timer';
     
     // Start interval
     state.timerInterval = setInterval(() => {
       state.timeRemaining--;
       elements.timer.textContent = state.timeRemaining;
       
       // Add warning classes
       if (state.timeRemaining <= 10) {
         elements.timer.classList.add('warning');
       }
       if (state.timeRemaining <= 5) {
         elements.timer.classList.remove('warning');
         elements.timer.classList.add('danger');
       }
       
       // Time's up
       if (state.timeRemaining <= 0) {
         stopTimer();
         handleTimeUp();
       }
     }, 1000);
   }
   
   // Stop the timer
   function stopTimer() {
     clearInterval(state.timerInterval);
   }
   
   // Handle time up
   function handleTimeUp() {
     // Find the selected team
     const team = state.teams.find(t => t.id === state.selectedTeam);
     if (!team) return;
     
     const statusElement = document.getElementById(`team-${team.id}-status`);
     if (statusElement) {
       statusElement.textContent = "¡Tiempo agotado!";
       statusElement.classList.remove('answering');
     }
     
     team.hasAnswered = true;
     team.isAnswering = false;
     
     // Add to history
     team.history.push({
       question: state.currentQuestion.question,
       answer: "Sin respuesta (tiempo agotado)",
       correct: false
     });
     
     // Check if all teams have had a chance
     const allTeamsAnswered = state.teams.every(t => t.hasAnswered);
     
     if (allTeamsAnswered) {
       // Show the correct answer
       const answerOptions = document.querySelectorAll('.answer-option');
       answerOptions[state.currentQuestion.correctAnswer].classList.add('correct');
       
       // Update instructions
       elements.gameInstructions.textContent = "Todos los equipos se quedaron sin tiempo";
       
       // Wait 2 seconds before moving to next question
       setTimeout(() => {
         selectRandomQuestion();
       }, 2000);
     } else {
       // Find teams that haven't answered yet
       const availableTeams = state.teams.filter(t => !t.hasAnswered);
       
       if (availableTeams.length === 1) {
         // If only one team left, automatically select it
         const nextTeam = availableTeams[0];
         
         // Update instructions
         elements.gameInstructions.textContent = `Turno de ${nextTeam.name}`;
         
         // Reset for other team selection
         state.waitingForTeamSelection = true;
         
         // Give a short pause before auto-selecting the other team
         setTimeout(() => {
           selectTeamToAnswer(nextTeam.id);
         }, 1000);
       } else {
         // Multiple teams available, let user select
         elements.gameInstructions.textContent = "Selecciona el siguiente equipo que levantó la mano";
         state.waitingForTeamSelection = true;
       }
     }
   }
   
   // Move to next question without awarding points
   function nextQuestion() {
     stopTimer();
     
     // Add to history for teams that didn't answer
     state.teams.forEach(team => {
       if (!team.hasAnswered && !team.isAnswering) {
         team.history.push({
           question: state.currentQuestion.question,
           answer: "Sin respuesta",
           correct: false
         });
       }
     });
     
     selectRandomQuestion();
   }
   
   // Show game summary
   function showGameSummary() {
     // Hide question section
     elements.questionSection.style.display = 'none';
     
     // Show summary section
     elements.gameSummary.style.display = 'block';
     
     // Clear previous summary
     elements.finalScores.innerHTML = '';
     elements.historyContainer.innerHTML = '';
     
     // Find the winner
     let maxScore = -1;
     let winners = [];
     
     state.teams.forEach(team => {
       if (team.score > maxScore) {
         maxScore = team.score;
         winners = [team];
       } else if (team.score === maxScore) {
         winners.push(team);
       }
     });
     
     // Determine winner message
     let winnerMessage = '';
     let winnerClass = '';
     
     if (winners.length === 1) {
       winnerMessage = `¡${winners[0].name} ha ganado!`;
       winnerClass = `winner-team-${winners[0].id}`;
     } else {
       winnerMessage = '¡Empate!';
       winnerClass = 'winner-tie';
     }
     
     elements.winnerAnnouncement.textContent = winnerMessage;
     elements.winnerAnnouncement.className = `winner-announcement ${winnerClass}`;
     
     // Create final scores
     state.teams.forEach(team => {
       const finalScore = document.createElement('div');
       finalScore.className = `final-score final-score-team-${team.id}`;
       
       const finalScoreName = document.createElement('div');
       finalScoreName.className = 'final-score-name';
       finalScoreName.textContent = team.name;
       
       const finalScorePoints = document.createElement('div');
       finalScorePoints.className = 'final-score-points';
       finalScorePoints.textContent = team.score;
       
       finalScore.appendChild(finalScoreName);
       finalScore.appendChild(finalScorePoints);
       
       elements.finalScores.appendChild(finalScore);
     });
     
     // Generate history lists
     state.teams.forEach(team => {
       const teamHistory = document.createElement('div');
       teamHistory.className = 'team-history';
       
       const historyHeader = document.createElement('div');
       historyHeader.className = `team-history-header team-${team.id}-header`;
       historyHeader.textContent = team.name;
       
       const historyList = document.createElement('ul');
       historyList.className = 'history-list';
       
       // Generate history items
       if (team.history.length === 0) {
         const emptyItem = document.createElement('li');
         emptyItem.className = 'history-item';
         emptyItem.textContent = 'No hay respuestas registradas';
         historyList.appendChild(emptyItem);
       } else {
         team.history.forEach(item => {
           const historyItem = document.createElement('li');
           historyItem.className = 'history-item';
           
           const questionSpan = document.createElement('span');
           questionSpan.className = 'history-question';
           questionSpan.textContent = item.question;
           
           const resultSpan = document.createElement('span');
           if (item.correct) {
             resultSpan.className = 'history-result history-correct';
             resultSpan.textContent = '✓';
           } else {
             resultSpan.className = 'history-result history-incorrect';
             resultSpan.textContent = '✗';
           }
           
           historyItem.appendChild(questionSpan);
           historyItem.appendChild(resultSpan);
           
           // Add tooltip with the answer
           historyItem.title = `Respuesta: ${item.answer}`;
           
           historyList.appendChild(historyItem);
         });
       }
       
       teamHistory.appendChild(historyHeader);
       teamHistory.appendChild(historyList);
       
       elements.historyContainer.appendChild(teamHistory);
     });
   }
   
   // Restart game
   function restartGame() {
     // Reset scores
     state.teams.forEach(team => {
       team.score = 0;
       team.history = [];
     });
     
     // Reset questions
     state.availableQuestions = [...state.questions];
     state.usedQuestions = [];
     
     // Update UI
     state.teams.forEach(team => {
       const scoreElement = document.getElementById(`team-${team.id}-score`);
       if (scoreElement) scoreElement.textContent = "0";
     });
     
     // Start game again
     startGame();
   }
   
   // Initialize the game when the page loads
   document.addEventListener('DOMContentLoaded', init);