let hideName = false;
const translations = {
  ar: {
    "title-create": "🎉 إنشاء مناسبة",
    "title-send": "✉️ إرسال رسالة",
    "title-view": "📬 رسائل المناسبة",
    "create-btn": "إنشاء",
    "send-btn": "إرسال",
    "hide-btn": "أخفي اسمي"
  },
  en: {
    "title-create": "🎉 Create Occasion",
    "title-send": "✉️ Send Message",
    "title-view": "📬 Occasion Messages",
    "create-btn": "Create",
    "send-btn": "Send",
    "hide-btn": "Hide my name"
  }
};

function toggleLang() {
  const currentLang = document.documentElement.lang === "ar" ? "en" : "ar";
  document.documentElement.lang = currentLang;
  localStorage.setItem("lang", currentLang);
  for (let el of document.querySelectorAll("[data-lang]")) {
    el.textContent = translations[currentLang][el.getAttribute("data-lang")];
  }
  document.getElementById("langToggle").textContent = currentLang === "ar" ? "English" : "عربي";
}

window.onload = () => {
  const lang = localStorage.getItem("lang") || "ar";
  document.documentElement.lang = lang;
  toggleLang();
  if (window.location.pathname.includes("view")) loadMessages();
};

async function createEvent() {
  const res = await fetch("/create", {
    method: "POST",
    body: JSON.stringify({
      name: document.getElementById("name").value,
      occasion: document.getElementById("occasion").value,
      date: document.getElementById("date").value
    })
  });
  const data = await res.json();
  document.getElementById("result").innerText = window.location.origin + "/send.html?id=" + data.id;
}

function toggleHide() {
  if (!hideName) {
    alert("لإخفاء اسمك، اشترك بـ 50 جنيه سنويًا على رقم 01017103152 (Vodafone Cash)");
    hideName = false;
    document.getElementById("hideBtn").style.background = "red";
  } else {
    hideName = false;
    document.getElementById("hideBtn").style.background = "red";
  }
}

async function sendMessage() {
  const params = new URLSearchParams(window.location.search);
  const res = await fetch("/send?id=" + params.get("id"), {
    method: "POST",
    body: JSON.stringify({
      name: document.getElementById("name").value,
      message: document.getElementById("message").value,
      paid: hideName
    })
  });
  document.getElementById("status").innerText = await res.text();
}

async function loadMessages() {
  const params = new URLSearchParams(window.location.search);
  const res = await fetch("/view?id=" + params.get("id"));
  const messages = await res.json();
  const box = document.getElementById("messages");
  box.innerHTML = messages.map(msg => `<p><strong>${msg.name}</strong>: ${msg.message}</p>`).join("");
}