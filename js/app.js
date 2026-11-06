// AURA OS — Core Mobile & Web Application Engine

let currentState = {
    expression: 'normal',
    servos: { head_pan: 90, head_tilt: 90, arm_l: 0, arm_r: 0 },
    memories: JSON.parse(localStorage.getItem('aura_memory') || '[]')
};

// Canvas Controllers for Robot Eyes
function drawEyes(canvasId, expression) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#a855f7";

    switch(expression) {
        case 'happy':
            ctx.beginPath();
            ctx.arc(canvas.width * 0.28, canvas.height * 0.5, 25, Math.PI, 0, false);
            ctx.arc(canvas.width * 0.72, canvas.height * 0.5, 25, Math.PI, 0, false);
            ctx.lineWidth = 8;
            ctx.strokeStyle = "#a855f7";
            ctx.stroke();
            break;
        case 'surprised':
            ctx.beginPath();
            ctx.arc(canvas.width * 0.28, canvas.height * 0.5, 30, 0, Math.PI * 2);
            ctx.arc(canvas.width * 0.72, canvas.height * 0.5, 30, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'sleeping':
            ctx.fillRect(canvas.width * 0.18, canvas.height * 0.5, 50, 6);
            ctx.fillRect(canvas.width * 0.62, canvas.height * 0.5, 50, 6);
            break;
        default: // 'normal'
            ctx.fillRect(canvas.width * 0.2, canvas.height * 0.3, 45, 55);
            ctx.fillRect(canvas.width * 0.65, canvas.height * 0.3, 45, 55);
            break;
    }
}

// Single Page Navigation Function
function switchPage(pageId) {
    document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn, .mob-btn').forEach(b => b.classList.remove('active'));
    
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) targetPage.classList.add('active');

    // Highlight active nav buttons (Sidebar & Mobile Bar)
    document.querySelectorAll(`[data-page="${pageId}"]`).forEach(b => b.classList.add('active'));
    
    // Scroll to top on page switch
    document.querySelector('.main-content').scrollTop = 0;
}

// Memory System Logic
function renderMemories() {
    const tbody = document.getElementById('memory-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    currentState.memories.forEach((mem, index) => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${mem.key}</strong></td>
                <td>${mem.val}</td>
                <td><button class="btn btn-danger" onclick="deleteMemory(${index})"><i class="fa-solid fa-trash"></i></button></td>
            </tr>
        `;
    });
}

function addMemory() {
    const key = document.getElementById('memory-key').value;
    const val = document.getElementById('memory-val').value;
    if (key && val) {
        currentState.memories.push({ key, val });
        localStorage.setItem('aura_memory', JSON.stringify(currentState.memories));
        document.getElementById('memory-key').value = '';
        document.getElementById('memory-val').value = '';
        renderMemories();
    }
}

function deleteMemory(index) {
    currentState.memories.splice(index, 1);
    localStorage.setItem('aura_memory', JSON.stringify(currentState.memories));
    renderMemories();
}

function updateServo(type, value) {
    document.getElementById(`${type.replace('_', '-')}-val`).innerText = value;
}

function sendMove(dir) {
    console.log(`Command sent: ${dir}`);
}

function selectExp(exp) {
    currentState.expression = exp;
    document.querySelectorAll('.exp-card').forEach(c => c.classList.remove('active'));
    event.currentTarget.classList.add('active');
    drawEyes('canvas-expression-preview', exp);
}

function applyExpression() {
    drawEyes('canvas-robot-eyes', currentState.expression);
    document.getElementById('current-expression-label').innerText = currentState.expression.toUpperCase();
}

// Speech Recognition
const micBtn = document.getElementById('mic-btn');
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';

    micBtn?.addEventListener('click', () => {
        recognition.start();
        micBtn.style.color = '#ef4444';
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('chat-input').value = transcript;
        micBtn.style.color = '';
    };
}

document.addEventListener('DOMContentLoaded', () => {
    drawEyes('canvas-robot-eyes', 'normal');
    drawEyes('canvas-expression-preview', 'normal');
    renderMemories();

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchPage(btn.dataset.page));
    });
});
