// ===== 1. ส่วนที่ใช้ร่วมกัน (Shared/Common) =====

// --- Firebase Configuration ---
const firebaseConfig = {
    apiKey: "AIzaSyA1DVvalDuthN0-pUwECByT7-Ur5uTlsEE",
    authDomain: "thai-phairater.firebaseapp.com",
    projectId: "thai-phairater",
    storageBucket: "thai-phairater.appspot.com",
    messagingSenderId: "995255977727",
    appId: "1:995255977727:web:c0c1170665a19ab5136eca"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
let currentUser = null;

// --- การเข้าถึง DOM Elements (ส่วนประกอบบนหน้าเว็บ) ---
const mainWrapper = document.getElementById('main-wrapper'), authContainer = document.getElementById('authContainer'), gameArea = document.getElementById('gameArea'), gameGrid = document.getElementById('game'), topBar = document.getElementById('topBar'), restartBtn = document.getElementById('restartBtn'), popup = document.getElementById('popup'), popupBox = document.getElementById('popupBox'), popupText = document.getElementById('popupText'), popupControls = document.getElementById('popupControls'), popupBtn = document.getElementById('popupBtn'), profileIconContainer = document.getElementById('profileIconContainer'), profileIconImg = document.getElementById('profileIconImg'), sidebar = document.getElementById('sidebar'), sidebarOverlay = document.getElementById('sidebar-overlay'), sidebarCloseBtn = document.getElementById('sidebarCloseBtn'), sidebarProfileImg = document.getElementById('sidebarProfileImg'), sidebarUserName = document.getElementById('sidebarUserName'), sidebarUserEmail = document.getElementById('sidebarUserEmail'), sidebarLogoutBtn = document.getElementById('sidebarLogoutBtn'), scoreValue = document.getElementById('scoreValue'), scoreDisplay = document.getElementById('scoreDisplay'), livesDisplay = document.getElementById('livesDisplay'), timerFill = document.getElementById('timerFill'), progressSection = document.getElementById('progressSection'), roundCoinContainer = document.getElementById('roundCoinContainer'), finalRewardsContainer = document.getElementById('finalRewardsContainer');
const loadingScreen = document.getElementById('loading-screen');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const lessonPage = document.getElementById('lesson-page');
const lessonGrid = document.getElementById('lesson-grid');
const closeLessonBtn = document.getElementById('close-lesson-btn');
const lessonBtn = document.getElementById('lessonBtn');
const startBtn = document.getElementById('startBtn');
const level2Area = document.getElementById('level2Area');
const level2Title = document.getElementById('level2-title');
const targetSequenceContainer = document.getElementById('target-sequence-container');
const sourceConsonantsContainer = document.getElementById('source-consonants-container');

// --- ตัวแปรสำหรับตรรกะของเกม (Game Logic Variables) ---
let countdownInterval, selected = [], gameChars = [];
const TOTAL_TIME = 60, LIVES = 3;
let baseScore = 0, bonusScore = 0, totalScore = 0;
let scoreFromPreviousLevels = 0;
let lives = LIVES, timeLeft = TOTAL_TIME, completedLessons = 0;
let level1Diamonds = 0;
const CHARS_PER_ROUND = 12; 
const LEVEL2_CHARS_PER_ROUND = 11;
let currentLevel = 1; 
let level2CurrentRound = 0;
let level2Chars = [];
let expectedCharIndex = 0; 

// --- เสียงประกอบ (Sound Effects) ---
const hoverSound = document.getElementById("hoverSound"), clickSound = document.getElementById("clickSound"), wrongSound = document.getElementById("wrongSound"), gameoverSound = document.getElementById("gameoverSound"), winSound = document.getElementById("winSound"), coinSound = document.getElementById("coinSound"), levelUpSound = document.getElementById("levelUpSound"), coinSwooshSound = document.getElementById("coinSwooshSound"), loseLifeSound = document.getElementById("loseLifeSound"), roundEndCoinSound = document.getElementById("roundEndCoinSound"), goodResultSound = document.getElementById("goodResultSound"), diamondSound = document.getElementById("diamondSound");

// --- ข้อมูลพยัญชนะ (Consonant Data) ---
const baseUrl = "https://phairater.github.io/thai-sounds/";
const allCharIds = [ "ก", "ข", "ฃ", "ค", "ฅ", "ฆ", "ง", "จ", "ฉ", "ช", "ซ", "ฌ", "ญ", "ฎ", "ฏ", "ฐ", "ฑ", "ฒ", "ณ", "ด", "ต", "ถ", "ท", "ธ", "น", "บ", "ป", "ผ", "ฝ", "พ", "ฟ", "ภ", "ม", "ย", "ร", "ล", "ว", "ศ", "ษ", "ส", "ห", "ฬ", "อ", "ฮ"];
const allChars = allCharIds.map(id => ({ id: id, img: `${baseUrl}${id}.png`, sound: `${baseUrl}${id}.mp3` }));
let matchedPairsInRound = 0;
let pairsInCurrentRound = 0;

// --- ฟังก์ชันช่วยเหลือ (Helper Functions) ---
function playAudio(audio) {
    audio.currentTime = 0;
    audio.play().catch(e => console.error("Audio play failed:", e));
}
function playEndRoundSoundSequence() {
    playAudio(roundEndCoinSound);
    setTimeout(() => playAudio(goodResultSound), 1000);
}
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- ฟังก์ชันจัดการ Layout และ UI ---
function calculateAndApplyLayout() {
    // ... (โค้ดคำนวณ Layout ของเกมด่าน 1)
}
function calculateLessonLayout() {
    // ... (โค้ดคำนวณ Layout ของหน้าบทเรียน)
}
function calculateLevel2Layout() {
    // ... (โค้ดคำนวณ Layout ของเกมด่าน 2)
}
function showPopup(msg, controls) {
    popupText.innerHTML = msg;
    popupControls.innerHTML = ''; // Clear previous buttons
    if (controls) {
        popupControls.appendChild(controls);
    }
    popup.style.display = "flex";
}
function closePopup() { popup.style.display = "none"; }
function preloadAllAssets(callback, text = "กำลังโหลดข้อมูลเกม...") {
    // ... (โค้ดโหลดไฟล์ทั้งหมดล่วงหน้า)
}
function updateScoreDisplay() {
    totalScore = scoreFromPreviousLevels + baseScore + bonusScore;
    scoreValue.textContent = totalScore;
}
function updateLivesDisplay() { livesDisplay.innerHTML = '❤️'.repeat(lives) + '💔'.repeat(LIVES - lives); }
function updateTrophyDisplay() {
    // ... (โค้ดอัปเดตถ้วยรางวัล)
}
function updateTimerBar() {
    const percentage = (timeLeft / TOTAL_TIME) * 100;
    timerFill.style.width = `${percentage}%`;
    if (percentage <= 25) timerFill.style.backgroundColor = '#dc3545';
    else if (percentage <= 50) timerFill.style.backgroundColor = '#ffc107';
    else timerFill.style.backgroundColor = '#28a745';
}

// --- ฟังก์ชันจัดการสถานะเกม (Game State Management) ---
function initializeGameUI() {
    updateScoreDisplay();
    timeLeft = TOTAL_TIME;
    updateLivesDisplay();
    updateTrophyDisplay();
    updateTimerBar();
    finalRewardsContainer.innerHTML = '';
}
function initializeGameState() {
    clearInterval(countdownInterval);
    currentLevel = 1;
    scoreFromPreviousLevels = 0;
    baseScore = 0; bonusScore = 0; totalScore = 0;
    lives = LIVES; completedLessons = 0;
    level1Diamonds = 0;
    gameGrid.innerHTML = "";
    initializeGameUI();
}
function resetGame() {
    clearInterval(countdownInterval);
    currentLevel = 1;
    scoreFromPreviousLevels = 0;
    baseScore = 0; bonusScore = 0; totalScore = 0;
    lives = LIVES; completedLessons = 0;
    level1Diamonds = 0;
    gameGrid.innerHTML = "";
    level2Area.style.display = 'none';
    gameArea.style.display = 'flex';
    startBtn.style.display = "inline-block";
    lessonBtn.style.display = "inline-block";
    restartBtn.style.display = "none";
    initializeGameUI();
}
// ---ฟังก์ชัน Animation ต่างๆ (Animations) ---
function animateTrophiesToDiamonds(finalCallback) {
    // ... (โค้ด animation ถ้วยรางวัลกลายเป็นเพชร)
}
function triggerFinalWinSequence() {
    // ... (โค้ดเมื่อชนะเกมโดยสมบูรณ์)
}
function triggerRoundCompleteSequence() {
    // ... (โค้ดเมื่อผ่านรอบ)
}
function addCollectedCoin(isBonus = false) {
    // ... (โค้ดเพิ่มเหรียญ)
}
function removeCollectedCoin() {
    // ... (โค้ดลบเหรียญ)
}

// ===== 2. ฟอร์มล็อกอิน (Login/Auth) =====

// --- ฟังก์ชันอัปเดต UI ตามสถานะการล็อกอิน ---
function updateAuthUI() {
    if (currentUser) {
        loadingScreen.style.display = 'none';
        authContainer.style.display = 'none';
        gameArea.style.display = 'flex';
        topBar.style.display = 'flex';
        profileIconContainer.style.display = 'block';
        const photoURL = currentUser.photoURL || 'https://i.imgur.com/sC22S2A.png';
        const displayName = currentUser.displayName || currentUser.email.split('@')[0];
        profileIconImg.src = photoURL;
        sidebarProfileImg.src = photoURL;
        sidebarUserName.textContent = displayName;
        sidebarUserEmail.textContent = currentUser.email;
        resetGame();
    } else {
        loadingScreen.style.display = 'none';
        authContainer.style.display = 'flex';
        gameArea.style.display = 'none';
        level2Area.style.display = 'none';
        topBar.style.display = 'none';
        profileIconContainer.style.display = 'none';
        closeSidebar();
    }
}
// --- ฟังก์ชัน Sidebar ---
function openSidebar() { sidebar.classList.add('open'); sidebarOverlay.style.display = 'block'; }
function closeSidebar() { sidebar.classList.remove('open'); sidebarOverlay.style.display = 'none'; }

// --- ฟังก์ชันเกี่ยวกับ Firebase Authentication ---
async function register() {
    // ดึงข้อมูลจากฟอร์มลงทะเบียน
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    // ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
    if (password !== confirmPassword) {
        alert("รหัสผ่านไม่ตรงกัน กรุณาลองใหม่อีกครั้ง");
        return;
    }

    try {
        // สร้างผู้ใช้ใหม่ใน Firebase Authentication
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // อัปเดตชื่อผู้ใช้ (Display Name)
        await userCredential.user.updateProfile({
            displayName: name
        });
        
        // onAuthStateChanged จะจัดการอัปเดต UI ให้เองเมื่อลงทะเบียนสำเร็จ
        console.log("Registered and logged in successfully:", userCredential.user);

    } catch (error) {
        console.error("Error registering:", error);
        alert("เกิดข้อผิดพลาดในการลงทะเบียน: " + error.message);
    }
}

async function login() {
    // ดึงข้อมูลจากฟอร์มล็อกอิน
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        // สั่งให้ Firebase ล็อกอินด้วยอีเมลและรหัสผ่าน
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        
        // onAuthStateChanged จะจัดการอัปเดต UI ให้เองเมื่อล็อกอินสำเร็จ
        console.log("Logged in successfully:", userCredential.user);

    } catch (error) {
        console.error("Error logging in:", error);
        alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง: " + error.message);
    }
}

async function loginWithGoogle() {
    try {
        // สร้างตัวจัดการสำหรับล็อกอินด้วย Google
        const provider = new firebase.auth.GoogleAuthProvider();
        
        // แสดงหน้าต่าง Popup ของ Google เพื่อให้ผู้ใช้ล็อกอิน
        const result = await auth.signInWithPopup(provider);

        // onAuthStateChanged จะจัดการอัปเดต UI ให้เองเมื่อล็อกอินสำเร็จ
        console.log("Logged in with Google successfully:", result.user);

    } catch (error) {
        console.error("Error with Google login:", error);
        alert("เกิดข้อผิดพลาดในการล็อกอินด้วย Google: " + error.message);
    }
}
async function logout() {
    try {
        // สั่งให้ Firebase ทำการ Sign Out
        await auth.signOut();
        
        // เมื่อ Sign Out สำเร็จ ไม่ต้องทำอะไรเพิ่ม
        // เพราะ onAuthStateChanged จะตรวจจับการเปลี่ยนแปลงและอัปเดตหน้าเว็บให้เอง
        console.log("User logged out successfully.");

    } catch (error) {
        // หากเกิดข้อผิดพลาดขึ้น
        console.error("Error logging out:", error);
        alert("เกิดข้อผิดพลาดในการออกจากระบบ: " + error.message);
    }
}

// ===== 3. บทเรียน (Lesson) =====
function showLessonPage() {
    lessonGrid.innerHTML = ''; 
    allChars.forEach(char => {
        const card = document.createElement('div');
        card.className = 'lesson-card';
        const img = document.createElement('img');
        img.src = char.img;
        img.alt = char.id;
        const text = document.createElement('span');
        text.textContent = char.id;
        card.appendChild(img);
        card.appendChild(text);
        card.onclick = () => { new Audio(char.sound).play(); };
        lessonGrid.appendChild(card);
    });
    lessonPage.style.display = 'flex';
    requestAnimationFrame(calculateLessonLayout);
}

function hideLessonPage() { lessonPage.style.display = 'none'; }


// ===== 4. เกมด่านที่ 1 (Game Level 1) =====

function startGame() {
    startBtn.style.display = "none";
    lessonBtn.style.display = "none";
    restartBtn.style.display = "inline-block";
    restartBtn.textContent = "เริ่มใหม่";
    
    // ตั้งค่าเกมเริ่มต้น
    currentLevel = 1;
    scoreFromPreviousLevels = 0;
    baseScore = 0;
    bonusScore = 0;
    lives = LIVES;
    completedLessons = 0;

    initializeGameUI();
    gameChars = shuffle([...allChars]);
    startRound();
}

function restartGame() {
    closePopup();
    resetGame();
}

function startRound() {
    // ... (โค้ดเริ่มรอบใหม่ของด่านที่ 1)
}

function selectCard(div, card) {
    // ... (โค้ดเมื่อผู้เล่นเลือกการ์ดในด่านที่ 1)
}

// ===== 5. เกมด่านที่ 2 (Game Level 2) =====

function startLevel2() {
    currentLevel = 2;
    gameArea.style.display = 'none';
    level2Area.style.display = 'flex';
    restartBtn.style.display = 'inline-block';
    level2CurrentRound = 0;
    startLevel2Round();
}

function startLevel2Round() {
    // ... (โค้ดเริ่มรอบใหม่ของด่านที่ 2)
}

function selectSequenceChar(charDiv, char) {
    // ... (โค้ดเมื่อผู้เล่นเลือกตัวอักษรในด่านที่ 2)
}


// ===== ส่วนจัดการตอนจบเกมและ Event Listeners (Game Over & Event Listeners) =====

function createSingleButtonPopup(text, onClickAction) {
    const controls = document.createElement('div');
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.style.backgroundColor = '#28a745';
    btn.onclick = onClickAction;
    controls.appendChild(btn);
    return controls;
}

function handleGameOver() {
    clearInterval(countdownInterval);
    playAudio(gameoverSound);
    showPopup("💔 พลาดแล้ว! ลองอีกครั้งนะ", createSingleButtonPopup("เล่นด่านนี้ใหม่", () => {
        closePopup();
        restartCurrentLevel();
    }));
    restartBtn.style.display = 'none';
    lessonBtn.style.display = "inline-block";
}
function handleScoreGameOver() {
    clearInterval(countdownInterval);
    playAudio(gameoverSound);
    
    showPopup("<h2>คะแนนหมด!</h2><p>คะแนนของคุณติดลบ เกมจะเริ่มต้นใหม่ทั้งหมด</p>", createSingleButtonPopup("เริ่มเกมใหม่", () => {
        closePopup();
        resetGame();
    }));
    
    restartBtn.style.display = 'none';
}

function restartCurrentLevel() {
    closePopup();
    lives = LIVES;
    baseScore = 0;
    bonusScore = 0;
    updateLivesDisplay();
    updateScoreDisplay(); 
    if (currentLevel === 1) {
        gameChars = shuffle([...allChars]);
        startRound();
    } else if (currentLevel === 2) {
        startLevel2();
    }
}

// --- Event Listeners (ตัวดักจับเหตุการณ์) ---
auth.onAuthStateChanged((user) => {
    currentUser = user;
    if (user) {
        // ถ้าล็อกอินแล้ว โหลดไฟล์เกมก่อน แล้วค่อยแสดง UI
        preloadAllAssets(updateAuthUI, "กำลังโหลดไฟล์เกม...");
    } else {
        // ถ้ายังไม่ล็อกอิน แสดงหน้าล็อกอินเลย
        updateAuthUI();
    }
});

profileIconContainer.onclick = openSidebar;
sidebarOverlay.onclick = closeSidebar;
sidebarCloseBtn.onclick = closeSidebar;
sidebarLogoutBtn.onclick = logout;
closeLessonBtn.onclick = hideLessonPage;

// --- จัดการการปรับขนาดหน้าจอ ---
let resizeTimeout;
function handleScreenChange() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        setFullHeight();
        if (lessonPage.style.display === 'flex') {
            calculateLessonLayout();
        } else if (gameArea.style.display === 'flex' && currentLevel === 1) {
            calculateAndApplyLayout();
        } else if (level2Area.style.display === 'flex') {
            calculateLevel2Layout();
        }
    }, 100);
}

window.addEventListener('resize', handleScreenChange);
window.addEventListener('orientationchange', handleScreenChange);

// --- ตั้งค่าความสูงเต็มหน้าจอสำหรับมือถือ ---
function setFullHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
window.addEventListener('load', () => { setFullHeight(); });
