if (window.ScrollTrigger) {
    // Register the plugin
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    } else {
    console.log("ScrollTrigger still loading... skipping animation for now.");
}

// PROJECT SETUP
window.addEventListener('load', () => {

    const canvas = document.getElementById('scatterCanvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let particleArray = [];
    const mouse = { x: null, y: null, radius: 150 };

    window.openContact = function() {
    document.getElementById('contact-panel').classList.add('open');
};

    window.closeContact = function() {
    document.getElementById('contact-panel').classList.remove('open');
};

    // Listeners for Mouse and Touch
    window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });
    window.addEventListener('touchmove', (e) => { 
        mouse.x = e.touches[0].clientX; 
        mouse.y = e.touches[0].clientY; 
    }, { passive: false });

    // THE PARTICLE BLUEPRINT
    class Particle {
        constructor(x, y) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.homeX = x;
            this.homeY = y;
            this.size = 4; // Bolder size to fill gaps
            this.ease = 0.05;
            this.opacity = 1;
        }
        draw() {
            ctx.fillStyle = '#FF4D00';
            ctx.globalAlpha = this.opacity;
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                // The "Run Away" logic
                this.x -= dx / 10;
                this.y -= dy / 10;
            } else {
                // The "Snap Back" logic
                this.x += (this.homeX - this.x) * this.ease;
                this.y += (this.homeY - this.y) * this.ease;
            }
        }
    }




    // THE SCANNER
function init() {
    // Set Canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particleArray = [];

    // Setup the "Invisible" drawing for scanning
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // MAIN TITLE
    ctx.font = '200px RobotoBold, sans-serif';
    ctx.fillText('FRAME FORGE', canvas.width / 2, canvas.height / 2);

    // DRAW SLOGAN (Larger & Pushed Down)
    // We use a fixed '40px' to ensure it's visible to the scanner
    ctx.font = '900 40px RobotoBold, sans-serif'; 
    
    // Increased gap: change '120' to '160' if you want even more space
    const sloganGap = 120; 
    ctx.fillText('FORGING THE CINEMATIC VISION', canvas.width / 2, (canvas.height / 2) + sloganGap);

    // Capture the WHOLE screen
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 4. SCAN: Lowered threshold to '0' to catch small slogan pixels
    // Using a tight gap of '3' for better detail on the smaller words
    for (let y = 0; y < data.height; y += 3) {
        for (let x = 0; x < data.width; x += 3) {
            // Index 3 is Alpha (0-255). We set to > 0 to catch everything!
            if (data.data[(y * 4 * data.width) + (x * 4) + 3] > 0) {
                particleArray.push(new Particle(x, y));

            }
        }
    }


    
    console.log("Forge active with " + particleArray.length + " particles.");


 
        // Particle Glow
        particleArray.forEach(p => {
            gsap.to(p, { opacity: 0.3, duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
        });

        gsap.set("#scatterCanvas", { visibility: "visible" });
        console.log("Forge Active!");
    }

    // THE ANIMATION LOOP
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particleArray.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    // MENU & UI
 // Update Section 5 in your script.js
const menuTl = gsap.timeline({ paused: true, reversed: true });

menuTl.to(".toggle-line", { width: 60, backgroundColor: "#fff", duration: 0.3 }, "f")
      .to(".toggle-text", { opacity: 0.5, x: -5, duration: 0.3 }, "f")
      .to("#studio-menu", { right: 0, duration: 0.5, ease: "expo.out" }, "-=0.2")
      .fromTo(".menu-content a", 
          { x: 40, opacity: 0 }, 
          { x: 0, opacity: 1, stagger: 0.1, duration: 0.4, ease: "power2.out" }, 
          "-=0.3"
      );



// Grab the elements

const forgeForm = document.getElementById('forge-form');
const successMsg = document.getElementById('success-message');

if (forgeForm) {
    forgeForm.addEventListener('submit', function(e) {
        //  STOP the page refresh
        e.preventDefault(); 
        
        console.log("Form Submit Detected!"); 

        // FADE OUT the form
        gsap.to(forgeForm, { 
            opacity: 0, 
            y: -20, 
            duration: 0.4, 
            onComplete: () => {
                // SWAP the display
                forgeForm.style.display = 'none';
                successMsg.style.display = 'block';
                
                // FADE IN the success message
                gsap.fromTo(successMsg, 
                    { opacity: 0, y: 20 }, 
                    { opacity: 1, y: 0, duration: 0.5 }
                );
            }
        });
    });
}

// The "SEND ANOTHER" Reset Logic
window.resetForm = function() {
   
    successMsg.style.display = 'none'; 
    
    forgeForm.reset(); 
    
    forgeForm.style.display = 'flex'; // Use 'flex' to match your CSS !important
    gsap.to(forgeForm, { opacity: 1, y: 0, duration: 0.4 }); 
};

    // START
    window.addEventListener('resize', init);
   document.fonts.load(`900 100px Roboto`).then(() => {
    console.log("Font loaded, starting Forge...");
    init();
    animate();
});

//*BACK BUTTON*/
window.toggleMenu = function() {
    menuTl.reversed() ? menuTl.play() : menuTl.reverse();
};


   window.openContact = function() {
    document.getElementById('contact-panel').classList.add('open');
    // Optional: dim the background menu for focus
    gsap.to(".menu-content", { opacity: 0.3, duration: 0.5 });
};
    window.closeContact = function() {
    document.getElementById('contact-panel').classList.remove('open');
    gsap.to(".menu-content", { opacity: 1, duration: 0.5 });
};






});


function openProject(projectId) {
    // Target the video inside the clicked project item
    const video = event.currentTarget.querySelector('video');

    if (video) {
        if (video.paused) {

            // First unmute, then play (required by some browsers for sound)
            video.muted = false; 
            video.play().catch(error => console.log("Playback failed:", error));
        } else {
            
            video.pause();
        }
    }
}



console.log("GSAP and ScrollTrigger are ready!");

// Pin the Hero Section
ScrollTrigger.create({
    trigger: ".portfolio-wrapper",
    start: "top top",
    end: "+=100%", // This determines how long the "pin" lasts
    pin: true,
    pinSpacing: false // Allows the Work Grid to slide OVER the hero
});

// Optional: Fade out the title as you scroll down
gsap.to("#scatterCanvas", {
    scrollTrigger: {
        trigger: ".portfolio-wrapper",
        start: "top top",
        end: "bottom top",
        scrub: true
    },
    opacity: 0,
    scale: 0.8
});

// Function for WORK
window.scrollToWork = function() {
    // Close the menu first using your existing timeline
    window.toggleMenu(); 

    // Smoothly glide to the #work section
    // 'power4.inOut' makes it feel heavy and expensive
    gsap.to(window, {
        duration: 1.8,
        scrollTo: { y: "#work", autoKill: false },
        ease: "power4.inOut"
    });
};



// Function for SERVICES
window.scrollToServices = function() {
    window.toggleMenu(); 
    gsap.to(window, {
        duration: 2.2, // Longer travel because it's further down the page
        scrollTo: { y: "#services", autoKill: false },
        ease: "power4.inOut"
    });
};


// Function for ABOUT
window.scrollToAbout = function() {
    window.toggleMenu(); 
    gsap.to(window, {
        duration: 2.8, // Longest travel for the deepest section
        scrollTo: { y: "#about", autoKill: false },
        ease: "power4.inOut"
    });
};












