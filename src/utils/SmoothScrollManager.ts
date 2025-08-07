import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

interface ScrollState {
  position: number;
  progress: number;
  velocity: number;
  direction: 'up' | 'down';
  isScrolling: boolean;
  momentum: number;
}

interface ScrollOptions {
  duration?: number;
  ease?: string;
  offset?: number;
  callback?: () => void;
}

class SmoothScrollManager {
  private static instance: SmoothScrollManager;
  private state: ScrollState = {
    position: 0,
    progress: 0,
    velocity: 0,
    direction: 'down',
    isScrolling: false,
    momentum: 0
  };
  
  private callbacks: ((state: ScrollState) => void)[] = [];
  private isEnabled = true;
  private smoothScrolling = false;
  private momentumDecay = 0.95;
  private velocityThreshold = 0.1;
  private lastTime = 0;
  private lastPosition = 0;
  private rafId: number | null = null;
  private wheelTimeout: ReturnType<typeof setTimeout> | null = null;

  private constructor() {
    this.init();
  }

  static getInstance(): SmoothScrollManager {
    if (!SmoothScrollManager.instance) {
      SmoothScrollManager.instance = new SmoothScrollManager();
    }
    return SmoothScrollManager.instance;
  }

  private init() {
    // Enhanced smooth scrolling CSS
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add custom CSS for ultra-smooth scrolling
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: smooth;
        scroll-padding-top: 0;
      }
      
      * {
        scroll-behavior: inherit;
      }
      
      @media (prefers-reduced-motion: no-preference) {
        html {
          scroll-behavior: smooth;
        }
      }
    `;
    document.head.appendChild(style);

    this.bindEvents();
    this.startMonitoring();
  }

  private bindEvents() {
    // Enhanced wheel event handling with momentum
    window.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
    
    // Touch events for mobile momentum scrolling
    let touchStartY = 0;
    let touchStartTime = 0;
    
    window.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    }, { passive: true });
    
    window.addEventListener('touchmove', (e) => {
      if (!this.isEnabled) return;
      
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      const deltaTime = Date.now() - touchStartTime;
      
      if (deltaTime > 0) {
        this.state.velocity = deltaY / deltaTime;
      }
    }, { passive: true });
    
    window.addEventListener('touchend', () => {
      this.applyMomentum();
    }, { passive: true });

    // Keyboard navigation with smooth scrolling
    window.addEventListener('keydown', this.handleKeyboard.bind(this));
    
    // Regular scroll event for position tracking
    window.addEventListener('scroll', this.updateState.bind(this), { passive: true });
    
    // Resize handler
    window.addEventListener('resize', this.updateState.bind(this));
  }

  private handleWheel(e: WheelEvent) {
    if (!this.isEnabled) return;
    
    // Prevent default for custom smooth scrolling
    e.preventDefault();
    
    const delta = e.deltaY;
    const scrollAmount = delta * 1.2; // Adjust sensitivity
    
    // Clear existing wheel timeout
    if (this.wheelTimeout) {
      clearTimeout(this.wheelTimeout);
    }
    
    // Apply smooth scroll with momentum
    this.smoothScrollBy(scrollAmount);
    
    // Set scrolling state
    this.state.isScrolling = true;
    
    // Clear scrolling state after delay
    this.wheelTimeout = setTimeout(() => {
      this.state.isScrolling = false;
      this.notifyCallbacks();
    }, 150);
  }

  private handleKeyboard(e: KeyboardEvent) {
    if (!this.isEnabled) return;
    
    const scrollAmount = window.innerHeight * 0.8;
    let targetPosition = this.state.position;
    
    switch (e.key) {
      case 'ArrowDown':
      case 'PageDown':
        e.preventDefault();
        targetPosition += scrollAmount;
        break;
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        targetPosition -= scrollAmount;
        break;
      case 'Home':
        e.preventDefault();
        targetPosition = 0;
        break;
      case 'End':
        e.preventDefault();
        targetPosition = document.documentElement.scrollHeight - window.innerHeight;
        break;
      case ' ':
        e.preventDefault();
        targetPosition += e.shiftKey ? -scrollAmount : scrollAmount;
        break;
      default:
        return;
    }
    
    this.smoothScrollTo(targetPosition, { duration: 0.8, ease: 'power2.out' });
  }

  private smoothScrollBy(delta: number) {
    const currentPosition = window.pageYOffset;
    const targetPosition = Math.max(0, Math.min(
      currentPosition + delta,
      document.documentElement.scrollHeight - window.innerHeight
    ));
    
    // Use GSAP for ultra-smooth scrolling
    gsap.to(window, {
      scrollTo: { y: targetPosition },
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }

  private applyMomentum() {
    if (Math.abs(this.state.velocity) < this.velocityThreshold) return;
    
    const momentumDistance = this.state.velocity * 100; // Adjust momentum factor
    this.smoothScrollBy(momentumDistance);
  }

  private startMonitoring() {
    const monitor = () => {
      this.updateState();
      this.rafId = requestAnimationFrame(monitor);
    };
    monitor();
  }

  private updateState() {
    const currentTime = performance.now();
    const currentPosition = window.pageYOffset;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    
    // Calculate velocity
    const deltaTime = currentTime - this.lastTime;
    const deltaPosition = currentPosition - this.lastPosition;
    
    if (deltaTime > 0) {
      this.state.velocity = deltaPosition / deltaTime;
    }
    
    // Update state
    this.state.position = currentPosition;
    this.state.progress = maxScroll > 0 ? currentPosition / maxScroll : 0;
    this.state.direction = deltaPosition >= 0 ? 'down' : 'up';
    
    // Apply momentum decay
    this.state.momentum *= this.momentumDecay;
    
    this.lastTime = currentTime;
    this.lastPosition = currentPosition;
    
    this.notifyCallbacks();
  }

  public smoothScrollTo(target: number | string | HTMLElement, options: ScrollOptions = {}) {
    if (!this.isEnabled) return;
    
    const {
      duration = 1.2,
      ease = 'power2.out',
      offset = 0,
      callback
    } = options;
    
    let targetPosition: number;
    
    if (typeof target === 'number') {
      targetPosition = target;
    } else if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (!element) return;
      targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
    } else {
      targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    }
    
    targetPosition += offset;
    
    // Clamp to valid scroll range
    targetPosition = Math.max(0, Math.min(
      targetPosition,
      document.documentElement.scrollHeight - window.innerHeight
    ));
    
    this.smoothScrolling = true;
    
    gsap.to(window, {
      scrollTo: { y: targetPosition },
      duration,
      ease,
      onComplete: () => {
        this.smoothScrolling = false;
        if (callback) callback();
      }
    });
  }

  public smoothScrollToProgress(progress: number, options: ScrollOptions = {}) {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetPosition = progress * maxScroll;
    this.smoothScrollTo(targetPosition, options);
  }

  public scrollToSection(sectionId: string, options: ScrollOptions = {}) {
    const section = document.getElementById(sectionId);
    if (section) {
      this.smoothScrollTo(section, { offset: -80, ...options });
    }
  }

  public subscribe(callback: (state: ScrollState) => void) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  private notifyCallbacks() {
    this.callbacks.forEach(callback => {
      try {
        callback({ ...this.state });
      } catch (error) {
        console.warn('Scroll callback error:', error);
      }
    });
  }

  public getState(): ScrollState {
    return { ...this.state };
  }

  public enable() {
    this.isEnabled = true;
  }

  public disable() {
    this.isEnabled = false;
  }

  public destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    
    if (this.wheelTimeout) {
      clearTimeout(this.wheelTimeout);
    }
    
    this.callbacks = [];
    
    // Remove event listeners
    window.removeEventListener('wheel', this.handleWheel.bind(this));
    window.removeEventListener('keydown', this.handleKeyboard.bind(this));
    window.removeEventListener('scroll', this.updateState.bind(this));
    window.removeEventListener('resize', this.updateState.bind(this));
  }
}

export const smoothScrollManager = SmoothScrollManager.getInstance();
export type { ScrollState, ScrollOptions };
