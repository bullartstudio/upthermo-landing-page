document.addEventListener('DOMContentLoaded', () => {
    console.log('Script loaded - DOMContentLoaded');

    // --- Scroll Progress Bar ---
    const progressBar = document.getElementById('scroll-progress');
    const mainHeader = document.getElementById('main-header');

    // --- Cookie Consent Logic ---

    const cookieBanner = document.getElementById('cookie-banner');
    const btnAcceptCookies = document.getElementById('btn-accept-cookies');

    if (cookieBanner && btnAcceptCookies) {
        // Check if previously accepted
        if (!localStorage.getItem('cookies-accepted')) {
            // Show after short delay
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }

        btnAcceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookies-accepted', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    function handleScroll() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;

        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }

        // Header scroll state
        if (mainHeader) {
            if (scrollTop > 50) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        }

        // Sticky CTA visibility
        const stickyCTA = document.getElementById('sticky-cta');
        const leadCapture = document.getElementById('lead-capture');

        if (stickyCTA && leadCapture) {
            const leadRect = leadCapture.getBoundingClientRect();
            const isLeadInView = leadRect.top < window.innerHeight && leadRect.bottom > 0;

            if (scrollTop > 800 && !isLeadInView) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- Intersection Observer for Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => {
        el.classList.add('hidden-initial');
        observer.observe(el);
    });

    // --- Mobile Menu Toggle ---
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', String(!isExpanded));
            mainNav.classList.toggle('mobile-open');
            console.log('Menu toggled:', mainNav.classList.contains('mobile-open'));
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mainNav.classList.contains('mobile-open') &&
                !mainNav.contains(e.target) &&
                !mobileMenuToggle.contains(e.target)) {

                mainNav.classList.remove('mobile-open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNav.classList.contains('mobile-open')) {
                mainNav.classList.remove('mobile-open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    } else {
        console.warn('Mobile menu elements not found:', { mobileMenuToggle, mainNav });
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetEl.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (mainNav && mainNav.classList.contains('mobile-open')) {
                    mainNav.classList.remove('mobile-open');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // --- Timeline Scroll Progress Logic ---
    const timelineSection = document.getElementById('implementation');
    const timelineContainer = document.getElementById('implementation-timeline');
    const timelineProgress = document.getElementById('timeline-progress-bar');
    const timelineItems = document.querySelectorAll('.timeline-item');

    function updateTimelineProgress() {
        if (!timelineContainer || !timelineProgress) return;

        const containerRect = timelineContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Start filling when container enters viewport (e.g. at 2/3 height)
        const startOffset = windowHeight * 0.7;

        // Calculate progress based on scroll relative to container
        // We want the line to "draw" as we scroll down the items

        const containerTop = containerRect.top;
        const containerHeight = containerRect.height;

        // How far have we scrolled past the start of the container?
        // We want the "drawing point" to be around the center of the screen
        const drawingPoint = windowHeight / 2;

        let progressHeight = drawingPoint - containerTop;

        // Clamp values
        if (progressHeight < 0) progressHeight = 0;
        if (progressHeight > containerHeight) progressHeight = containerHeight;

        timelineProgress.style.height = `${progressHeight}px`;

        // Activate items based on progress
        timelineItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top - containerTop; // Position relative to container

            if (progressHeight >= itemTop) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    if (timelineContainer) {
        window.addEventListener('scroll', updateTimelineProgress, { passive: true });
        updateTimelineProgress(); // Initial check
    }

    // --- Calculator Logic ---
    const inputBill = document.getElementById('input-bill');
    const shiftsInputs = document.querySelectorAll('input[name="shifts"]');
    const solarInputs = document.querySelectorAll('input[name="solar"]');
    const modernizationInputs = document.querySelectorAll('input[name="modernization"]');

    const valBill = document.getElementById('val-bill');

    // Results Elements
    const resCurrentBill = document.getElementById('res-current-bill');
    const resSavingsYear = document.getElementById('res-savings-year');
    const resSavingsMonth = document.getElementById('res-savings-month');
    const bonusesContainer = document.getElementById('bonuses-container');

    // Inaction Elements
    const dailyLossEl = document.getElementById('daily-loss');
    const loss1mEl = document.getElementById('loss-1m');
    const loss6mEl = document.getElementById('loss-6m');
    const loss1yEl = document.getElementById('loss-1y');

    if (inputBill) {

        // Update range slider gradient based on value
        function updateRangeGradient(input) {
            const min = parseFloat(input.min);
            const max = parseFloat(input.max);
            const val = parseFloat(input.value);
            const percentage = ((val - min) / (max - min)) * 100;
            input.style.background = `linear-gradient(to right, #FF6B35 0%, #FF6B35 ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`;
        }

        function formatMoney(amount) {
            return new Intl.NumberFormat('pl-PL', {
                style: 'decimal',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(Math.round(amount)) + ' zł';
        }

        function calculate() {
            // Inputs
            const billMonth = parseInt(inputBill.value);
            let shifts = 3;
            shiftsInputs.forEach(r => { if (r.checked) shifts = parseInt(r.value); });
            let hasSolar = false;
            solarInputs.forEach(r => { if (r.checked) hasSolar = (r.value === 'true'); });
            let hasModernization = false;
            modernizationInputs.forEach(r => { if (r.checked) hasModernization = (r.value === 'true'); });

            // Update UI Labels
            valBill.textContent = new Intl.NumberFormat('pl-PL').format(billMonth) + ' PLN';

            // Logic
            let savingsPercent = 0.60;
            if (shifts === 2) savingsPercent = 0.65;
            if (shifts === 3) savingsPercent = 0.70;
            if (hasSolar) savingsPercent += 0.05;

            // Savings Calculations
            const savingsMonth = billMonth * savingsPercent;
            const savingsYear = savingsMonth * 12;
            const currentBillYear = billMonth * 12;

            // Bonus Heat (Estimation)
            const heatBonusMonth = 15000;
            const totalMonthlyBenefit = savingsMonth + heatBonusMonth;

            // Update Results
            resCurrentBill.textContent = formatMoney(currentBillYear);
            resSavingsYear.textContent = formatMoney(savingsYear);

            // Update monthly savings
            if (resSavingsMonth) {
                resSavingsMonth.textContent = '~' + formatMoney(Math.round(savingsMonth));
            }

            // Update range slider gradient
            updateRangeGradient(inputBill);

            // Dynamic Bonuses with SVG icons
            let bonusHTML = `
                <div class="bonus-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                    </svg>
                    Ciepło procesowe w cenie
                </div>
            `;

            if (hasSolar) {
                bonusHTML += `
                    <div class="bonus-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>
                        Uzupełnienie istniejącej instalacji PV
                    </div>
                `;
            }
            bonusesContainer.innerHTML = bonusHTML;

            // Cost of Inaction
            const lossDay = totalMonthlyBenefit / 30;
            dailyLossEl.textContent = '−' + formatMoney(lossDay);
            loss1mEl.textContent = '−' + formatMoney(totalMonthlyBenefit);
            loss6mEl.textContent = '−' + formatMoney(totalMonthlyBenefit * 6);
            loss1yEl.textContent = '−' + formatMoney(totalMonthlyBenefit * 12);

            // Update Hidden Keywords for Form
            document.getElementById('calc-bill-monthly').value = new Intl.NumberFormat('pl-PL').format(billMonth) + ' PLN';
            document.getElementById('calc-shifts').value = shifts;
            document.getElementById('calc-has-solar').value = hasSolar ? 'Tak' : 'Nie';
            document.getElementById('calc-modernization').value = hasModernization ? 'Tak' : 'Nie';
            document.getElementById('calc-savings-yearly').value = formatMoney(savingsYear);
        }

        // Event Listeners
        inputBill.addEventListener('input', calculate);
        shiftsInputs.forEach(el => el.addEventListener('change', calculate));
        solarInputs.forEach(el => el.addEventListener('change', calculate));
        modernizationInputs.forEach(el => el.addEventListener('change', calculate));

        // Initial Calc
        calculate();

        // Btn Send Calc Logic
        const btnSendCalc = document.getElementById('btn-send-calc');
        if (btnSendCalc) {
            btnSendCalc.addEventListener('click', (e) => {
                // Smooth scroll handled by default anchor behavior, but let's focus the message field
                setTimeout(() => {
                    const msgField = document.getElementById('contact-message');
                    if (msgField) {
                        msgField.value = `Proszę o ofertę na podstawie moich wyliczeń:\n- Rachunek: ${valBill.textContent}\n- Przewidywana oszczędność: ${resSavingsYear.textContent}`;
                        msgField.focus();
                    }
                }, 800);
            });
        }
    }

    // --- Form Validation Enhancement ---
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const requiredFields = contactForm.querySelectorAll('[required]');
            let isValid = true;
            let firstInvalid = null;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    if (!firstInvalid) firstInvalid = field;
                } else {
                    field.classList.remove('error');
                }
            });

            if (!isValid) {
                e.preventDefault();
                firstInvalid.focus();
            }
        });

        // Remove error class on input
        contactForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', () => {
                field.classList.remove('error');
            });
        });
    }

    // --- Charts Logic ---
    function initCharts() {
        if (typeof Chart === 'undefined') return;

        const ctxProd = document.getElementById('production-chart');
        if (!ctxProd) return;

        // Destroy existing chart if it exists
        const existingChart = Chart.getChart(ctxProd);
        if (existingChart) {
            existingChart.destroy();
        }

        new Chart(ctxProd, {
            type: 'bar',
            data: {
                labels: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
                datasets: [
                    {
                        label: 'Turbina ORC (kWh)',
                        data: Array(12).fill(170000),
                        backgroundColor: '#FF6B35',
                        borderRadius: 4
                    },
                    {
                        label: 'Fotowoltaika (kWh)',
                        data: [5000, 8000, 15000, 25000, 35000, 40000, 42000, 38000, 28000, 15000, 8000, 4000],
                        backgroundColor: '#F59E0B',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Miesięczna Produkcja Energii [kWh]',
                        font: { size: 14, weight: '600' }
                    },
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value) {
                                return new Intl.NumberFormat('pl-PL').format(value);
                            }
                        }
                    }
                }
            }
        });
    }

    // Initialize charts after a short delay to ensure Chart.js is loaded
    if (document.getElementById('production-chart')) {
        if (typeof Chart !== 'undefined') {
            initCharts();
        } else {
            // Wait for Chart.js to load
            window.addEventListener('load', initCharts);
        }
    }

    // --- Keyboard Navigation for FAQ ---
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });

    // --- Report Download Form ---
    const reportForm = document.getElementById('report-download-form');

    if (reportForm) {
        reportForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('report-email');
            const email = emailInput.value.trim();
            const submitBtn = reportForm.querySelector('button[type="submit"]');

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                emailInput.classList.add('error');
                emailInput.focus();
                return;
            }

            emailInput.classList.remove('error');

            // Show loading state
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                </svg>
                Pobieranie...
            `;
            submitBtn.disabled = true;

            try {
                // Send email to FormSubmit (async, don't wait)
                fetch('https://formsubmit.co/ajax/biuro@upthermo.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        _subject: 'Pobranie raportu OZE - Upthermo',
                        message: 'Użytkownik pobrał raport "Analiza opłacalności technologii OZE"'
                    })
                }).catch(() => { });

                // Trigger PDF download
                const link = document.createElement('a');
                link.href = 'pdf/Analiza opłacalności technologii OZE.pdf';
                link.download = 'Analiza opłacalności technologii OZE.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Show success state
                submitBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Pobrano!
                `;
                submitBtn.style.background = '#10B981';

                // Reset form after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    emailInput.value = '';
                }, 3000);

            } catch (error) {
                // Reset on error
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });

        // Remove error class on input
        const reportEmailInput = document.getElementById('report-email');
        if (reportEmailInput) {
            reportEmailInput.addEventListener('input', () => {
                reportEmailInput.classList.remove('error');
            });
        }
    }

    console.log('Upthermo ORC Landing Page Loaded');
});
