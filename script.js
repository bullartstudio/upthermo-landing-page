document.addEventListener('DOMContentLoaded', () => {

    // --- Scroll Progress Bar ---
    const progressBar = document.getElementById('scroll-progress');
    const mainHeader = document.getElementById('main-header');

    // --- Chart.js Implementation ---
    const chartCtx = document.getElementById('production-chart');
    if (chartCtx) {
        new Chart(chartCtx, {
            type: 'bar',
            data: {
                labels: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
                datasets: [
                    {
                        label: 'Turbina ORC (250 kW)',
                        data: Array(12).fill(165000), // ~165 MWh constant
                        backgroundColor: '#FF6B35',
                        borderRadius: 4
                    },
                    {
                        label: 'Fotowoltaika (250 kWp)',
                        // PV production curve approx (low in winter, high in summer) in kWh
                        data: [9000, 15000, 25000, 35000, 45000, 48000, 49000, 46000, 35000, 20000, 10000, 8000],
                        backgroundColor: '#FFD166',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: 'white', font: { size: 14 } }
                    },
                    title: {
                        display: true,
                        text: 'Miesięczna Produkcja Energii [kWh]',
                        color: 'white',
                        font: { size: 16 }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                    }
                }
            }
        });
    }

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
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('mobile-open');
        });
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
    const inputWaste = document.getElementById('input-waste');
    const shiftsInputs = document.querySelectorAll('input[name="shifts"]');
    const solarInputs = document.querySelectorAll('input[name="solar"]');

    const valBill = document.getElementById('val-bill');
    const valWaste = document.getElementById('val-waste');

    // Results Elements
    const resCurrentBill = document.getElementById('res-current-bill');
    const resSavingsYear = document.getElementById('res-savings-year');
    const resSavingsContext = document.getElementById('res-savings-context');
    const bonusesContainer = document.getElementById('bonuses-container');

    // Inaction Elements
    const dailyLossEl = document.getElementById('daily-loss');
    const loss1mEl = document.getElementById('loss-1m');
    const loss6mEl = document.getElementById('loss-6m');
    const loss1yEl = document.getElementById('loss-1y');

    if (inputBill && inputWaste) {

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
            const wasteTons = parseInt(inputWaste.value);
            let shifts = 3;
            shiftsInputs.forEach(r => { if (r.checked) shifts = parseInt(r.value); });
            let hasSolar = false;
            solarInputs.forEach(r => { if (r.checked) hasSolar = (r.value === 'true'); });

            // Update UI Labels
            valBill.textContent = new Intl.NumberFormat('pl-PL').format(billMonth) + ' PLN';
            valWaste.textContent = wasteTons + ' ton';

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

            // Dynamic context text
            if (resSavingsContext) {
                const savingsInMillions = savingsYear / 1000000;
                if (savingsInMillions >= 1) {
                    resSavingsContext.innerHTML = `To ponad <strong>${savingsInMillions.toFixed(1).replace('.', ',')} mln zł</strong> rocznie`;
                } else if (savingsYear >= 500000) {
                    resSavingsContext.innerHTML = `To ponad <strong>pół miliona złotych</strong> rocznie`;
                } else {
                    resSavingsContext.innerHTML = `To <strong>${Math.round(savingsYear / 1000)} tys. zł</strong> oszczędności rocznie`;
                }
            }

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
            document.getElementById('calc-waste-daily').value = wasteTons + ' ton';
            document.getElementById('calc-shifts').value = shifts;
            document.getElementById('calc-has_solar').value = hasSolar ? 'Tak' : 'Nie';
            document.getElementById('calc-savings-yearly').value = formatMoney(savingsYear);
        }

        // Event Listeners
        inputBill.addEventListener('input', calculate);
        inputWaste.addEventListener('input', calculate);
        shiftsInputs.forEach(el => el.addEventListener('change', calculate));
        solarInputs.forEach(el => el.addEventListener('change', calculate));

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
                        msgField.value = `Proszę o ofertę na podstawie moich wyliczeń:\n- Rachunek: ${valBill.textContent}\n- Odpady: ${valWaste.textContent}\n- Przewidywana oszczędność: ${resSavingsYear.textContent}`;
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
                maintainAspectRatio: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Miesięczna Produkcja Energii (Stabilność ORC vs Sezonowość PV)',
                        font: { size: 14, weight: '600' }
                    },
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'kWh' },
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

    console.log('Upthermo ORC Landing Page Loaded');
});
