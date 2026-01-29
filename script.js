const questionBank = {
    software: {
        easy: [
            { q: "What does HTML stand for?", o: ["Hypertext Markup Language", "High Tech Multi Language", "Hyperlinks Text"], a: 0 },
            { q: "Which symbol is used for IDs in CSS?", o: [".", "#", "&"], a: 1 },
            { q: "Which language is primarily used for Android apps?", o: ["Swift", "Kotlin", "C#"], a: 1 },
            { q: "What is the result of 2 + '2' in JavaScript?", o: ["4", "22", "undefined"], a: 1 }
        ],
        medium: [
            { q: "Which design pattern ensures a class has only one instance?", o: ["Factory", "Singleton", "Observer"], a: 1 },
            { q: "What is the time complexity of searching in a balanced BST?", o: ["O(n)", "O(log n)", "O(1)"], a: 1 },
            { q: "Which keyword is used to prevent inheritance in Java?", o: ["static", "final", "private"], a: 1 },
            { q: "In Git, which command creates a new branch?", o: ["git checkout -b", "git branch -new", "git commit -b"], a: 0 }
        ],
        hard: [
            { q: "What does the 'A' in CAP theorem stand for?", o: ["Atomicity", "Availability", "Authority"], a: 1 },
            { q: "Which garbage collection algorithm uses 'Mark and Sweep'?", o: ["Reference Counting", "Tracing", "Copying"], a: 1 },
            { q: "What is the purpose of a 'Reverse Proxy'?", o: ["Load Balancing", "Database Indexing", "Unit Testing"], a: 0 },
            { q: "In Microservices, what is 'Circuit Breaking' used for?", o: ["Data encryption", "Fault tolerance", "Code minification"], a: 1 }
        ]
    },
    testing: {
        easy: [
            { q: "What is the primary goal of Software Testing?", o: ["To find bugs", "To write code", "To design UI"], a: 0 },
            { q: "Which testing is done by developers?", o: ["Unit Testing", "System Testing", "UAT"], a: 0 },
            { q: "What is a 'Bug' in software?", o: ["A feature", "An error in code", "A hardware part"], a: 1 },
            { q: "Which tool is used for tracking bugs?", o: ["Jira", "VS Code", "Photoshop"], a: 0 }
        ],
        medium: [
            { q: "What is Regression Testing?", o: ["Testing new features", "Retesting old features for side effects", "Stress testing"], a: 1 },
            { q: "Which testing verifies internal code logic?", o: ["Black-box", "White-box", "Grey-box"], a: 1 },
            { q: "What does 'STLC' stand for?", o: ["Software Testing Life Cycle", "System Tech Logic Center", "Standard Test Level Code"], a: 0 },
            { q: "What is a 'Sanity' test?", o: ["Deep testing", "Narrow, brief test of fixed bugs", "Final release test"], a: 1 }
        ],
        hard: [
            { q: "What is the main difference between Load and Stress testing?", o: ["User count", "Testing beyond system limits", "Tool used"], a: 1 },
            { q: "In Selenium, what is the 'Page Object Model'?", o: ["A design pattern", "A library", "A browser type"], a: 0 },
            { q: "What is 'Equivalence Partitioning'?", o: ["Code splitting", "Dividing input data into valid/invalid sets", "Database sharding"], a: 1 },
            { q: "Which tool is best for API performance testing?", o: ["Selenium", "JMeter", "Appium"], a: 1 }
        ]
    }
};

let quizState = {
    index: 0,
    score: 0,
    timeSpent: [],
    timer: null,
    timeLeft: 15,
    startTime: 0,
    currentQuestions: []
};

function initiateQuiz() {
    const selectedCat = document.getElementById('category-select').value;
    const selectedDiff = document.getElementById('difficulty-select').value;
    
    // Select the 4-question array based on user choice 
    quizState.currentQuestions = questionBank[selectedCat][selectedDiff];

    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('quiz-page').classList.remove('hidden');
    loadQuestion();
}

function loadQuestion() {
    clearInterval(quizState.timer); // Reset timer for every question 
    quizState.timeLeft = 15; 
    quizState.startTime = Date.now();
    
    const q = quizState.currentQuestions[quizState.index];
    document.getElementById('q-text').innerText = q.q;
    document.getElementById('progress-text').innerText = `Question ${quizState.index + 1}/4`; // 
    
    const grid = document.getElementById('options-grid');
    grid.innerHTML = '';
    
    q.o.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.innerText = opt;
        btn.onclick = () => recordResponse(idx);
        grid.appendChild(btn);
    });

    startCountdown();
}

function startCountdown() {
    const display = document.getElementById('timer-count');
    quizState.timer = setInterval(() => {
        quizState.timeLeft--;
        display.innerText = quizState.timeLeft;
        if (quizState.timeLeft <= 0) recordResponse(-1); // Auto-submit on zero [cite: 37]
    }, 1000);
}

function recordResponse(userChoice) {
    clearInterval(quizState.timer);
    const timeTaken = (Date.now() - quizState.startTime) / 1000;
    quizState.timeSpent.push(timeTaken);

    if (userChoice === quizState.currentQuestions[quizState.index].a) quizState.score++;

    quizState.index++;
    if (quizState.index < 4) {
        loadQuestion();
    } else {
        renderResults();
    }
}

function renderResults() {
    document.getElementById('quiz-page').classList.add('hidden');
    document.getElementById('result-page').classList.remove('hidden');
    document.getElementById('score-text').innerHTML = `<h3>Final Score: ${quizState.score} / 4</h3>`; 
    
    renderCharts(quizState.score, 4, quizState.timeSpent); // Result analysis using charts [cite: 38]
}

function renderCharts(score, total, timeData) {
    new Chart(document.getElementById('accuracyChart'), {
        type: 'pie',
        data: {
            labels: ['Correct', 'Incorrect'],
            datasets: [{ data: [score, total - score], backgroundColor: ['#2ecc71', '#e74c3c'] }]
        }
    });

    new Chart(document.getElementById('timeChart'), {
        type: 'bar',
        data: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [{ label: 'Seconds', data: timeData, backgroundColor: '#3498db' }]
        }
    });
}