document.addEventListener('DOMContentLoaded', function () {
  createParticles();
  initStepperAnimation();
  initFormEvents();
  initCharCounter();
});

function createParticles() {
  const container = document.querySelector('.particles');
  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = Math.random() * 100 + 'vw';
    p.style.width = (4 + Math.random() * 8) + 'px';
    p.style.height = p.style.width;
    p.style.animationDuration = (8 + Math.random() * 12) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    container.appendChild(p);
  }
}

function initStepperAnimation() {
  const dots = document.querySelectorAll('.stepper-dot');
  let current = 0;
  setInterval(() => {
    dots[current].classList.remove('active');
    current = (current + 1) % dots.length;
    dots[current].classList.add('active');
  }, 1200);
}

function initCharCounter() {
  const textarea = document.getElementById('alasan');
  const counter = document.getElementById('charCount');
  if (textarea && counter) {
    textarea.addEventListener('input', function () {
      counter.textContent = this.value.length + ' karakter';
    });
  }
}

function initFormEvents() {
  const form = document.getElementById('registrationForm');
  const inputs = form.querySelectorAll('input, select, textarea');

  inputs.forEach(input => {
    input.addEventListener('blur', function () {
      validateField(this);
    });
    input.addEventListener('input', function () {
      if (this.classList.contains('error')) {
        validateField(this);
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    handleSubmit();
  });
}

function validateField(field) {
  const errorEl = document.getElementById('err-' + field.id);
  let isValid = true;
  let msg = '';

  if (!field.value.trim()) {
    isValid = false;
    msg = 'Field ini wajib diisi.';
  } else {
    if (field.id === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        isValid = false;
        msg = 'Format email tidak valid.';
      }
    }
    if (field.id === 'phone') {
      const phoneRegex = /^(\+62|62|0)[0-9]{8,13}$/;
      if (!phoneRegex.test(field.value.replace(/\s/g, ''))) {
        isValid = false;
        msg = 'Nomor HP tidak valid. Contoh: 08123456789';
      }
    }
    if (field.id === 'alasan' && field.value.trim().length < 10) {
      isValid = false;
      msg = 'Alasan terlalu singkat, minimal 10 karakter.';
    }
  }

  if (!isValid) {
    field.classList.add('error');
    if (errorEl) { errorEl.textContent = msg; errorEl.classList.add('show'); }
  } else {
    field.classList.remove('error');
    if (errorEl) { errorEl.classList.remove('show'); }
  }

  return isValid;
}

function validateAll() {
  const fields = document.querySelectorAll('#registrationForm input, #registrationForm select, #registrationForm textarea');
  let allValid = true;
  fields.forEach(f => { if (!validateField(f)) allValid = false; });
  return allValid;
}

function handleSubmit() {
  if (!validateAll()) return;

  const nama  = document.getElementById('nama').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const kota  = document.getElementById('kota').value.trim();
  const skill = document.getElementById('skill').value;
  const alasan = document.getElementById('alasan').value.trim();

  displayResult({ nama, email, phone, kota, skill, alasan });
}

function displayResult(data) {
  const skillMap = {
    'pemula':          'Masih Pemula',
    'bisa-dikit':      'Bisa Dikit-dikit',
    'lumayan':         'Lumayan Mengerti',
    'jago-tapi-males': 'Jago Tapi Malas',
    'ga-mau-ngoding':  'Tidak Mau Ngoding Sama Sekali'
  };

  const resultSection = document.getElementById('resultSection');
  const resultBody    = document.getElementById('resultBody');

  const items = [
    { label: 'Nama',        value: data.nama },
    { label: 'Email',       value: data.email },
    { label: 'No. HP',      value: data.phone },
    { label: 'Kota',        value: data.kota || '-' },
    { label: 'Level Skill', value: skillMap[data.skill] || data.skill },
    { label: 'Alasan Join', value: data.alasan },
  ];

  // DOM manipulation
  resultBody.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('result-item');

    const labelEl = document.createElement('span');
    labelEl.classList.add('result-label');
    labelEl.textContent = item.label;

    const valueEl = document.createElement('span');
    valueEl.classList.add('result-value');
    valueEl.textContent = item.value;

    div.appendChild(labelEl);
    div.appendChild(valueEl);
    resultBody.appendChild(div);
  });

  resultSection.classList.add('active');

  setTimeout(() => {
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);

  // Update button state
  const btn = document.querySelector('.btn-submit');
  btn.textContent = 'Data Terkirim, Daftar Lagi Kahj?';
  btn.style.background = 'linear-gradient(135deg, #26c6da, #00897b)';

  btn.addEventListener('click', function resetBtn() {
    document.getElementById('registrationForm').reset();
    document.getElementById('charCount').textContent = '0 karakter';
    resultSection.classList.remove('active');
    btn.textContent = 'Kirim Pendaftaran';
    btn.style.background = '';
    btn.removeEventListener('click', resetBtn);
    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
  }, { once: true });
}
