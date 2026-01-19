// 1. Your unique Firebase Configuration from your screenshots
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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 3. UI Elements
const dateEl = document.getElementById('currentDate');
const diaryText = document.getElementById('diaryText');
const picker = document.getElementById('bgColorPicker');
const diaryPage = document.getElementById('diaryPage');
const historyList = document.getElementById('historyList');

const todayKey = new Date().toDateString();
dateEl.innerText = todayKey;

// 4. Function to Save an entry to the CLOUD
async function saveDiary() {
    const text = diaryText.value;
    const color = picker.value;

    try {
        // This line sends the data to your Firebase Cloud Database
        await db.collection("entries").doc(todayKey).set({
            text: text,
            color: color,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert("Saved to the Cloud successfully!");
        renderHistory(); // Refresh the sidebar list
    } catch (error) {
        console.error("Error saving:", error);
        alert("Cloud saving failed. Please check if Firestore is in 'Test Mode'.");
    }
}

// 5. Function to load an entry from the list
function loadEntry(dateKey, text, color) {
    dateEl.innerText = dateKey;
    diaryText.value = text;
    diaryPage.style.backgroundColor = color;
    picker.value = color;
}

// 6. Function to fetch all entries from the CLOUD and show them in history
function renderHistory() {
    if (!historyList) return; // Skip if element doesn't exist
    historyList.innerHTML = "<h4>Past Entries</h4>";
    
    db.collection("entries").orderBy("timestamp", "desc").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const btn = document.createElement('button');
            btn.innerText = doc.id; // This is the date
            btn.className = "history-btn";
            btn.onclick = () => loadEntry(doc.id, data.text, data.color);
            historyList.appendChild(btn);
        });
    });
}

// 7. Sticker Logic
document.getElementById('stickerPalette').addEventListener('click', (e) => {
    if (e.target.tagName === 'SPAN') {
        const sticker = document.createElement('div');
        sticker.className = 'placed-sticker';
        sticker.innerText = e.target.innerText;
        sticker.style.left = '50px';
        sticker.style.top = '100px';
        
        // Basic drag-and-drop
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

// 8. Load data when the page opens
window.onload = renderHistory;