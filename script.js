/* ==========================================================================
   DM HOME IMPROVEMENT LLC — LANDING PAGE INTERACTIVITY & LIGHTBOX ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. POP-UP QUESTIONNAIRE MODAL CONTROLLER
     ------------------------------------------------------------------------ */
  const quizModal = document.getElementById('quizModal');
  const quizModalOverlay = document.getElementById('quizModalOverlay');
  const quizModalClose = document.getElementById('quizModalClose');
  const ctaButtons = document.querySelectorAll('.scroll-to-quiz');

  function openQuizModal(e) {
    if (e) e.preventDefault();
    if (quizModal) {
      quizModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeQuizModal() {
    if (quizModal) {
      quizModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  ctaButtons.forEach(btn => {
    btn.addEventListener('click', openQuizModal);
  });

  if (quizModalClose) quizModalClose.addEventListener('click', closeQuizModal);
  if (quizModalOverlay) quizModalOverlay.addEventListener('click', closeQuizModal);

  /* ------------------------------------------------------------------------
     2. LIGHTBOX PHOTO EXPAND MODAL FOR BEFORE & AFTER PHOTOS
     ------------------------------------------------------------------------ */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const zoomableElements = document.querySelectorAll('.zoomable-img-wrap');

  function openLightbox(imgSrc, captionText) {
    if (lightboxModal && lightboxImg) {
      lightboxImg.src = imgSrc;
      if (lightboxCaption) lightboxCaption.textContent = captionText || '';
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  zoomableElements.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.getAttribute('data-img') || item.querySelector('img')?.src;
      const captionText = item.getAttribute('data-caption') || item.querySelector('img')?.alt;
      if (imgSrc) {
        openLightbox(imgSrc, captionText);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

  // Global escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuizModal();
      closeLightbox();
    }
  });

  /* ------------------------------------------------------------------------
     3. MULTI-STEP QUESTIONNAIRE LOGIC
     ------------------------------------------------------------------------ */
  let currentStep = 1;
  const totalSteps = 5;

  const quizSteps = document.querySelectorAll('.quiz-step');
  const quizProgressFill = document.getElementById('quizProgressFill');
  const quizStepLabel = document.getElementById('quizStepLabel');
  const quizPercentLabel = document.getElementById('quizPercentLabel');
  const btnQuizBack = document.getElementById('btnQuizBack');

  function updateStepView(stepNum) {
    currentStep = stepNum;

    quizSteps.forEach(step => {
      const stepIdx = parseInt(step.getAttribute('data-step'), 10);
      if (stepIdx === currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    const percent = Math.round((currentStep / totalSteps) * 100);
    if (quizProgressFill) quizProgressFill.style.width = `${percent}%`;
    if (quizStepLabel) quizStepLabel.textContent = `STEP ${currentStep} OF ${totalSteps}`;
    if (quizPercentLabel) quizPercentLabel.textContent = `${percent}% COMPLETE`;

    if (btnQuizBack) {
      if (currentStep > 1) {
        btnQuizBack.style.display = 'inline-block';
      } else {
        btnQuizBack.style.display = 'none';
      }
    }
  }

  // Radio Cards Auto-Advance (Steps 1, 2, 3)
  const radioCards = document.querySelectorAll('.quiz-option-card');
  radioCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const parentStep = card.closest('.quiz-step');
      if (!parentStep) return;
      const stepIdx = parseInt(parentStep.getAttribute('data-step'), 10);

      const siblingCards = parentStep.querySelectorAll('.quiz-option-card');
      siblingCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      const radioInput = card.querySelector('.quiz-radio');
      if (radioInput) radioInput.checked = true;

      if (stepIdx < 4) {
        setTimeout(() => {
          updateStepView(stepIdx + 1);
        }, 260);
      }
    });
  });

  // Checkbox Cards Multi-Select (Step 4)
  const checkboxCards = document.querySelectorAll('.quiz-checkbox-card');
  checkboxCards.forEach(card => {
    card.addEventListener('click', () => {
      const checkbox = card.querySelector('.quiz-checkbox');
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        if (checkbox.checked) {
          card.classList.add('selected');
        } else {
          card.classList.remove('selected');
        }
      }
    });
  });

  const btnNextStep4 = document.getElementById('btnNextStep4');
  if (btnNextStep4) {
    btnNextStep4.addEventListener('click', () => {
      updateStepView(5);
    });
  }

  if (btnQuizBack) {
    btnQuizBack.addEventListener('click', () => {
      if (currentStep > 1) {
        updateStepView(currentStep - 1);
      }
    });
  }

  /* ------------------------------------------------------------------------
     4. 3D RENDER vs FINISHED JOB SITE TOGGLE
     ------------------------------------------------------------------------ */
  const btnShowRender = document.getElementById('btnShowRender');
  const btnShowFinished = document.getElementById('btnShowFinished');
  const offerImage = document.getElementById('offerImage');

  if (btnShowRender && btnShowFinished && offerImage) {
    btnShowRender.addEventListener('click', () => {
      btnShowRender.classList.add('active');
      btnShowFinished.classList.remove('active');
      offerImage.style.opacity = '0';
      setTimeout(() => {
        offerImage.src = 'assets/bath_3d_render.jpg';
        offerImage.alt = 'DM Home Improvement 3D Bathroom Render Design Concept';
        offerImage.style.opacity = '1';
      }, 200);
    });

    btnShowFinished.addEventListener('click', () => {
      btnShowFinished.classList.add('active');
      btnShowRender.classList.remove('active');
      offerImage.style.opacity = '0';
      setTimeout(() => {
        offerImage.src = 'assets/real_after/IMG_0377.jpeg';
        offerImage.alt = 'DM Home Improvement Real Finished Job Site Photo';
        offerImage.style.opacity = '1';
      }, 200);
    });
  }

  /* ------------------------------------------------------------------------
     5. STICKY CTA BAR SCROLL TRIGGER
     ------------------------------------------------------------------------ */
  const stickyCtaBar = document.getElementById('stickyCtaBar');
  const heroSection = document.getElementById('hero');

  if (stickyCtaBar && heroSection) {
    window.addEventListener('scroll', () => {
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      if (heroBottom < 0) {
        stickyCtaBar.classList.add('visible');
      } else {
        stickyCtaBar.classList.remove('visible');
      }
    });
  }

  /* ------------------------------------------------------------------------
     6. FORM VALIDATION & SUCCESS MODAL SUBMISSION
     ------------------------------------------------------------------------ */
  const questionnaireForm = document.getElementById('questionnaireForm');
  const successModal = document.getElementById('successModal');
  const successCloseBtn = document.getElementById('successCloseBtn');
  const successName = document.getElementById('successName');
  const successPhone = document.getElementById('successPhone');

  if (questionnaireForm) {
    questionnaireForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const firstName = document.getElementById('firstName');
      const phone = document.getElementById('phone');
      const email = document.getElementById('email');
      const zip = document.getElementById('zip');

      const firstNameError = document.getElementById('firstNameError');
      const phoneError = document.getElementById('phoneError');
      const emailError = document.getElementById('emailError');
      const zipError = document.getElementById('zipError');

      let isValid = true;

      if (!firstName || !firstName.value.trim()) {
        if (firstName) firstName.classList.add('invalid');
        if (firstNameError) firstNameError.style.display = 'block';
        isValid = false;
      } else {
        if (firstName) firstName.classList.remove('invalid');
        if (firstNameError) firstNameError.style.display = 'none';
      }

      const phoneDigits = phone ? phone.value.replace(/\D/g, '') : '';
      if (!phone || phoneDigits.length < 10) {
        if (phone) phone.classList.add('invalid');
        if (phoneError) phoneError.style.display = 'block';
        isValid = false;
      } else {
        if (phone) phone.classList.remove('invalid');
        if (phoneError) phoneError.style.display = 'none';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email.value.trim())) {
        if (email) email.classList.add('invalid');
        if (emailError) emailError.style.display = 'block';
        isValid = false;
      } else {
        if (email) email.classList.remove('invalid');
        if (emailError) emailError.style.display = 'none';
      }

      const zipDigits = zip ? zip.value.trim() : '';
      if (!zip || !/^\d{5}$/.test(zipDigits)) {
        if (zip) zip.classList.add('invalid');
        if (zipError) zipError.style.display = 'block';
        isValid = false;
      } else {
        if (zip) zip.classList.remove('invalid');
        if (zipError) zipError.style.display = 'none';
      }

      if (isValid) {
        if (successName) successName.textContent = firstName.value.trim();
        if (successPhone) successPhone.textContent = phone.value.trim();

        closeQuizModal();

        if (successModal) {
          successModal.classList.add('active');
        }

        questionnaireForm.reset();
        updateStepView(1);
      }
    });
  }

  if (successCloseBtn && successModal) {
    successCloseBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });
  }
});
