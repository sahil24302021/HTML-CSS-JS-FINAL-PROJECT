/* ==========================================================================
   TABLE OF CONTENTS:
   1.  Preloader
   2.  Navbar Scroll Effect
   3.  Mobile Navigation Toggle
   4.  Hero Fade Up Animations
   5.  Stat Counter Animation
   6.  Smooth Scroll for Anchor Links
   7.  FAQ Toggle
   8.  Scroll Reveal & Counter Observer
   9.  Hero Parallax Effect
   10. Navbar Active Link Detection
   11. Scroll Reveal Fallback
   12. User Auth State (localStorage)
   13. Update Nav Based on Auth
   14. Login Form Handler
   15. Signup Form Handler
   16. Toggle Password Visibility
   17. Application Modal Flow (Apply Buttons)
   18. File Upload Handling
   19. Application Form Submission
   20. Pending Job Redirect After Login
   21. Jobs Page - Data, Filters, Search, Sort, Render
   22. Company Page - Form Validation
   23. Contact Page - Form Validation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

    /* ======================================================================
       1. PRELOADER
       ====================================================================== */
    var preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', function () {
            setTimeout(function () {
                preloader.classList.add('loaded');
            }, 800);
        });
        // Fallback: hide preloader after 3 seconds max
        setTimeout(function () {
            preloader.classList.add('loaded');
        }, 3000);
    }


    /* ======================================================================
       2. NAVBAR SCROLL EFFECT
       ====================================================================== */
    var navbar = document.getElementById('navbar');
    if (navbar && !navbar.classList.contains('navbar-solid')) {
        function handleNavScroll() {
            if (window.scrollY > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        window.addEventListener('scroll', handleNavScroll);
        handleNavScroll();
    }


    /* ======================================================================
       3. MOBILE NAVIGATION TOGGLE
       ====================================================================== */
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        });

        // Close nav on link click
        navLinks.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }


    /* ======================================================================
       4. HERO FADE UP ANIMATIONS
       ====================================================================== */
    var fadeUpElements = document.querySelectorAll('.fade-up');
    if (fadeUpElements.length > 0) {
        setTimeout(function () {
            fadeUpElements.forEach(function (el) {
                el.classList.add('visible');
            });
        }, 400);
    }


    /* ======================================================================
       5. STAT COUNTER ANIMATION
       ====================================================================== */
    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-count'));
        if (!target) return;

        var duration = 2000;
        var startTime = performance.now();

        function update(currentTime) {
            var elapsed = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * target);

            if (target >= 1000) {
                el.textContent = current.toLocaleString('en-IN') + '+';
            } else {
                el.textContent = current + '+';
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }


    /* ======================================================================
       6. SMOOTH SCROLL FOR ANCHOR LINKS
       ====================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


    /* ======================================================================
       7. FAQ TOGGLE
       ====================================================================== */
    var faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function (item) {
        var question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function () {
                var isActive = item.classList.contains('active');
                // Close all
                faqItems.forEach(function (faq) {
                    faq.classList.remove('active');
                });
                // Toggle current
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });


    /* ======================================================================
       8. SCROLL REVEAL & COUNTER OBSERVER
       ====================================================================== */
    var scrollElements = document.querySelectorAll('.scroll-reveal');
    var statNumbers = document.querySelectorAll('.stat-number[data-count]');
    var countersAnimated = new Set();

    var observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    var scrollObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    scrollElements.forEach(function (el) {
        scrollObserver.observe(el);
    });

    var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !countersAnimated.has(entry.target)) {
                countersAnimated.add(entry.target);
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (el) {
        counterObserver.observe(el);
    });


    /* ======================================================================
       9. HERO PARALLAX EFFECT
       ====================================================================== */
    var heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        window.addEventListener('scroll', function () {
            var scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroVideo.style.transform = 'scale(' + (1 + scrolled * 0.0003) + ')';
            }
        });
    }


    /* ======================================================================
       10. NAVBAR ACTIVE LINK DETECTION
       ====================================================================== */
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(function (link) {
        var href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else if (currentPage === '' && href === 'index.html') {
            link.classList.add('active');
        }
    });


    /* ======================================================================
       11. SCROLL REVEAL FALLBACK (throttled scroll listener)
       ====================================================================== */
    function revealOnScroll() {
        var reveals = document.querySelectorAll('.scroll-reveal:not(.revealed)');
        reveals.forEach(function (el) {
            var rect = el.getBoundingClientRect();
            var windowHeight = window.innerHeight;
            if (rect.top < windowHeight - 80) {
                el.classList.add('revealed');
            }
        });
    }

    // Run once on load for already visible elements
    revealOnScroll();

    // Throttled scroll listener as fallback
    var ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                revealOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    });


    /* ======================================================================
       12. USER AUTH STATE (localStorage)
       ====================================================================== */
    function getUser() {
        var data = localStorage.getItem('internpath_user');
        return data ? JSON.parse(data) : null;
    }

    function setUser(user) {
        localStorage.setItem('internpath_user', JSON.stringify(user));
    }

    function removeUser() {
        localStorage.removeItem('internpath_user');
    }

    function getApplications() {
        var data = localStorage.getItem('internpath_applications');
        return data ? JSON.parse(data) : [];
    }

    function saveApplication(app) {
        var apps = getApplications();
        apps.push(app);
        localStorage.setItem('internpath_applications', JSON.stringify(apps));
    }

    function getRegisteredUsers() {
        var data = localStorage.getItem('internpath_registered_users');
        return data ? JSON.parse(data) : [];
    }

    function saveRegisteredUser(user) {
        var users = getRegisteredUsers();
        users.push(user);
        localStorage.setItem('internpath_registered_users', JSON.stringify(users));
    }


    /* ======================================================================
       13. UPDATE NAV BASED ON AUTH STATE
       ====================================================================== */
    function updateNavState() {
        var user = getUser();
        var navActions = document.querySelector('.nav-actions');
        if (!navActions) return;

        if (user) {
            var initials = '';
            if (user.firstName && user.lastName) {
                initials = user.firstName.charAt(0) + user.lastName.charAt(0);
            } else if (user.email) {
                initials = user.email.charAt(0).toUpperCase();
            }

            navActions.innerHTML =
                '<div class="nav-user">' +
                    '<div class="nav-user-avatar" title="' + (user.firstName || user.email) + '">' + initials.toUpperCase() + '</div>' +
                    '<span class="nav-user-name">' + (user.firstName || 'User') + '</span>' +
                    '<button class="btn-logout" id="logoutBtn">Logout</button>' +
                '</div>';

            var logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function () {
                    removeUser();
                    window.location.reload();
                });
            }
        }
    }

    updateNavState();


    /* ======================================================================
       14. LOGIN FORM HANDLER
       ====================================================================== */
    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var email = document.getElementById('loginEmail').value.trim();
            var password = document.getElementById('loginPassword').value;
            var emailError = document.getElementById('loginEmailError');
            var passwordError = document.getElementById('loginPasswordError');

            // Reset errors
            if (emailError) emailError.textContent = '';
            if (passwordError) passwordError.textContent = '';

            var valid = true;

            // Validate email
            if (!email) {
                if (emailError) emailError.textContent = 'Email is required';
                valid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                if (emailError) emailError.textContent = 'Enter a valid email address';
                valid = false;
            }

            // Validate password
            if (!password) {
                if (passwordError) passwordError.textContent = 'Password is required';
                valid = false;
            } else if (password.length < 6) {
                if (passwordError) passwordError.textContent = 'Password must be at least 6 characters';
                valid = false;
            }

            if (!valid) return;

            // Check against registered users
            var users = getRegisteredUsers();
            var foundUser = null;
            for (var i = 0; i < users.length; i++) {
                if (users[i].email === email && users[i].password === password) {
                    foundUser = users[i];
                    break;
                }
            }

            if (foundUser) {
                setUser(foundUser);
                var pendingJob = localStorage.getItem('internpath_pending_job');
                if (pendingJob) {
                    localStorage.removeItem('internpath_pending_job');
                    window.location.href = 'jobs.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                // Demo mode: auto-register on first login
                var newUser = {
                    email: email,
                    password: password,
                    firstName: email.split('@')[0],
                    lastName: '',
                    phone: ''
                };
                saveRegisteredUser(newUser);
                setUser(newUser);

                var pendingJob = localStorage.getItem('internpath_pending_job');
                if (pendingJob) {
                    localStorage.removeItem('internpath_pending_job');
                    window.location.href = 'jobs.html';
                } else {
                    window.location.href = 'index.html';
                }
            }
        });

        // Google/LinkedIn mock login
        var googleLogin = document.getElementById('googleLogin');
        var linkedinLogin = document.getElementById('linkedinLogin');

        if (googleLogin) {
            googleLogin.addEventListener('click', function () {
                var mockUser = {
                    email: 'student@gmail.com',
                    firstName: 'Student',
                    lastName: 'User',
                    phone: '+91 98765 43210',
                    password: ''
                };
                setUser(mockUser);
                window.location.href = 'index.html';
            });
        }

        if (linkedinLogin) {
            linkedinLogin.addEventListener('click', function () {
                var mockUser = {
                    email: 'student@linkedin.com',
                    firstName: 'Student',
                    lastName: 'User',
                    phone: '+91 98765 43210',
                    password: ''
                };
                setUser(mockUser);
                window.location.href = 'index.html';
            });
        }
    }


    /* ======================================================================
       15. SIGNUP FORM HANDLER
       ====================================================================== */
    var signupForm = document.getElementById('signupForm');
    if (signupForm) {
        // Password strength meter
        var signupPassword = document.getElementById('signupPassword');
        if (signupPassword) {
            signupPassword.addEventListener('input', function () {
                var val = this.value;
                var strengthFill = document.getElementById('strengthFill');
                var strengthText = document.getElementById('strengthText');
                if (!strengthFill || !strengthText) return;

                var score = 0;
                if (val.length >= 8) score++;
                if (/[A-Z]/.test(val)) score++;
                if (/[0-9]/.test(val)) score++;
                if (/[^A-Za-z0-9]/.test(val)) score++;

                var width = 0;
                var color = '';
                var text = '';

                if (val.length === 0) {
                    width = 0;
                    text = '';
                } else if (score <= 1) {
                    width = 25;
                    color = '#ef4444';
                    text = 'Weak';
                } else if (score === 2) {
                    width = 50;
                    color = '#f59e0b';
                    text = 'Fair';
                } else if (score === 3) {
                    width = 75;
                    color = '#0ea5e9';
                    text = 'Good';
                } else {
                    width = 100;
                    color = '#10b981';
                    text = 'Strong';
                }

                strengthFill.style.width = width + '%';
                strengthFill.style.background = color;
                strengthText.textContent = text;
                strengthText.style.color = color;
            });
        }

        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var firstName = document.getElementById('signupFirstName').value.trim();
            var lastName = document.getElementById('signupLastName').value.trim();
            var email = document.getElementById('signupEmail').value.trim();
            var phone = document.getElementById('signupPhone').value.trim();
            var password = document.getElementById('signupPassword').value;
            var confirmPassword = document.getElementById('signupConfirmPassword').value;
            var agreeTerms = document.getElementById('agreeTerms');

            var emailError = document.getElementById('signupEmailError');
            var phoneError = document.getElementById('signupPhoneError');
            var confirmError = document.getElementById('signupConfirmError');

            // Reset
            if (emailError) emailError.textContent = '';
            if (phoneError) phoneError.textContent = '';
            if (confirmError) confirmError.textContent = '';

            var valid = true;

            if (!firstName || !lastName) {
                valid = false;
                alert('Please enter your full name.');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                if (emailError) emailError.textContent = 'Enter a valid email address';
                valid = false;
            }

            if (!phone || phone.length < 10) {
                if (phoneError) phoneError.textContent = 'Enter a valid phone number';
                valid = false;
            }

            if (password.length < 8) {
                valid = false;
                alert('Password must be at least 8 characters.');
                return;
            }

            if (password !== confirmPassword) {
                if (confirmError) confirmError.textContent = 'Passwords do not match';
                valid = false;
            }

            if (agreeTerms && !agreeTerms.checked) {
                valid = false;
                alert('Please agree to the Terms of Service.');
                return;
            }

            if (!valid) return;

            // Check if email already exists
            var users = getRegisteredUsers();
            for (var i = 0; i < users.length; i++) {
                if (users[i].email === email) {
                    if (emailError) emailError.textContent = 'This email is already registered. Try signing in.';
                    return;
                }
            }

            // Create user
            var newUser = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                password: password
            };

            saveRegisteredUser(newUser);
            setUser(newUser);

            // Check pending job
            var pendingJob = localStorage.getItem('internpath_pending_job');
            if (pendingJob) {
                localStorage.removeItem('internpath_pending_job');
                window.location.href = 'jobs.html';
            } else {
                window.location.href = 'index.html';
            }
        });

        // Google/LinkedIn mock signup
        var googleSignup = document.getElementById('googleSignup');
        var linkedinSignup = document.getElementById('linkedinSignup');

        if (googleSignup) {
            googleSignup.addEventListener('click', function () {
                var mockUser = {
                    email: 'student@gmail.com',
                    firstName: 'Student',
                    lastName: 'User',
                    phone: '+91 98765 43210',
                    password: 'google123'
                };
                saveRegisteredUser(mockUser);
                setUser(mockUser);
                window.location.href = 'index.html';
            });
        }

        if (linkedinSignup) {
            linkedinSignup.addEventListener('click', function () {
                var mockUser = {
                    email: 'student@linkedin.com',
                    firstName: 'Student',
                    lastName: 'User',
                    phone: '+91 98765 43210',
                    password: 'linkedin123'
                };
                saveRegisteredUser(mockUser);
                setUser(mockUser);
                window.location.href = 'index.html';
            });
        }
    }


    /* ======================================================================
       16. TOGGLE PASSWORD VISIBILITY
       ====================================================================== */
    document.querySelectorAll('.toggle-password').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var targetId = this.getAttribute('data-target');
            var input = document.getElementById(targetId);
            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                    this.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
                } else {
                    input.type = 'password';
                    this.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
                }
            }
        });
    });


    /* ======================================================================
       17. APPLICATION MODAL FLOW (Apply Buttons)
       ====================================================================== */
    var applicationModal = document.getElementById('applicationModal');
    var modalClose = document.getElementById('modalClose');
    var stepLogin = document.getElementById('stepLogin');
    var stepApply = document.getElementById('stepApply');
    var stepSuccess = document.getElementById('stepSuccess');
    var applyJobTitle = document.getElementById('applyJobTitle');
    var applicationForm = document.getElementById('applicationForm');
    var currentJobTitle = '';

    function openModal(jobTitle) {
        currentJobTitle = jobTitle;
        var user = getUser();

        if (!applicationModal) return;

        // Reset steps
        if (stepLogin) stepLogin.style.display = 'none';
        if (stepApply) stepApply.style.display = 'none';
        if (stepSuccess) stepSuccess.style.display = 'none';

        if (user) {
            // User is logged in, show application form
            if (stepApply) stepApply.style.display = 'block';
            if (applyJobTitle) applyJobTitle.textContent = jobTitle;

            // Pre-fill form with user data
            var appFullName = document.getElementById('appFullName');
            var appEmail = document.getElementById('appEmail');
            var appPhone = document.getElementById('appPhone');

            if (appFullName && user.firstName) {
                appFullName.value = (user.firstName + ' ' + (user.lastName || '')).trim();
            }
            if (appEmail && user.email) {
                appEmail.value = user.email;
            }
            if (appPhone && user.phone) {
                appPhone.value = user.phone;
            }
        } else {
            // User not logged in, show login prompt
            if (stepLogin) stepLogin.style.display = 'block';
            localStorage.setItem('internpath_pending_job', jobTitle);
        }

        applicationModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (applicationModal) {
            applicationModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Close modal via button
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close modal via backdrop click
    if (applicationModal) {
        applicationModal.addEventListener('click', function (e) {
            if (e.target === applicationModal) {
                closeModal();
            }
        });
    }

    // Escape key to close modal
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Bind static Apply buttons (on index.html featured cards)
    document.querySelectorAll('.apply-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var jobTitle = this.getAttribute('data-job') || 'this internship';
            openModal(jobTitle);
        });
    });


    /* ======================================================================
       18. FILE UPLOAD HANDLING
       ====================================================================== */
    var fileUploadArea = document.getElementById('fileUploadArea');
    var appResume = document.getElementById('appResume');
    var fileNameDisplay = document.getElementById('fileName');

    if (appResume) {
        appResume.addEventListener('change', function () {
            if (this.files && this.files[0]) {
                var file = this.files[0];
                if (file.type !== 'application/pdf') {
                    alert('Please upload a PDF file only.');
                    this.value = '';
                    if (fileNameDisplay) fileNameDisplay.textContent = '';
                    return;
                }
                if (file.size > 5 * 1024 * 1024) {
                    alert('File size must be less than 5MB.');
                    this.value = '';
                    if (fileNameDisplay) fileNameDisplay.textContent = '';
                    return;
                }
                if (fileNameDisplay) {
                    fileNameDisplay.textContent = 'Selected: ' + file.name + ' (' + (file.size / 1024 / 1024).toFixed(2) + ' MB)';
                }
            }
        });
    }

    if (fileUploadArea) {
        fileUploadArea.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        fileUploadArea.addEventListener('dragleave', function () {
            this.classList.remove('dragover');
        });
        fileUploadArea.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });
    }


    /* ======================================================================
       19. APPLICATION FORM SUBMISSION
       ====================================================================== */
    if (applicationForm) {
        applicationForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var fullName = document.getElementById('appFullName').value.trim();
            var email = document.getElementById('appEmail').value.trim();
            var phone = document.getElementById('appPhone').value.trim();
            var college = document.getElementById('appCollege').value.trim();
            var degree = document.getElementById('appDegree').value.trim();
            var coverLetter = document.getElementById('appCoverLetter').value.trim();
            var resume = document.getElementById('appResume');

            // Validate
            if (!fullName || !email || !phone || !college || !degree || !coverLetter) {
                alert('Please fill in all required fields.');
                return;
            }

            if (!resume || !resume.files || !resume.files[0]) {
                alert('Please upload your resume.');
                return;
            }

            // Save application
            var application = {
                id: Date.now(),
                jobTitle: currentJobTitle,
                fullName: fullName,
                email: email,
                phone: phone,
                college: college,
                degree: degree,
                coverLetter: coverLetter,
                resumeName: resume.files[0].name,
                appliedAt: new Date().toLocaleString('en-IN'),
                status: 'Under Review'
            };

            saveApplication(application);

            // Show success step
            if (stepApply) stepApply.style.display = 'none';
            if (stepSuccess) {
                stepSuccess.style.display = 'block';

                var summaryEl = document.getElementById('applicationSummary');
                if (summaryEl) {
                    summaryEl.innerHTML =
                        '<div class="summary-item"><span class="label">Position</span><span class="value">' + currentJobTitle + '</span></div>' +
                        '<div class="summary-item"><span class="label">Applicant</span><span class="value">' + fullName + '</span></div>' +
                        '<div class="summary-item"><span class="label">Email</span><span class="value">' + email + '</span></div>' +
                        '<div class="summary-item"><span class="label">College</span><span class="value">' + college + '</span></div>' +
                        '<div class="summary-item"><span class="label">Resume</span><span class="value">' + resume.files[0].name + '</span></div>' +
                        '<div class="summary-item"><span class="label">Status</span><span class="value" style="color: #f59e0b;">Under Review</span></div>';
                }
            }

            // Reset form
            applicationForm.reset();
            if (fileNameDisplay) fileNameDisplay.textContent = '';
        });
    }


    /* ======================================================================
       20. PENDING JOB REDIRECT AFTER LOGIN
       ====================================================================== */
    var pendingJob = localStorage.getItem('internpath_pending_job');
    var currentUser = getUser();
    if (pendingJob && currentUser && applicationModal) {
        localStorage.removeItem('internpath_pending_job');
        setTimeout(function () {
            openModal(pendingJob);
        }, 500);
    }


    /* ======================================================================
       21. JOBS PAGE - Data, Filters, Search, Sort, Render
       ====================================================================== */
    var jobsList = document.getElementById('jobsList');

    // Only run jobs logic if jobsList exists on this page
    if (jobsList) {

        // ---- Internship Data ----
        var internships = [
            {
                id: 1,
                title: 'Software Engineering Intern',
                company: 'Google India',
                companyLetter: 'G',
                companyColor: '#1a73e8',
                companyLogo: 'images/Google.png',
                location: 'Bangalore',
                worktype: 'remote',
                category: 'tech',
                stipend: 80000,
                stipendDisplay: 'Rs. 80,000/month',
                duration: 6,
                posted: '2 days ago',
                description: 'Work on large-scale distributed systems. Contribute to products used by billions of users worldwide. Strong DSA and system design skills required.',
                perks: ['certificate', 'lor', 'ppo'],
                featured: true
            },
            {
                id: 2,
                title: 'Product Design Intern',
                company: 'Microsoft',
                companyLetter: 'M',
                companyColor: '#0078d4',
                companyLogo: 'images/Microsoft.png',
                location: 'Hyderabad',
                worktype: 'onsite',
                category: 'design',
                stipend: 60000,
                stipendDisplay: 'Rs. 60,000/month',
                duration: 3,
                posted: '1 day ago',
                description: 'Design intuitive user experiences for Microsoft 365. Collaborate with product managers and engineers on enterprise solutions.',
                perks: ['certificate', 'lor'],
                featured: false
            },
            {
                id: 3,
                title: 'Marketing Analytics Intern',
                company: 'Swiggy',
                companyLetter: 'S',
                companyColor: '#ff6900',
                companyLogo: 'images/Swiggy.png',
                location: 'Remote',
                worktype: 'remote',
                category: 'marketing',
                stipend: 25000,
                stipendDisplay: 'Rs. 25,000/month',
                duration: 4,
                posted: '5 hours ago',
                description: 'Analyze consumer behavior data and optimize marketing campaigns for one of India\'s largest food delivery platforms.',
                perks: ['certificate', 'flexible'],
                featured: false
            },
            {
                id: 4,
                title: 'Financial Analyst Intern',
                company: 'Deloitte India',
                companyLetter: 'D',
                companyColor: '#003d6b',
                companyLogo: 'images/Deloitte.png',
                location: 'Mumbai',
                worktype: 'onsite',
                category: 'finance',
                stipend: 40000,
                stipendDisplay: 'Rs. 40,000/month',
                duration: 6,
                posted: '3 days ago',
                description: 'Support audit and advisory teams with financial modeling, data analysis, and client-facing presentations.',
                perks: ['certificate', 'lor', 'ppo'],
                featured: false
            },
            {
                id: 5,
                title: 'Full Stack Developer Intern',
                company: 'Zomato',
                companyLetter: 'Z',
                companyColor: '#e23744',
                companyLogo: 'images/Zomato.png',
                location: 'Gurugram',
                worktype: 'remote',
                category: 'tech',
                stipend: 35000,
                stipendDisplay: 'Rs. 35,000/month',
                duration: 3,
                posted: '1 day ago',
                description: 'Build and ship features on the Zomato app. Work with React, Node.js, and cloud infrastructure at scale.',
                perks: ['certificate', 'flexible'],
                featured: false
            },
            {
                id: 6,
                title: 'UI/UX Design Intern',
                company: 'Razorpay',
                companyLetter: 'R',
                companyColor: '#00b4d8',
                companyLogo: 'images/Razorpay.png',
                location: 'Bangalore',
                worktype: 'onsite',
                category: 'design',
                stipend: 30000,
                stipendDisplay: 'Rs. 30,000/month',
                duration: 4,
                posted: '4 days ago',
                description: 'Create seamless payment experiences. Work closely with product managers and engineers on fintech solutions.',
                perks: ['certificate', 'lor', 'flexible'],
                featured: true
            },
            {
                id: 7,
                title: 'Data Science Intern',
                company: 'Flipkart',
                companyLetter: 'F',
                companyColor: '#f7d42a',
                companyLogo: 'images/Flipkart.png',
                location: 'Bangalore',
                worktype: 'hybrid',
                category: 'data',
                stipend: 50000,
                stipendDisplay: 'Rs. 50,000/month',
                duration: 6,
                posted: '6 hours ago',
                description: 'Build ML models for product recommendations, search ranking, and demand forecasting. Python and SQL required.',
                perks: ['certificate', 'lor', 'ppo', 'flexible'],
                featured: true
            },
            {
                id: 8,
                title: 'Content Writing Intern',
                company: 'Unacademy',
                companyLetter: 'U',
                companyColor: '#22c55e',
                companyLogo: 'images/Unacademy.png',
                location: 'Remote',
                worktype: 'remote',
                category: 'content',
                stipend: 12000,
                stipendDisplay: 'Rs. 12,000/month',
                duration: 3,
                posted: '2 days ago',
                description: 'Write engaging educational content for exam preparation. Strong command over English and research skills needed.',
                perks: ['certificate', 'flexible'],
                featured: false
            },
            {
                id: 9,
                title: 'Backend Engineer Intern',
                company: 'PhonePe',
                companyLetter: 'P',
                companyColor: '#5f259f',
                companyLogo: 'images/PhonePe.png',
                location: 'Bangalore',
                worktype: 'onsite',
                category: 'tech',
                stipend: 55000,
                stipendDisplay: 'Rs. 55,000/month',
                duration: 6,
                posted: '3 days ago',
                description: 'Design and build scalable microservices for India\'s largest UPI payments platform. Java/Kotlin experience preferred.',
                perks: ['certificate', 'lor', 'ppo'],
                featured: false
            },
            {
                id: 10,
                title: 'Digital Marketing Intern',
                company: 'Nykaa',
                companyLetter: 'N',
                companyColor: '#fc2779',
                companyLogo: 'images/Nykaa.png',
                location: 'Mumbai',
                worktype: 'hybrid',
                category: 'marketing',
                stipend: 18000,
                stipendDisplay: 'Rs. 18,000/month',
                duration: 3,
                posted: '1 day ago',
                description: 'Plan and execute social media campaigns for beauty and fashion products. Experience with Instagram and influencer marketing is a plus.',
                perks: ['certificate', 'flexible'],
                featured: false
            },
            {
                id: 11,
                title: 'Machine Learning Intern',
                company: 'Amazon India',
                companyLetter: 'A',
                companyColor: '#ff9900',
                companyLogo: 'images/Amazon.png',
                location: 'Hyderabad',
                worktype: 'onsite',
                category: 'data',
                stipend: 75000,
                stipendDisplay: 'Rs. 75,000/month',
                duration: 6,
                posted: '5 days ago',
                description: 'Build and deploy ML models for Alexa, recommendation engines, and supply chain optimization. Strong Python and math background required.',
                perks: ['certificate', 'lor', 'ppo'],
                featured: true
            },
            {
                id: 12,
                title: 'Accounts & Finance Intern',
                company: 'KPMG India',
                companyLetter: 'K',
                companyColor: '#00338d',
                companyLogo: 'images/KPMG.png',
                location: 'Delhi',
                worktype: 'onsite',
                category: 'finance',
                stipend: 30000,
                stipendDisplay: 'Rs. 30,000/month',
                duration: 3,
                posted: '4 days ago',
                description: 'Assist in audit engagements, prepare financial statements, and support tax advisory projects for enterprise clients.',
                perks: ['certificate', 'lor'],
                featured: false
            },
            {
                id: 13,
                title: 'React Developer Intern',
                company: 'Meesho',
                companyLetter: 'M',
                companyColor: '#e7457a',
                companyLogo: 'images/Meesho.png',
                location: 'Bangalore',
                worktype: 'remote',
                category: 'tech',
                stipend: 30000,
                stipendDisplay: 'Rs. 30,000/month',
                duration: 3,
                posted: '12 hours ago',
                description: 'Build responsive web interfaces for social commerce platform. React, TypeScript, and CSS skills required.',
                perks: ['certificate', 'flexible'],
                featured: false
            },
            {
                id: 14,
                title: 'Graphic Design Intern',
                company: 'Canva India',
                companyLetter: 'C',
                companyColor: '#00c4cc',
                companyLogo: 'images/Canva.png',
                location: 'Remote',
                worktype: 'remote',
                category: 'design',
                stipend: 35000,
                stipendDisplay: 'Rs. 35,000/month',
                duration: 4,
                posted: '2 days ago',
                description: 'Create templates, illustrations, and marketing assets for the world\'s largest online design platform. Figma and Illustrator proficiency needed.',
                perks: ['certificate', 'lor', 'flexible'],
                featured: false
            },
            {
                id: 15,
                title: 'SEO Content Specialist Intern',
                company: 'Zoho',
                companyLetter: 'Z',
                companyColor: '#dc4c3f',
                companyLogo: 'images/Zoho.png',
                location: 'Chennai',
                worktype: 'onsite',
                category: 'content',
                stipend: 15000,
                stipendDisplay: 'Rs. 15,000/month',
                duration: 3,
                posted: '6 days ago',
                description: 'Create SEO-optimized blog posts, landing page copy, and product documentation for Zoho\'s suite of business tools.',
                perks: ['certificate'],
                featured: false
            },
            {
                id: 16,
                title: 'Investment Banking Intern',
                company: 'Goldman Sachs',
                companyLetter: 'G',
                companyColor: '#6f9fce',
                companyLogo: 'images/Goldman Sachs.png',
                location: 'Bangalore',
                worktype: 'onsite',
                category: 'finance',
                stipend: 90000,
                stipendDisplay: 'Rs. 90,000/month',
                duration: 2,
                posted: '1 week ago',
                description: 'Support deal teams with financial analysis, valuation models, and market research. Strong Excel and financial modeling skills required.',
                perks: ['certificate', 'lor', 'ppo'],
                featured: true
            },
            {
                id: 17,
                title: 'DevOps Engineer Intern',
                company: 'Infosys',
                companyLetter: 'I',
                companyColor: '#007cc3',
                companyLogo: 'images/Infosys.png',
                location: 'Pune',
                worktype: 'hybrid',
                category: 'tech',
                stipend: 22000,
                stipendDisplay: 'Rs. 22,000/month',
                duration: 6,
                posted: '3 days ago',
                description: 'Manage CI/CD pipelines, container orchestration with Kubernetes, and cloud infrastructure on AWS. Linux and scripting skills needed.',
                perks: ['certificate', 'lor'],
                featured: false
            },
            {
                id: 18,
                title: 'Business Analytics Intern',
                company: 'Paytm',
                companyLetter: 'P',
                companyColor: '#00baf2',
                companyLogo: 'images/Paytm.png',
                location: 'Noida',
                worktype: 'onsite',
                category: 'data',
                stipend: 28000,
                stipendDisplay: 'Rs. 28,000/month',
                duration: 3,
                posted: '2 days ago',
                description: 'Analyze transaction data, build dashboards, and provide insights to improve product and business metrics. SQL and Python required.',
                perks: ['certificate', 'flexible'],
                featured: false
            }
        ];

        // ---- Filter State ----
        var activeFilters = {
            category: [],
            worktype: [],
            stipend: [],
            duration: [],
            perks: []
        };
        var searchQuery = '';
        var locationQuery = '';
        var sortBy = 'relevance';

        // ---- DOM Elements ----
        var resultsCount = document.getElementById('resultsCount');
        var activeFiltersContainer = document.getElementById('activeFilters');
        var searchInput = document.getElementById('jobSearchInput');
        var locationInput = document.getElementById('locationSearchInput');
        var searchBtn = document.getElementById('searchBtn');
        var sortSelect = document.getElementById('sortSelect');
        var clearFiltersBtn = document.getElementById('clearFilters');
        var mobileFilterToggle = document.getElementById('mobileFilterToggle');
        var sidebar = document.getElementById('jobsSidebar');

        // ---- Render Job Cards ----
        function renderJobs(jobs) {
            if (jobs.length === 0) {
                jobsList.innerHTML = '<div class="no-results"><h3>No internships found</h3><p>Try adjusting your filters or search query to find more opportunities.</p></div>';
                if (resultsCount) resultsCount.textContent = 'No results found';
                return;
            }

            if (resultsCount) resultsCount.textContent = 'Showing ' + jobs.length + ' internship' + (jobs.length !== 1 ? 's' : '');

            jobsList.innerHTML = jobs.map(function (job) {
                var worktypeLabel = job.worktype === 'remote' ? 'Remote' : job.worktype === 'hybrid' ? 'Hybrid' : 'On-site';
                var worktypeClass = 'badge-' + job.worktype;

                var badges = [
                    '<span class="badge ' + worktypeClass + '">' + worktypeLabel + '</span>'
                ];
                if (job.featured) badges.push('<span class="badge badge-featured">Featured</span>');
                if (job.perks.includes('certificate')) badges.push('<span class="badge badge-certificate">Certificate</span>');

                var perkTags = [];
                if (job.perks.includes('ppo')) perkTags.push('<span class="badge badge-featured">PPO</span>');
                if (job.perks.includes('lor')) perkTags.push('<span class="badge badge-certificate">LOR</span>');
                if (job.perks.includes('flexible')) perkTags.push('<span class="badge badge-hybrid">Flexible</span>');

                return '<div class="job-list-card" data-id="' + job.id + '">' +
                    '<div class="job-list-card-header">' +
                        '<div class="job-list-left">' +
                            '<div class="company-logo"><img src="' + job.companyLogo + '" alt="' + job.company + '"></div>' +
                            '<div class="job-list-info">' +
                                '<h3>' + job.title + '</h3>' +
                                '<span class="company-name">' + job.company + '</span>' +
                            '</div>' +
                        '</div>' +
                        '<div class="job-list-right">' +
                            '<div class="job-list-stipend">' + job.stipendDisplay + '</div>' +
                            '<div class="job-list-posted">' + job.posted + '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="job-list-meta">' +
                        '<div class="job-list-meta-item">' +
                            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>' +
                            job.location +
                        '</div>' +
                        '<div class="job-list-meta-item">' +
                            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>' +
                            job.duration + (job.duration === 1 ? ' Month' : ' Months') +
                        '</div>' +
                        '<div class="job-list-meta-item">' + badges.join('') + '</div>' +
                    '</div>' +
                    '<p class="job-list-desc">' + job.description + '</p>' +
                    '<div class="job-list-footer">' +
                        '<div class="job-list-tags">' + perkTags.join('') + '</div>' +
                        '<a href="#" class="btn btn-apply apply-btn" data-job="' + job.title + ' - ' + job.company + '" onclick="event.preventDefault();">Apply Now</a>' +
                    '</div>' +
                '</div>';
            }).join('');
        }

        // ---- Filter & Sort Logic ----
        function getFilteredJobs() {
            var filtered = internships.slice();

            // Search filter
            if (searchQuery) {
                var q = searchQuery.toLowerCase();
                filtered = filtered.filter(function (job) {
                    return job.title.toLowerCase().includes(q) ||
                           job.company.toLowerCase().includes(q) ||
                           job.description.toLowerCase().includes(q) ||
                           job.category.toLowerCase().includes(q);
                });
            }

            // Location filter
            if (locationQuery) {
                var lq = locationQuery.toLowerCase();
                filtered = filtered.filter(function (job) {
                    if (lq === 'remote' || lq === 'work from home' || lq === 'wfh') {
                        return job.worktype === 'remote';
                    }
                    return job.location.toLowerCase().includes(lq);
                });
            }

            // Category filter
            if (activeFilters.category.length > 0) {
                filtered = filtered.filter(function (job) {
                    return activeFilters.category.includes(job.category);
                });
            }

            // Work type filter
            if (activeFilters.worktype.length > 0) {
                filtered = filtered.filter(function (job) {
                    return activeFilters.worktype.includes(job.worktype);
                });
            }

            // Stipend filter
            if (activeFilters.stipend.length > 0) {
                filtered = filtered.filter(function (job) {
                    return activeFilters.stipend.some(function (range) {
                        if (range === '0-10000') return job.stipend >= 0 && job.stipend <= 10000;
                        if (range === '10000-25000') return job.stipend > 10000 && job.stipend <= 25000;
                        if (range === '25000-50000') return job.stipend > 25000 && job.stipend <= 50000;
                        if (range === '50000+') return job.stipend > 50000;
                        return false;
                    });
                });
            }

            // Duration filter
            if (activeFilters.duration.length > 0) {
                filtered = filtered.filter(function (job) {
                    return activeFilters.duration.includes(String(job.duration));
                });
            }

            // Perks filter
            if (activeFilters.perks.length > 0) {
                filtered = filtered.filter(function (job) {
                    return activeFilters.perks.every(function (perk) {
                        return job.perks.includes(perk);
                    });
                });
            }

            // Sort
            if (sortBy === 'newest') {
                // Keep original order
            } else if (sortBy === 'stipend-high') {
                filtered.sort(function (a, b) { return b.stipend - a.stipend; });
            } else if (sortBy === 'stipend-low') {
                filtered.sort(function (a, b) { return a.stipend - b.stipend; });
            } else if (sortBy === 'duration-short') {
                filtered.sort(function (a, b) { return a.duration - b.duration; });
            } else if (sortBy === 'duration-long') {
                filtered.sort(function (a, b) { return b.duration - a.duration; });
            } else {
                // Relevance: featured first
                filtered.sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); });
            }

            return filtered;
        }

        function updateResults() {
            var jobs = getFilteredJobs();
            renderJobs(jobs);
            renderActiveFilters();
        }

        // ---- Active Filter Tags ----
        function renderActiveFilters() {
            if (!activeFiltersContainer) return;

            var tags = [];
            var filterLabels = {
                tech: 'Software Dev', design: 'UI/UX Design', data: 'Data Science',
                marketing: 'Marketing', finance: 'Finance', content: 'Content Writing',
                remote: 'Remote', onsite: 'On-site', hybrid: 'Hybrid',
                '0-10000': 'Rs. 0-10K', '10000-25000': 'Rs. 10K-25K',
                '25000-50000': 'Rs. 25K-50K', '50000+': 'Rs. 50K+',
                '1': '1 Month', '2': '2 Months', '3': '3 Months',
                '6': '6 Months', '12': '12 Months',
                certificate: 'Certificate', lor: 'LOR', flexible: 'Flexible Hours', ppo: 'PPO'
            };

            Object.keys(activeFilters).forEach(function (key) {
                activeFilters[key].forEach(function (val) {
                    tags.push({ filterType: key, value: val, label: filterLabels[val] || val });
                });
            });

            if (searchQuery) {
                tags.push({ filterType: 'search', value: searchQuery, label: 'Search: ' + searchQuery });
            }
            if (locationQuery) {
                tags.push({ filterType: 'location', value: locationQuery, label: 'Location: ' + locationQuery });
            }

            activeFiltersContainer.innerHTML = tags.map(function (tag) {
                return '<span class="active-filter-tag">' +
                    tag.label +
                    '<button data-type="' + tag.filterType + '" data-value="' + tag.value + '">&times;</button>' +
                '</span>';
            }).join('');

            // Bind remove events
            activeFiltersContainer.querySelectorAll('button').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var type = this.getAttribute('data-type');
                    var value = this.getAttribute('data-value');

                    if (type === 'search') {
                        searchQuery = '';
                        if (searchInput) searchInput.value = '';
                    } else if (type === 'location') {
                        locationQuery = '';
                        if (locationInput) locationInput.value = '';
                    } else {
                        activeFilters[type] = activeFilters[type].filter(function (v) { return v !== value; });
                        var checkbox = document.querySelector('input[data-filter="' + type + '"][value="' + value + '"]');
                        if (checkbox) checkbox.checked = false;
                    }

                    updateResults();
                });
            });
        }

        // ---- Event Listeners ----

        // Checkbox filters (multi-select)
        document.querySelectorAll('input[data-filter]').forEach(function (checkbox) {
            checkbox.addEventListener('change', function () {
                var filterType = this.getAttribute('data-filter');
                var value = this.value;

                if (this.checked) {
                    if (!activeFilters[filterType].includes(value)) {
                        activeFilters[filterType].push(value);
                    }
                } else {
                    activeFilters[filterType] = activeFilters[filterType].filter(function (v) {
                        return v !== value;
                    });
                }

                updateResults();
            });
        });

        // Search button
        if (searchBtn) {
            searchBtn.addEventListener('click', function () {
                searchQuery = searchInput ? searchInput.value.trim() : '';
                locationQuery = locationInput ? locationInput.value.trim() : '';
                updateResults();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    searchQuery = searchInput.value.trim();
                    locationQuery = locationInput ? locationInput.value.trim() : '';
                    updateResults();
                }
            });
        }

        if (locationInput) {
            locationInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    searchQuery = searchInput ? searchInput.value.trim() : '';
                    locationQuery = locationInput.value.trim();
                    updateResults();
                }
            });
        }

        // Sort
        if (sortSelect) {
            sortSelect.addEventListener('change', function () {
                sortBy = this.value;
                updateResults();
            });
        }

        // Clear all filters
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', function () {
                activeFilters = { category: [], worktype: [], stipend: [], duration: [], perks: [] };
                searchQuery = '';
                locationQuery = '';
                if (searchInput) searchInput.value = '';
                if (locationInput) locationInput.value = '';
                document.querySelectorAll('input[data-filter]').forEach(function (cb) {
                    cb.checked = false;
                });
                if (sortSelect) sortSelect.value = 'relevance';
                sortBy = 'relevance';
                updateResults();
            });
        }

        // Filter group collapse/expand
        document.querySelectorAll('.filter-title').forEach(function (title) {
            title.addEventListener('click', function () {
                var targetId = this.getAttribute('data-toggle');
                var options = document.getElementById(targetId);
                if (options) {
                    this.classList.toggle('collapsed');
                    options.classList.toggle('collapsed');
                }
            });
        });

        // Mobile filter toggle
        if (mobileFilterToggle && sidebar) {
            mobileFilterToggle.addEventListener('click', function () {
                sidebar.classList.toggle('open');
                document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
            });
        }

        // ---- Initial Render ----
        updateResults();

        // ---- Delegate Apply Button Clicks (for dynamically rendered cards) ----
        jobsList.addEventListener('click', function (e) {
            var applyBtn = e.target.closest('.apply-btn');
            if (applyBtn) {
                e.preventDefault();
                var jobTitle = applyBtn.getAttribute('data-job') || 'this internship';
                openModal(jobTitle);
            }
        });

    } // end if (jobsList)


    /* ======================================================================
       22. COMPANY PAGE - Form Validation
       ====================================================================== */
    var internshipForm = document.getElementById('internshipForm');
    var companyFormSuccess = document.getElementById('formSuccess');

    if (internshipForm) {
        internshipForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Basic validation
            var required = internshipForm.querySelectorAll('[required]');
            var isValid = true;

            required.forEach(function (field) {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ef4444';
                    field.addEventListener('input', function () {
                        this.style.borderColor = '';
                    }, { once: true });
                }
            });

            if (!isValid) return;

            // Collect form data
            var formData = {
                companyName: document.getElementById('companyName').value,
                companyWebsite: document.getElementById('companyWebsite').value,
                title: document.getElementById('internTitle').value,
                category: document.getElementById('internCategory').value,
                location: document.getElementById('internLocation').value,
                workType: document.getElementById('internType').value,
                stipend: document.getElementById('internStipend').value,
                duration: document.getElementById('internDuration').value,
                description: document.getElementById('internDesc').value,
                contactEmail: document.getElementById('contactEmail').value,
                contactPhone: document.getElementById('contactPhone').value,
                perks: Array.from(internshipForm.querySelectorAll('.perk-checkbox input:checked')).map(function (cb) {
                    return cb.value;
                })
            };

            console.log('Internship Posted:', formData);

            // Show success message
            internshipForm.style.display = 'none';
            if (companyFormSuccess) {
                companyFormSuccess.style.display = 'block';
                companyFormSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }


    /* ======================================================================
       23. CONTACT PAGE - Form Validation
       ====================================================================== */
    var contactForm = document.getElementById('contactForm');
    var contactFormSuccess = document.getElementById('contactFormSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Basic validation
            var required = contactForm.querySelectorAll('[required]');
            var isValid = true;

            required.forEach(function (field) {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ef4444';
                    field.addEventListener('input', function () {
                        this.style.borderColor = '';
                    }, { once: true });
                }
            });

            if (!isValid) return;

            // Collect form data
            var formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            console.log('Contact Form Submitted:', formData);

            // Show success
            contactForm.style.display = 'none';
            if (contactFormSuccess) {
                contactFormSuccess.style.display = 'block';
                contactFormSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

}); // end DOMContentLoaded
