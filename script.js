document.addEventListener('DOMContentLoaded', function() {
    // Cek apakah browser mendukung Touch events 
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Tambahkan kelas ke body jika perangkat touchscreen
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    }
    
    // Tab switching functionality
    const tabs = document.querySelectorAll('.tab');
    const paymentDetails = document.querySelectorAll('.payment-detail');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and payment details
            tabs.forEach(t => t.classList.remove('active'));
            paymentDetails.forEach(pd => pd.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding payment detail
            tab.classList.add('active');
            const method = tab.getAttribute('data-method');
            document.getElementById(method).classList.add('active');
            
            // Add entrance animation
            animatePaymentDetail(method);
        });
    });
    
    // Copy button functionality
    const copyButtons = document.querySelectorAll('.copy-btn');
    const successPopup = document.getElementById('success-popup');
    
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const value = btn.getAttribute('data-value');
            copyToClipboard(value);
            
            // Show success popup
            successPopup.classList.add('show');
            
            // Hide popup after 2 seconds
            setTimeout(() => {
                successPopup.classList.remove('show');
            }, 2000);
            
            // Animate the button
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 100);
        });
    });
    
    // Function to copy text to clipboard
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
    
    // Function to animate payment details on tab change
    function animatePaymentDetail(method) {
        const detail = document.getElementById(method);
        
        // Scroll to top of container when changing tabs
        const container = document.querySelector('.container');
        container.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Using GSAP for animations
        gsap.fromTo(detail, 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
        
        // Animate the detail header
        const header = detail.querySelector('.detail-header');
        gsap.fromTo(header, 
            { opacity: 0, x: -20 }, 
            { opacity: 1, x: 0, duration: 0.6, delay: 0.1, ease: "back.out(1.7)" }
        );
        
        // Animate the account info with stagger effect
        const accountFields = detail.querySelectorAll('.account-field');
        gsap.fromTo(accountFields, 
            { opacity: 0, y: 10 }, 
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.2, ease: "power1.out" }
        );
        
        // Special animations for QR code if present
        const qrCode = detail.querySelector('.qr-code');
        if (qrCode) {
            gsap.fromTo(qrCode, 
                { opacity: 0, scale: 0.8, rotation: -5 }, 
                { opacity: 1, scale: 1, rotation: 0, duration: 0.7, delay: 0.3, ease: "elastic.out(1, 0.5)" }
            );
        }
        
        // Animate the instructions
        const instruction = detail.querySelector('.instruction');
        if (instruction) {
            gsap.fromTo(instruction, 
                { opacity: 0, y: 20 }, 
                { opacity: 1, y: 0, duration: 0.5, delay: 0.4, ease: "power1.out" }
            );
            
            // Stagger animation for list items
            const listItems = instruction.querySelectorAll('li');
            gsap.fromTo(listItems, 
                { opacity: 0, x: -10 }, 
                { opacity: 1, x: 0, duration: 0.3, stagger: 0.1, delay: 0.5, ease: "power1.out" }
            );
        }
        
        // Check device width for different animations on mobile
        if (window.innerWidth <= 768) {
            // Simplify animations on mobile for better performance
            gsap.set(detail, { clearProps: "all" });
            detail.style.opacity = 1;
            detail.style.transform = "none";
        }
    }
    
    // Initial animation for the first visible payment method
    animatePaymentDetail('qris');
    
    // Add floating animation to tabs
    gsap.to('.tab', {
        y: -5,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
            each: 0.2,
            from: "start"
        }
    });
    
    // Add shine effect to header
    const header = document.querySelector('.header');
    gsap.to(header, {
        backgroundPosition: '200% center',
        duration: 15,
        repeat: -1,
        ease: "none"
    });
    
    // Easter egg: Konami code (up, up, down, down, left, right, left, right, b, a)
    let keys = [];
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    window.addEventListener('keydown', (e) => {
        keys.push(e.key);
        keys = keys.slice(-10); // Keep only the last 10 keys
        
        if (keys.join(',') === konamiCode.join(',')) {
            // Trigger cool animation when Konami code is entered
            partyMode();
        }
    });
    
    function partyMode() {
        // Rainbow colors for header
        gsap.to('.header', {
            background: 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)',
            backgroundSize: '1400% 100%',
            duration: 10,
            repeat: -1,
            ease: "none"
        });
        
        // Make all payment methods dance
        gsap.to('.tab', {
            rotation: 360,
            duration: 1,
            ease: "back.out(1.7)"
        });
        
        // Show all payment methods briefly
        const methods = ['qris', 'dana', 'shopeepay', 'gopay', 'mandiri', 'bni', 'nobu'];
        let delay = 0;
        
        methods.forEach(method => {
            setTimeout(() => {
                tabs.forEach(t => t.classList.remove('active'));
                paymentDetails.forEach(pd => pd.classList.remove('active'));
                
                document.querySelector(`[data-method="${method}"]`).classList.add('active');
                document.getElementById(method).classList.add('active');
                
                animatePaymentDetail(method);
            }, delay);
            
            delay += 800;
        });
    }
    
    // Add hover effects for better interactivity
    tabs.forEach(tab => {
        tab.addEventListener('mouseenter', () => {
            if (!tab.classList.contains('active')) {
                gsap.to(tab, {
                    backgroundColor: '#e9e9e9',
                    color: '#6c5ce7',
                    duration: 0.3,
                    ease: "power1.out"
                });
            }
        });
        
        tab.addEventListener('mouseleave', () => {
            if (!tab.classList.contains('active')) {
                gsap.to(tab, {
                    backgroundColor: '#f1f1f1',
                    color: '#666',
                    duration: 0.3,
                    ease: "power1.out"
                });
            }
        });
    });
    
    // Add ripple effect to copy buttons
    copyButtons.forEach(btn => {
        btn.addEventListener('mousedown', function(e) {
            const x = e.clientX - btn.getBoundingClientRect().left;
            const y = e.clientY - btn.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
            ripple.style.borderRadius = '50%';
            ripple.style.width = '100px';
            ripple.style.height = '100px';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.style.opacity = '0';
            
            btn.appendChild(ripple);
            
            gsap.to(ripple, {
                opacity: 1,
                scale: 0,
                duration: 0.6,
                ease: "power1.out",
                onComplete: () => {
                    ripple.remove();
                }
            });
        });
    });
});