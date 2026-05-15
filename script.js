/* ===========================
   1. BURGER MENU
=========================== */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

/* ===========================
   2. ACTIVE NAV LINK ON SCROLL
=========================== */
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  links.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

/* ===========================
   3. PROJECT FILTER — ADDED
=========================== */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active from all buttons, add to clicked
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    document.querySelectorAll('.card').forEach(card => {
      const cats = card.dataset.category || '';
      // Show all if filter is 'all', otherwise check if category matches
      card.classList.toggle('hidden', filter !== 'all' && !cats.includes(filter));
    });
  });
});

/* ===========================
   4. CONTACT FORM VALIDATION
=========================== */
const submitBtn = document.getElementById('submitBtn');
const nomInput = document.getElementById('nom');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const formError = document.getElementById('form-error');
const formSuccess = document.getElementById('form-success');

submitBtn.addEventListener('click', () => {
  const nom = nomInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

  // Hide previous messages
  formError.classList.add('hidden');
  formSuccess.classList.add('hidden');

  // Validation
  if (!nom) {
    showError('Veuillez entrer votre nom complet.');
    nomInput.focus();
    return;
  }

  if (!email || !isValidEmail(email)) {
    showError('Veuillez entrer une adresse email valide.');
    emailInput.focus();
    return;
  }

  if (!message || message.length < 10) {
    showError('Le message doit contenir au moins 10 caractères.');
    messageInput.focus();
    return;
  }

  // Success (simulated send)
  formSuccess.classList.remove('hidden');
  nomInput.value = '';
  emailInput.value = '';
  messageInput.value = '';

  // Hide success after 4 seconds
  setTimeout(() => {
    formSuccess.classList.add('hidden');
  }, 4000);
});

// Email helper
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(msg) {
  formError.textContent = msg;
  formError.classList.remove('hidden');
}

// Real-time clear error on typing
[nomInput, emailInput, messageInput].forEach(input => {
  input.addEventListener('input', () => {
    formError.classList.add('hidden');
  });
});

[nomInput, emailInput].forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      submitBtn.click();
    }
  });
});

/* ===========================
   5. SCROLL ANIMATIONS
=========================== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .skill-tag').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

/* ===========================
   6. WEATHER API — fetch + async/await
=========================== */
async function fetchWeather() {
  const loader = document.getElementById('weather-loader');
  const content = document.getElementById('weather-content');
  const error = document.getElementById('weather-error');

  try {
    // Show loader
    loader.classList.remove('hidden');
    content.classList.add('hidden');
    error.classList.add('hidden');

    const response = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=28.98&longitude=-10.05&current_weather=true'
    );

    if (!response.ok) {
      throw new Error('Erreur réseau : ' + response.status);
    }

    const data = await response.json();
    const weather = data.current_weather;

    // Weather code → description
    const descriptions = {
      0: 'Ciel dégagé ☀️',
      1: 'Principalement dégagé 🌤',
      2: 'Partiellement nuageux ⛅',
      3: 'Couvert ☁️',
      45: 'Brouillard 🌫',
      61: 'Pluie légère 🌧',
      63: 'Pluie modérée 🌧',
      80: 'Averses 🌦',
      95: 'Orage ⛈',
    };

    const desc = descriptions[weather.weathercode] || 'Conditions variables 🌡';

    // Display data
    document.getElementById('weather-temp').textContent = `🌡 ${weather.temperature}°C`;
    document.getElementById('weather-wind').textContent = `💨 Vent : ${weather.windspeed} km/h`;
    document.getElementById('weather-desc').textContent = desc;

    loader.classList.add('hidden');
    content.classList.remove('hidden');

  } catch (err) {
    loader.classList.add('hidden');
    error.textContent = '❌ Impossible de charger la météo. Vérifiez votre connexion.';
    error.classList.remove('hidden');
  }
}

// Call on page load
fetchWeather();