/* ---------- Mobile Nav, Smooth Scroll, Testimonials, Contact Form, Modal ---------- */

function openModal(content) {
  const modal = document.getElementById("tosModal");
  const modalBody = document.getElementById("tosModalContent");
  modalBody.innerHTML = content;
  modal.style.display = "flex"; // show modal
  document.body.style.overflow = "hidden"; // prevent background scroll
}

function closeModal() {
  const modal = document.getElementById("tosModal");
  modal.style.display = "none"; // hide modal
  document.body.style.overflow = ""; // restore scroll
}

document.addEventListener("DOMContentLoaded", function() {
  // -------- Mobile nav toggle --------
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      nav.style.display = nav.style.display === "flex" ? "none" : "flex";
    });
  }

  // -------- Smooth scroll for anchor links --------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // -------- Testimonials rotation --------
  (function rotateTestimonials() {
    const blocks = document.querySelectorAll(".testimonial");
    const clientLabel = document.getElementById("testimonial-client");
    if (!blocks.length || !clientLabel) return;
    let idx = 0;
    const update = () => {
      blocks.forEach((b, i) => b.classList.toggle("active", i === idx));
      clientLabel.textContent = blocks[idx].getAttribute("data-client") || "";
      idx = (idx + 1) % blocks.length;
    };
    update();
    setInterval(update, 4500);
  })();

  // -------- Contact form submission --------
  const form = document.getElementById("contactForm");
  const successBox = document.getElementById("formSuccess");
  const errorBox = document.getElementById("formError");
  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      successBox.hidden = true;
      errorBox.hidden = true;

      const smsConsent = document.getElementById("smsConsent")?.checked || false;
      const url = "https://api.web3forms.com/submit";
      const formData = new FormData(form);
      formData.append("smsConsent", smsConsent ? "Yes" : "No");

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      fetch(url, { method: "POST", body: formData })
        .then(async res => {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send Message";
          if (res.ok) {
            form.reset();
            successBox.textContent = smsConsent
              ? "✅ Thank you — your message has been sent. You have agreed to receive SMS updates. We will respond shortly."
              : "✅ Thank you — your message has been sent. We will respond shortly.";
            successBox.hidden = false;
            setTimeout(() => { successBox.hidden = true; }, 6000);
          } else {
            errorBox.hidden = false;
            console.error(await res.text());
          }
        })
        .catch(err => {
          errorBox.hidden = false;
          submitBtn.disabled = false;
          submitBtn.textContent = "Send Message";
          console.error(err);
        });
    });
  }

  // -------- Set current year in footer --------
  const y = new Date().getFullYear();
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = y;

  // -------- Modal: TOS & Privacy Policy --------
  const tosLink = document.getElementById("tosLink");
  const privacyLink = document.getElementById("privacyLink");
  const modalClose = document.querySelector(".modal-close");
  const modal = document.getElementById("tosModal");

  if (tosLink) {
    tosLink.addEventListener("click", function(e) {
      e.preventDefault();
      openModal(tosContent);
    });
  }

  if (privacyLink) {
    privacyLink.addEventListener("click", function(e) {
      e.preventDefault();
      openModal(privacyContent);
    });
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  window.addEventListener("click", function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // -------- Scroll to top button --------
  const scrollBtn = document.getElementById("scrollTopBtn");

  window.onscroll = function() {
    scrollBtn.style.display = (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) ? "block" : "none";
  };

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

});

// -------- Example TOS & Privacy Content --------
const tosContent = `
<h2>Terms of Service</h2>
<p>Effective Date: 07/07/2025</p>
<p>These Terms of Service ("Terms") govern your use of the Pages Of Purpose LLC website (the "Site") and any services provided by us ("Services"). By accessing or using our Site, you agree to these Terms. If you do not agree, you should not use our Site.</p>
<h3>1. General Information</h3>
<p>Pages Of Purpose LLC offers real estate investment services including property evaluations, property acquisitions, and consulting for real estate investors. These Terms apply to anyone who accesses or uses the Site or Services.</p>
<h3>2. Use of the Site</h3>
<p>You agree to use the Site in accordance with all applicable laws and regulations. You may not:</p>
<ul>
<li>Use the Site for any illegal or unauthorized purposes.</li>
<li>Interfere with or disrupt the functionality of the Site.</li>
<li>Post or transmit any harmful, unlawful, or infringing content.</li>
</ul>
<h3>3. Account Registration</h3>
<p>To access certain features of the Site, you may be required to create an account. You agree to provide accurate and complete information during registration and to keep your account credentials confidential. You are responsible for all activities that occur under your account.</p>
<h3>4. Real Estate Investment Services</h3>
<p>We offer various real estate services, including investment analysis, consultations, and project evaluations. These services are provided “as is,” and while we strive to offer high-quality, reliable information, we do not guarantee the success or profitability of any investment.</p>
<h3>5. Payment and Fees</h3>
<p>If applicable, you agree to pay any fees associated with the Services provided. All payments are processed securely, and we reserve the right to modify or change our pricing at any time.</p>
<h3>6. Limitation of Liability</h3>
<p>To the maximum extent permitted by law, Pages Of Purpose LLC shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from the use or inability to use the Site or Services, even if we have been advised of the possibility of such damages.</p>
<h3>7. Intellectual Property</h3>
<p>All content on the Site, including text, graphics, logos, images, and software, is owned by Pages Of Purpose LLC or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not use, reproduce, or distribute any content from the Site without our express permission.</p>
<h3>8. Termination</h3>
<p>We reserve the right to suspend or terminate your access to the Site or Services at our discretion, with or without notice, if you violate these Terms.</p>
<h3>9. Governing Law</h3>
<p>These Terms will be governed by and construed in accordance with the laws of the state where Pages Of Purpose LLC is based, without regard to its conflict of law principles.</p>
<h3>10. Changes to Terms</h3>
<p>We may update these Terms from time to time. Any changes will be posted on this page, and the updated Terms will become effective as of the date posted.</p>
`;

/* ---------- Privacy Policy Content ---------- */
const privacyContent = `
<h2>Privacy Policy</h2>
<p>At Pages Of Purpose LLC, we respect and are committed to protecting your privacy. This Privacy Policy outlines the types of information we collect and how we use, protect, and share it.</p>
<h3>1. Information We Collect</h3>
<p>We may collect the following types of personal information when you visit our website, register for services, or communicate with us:</p>
<ul>
<li>Personal Information: Name, email address, phone number, mailing address.</li>
<li>Transaction Information: Details about your inquiries, real estate interests, and services you’ve requested.</li>
<li>Usage Data: Information about how you use our website, such as IP addresses, device types, and browser information.</li>
<li>Cookies and Tracking Technologies: We use cookies to improve site functionality and your browsing experience.</li>
</ul>
<h3>2. How We Use Your Information</h3>
<p>Your information is used to:</p>
<ul>
<li>Provide and improve our services</li>
<li>Communicate with you regarding your inquiries and services</li>
<li>Send marketing communications if you have consented</li>
<li>Analyze website usage and improve our offerings</li>
</ul>
<h3>3. Information Sharing</h3>
<p>We do not sell, rent, or trade your personal information. We may share information with trusted third parties who assist in providing our services, as long as they agree to keep it confidential.</p>
<h3>4. Data Security</h3>
<p>We implement appropriate security measures to protect your data from unauthorized access, disclosure, alteration, or destruction.</p>
<h3>5. Your Rights</h3>
<p>You have the right to access, correct, or delete your personal information, and to withdraw consent where applicable.</p>
<h3>6. Changes to This Policy</h3>
<p>We may update this Privacy Policy periodically. The updated version will be posted on this page, and your continued use of our services constitutes acceptance of the revised Privacy Policy.</p>
`;



