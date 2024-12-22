const apiKey = "b83e4ce266c94968876e64fe4f144b92";
const newsContainer = document.getElementById("newsContainer");
const loadingMessage = document.getElementById("loadingMessage");
let currentAudio = null;

let isDarkMode = true;
const toggleModeBtn = document.getElementById("toggleModeBtn");
const body = document.body;
const sunIcon = document.getElementById("sunIcon");

toggleModeBtn.addEventListener("click", () => {
  isDarkMode = !isDarkMode;
  body.classList.toggle("dark-mode", isDarkMode);
  body.classList.toggle("light-mode", !isDarkMode);
  sunIcon.innerHTML = isDarkMode ? "&#9728;" : "&#9790;";
});

async function fetchNews() {
  loadingMessage.style.display = "block";  // Show loading message

  const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  loadingMessage.style.display = "none";  // Hide loading message
  displayNews(data.articles);
}

function displayNews(articles) {
  newsContainer.innerHTML = "";

  articles.forEach((article) => {
    const newsCard = document.createElement("div");
    newsCard.classList.add("news-card");
    newsCard.innerHTML = `
      <h2>${article.title}</h2>
      <p>${article.description || "No description available."}</p>
      <div class="buttons">
        <button class="btn read-aloud" onclick="readAloud('${article.title}')">Read Aloud</button>
        <button class="btn stop" onclick="stopReading()">Stop</button>
      </div>
      <div class="news-content" style="display:none;">
        <p class="full-description">${article.content || "No detailed content available."}</p>
        <a href="${article.url}" class="link-button" target="_blank">Read Full Article</a>
      </div>
    `;
    newsCard.addEventListener("click", () => toggleDescription(newsCard));

    newsContainer.appendChild(newsCard);
  });
}

function readAloud(text) {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
  currentAudio = utterance;
}

function stopReading() {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    currentAudio = null;
  }
}

function toggleDescription(newsCard) {
  const newsContent = newsCard.querySelector(".news-content");
  const isVisible = newsContent.style.display === "block";
  newsContent.style.display = isVisible ? "none" : "block";
}

fetchNews();
