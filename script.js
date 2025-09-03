import { inject } from "@vercel/analytics";
inject();

// Gestionnaire principal pour l'initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeThemeToggle();
    initializeScrollAnimations();
    initializeTabs();
    initializeAccordion();
    initializeCursorFollower();
    initializeParticles();
    initializeMobileMenu();
});

// Navigation et scroll spy
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Smooth scroll pour les liens d'ancrage
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                updateActiveNavLink(this);
            }
        });
    });
    
    // Scroll spy pour mettre à jour la navigation active
    window.addEventListener('scroll', function() {
        let current = '';
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Gestion du thème clair/sombre
function initializeThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // Vérifier le thème sauvegardé
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        body.setAttribute('data-theme', 'light');
    }
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Animation de transition fluide
        body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    });
}

// Animations au scroll
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Ajouter l'animation appropriée selon la position
                if (element.classList.contains('concept-card')) {
                    element.style.animationDelay = `${Array.from(element.parentNode.children).indexOf(element) * 0.1}s`;
                    element.classList.add('animate-up');
                } else if (element.classList.contains('timeline-item')) {
                    element.style.animationDelay = `${Array.from(element.parentNode.children).indexOf(element) * 0.2}s`;
                    element.classList.add('animate-left');
                } else if (element.classList.contains('rule-card')) {
                    element.style.animationDelay = `${Array.from(element.parentNode.children).indexOf(element) * 0.15}s`;
                    element.classList.add('animate-right');
                } else if (element.classList.contains('strategy-card')) {
                    element.style.animationDelay = `${Array.from(element.parentNode.children).indexOf(element) * 0.1}s`;
                    element.classList.add('animate-up');
                } else if (element.classList.contains('credit-card')) {
                    element.style.animationDelay = `${Array.from(element.parentNode.children).indexOf(element) * 0.2}s`;
                    element.classList.add('animate-up');
                }
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observer les éléments animables
    document.querySelectorAll('.concept-card, .timeline-item, .rule-card, .strategy-card, .credit-card').forEach(el => {
        observer.observe(el);
    });
}

// Système d'onglets
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Désactiver tous les onglets
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Activer l'onglet sélectionné
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Animation de transition
            const activePane = document.getElementById(targetTab);
            activePane.style.opacity = '0';
            activePane.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                activePane.style.opacity = '1';
                activePane.style.transform = 'translateY(0)';
                activePane.style.transition = 'all 0.3s ease';
            }, 50);
        });
    });
}

// Accordéon pour les stratégies avancées
function initializeAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        
        header.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Fermer tous les autres accordéons
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherContent = otherItem.querySelector('.accordion-content');
                    otherContent.style.maxHeight = '0px';
                }
            });
            
            // Toggle l'accordéon actuel
            if (isActive) {
                item.classList.remove('active');
                content.style.maxHeight = '0px';
            } else {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
}

// Curseur personnalisé
function initializeCursorFollower() {
    const cursor = document.querySelector('.cursor-follower');
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', function() {
        cursor.style.opacity = '0';
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Effet sur les éléments interactifs
    const interactiveElements = document.querySelectorAll('a, button, .card, .accordion-header');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            cursor.style.transform += ' scale(1.5)';
            cursor.style.background = 'linear-gradient(45deg, #FF6B35, #4CAF50)';
        });
        
        el.addEventListener('mouseleave', function() {
            cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
            cursor.style.background = 'linear-gradient(45deg, #4CAF50, #FF6B35)';
        });
    });
}

// Effet de particules
function initializeParticles() {
    const hero = document.querySelector('.hero');
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    hero.appendChild(particlesContainer);
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const startX = Math.random() * window.innerWidth;
        const endX = startX + (Math.random() - 0.5) * 200;
        const duration = 8 + Math.random() * 4;
        
        particle.style.left = startX + 'px';
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        // Couleurs aléatoires des particules
        const colors = ['#4CAF50', '#FF6B35', '#2196F3', '#FFC107'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, (duration + 2) * 1000);
    }
    
    // Créer des particules périodiquement
    setInterval(createParticle, 800);
}

// Menu mobile
function initializeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
        
        // Animation du bouton hamburger
        const spans = this.querySelectorAll('span');
        if (this.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    });
    
    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        });
    });
}

// Effet parallax pour le hero
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-block');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform += ` translateY(${scrolled * speed}px)`;
    });
});

// Animation des blocs Minecraft au survol
document.querySelectorAll('.minecraft-block').forEach(block => {
    block.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotateY(15deg)';
        this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
    });
    
    block.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
    });
});

// Effet de typing pour le titre principal
function initializeTypingEffect() {
    const titlePrimary = document.querySelector('.title-primary');
    const titleSecondary = document.querySelector('.title-secondary');
    
    if (titlePrimary && titleSecondary) {
        const text1 = titlePrimary.textContent;
        const text2 = titleSecondary.textContent;
        
        titlePrimary.textContent = '';
        titleSecondary.textContent = '';
        
        let i = 0;
        const typingSpeed = 100;
        
        function typeFirstWord() {
            if (i < text1.length) {
                titlePrimary.textContent += text1.charAt(i);
                i++;
                setTimeout(typeFirstWord, typingSpeed);
            } else {
                setTimeout(typeSecondWord, 200);
            }
        }
        
        let j = 0;
        function typeSecondWord() {
            if (j < text2.length) {
                titleSecondary.textContent += text2.charAt(j);
                j++;
                setTimeout(typeSecondWord, typingSpeed);
            }
        }
        
        setTimeout(typeFirstWord, 1000);
    }
}

// Initialiser l'effet de typing après le chargement
window.addEventListener('load', function() {
    setTimeout(initializeTypingEffect, 500);
});

// Effet de compteur pour les statistiques
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Gestion des tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            setTimeout(() => {
                tooltip.classList.add('show');
            }, 10);
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.classList.remove('show');
                setTimeout(() => {
                    if (tooltip.parentNode) {
                        tooltip.parentNode.removeChild(tooltip);
                    }
                }, 300);
            }
        });
    });
}

// Easter egg - Konami Code
function initializeKonamiCode() {
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    let userInput = [];
    
    document.addEventListener('keydown', function(e) {
        userInput.push(e.code);
        
        if (userInput.length > konamiCode.length) {
            userInput.shift();
        }
        
        if (JSON.stringify(userInput) === JSON.stringify(konamiCode)) {
            activateEasterEgg();
            userInput = [];
        }
    });
    
    function activateEasterEgg() {
        // Effet spécial : pluie de blocs Minecraft
        const body = document.body;
        body.classList.add('easter-egg-active');
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                createFallingBlock();
            }, i * 100);
        }
        
        setTimeout(() => {
            body.classList.remove('easter-egg-active');
        }, 5000);
    }
    
    function createFallingBlock() {
        const block = document.createElement('div');
        block.className = 'falling-minecraft-block';
        
        const blockTypes = ['stone', 'dirt', 'diamond', 'tnt'];
        const randomType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
        block.classList.add(randomType);
        
        block.style.left = Math.random() * window.innerWidth + 'px';
        block.style.animationDuration = (2 + Math.random() * 3) + 's';
        
        document.body.appendChild(block);
        
        setTimeout(() => {
            if (block.parentNode) {
                block.parentNode.removeChild(block);
            }
        }, 5000);
    }
}

// Effet de survol pour les cartes
function initializeCardEffects() {
    const cards = document.querySelectorAll('.concept-card, .strategy-card, .credit-card, .rule-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--mouse-x', x + 'px');
            this.style.setProperty('--mouse-y', y + 'px');
            
            this.classList.add('card-hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('card-hover');
        });
    });
}

// Performance: Debounce pour les événements de scroll
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimisation des animations
function optimizeAnimations() {
    // Réduire les animations si l'utilisateur préfère les mouvements réduits
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition-fast', '0s');
        document.documentElement.style.setProperty('--transition-normal', '0s');
        document.documentElement.style.setProperty('--transition-slow', '0s');
    }
    
    // Pause les animations quand l'onglet n'est pas visible
    document.addEventListener('visibilitychange', function() {
        const animatedElements = document.querySelectorAll('.floating-block, .minecraft-blocks');
        
        if (document.hidden) {
            animatedElements.forEach(el => {
                el.style.animationPlayState = 'paused';
            });
        } else {
            animatedElements.forEach(el => {
                el.style.animationPlayState = 'running';
            });
        }
    });
}

// Gestion des erreurs
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
    // En production, vous pourriez vouloir envoyer ces erreurs à un service de monitoring
});

// Initialisation finale
document.addEventListener('DOMContentLoaded', function() {
    initializeCardEffects();
    initializeTooltips();
    initializeKonamiCode();
    optimizeAnimations();
});

// Ajout du CSS pour les effets supplémentaires
const additionalStyles = `
<style>
.tooltip {
    position: absolute;
    background: var(--bg-tertiary);
    color: var(--text-primary);
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.875rem;
    white-space: nowrap;
    z-index: 10000;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.tooltip.show {
    opacity: 1;
    transform: translateY(0);
}

.falling-minecraft-block {
    position: fixed;
    width: 30px;
    height: 30px;
    border-radius: 2px;
    top: -50px;
    z-index: 10000;
    animation: fall linear forwards;
    box-shadow: 
        inset -4px -4px 0px rgba(0, 0, 0, 0.2),
        inset 4px 4px 0px rgba(255, 255, 255, 0.1);
}

.falling-minecraft-block.stone {
    background: linear-gradient(135deg, #7F7F7F, #5A5A5A);
}

.falling-minecraft-block.dirt {
    background: linear-gradient(135deg, #8B4513, #654321);
}

.falling-minecraft-block.diamond {
    background: linear-gradient(135deg, #00BCD4, #0097A7);
}

.falling-minecraft-block.tnt {
    background: linear-gradient(135deg, #F44336, #D32F2F);
}

@keyframes fall {
    to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
    }
}

.card-hover {
    position: relative;
}

.card-hover::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
        rgba(76, 175, 80, 0.1) 0%,
        transparent 50%
    );
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.card-hover:hover::before {
    opacity: 1;
}

.easter-egg-active {
    overflow: hidden;
}

.easter-egg-active::after {
    content: '🎉 Konami Code Activé! 🎉';
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #4CAF50, #FF6B35);
    color: white;
    padding: 20px 40px;
    border-radius: 12px;
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 1.5rem;
    z-index: 10001;
    animation: bounceIn 0.5s ease;
}

@keyframes bounceIn {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.3);
    }
    50% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.1);
    }
    100% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}

/* Améliorations pour la navigation mobile */
@media (max-width: 768px) {
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .nav-menu {
        animation: slideDown 0.3s ease when active;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
}

/* Animations d'entrée pour les éléments */
.fade-in {
    opacity: 0;
    animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Effet de glow pour les éléments actifs */
.glow-effect {
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.4);
    transition: box-shadow 0.3s ease;
}

/* Media queries pour les animations */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
    
    .floating-block {
        animation: none;
    }
    
    .minecraft-blocks {
        animation: none;
    }
}
</style>
`;

// Injecter les styles supplémentaires
document.head.insertAdjacentHTML('beforeend', additionalStyles);
