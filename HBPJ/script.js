let quizCompletato = false;

// Navigazione tra fasi
function showPhase(phaseId) {
    document.querySelectorAll('.lock-container, .present-container').forEach(p => p.classList.add('hidden'));
    document.getElementById(phaseId).classList.remove('hidden');
}

// 1. Check PIN
function checkPin() {
    const pin = document.getElementById('pin-input').value;
    if (pin === "020422") {
        showPhase('phase-home');
    } else {
        const err = document.getElementById('error-pin');
        err.classList.remove('hidden');
        setTimeout(() => err.classList.add('hidden'), 2000);
    }
}

// 2. Logica Quiz
const quizData = [
    { q: "Iniziamo con una bella facile... Chi è il più SWAG???", options: ["Nando", "Nardo", "Napoli", "Iaia"], correct: 1 },
    { q: "Dai la prima era facile, proseguiamo. Sei stata brava quest'anno? Ti meriti il tuo regalo?", options: ["No non lo merito", "forse?", "Maggio", "SI!!!"], correct: 3 },
    { q: "Quanta arroganza, ti avviso che ci saranno conseguenze 🤬... devi dirmi qualcosa???", options: ["Ti chiedo scusa, sono una puzzona"], correct: 0 },
    { q: "Cosa stavamo facendo?", options: ["il quiz..."], correct: 0 },
    { q: "verooooo, ok ultima domanda: Come valuti l'operato del tuo ragazzo in questi ultimi 4 anni?", options: ["0/10", "2/10", "6/10", "10/10"], correct: 3 },
];
let currentQ = 0;

function startQuiz() {
    showPhase('phase-quiz');
    loadQuestion();
}

function loadQuestion() {
    const data = quizData[currentQ];
    document.getElementById('question-text').innerText = data.q;
    const container = document.getElementById('options-container');
    container.innerHTML = "";
    data.options.forEach((opt, idx) => {
        const b = document.createElement('button');
        b.className = "btn-quiz";
        b.innerText = opt;
        b.onclick = () => {
            if(idx === data.correct) {
                currentQ++;
                if(currentQ < quizData.length) loadQuestion();
                else finishQuiz();
            } else {
                alert("Sbagliato! Ricomincia il quiz.");
                currentQ = 0;
                showPhase('phase-home');
            }
        };
        container.appendChild(b);
    });
}

// Modifica la funzione finishQuiz esistente
function finishQuiz() {
    quizCompletato = true;
    document.getElementById('stat-1').innerText = "✅ COMPLETATO";
    document.getElementById('stat-1').style.color = "#00ff00";
    
    const card2 = document.getElementById('card-2');
    card2.classList.remove('locked');
    card2.querySelector('.icon').innerText = "📸";
    card2.querySelector('.status').innerText = "Disponibile";
    
    // Ora il click sulla card apre il gioco delle memorie
    card2.onclick = () => showPhase('phase-memories');

    showPhase('phase-home');
}

// Dati delle memorie: aggiungi qui quante coppie di foto vuoi
const memoriesData = [
    { f1: "images/pistola.png", f2: "images/pistola2.png", correct: 2 },
    { f1: "images/tg.png", f2: "images/tg2.png", correct: 2 },
    { f1: "images/gelato2.png", f2: "images/gelato.png", correct: 1 }
];

let currentMemory = 0;

// Questa funzione viene chiamata quando clicca sulla card "Memories" nella Home
function startMemories() {
    currentMemory = 0; // Reset se lo ricomincia
    showPhase('phase-memories');
    loadMemoryRound();
}

function loadMemoryRound() {
    const data = memoriesData[currentMemory];
    
    // Aggiorna il testo del round
    document.getElementById('memory-subtitle').innerText = `Round ${currentMemory + 1} di ${memoriesData.length}`;
    
    // Cambia le sorgenti delle immagini
    document.getElementById('img-choice-1').src = data.f1;
    document.getElementById('img-choice-2').src = data.f2;
}

function checkMemory(chosenNumber) {
    const data = memoriesData[currentMemory];

    if (chosenNumber === data.correct) {
        currentMemory++; // Passa al prossimo round
        
        if (currentMemory < memoriesData.length) {
            // Se ci sono ancora round, carica il prossimo
            loadMemoryRound();
        } else {
            // Se ha finito tutti i round
            finishMemories();
        }
    } else {
        // Se sbaglia, rimandalo alla home o fagli ricominciare i round
        const feedback = document.getElementById('memory-feedback');
        feedback.classList.remove('hidden');
        setTimeout(() => {
            feedback.classList.add('hidden');
            alert("Memoria fallace! Ricomincia");
            showPhase('phase-home');
        }, 1500);
    }
}

// Modifica anche il click della card nel finishQuiz per usare la nuova funzione
function finishQuiz() {
    quizCompletato = true;
    document.getElementById('stat-1').innerText = "✅ COMPLETATO";
    document.getElementById('stat-1').style.color = "#00ff00";
    
    const card2 = document.getElementById('card-2');
    card2.classList.remove('locked');
    card2.querySelector('.icon').innerText = "📸";
    card2.querySelector('.status').innerText = "Disponibile";
    
    // USA STARTMEMORIES QUI
    card2.onclick = () => startMemories(); 

    showPhase('phase-home');
}

function finishMemories() {
    document.getElementById('stat-2').innerText = "✅ COMPLETATO";
    document.getElementById('stat-2').style.color = "#00ff00";
    
    // Sblocca il pulsante del regalo finale
    document.getElementById('btn-final-gift').classList.remove('hidden'); 
    showPhase('phase-home');
}

function showGift() {
    showPhase('phase-gift');
    document.getElementById('floating-image').classList.add('hidden');
}

// ... Includi qui il codice delle stelle (canvas) che abbiamo usato prima ...
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize(); // Esegui subito per impostare le dimensioni

const stars = [];
for (let i = 0; i < 150; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.8,
        vx: Math.random() * 0.4 - 0.2,
        vy: Math.random() * 0.4 - 0.2,
        alpha: Math.random()
    });
}

function tick() {
    // Importante: il clearRect deve usare le dimensioni corrette
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let s of stars) {
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Movimento
        s.x += s.vx;
        s.y += s.vy;
        
        // Effetto tunnel
        if (s.x < 0) s.x = canvas.width;
        if (s.y < 0) s.y = canvas.height;
        if (s.x > canvas.width) s.x = 0;
        if (s.y > canvas.height) s.y = 0;
    }
    requestAnimationFrame(tick);
}

// Fai partire l'animazione
tick();

async function startFakeScan() {
    const btn = document.getElementById('btn-scan');
    const status = document.getElementById('recon-status');
    const scanLine = document.querySelector('.scan-line');
    const video = document.getElementById('webcam-video');
    
    try {
        // Chiede l'accesso alla fotocamera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.style.display = 'block'; // Mostra il video
        
        btn.classList.add('hidden');
        scanLine.style.display = 'block';
        status.innerText = "Analisi tratti somatici...";
        status.style.color = "#ff0000";

        // Finto caricamento suspense mentre lei si vede nel cerchio
        setTimeout(() => { status.innerText = "Confronto database 'Puzzone'..."; }, 2000);
        setTimeout(() => { status.innerText = "Verifica puzza piedi in corso..."; }, 4000);
        
        setTimeout(() => {
            // Spegne la fotocamera prima di mostrare la foto buffa
            stream.getTracks().forEach(track => track.stop());
            video.style.display = 'none';
            
            document.getElementById('camera-box').classList.add('hidden');
            document.getElementById('funny-result').classList.remove('hidden');
        }, 6500);

    } catch (err) {
        console.error("Errore fotocamera:", err);
        // Se rifiuta, puoi comunque far partire il finto caricamento senza video
        btn.classList.remove('hidden');
    }
}

// Quando ha finito Memories, sblocca la Card 3
function finishMemories() {
    // Segna Memories come completato
    document.getElementById('stat-2').innerText = "✅ COMPLETATO";
    document.getElementById('stat-2').style.color = "#00ff00";
    
    // Sblocca la Card 3 (Verifica volto)
    const card3 = document.getElementById('card-3');
    card3.classList.remove('locked');
    card3.querySelector('.icon').innerText = "👤";
    const statusText3 = card3.querySelector('.status');
    statusText3.innerText = "Disponibile";
    statusText3.id = "stat-3"; // Ora l'id è sul testo dello stato, non sulla card
    
    card3.onclick = () => showPhase('phase-recon');
    showPhase('phase-home');
}

function finishRecon() {
    document.getElementById('stat-3').innerText = "✅ IDENTIFICATA";
    document.getElementById('stat-3').style.color = "#00ff00";
    
    // Sblocca il pulsante del regalo finale
    document.getElementById('btn-final-gift').classList.remove('hidden'); 
    showPhase('phase-home');
}

let clickCount = 0;
const targetClicks = 150;

function handleSpamClick() {
    clickCount++;
    const display = document.getElementById('counter-display');
    const msg = document.getElementById('clicker-msg');
    const btn = document.getElementById('btn-spam');
    
    display.innerText = clickCount;

    // Messaggi divertenti a certi intervalli
    if(clickCount === 30) msg.innerText = "Good girl";
    if(clickCount === 60) msg.innerText = "Ti fanno male le dita? Poverina...";
    if(clickCount === 90) msg.innerText = "HEY rallenta pupa";
    if(clickCount === 120) msg.innerText = "C-C-ci sono quasi...";
    if(clickCount === 140) {
        msg.innerText = "ULTIMI DIECI!!!";
        display.style.color = "#00ff00";
    }

    if (clickCount >= targetClicks) {
        msg.innerText = "CE L'HAI FATTA! ❤️";
        btn.disabled = true;
        btn.innerText = "COMPLETATO!";
        setTimeout(() => {
            finishClicker();
        }, 1500);
    }
}

// Modifica la funzione finishRecon per sbloccare la Card 4 invece del regalo finale
function finishRecon() {
    document.getElementById('stat-3').innerText = "✅ IDENTIFICATA";
    document.getElementById('stat-3').style.color = "#00ff00";
    
    const card4 = document.getElementById('card-4');
    card4.classList.remove('locked');
    card4.querySelector('.icon').innerText = "🏆";
    const statusText4 = card4.querySelector('.status');
    statusText4.innerText = "Disponibile";
    statusText4.id = "stat-4";
    
    card4.onclick = () => showPhase('phase-clicker');
    showPhase('phase-home');
}

function finishClicker() {
    document.getElementById('stat-4').innerText = "✅ 150 CLIC FATTI";
    document.getElementById('stat-4').style.color = "#00ff00";
    
    // ORA mostriamo il tasto del regalo finale
    document.getElementById('btn-final-gift').classList.remove('hidden'); 
    showPhase('phase-home');
}

function revealJapan() {
    // Nasconde il "tasto" iniziale e mostra il Giappone
    document.getElementById('gift-curtain').classList.add('hidden');
    const revealDiv = document.getElementById('japan-reveal');
    revealDiv.classList.remove('hidden');

    // Crea l'effetto petali di ciliegio (Sakura)
    createPetals();
}

function createPetals() {
    const container = document.querySelector('.japan-theme');
    for (let i = 0; i < 50; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        
        // Dimensioni e posizioni casuali
        const size = Math.random() * 10 + 5 + 'px';
        petal.style.width = size;
        petal.style.height = size;
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDuration = Math.random() * 3 + 2 + 's';
        petal.style.animationDelay = Math.random() * 2 + 's';
        
        container.appendChild(petal);
    }
}

// Assicurati che showGift sia così:
function showGift() {
    showPhase('phase-gift');
    // Nascondiamo il gatto sospettoso per non rovinare il momento romantico
    document.getElementById('floating-image').style.display = 'none';
}