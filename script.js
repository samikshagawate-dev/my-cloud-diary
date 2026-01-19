// 1. Initialize data from Browser Memory
let diaryEntries = JSON.parse(localStorage.getItem('myDiaryEntries')) || {};
const dateEl = document.getElementById('currentDate');
const diaryText = document.getElementById('diaryText');
const picker = document.getElementById('bgColorPicker');
const diaryPage = document.getElementById('diaryPage');
const historyList = document.getElementById('historyList');

const todayKey = new Date().toDateString();
dateEl.innerText = todayKey;

// 2. Enable Color Changing
picker.addEventListener('input', (e) => {
    diaryPage.style.backgroundColor = e.target.value;
});

// 3. Function to Save an entry LOCALLY
function saveDiary() {
    const text = diaryText.value;
    const color = picker.value;

    // Save to the browser's storage
    diaryEntries[todayKey] = { text: text, color: color };
    localStorage.setItem('myDiaryEntries', JSON.stringify(diaryEntries));
    
    alert("Saved successfully to your computer!");
    renderHistory(); 
}

// 4. Function to Load a past entry
function loadEntry(dateKey) {
    const entry = diaryEntries[dateKey];
    if (entry) {
        dateEl.innerText = dateKey;
        diaryText.value = entry.text;
        diaryPage.style.backgroundColor = entry.color;
        picker.value = entry.color;
    }
}

// 5. Create the History List
function renderHistory() {
    if (!historyList) return;
    historyList.innerHTML = "<h4>Past Entries</h4>";
    
    Object.keys(diaryEntries).reverse().forEach(dateKey => {
        const btn = document.createElement('button');
        btn.innerText = dateKey;
        btn.className = "history-btn";
        btn.onclick = () => loadEntry(dateKey);
        historyList.appendChild(btn);
    });
}

// 6. Sticker Logic
document.getElementById('stickerPalette').addEventListener('click', (e) => {
    if (e.target.tagName === 'SPAN') {
        const sticker = document.createElement('div');
        sticker.className = 'placed-sticker';
        sticker.innerText = e.target.innerText;
        sticker.style.left = '50px';
        sticker.style.top = '100px';
        
        // Let's make stickers draggable
        makeDraggable(sticker);
        document.getElementById('canvas').appendChild(sticker);
    }
});

function makeDraggable(el) {
    let isDragging = false;
    el.onmousedown = () => { isDragging = true; };
    document.onmousemove = (e) => {
        if (isDragging) {
            el.style.left = e.pageX - 150 + 'px';
            el.style.top = e.pageY - 100 + 'px';
        }
    };
    document.onmouseup = () => { isDragging = false; };
}

// Load data when page opens
window.onload = () => {
    renderHistory();
    if (diaryEntries[todayKey]) loadEntry(todayKey);
};