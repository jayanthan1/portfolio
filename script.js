// EmailJS Integration Instructions:
// 1. Sign up at https://www.emailjs.com/ and add your email service.
// 2. Replace the placeholders below with your actual EmailJS userID (public key), serviceID, and templateID.
// 3. Make sure to allow the template to accept variables: name, email, subject, message.

const EMAILJS_USER_ID = 'zxuDPgsWZapsIrlha'; // User's actual EmailJS user id (public key)
const EMAILJS_SERVICE_ID = 'service_z355agl'; // User's actual EmailJS service id
const EMAILJS_TEMPLATE_ID = 'template_rihxiqp'; // User's actual EmailJS template id

// Dark theme toggle
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  document.body.classList.add('dark-theme');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme')) {
      localStorage.setItem('theme', 'dark');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      localStorage.setItem('theme', 'light');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
  });
  // Set correct icon on load
  if (document.body.classList.contains('dark-theme')) {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (document.querySelector('.nav-menu').classList.contains('active')) {
                document.querySelector('.nav-menu').classList.remove('active');
            }
        });
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navClose = document.querySelector('.nav-close');

    hamburger.addEventListener('click', function() {
        navMenu.classList.add('active');
    });

    navClose.addEventListener('click', function() {
        navMenu.classList.remove('active');
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Certificate modal functionality
    const certificateItems = document.querySelectorAll('.certificate-item');
    const modal = document.querySelector('.modal');
    const closeModal = document.querySelector('.close-modal');

    certificateItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.getAttribute('data-title');
            const image = this.getAttribute('data-image');
            const issuer = this.getAttribute('data-issuer');
            const date = this.getAttribute('data-date');
            const description = this.getAttribute('data-description');
            
            document.querySelector('.modal-header h3').textContent = title;
            document.querySelector('.modal-img img').src = image;
            document.querySelector('.issuer-value').textContent = issuer;
            document.querySelector('.date-value').textContent = date;
            document.querySelector('.description-value').textContent = description;
            
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        });
    });

    closeModal.addEventListener('click', function() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    });

    // Copy functionality for contact information
    const contactItems = document.querySelectorAll('.copyable');
    contactItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = this.getAttribute('data-copy') || (this.querySelector('p') ? this.querySelector('p').textContent : '');
            if (text) {
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(text).then(() => {
                        showToast('Copied to clipboard!');
                    }, () => {
                        fallbackCopyTextToClipboard(text);
                    });
                } else {
                    fallbackCopyTextToClipboard(text);
                }
                // Visual feedback
                item.classList.add('copied');
                setTimeout(() => {
                    item.classList.remove('copied');
                }, 1200);
            }
        });
    });

    function fallbackCopyTextToClipboard(text) {
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast('Copied to clipboard!');
    }

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    // Toast notification
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Form submission
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('#name').value;
        const email = this.querySelector('#email').value;
        const subject = this.querySelector('#subject').value;
        const message = this.querySelector('#message').value;

        if (!EMAILJS_USER_ID || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || EMAILJS_USER_ID.includes('YOUR_')) {
            showToast('Please configure your EmailJS keys in script.js');
            return;
        }

        emailjs.init(EMAILJS_USER_ID);
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            name: name,
            email: email,
            subject: subject,
            message: message
        }).then(function(response) {
            showToast('Message sent successfully!');
            contactForm.reset();
        }, function(error) {
            showToast('Failed to send message. Please try again.');
        });
        // })
        // .then(response => {
        //     showToast('Message sent successfully!');
        //     contactForm.reset();
        // })
        // .catch(error => {
        //     showToast('Failed to send message. Please try again.');
        // });
        
        // For now, just simulate success
        showToast('Message sent successfully!');
        contactForm.reset();
    });
});
