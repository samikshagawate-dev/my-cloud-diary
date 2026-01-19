// 1. Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDw_7mNRVcKf_NxlNdapWRu8Kv7HvJHi9c",
  authDomain: "my-web-diary-f916c.firebaseapp.com",
  projectId: "my-web-diary-f916c",
  storageBucket: "my-web-diary-f916c.firebasestorage.app",
  messagingSenderId: "525238413657",
  appId: "1:525238413657:web:9c429fad39df04529ec448",
  measurementId: "G-M63X92MJWK"
};

// 2. Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase Initialized");
} catch (e) {
    alert("Error starting Firebase: " + e.message);
}
const db = firebase.firestore();

// 3. UI Elements
const dateEl = document.getElementById('currentDate');
const diaryText = document.getElementById('diaryText');
const picker = document.getElementById('bgColorPicker');
const diaryPage = document.getElementById('diaryPage');
const historyList = document.getElementById('historyList');

// Set Date
const todayKey = new Date().toDateString();
if(dateEl) dateEl.innerText = todayKey;

// --- FIX 1: Enable Color Changing ---
picker.addEventListener('input', (e) => {
    diaryPage.style.backgroundColor = e.target.value;
});

// 4. Function to Save an entry
async function saveDiary() {
    // --- FIX 2: Debug Alert to prove button works ---
    alert("Button clicked! Trying to save..."); 

    const text = diaryText.value;
    const color = picker.value;

    try {
        await db.collection("entries").doc(todayKey).set({
            text: text,
            color: color,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert("Saved to the Cloud successfully!");
        renderHistory(); 
    } catch (error) {
        console.error("Error saving:", error);
        alert("Save Failed! Error: " + error.message);
    }
}

// 5. Load an entry
function loadEntry(dateKey, text, color) {
    dateEl.innerText = dateKey;
    diaryText.value = text;
    diaryPage.style.backgroundColor = color;
    picker.value = color;
}

// 6. Load History
function renderHistory() {
    if (!historyList) return;
    historyList.innerHTML = "<h4>Past Entries</h4>";
    
    db.collection("entries").orderBy("timestamp", "desc").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const btn = document.createElement('button');
            btn.innerText = doc.id;
            btn.className = "history-btn";
            btn.onclick = () => loadEntry(doc.id, data.text, data.color);
            historyList.appendChild(btn);
        });
    }).catch(err => console.log("History load error (expected if empty):", err));
}

// 7. Sticker Logic
const stickerPalette = document.getElementById('stickerPalette');
if (stickerPalette) {
    stickerPalette.addEventListener('click', (e) => {
        if (e.target.tagName === 'SPAN') {
            const sticker = document.createElement('div');
            sticker.className = 'placed-sticker';
            sticker.innerText = e.target.innerText;
            // Random position so they don't stack perfectly on top of each other
            sticker.style.left = (Math.random() * 200 + 50) + 'px';
            sticker.style.top = (Math.random() * 200 + 100) + 'px';
            
            makeDraggable(sticker);
            document.getElementById('canvas').appendChild(sticker);
        }
    });
}

function makeDraggable(el) {
    let isDragging = false;
    el.onmousedown = () => { isDragging = true; };
    document.onmousemove = (e) => {
        if (isDragging) {
            el.style.left = e.pageX - 200 + 'px';
            el.style.top = e.pageY - 100 + 'px';
        }
    };
    document.onmouseup = () => { isDragging = false; };
}

window.onload = renderHistory;