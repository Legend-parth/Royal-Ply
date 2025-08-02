interface ScrollState {
  position: number;
  progress: number;
  direction: 'up' | 'down';
  velocity: number;
  isScrolling: boolean;
  fps: number;
  smoothness: number;
}

interface ScrollCallback {
  id: string;
  callback: (state: ScrollState) => void;
  priority: number;
}

export class ScrollManager {
  private static instance: ScrollManager;
  private callbacks: ScrollCallback[] = [];
  private state: ScrollState = {
    position: 0,
    progress: 0,
    direction: 'down',
    velocity: 0,
    isScrolling: false,
    fps: 60,
    smoothness: 1
  };
  private lastPosition = 0;
  private lastTime = 0;
  private frameCount = 0;
  private lastFPSTime = 0;
  private scrollTimeout: NodeJS.Timeout | null = null;
  private rafId: number | null = null;
  private isEnabled = true;
  private smoothScrollTarget: number | null = null;
  private smoothScrollDuration = 0;
  private smoothScrollStart = 0;
  private smoothScrollStartTime = 0;

  private constructor() {
    this.init();
  }

  static getInstance(): ScrollManager {
    if (!ScrollManager.instance) {
      ScrollManager.instance = new ScrollManager();
    }
    return ScrollManager.instance;
  }

  private init() {
    this.updateState();
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('resize', this.handleResize);
  }

  private handleScroll = () => {
    if (!this.isEnabled) return;

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    this.rafId = requestAnimationFrame(() => {
      this.updateState();
      this.notifyCallbacks();
    });

    // Clear existing timeout
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    // Set scrolling state
    this.state.isScrolling = true;

    // Reset scrolling state after delay
    this.scrollTimeout = setTimeout(() => {
      this.state.isScrolling = false;
      this.state.velocity = 0;
      this.notifyCallbacks();
    }, 150);
  };

  private handleResize = () => {
    this.updateState();
    this.notifyCallbacks();
  };

  private updateState() {
    const currentTime = Date.now();
    const currentPosition = window.pageYOffset || document.documentElement.scrollTop;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    
    // Calculate FPS
    this.frameCount++;
    if (currentTime - this.lastFPSTime >= 1000) {
      this.state.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFPSTime = currentTime;
    }
    
    // Calculate velocity
    const deltaPosition = currentPosition - this.lastPosition;
    const deltaTime = currentTime - this.lastTime;
    const velocity = deltaTime > 0 ? deltaPosition / deltaTime : 0;
    
    // Calculate smoothness based on FPS and velocity consistency
    const smoothness = Math.min(1, this.state.fps / 60) * (1 - Math.min(1, Math.abs(velocity) / 10));

    // Update state
    this.state = {
      position: currentPosition,
      progress: maxScroll > 0 ? currentPosition / maxScroll : 0,
      direction: deltaPosition >= 0 ? 'down' : 'up',
      velocity: Math.abs(velocity),
      isScrolling: this.state.isScrolling,
      fps: this.state.fps,
      smoothness: smoothness
    };

    this.lastPosition = currentPosition;
    this.lastTime = currentTime;
  }

  private notifyCallbacks() {
    // Sort callbacks by priority (higher priority first)
    const sortedCallbacks = [...this.callbacks].sort((a, b) => b.priority - a.priority);
    
    sortedCallbacks.forEach(({ callback }) => {
      try {
        callback({ ...this.state });
      } catch (error) {
        console.warn('ScrollManager callback error:', error);
      }
    });
  }

  subscribe(id: string, callback: (state: ScrollState) => void, priority = 0): () => void {
    this.callbacks.push({ id, callback, priority });
    
    // Return unsubscribe function
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb.id !== id);
    };
  }

  unsubscribe(id: string) {
    this.callbacks = this.callbacks.filter(cb => cb.id !== id);
  }

  getState(): ScrollState {
    return { ...this.state };
  }

  scrollTo(target: number | string, options: { duration?: number; easing?: string } = {}) {
    const { duration = 1000, easing = 'power2.out' } = options;
    
    let targetPosition: number;
    
    if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (!element) {
        console.warn(`ScrollManager: Element "${target}" not found`);
        return;
      }
      targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
    } else {
      targetPosition = target;
    }

    this.smoothScrollTarget = targetPosition;
    this.smoothScrollDuration = duration;
    this.smoothScrollStart = this.state.position;
    this.smoothScrollStartTime = Date.now();

    // Use GSAP for smooth scrolling if available
    if (window.gsap && window.gsap.to) {
      window.gsap.to(window, {
        scrollTo: { y: targetPosition },
        duration: duration / 1000,
        ease: easing,
        onComplete: () => {
          this.smoothScrollTarget = null;
        }
      });
    } else {
      // Custom smooth scrolling with requestAnimationFrame
      this.performSmoothScroll();
    }
  }
  
  private performSmoothScroll() {
    if (this.smoothScrollTarget === null) return;
    
    const currentTime = Date.now();
    const elapsed = currentTime - this.smoothScrollStartTime;
    const progress = Math.min(elapsed / this.smoothScrollDuration, 1);
    
    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    
    const currentPosition = this.smoothScrollStart + 
      (this.smoothScrollTarget - this.smoothScrollStart) * easeOut;
    
    window.scrollTo(0, currentPosition);
    
    if (progress < 1) {
      requestAnimationFrame(() => this.performSmoothScroll());
    } else {
      this.smoothScrollTarget = null;
    }
  }

  scrollToProgress(progress: number, options: { duration?: number; easing?: string } = {}) {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const targetPosition = progress * maxScroll;
    this.scrollTo(targetPosition, options);
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }
  
  // Enhanced scroll methods
  scrollToElement(element: HTMLElement, options: { duration?: number; offset?: number } = {}) {
    const { duration = 1000, offset = 0 } = options;
    const rect = element.getBoundingClientRect();
    const targetPosition = window.pageYOffset + rect.top + offset;
    this.scrollTo(targetPosition, { duration });
  }
  
  scrollToProgress(progress: number, options: { duration?: number } = {}) {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const targetPosition = progress * maxScroll;
    this.scrollTo(targetPosition, options);
  }
  
  // Keyboard scroll handling
  handleKeyboardScroll(event: KeyboardEvent) {
    if (!this.isEnabled) return;
    
    const scrollAmount = window.innerHeight * 0.8;
    let targetPosition = this.state.position;
    
    switch (event.key) {
      case 'ArrowDown':
      case 'PageDown':
        event.preventDefault();
        targetPosition += scrollAmount;
        break;
      case 'ArrowUp':
      case 'PageUp':
        event.preventDefault();
        targetPosition -= scrollAmount;
        break;
      case 'Home':
        event.preventDefault();
        targetPosition = 0;
        break;
      case 'End':
        event.preventDefault();
        targetPosition = document.documentElement.scrollHeight - window.innerHeight;
        break;
      case ' ':
        event.preventDefault();
        targetPosition += event.shiftKey ? -scrollAmount : scrollAmount;
        break;
      default:
        return;
    }
    
    this.scrollTo(targetPosition);
  }

  destroy() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    
    this.callbacks = [];
    
    // Remove keyboard listener
    document.removeEventListener('keydown', this.handleKeyboardScroll.bind(this));
  }
}

// Global scroll manager instance
export const scrollManager = ScrollManager.getInstance();

// Add keyboard scroll support
document.addEventListener('keydown', (e) => {
  scrollManager.handleKeyboardScroll(e);
});

// Expose to window for debugging
if (typeof window !== 'undefined') {
  (window as any).scrollManager = scrollManager;
  (window as any).getScrollY = () => scrollManager.getState().position;
  (window as any).getScrollProgress = () => scrollManager.getState().progress;
  (window as any).smoothScrollTo = (target: number) => scrollManager.scrollTo(target);
}