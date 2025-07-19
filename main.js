let hideName = false;
let lang = localStorage.getItem("lang") || navigator.language.slice(0, 2) || "ar";

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
  lang = (lang === "ar") ? "en" : "ar";
  localStorage.setItem("lang", lang);
  updateLang();
}

function updateLang() {
  document.documentElement.lang = lang;
  document.getElementById("langToggle").textContent = (lang === "ar") ? "English" : "عربي";
  for (let el of document.querySelectorAll("[data-lang]")) {
    el.textContent = translations[lang][el.getAttribute("data-lang")];
  }
}

window.onload = () => {
  updateLang();
  if (window.location.pathname.includes("view")) loadMessages();
};

function showToast(msg) {
  let toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = msg;
  document.body.appendChild(toast);
  toast.style.display = "block";
  setTimeout(() => { toast.remove(); }, 3000);
}

async function createEvent() {
  const name = document.getElementById("name").value;
  const occasion = document.getElementById("occasion").value;
  const date = document.getElementById("date").value;
  const res = await fetch("/create", {
    method: "POST",
    body: JSON.stringify({ name, occasion, date })
  });
  const data = await res.json();
  const link = `${window.location.origin}/send.html?id=${data.id}`;
  document.getElementById("generatedLink").value = link;
  showToast("✅ تم إنشاء المناسبة");
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
  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;
  const res = await fetch("/send?id=" + params.get("id"), {
    method: "POST",
    body: JSON.stringify({ name, message, paid: hideName })
  });
  document.getElementById("status").innerText = await res.text();
  showToast("✅ تم إرسال الرسالة");
}

async function loadMessages() {
  const params = new URLSearchParams(window.location.search);
  const res = await fetch("/view?id=" + params.get("id"));
  const messages = await res.json();
  const box = document.getElementById("messages");
  box.innerHTML = messages.map(msg => `<p><strong>${msg.name}</strong>: ${msg.message}</p>`).join("");
}
