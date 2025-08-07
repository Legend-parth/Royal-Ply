import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollState {
  position: number;
  progress: number;
  velocity: number;
  direction: 'up' | 'down';
  isScrolling: boolean;
  momentum: number;
  fps: number;
}

interface ScrollCallback {
  id: string;
  callback: (state: ScrollState) => void;
  priority: number;
}

export class SmoothScrollSystem {
  private static instance: SmoothScrollSystem;
  private callbacks: ScrollCallback[] = [];
  private state: ScrollState = {
    position: 0,
    progress: 0,
    velocity: 0,
    direction: 'down',
    isScrolling: false,
    momentum: 0,
    fps: 60
  };
  
  private lastPosition = 0;
  private lastTime = 0;
  private frameCount = 0;
  private lastFPSTime = 0;
  private rafId: number | null = null;
  private isEnabled = true;
  private momentumDecay = 0.92;
  private velocityThreshold = 0.1;
  private scrollContainer: HTMLElement | null = null;
  private contentElement: HTMLElement | null = null;
  private targetScroll = 0;
  private currentScroll = 0;
  private ease = 0.08;

  private constructor() {
    this.init();
  }

  static getInstance(): SmoothScrollSystem {
    if (!SmoothScrollSystem.instance) {
      SmoothScrollSystem.instance = new SmoothScrollSystem();
    }
    return SmoothScrollSystem.instance;
  }

  private init() {
    this.setupSmoothScrolling();
    this.bindEvents();
    this.startRenderLoop();
    this.updateScrollBounds(); // Add initial bounds update
    // Add resize observer for dynamic content
    const resizeObserver = new ResizeObserver(() => this.updateScrollBounds());
    if (this.contentElement) {
        resizeObserver.observe(this.contentElement);
    }
}

  private setupSmoothScrolling() {
    // Create smooth scroll container
    document.body.style.height = '100vh';
    document.body.style.overflow = 'hidden';
    
    // Get or create scroll container
    this.scrollContainer = document.getElementById('smooth-scroll-container');
    if (!this.scrollContainer) {
      this.scrollContainer = document.createElement('div');
      this.scrollContainer.id = 'smooth-scroll-container';
      this.scrollContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        will-change: transform;
      `;
      
      // Move all body content to scroll container
      const bodyContent = Array.from(document.body.children);
      bodyContent.forEach(child => {
        if (child !== this.scrollContainer) {
          this.scrollContainer!.appendChild(child);
        }
      });
      
      document.body.appendChild(this.scrollContainer);
    }

    this.contentElement = this.scrollContainer.firstElementChild as HTMLElement;
    if (this.contentElement) {
      this.contentElement.style.willChange = 'transform';
    }
    
    // Dynamically set body height based on content
    if (this.contentElement) {
        const contentHeight = this.contentElement.scrollHeight;
        document.body.style.height = `${contentHeight}px`;
    }
  }

  private bindEvents() {
    // Wheel events with passive listeners for performance
    window.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
    
    // Touch events for mobile
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
        this.targetScroll += deltaY * 2;
      }
      
      touchStartY = touchY;
      touchStartTime = Date.now();
    }, { passive: true });
    
    // Keyboard navigation
    window.addEventListener('keydown', this.handleKeyboard.bind(this));
    
    // Resize handler
    window.addEventListener('resize', this.updateScrollBounds.bind(this));
  }

  private handleWheel(e: WheelEvent) {
    if (!this.isEnabled) return;
    
    e.preventDefault();
    
    const delta = e.deltaY;
    const normalizedDelta = Math.sign(delta) * Math.min(Math.abs(delta), 100);
    
    this.targetScroll += normalizedDelta * 1.5;
    this.state.isScrolling = true;
    
    // Apply momentum
    this.state.momentum = normalizedDelta * 0.3;
  }

  private handleKeyboard(e: KeyboardEvent) {
    if (!this.isEnabled) return;
    
    const scrollAmount = window.innerHeight * 0.8;
    
    switch (e.key) {
      case 'ArrowDown':
      case 'PageDown':
        e.preventDefault();
        this.targetScroll += scrollAmount;
        break;
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        this.targetScroll -= scrollAmount;
        break;
      case 'Home':
        e.preventDefault();
        this.targetScroll = 0;
        break;
      case 'End':
        e.preventDefault();
        this.targetScroll = this.getMaxScroll();
        break;
      case ' ':
        e.preventDefault();
        this.targetScroll += e.shiftKey ? -scrollAmount : scrollAmount;
        break;
    }
  }

  private startRenderLoop() {
    const render = () => {
      this.updateScroll();
      this.updateState();
      this.notifyCallbacks();
      this.rafId = requestAnimationFrame(render);
    };
    render();
  }

  private updateScroll() {
    this.updateScrollBounds(); // Update bounds each frame
    if (!this.contentElement) return;
    
    const maxScroll = this.getMaxScroll();
    
    // Clamp target scroll
    this.targetScroll = Math.max(0, Math.min(this.targetScroll, maxScroll));
    
    // Apply momentum
    if (Math.abs(this.state.momentum) > this.velocityThreshold) {
      this.targetScroll += this.state.momentum;
      this.state.momentum *= this.momentumDecay;
    }
    
    // Smooth interpolation
    const diff = this.targetScroll - this.currentScroll;
    this.currentScroll += diff * this.ease;
    
    // Apply transform with GPU acceleration
    gsap.set(this.contentElement, {
      y: -this.currentScroll,
      force3D: true
    });
    
    // Update scroll state
    this.state.position = this.currentScroll;
    this.state.progress = maxScroll > 0 ? this.currentScroll / maxScroll : 0;
    
    // Check if scrolling has stopped
    if (Math.abs(diff) < 0.1 && Math.abs(this.state.momentum) < this.velocityThreshold) {
      this.state.isScrolling = false;
    }
  }

  private updateState() {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    const deltaPosition = this.currentScroll - this.lastPosition;
    
    // Calculate FPS
    this.frameCount++;
    if (currentTime - this.lastFPSTime >= 1000) {
      this.state.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFPSTime = currentTime;
    }
    
    // Calculate velocity
    if (deltaTime > 0) {
      this.state.velocity = deltaPosition / deltaTime;
      this.state.direction = deltaPosition >= 0 ? 'down' : 'up';
    }
    
    this.lastTime = currentTime;
    this.lastPosition = this.currentScroll;
  }

  private getMaxScroll(): number {
    if (!this.contentElement) return 0;
    return Math.max(0, this.contentElement.scrollHeight - window.innerHeight);
  }

  private updateScrollBounds() {
    if (this.container) {
        this.maxScroll = this.container.scrollHeight - window.innerHeight;
        document.body.style.height = `${this.container.scrollHeight}px`;
    }
  }

  // In constructor or init method
  constructor() {
    // Add resize observer for dynamic content
    const resizeObserver = new ResizeObserver(() => this.updateScrollBounds());
    if (this.contentElement) {
        resizeObserver.observe(this.contentElement);
    }
}

  public scrollTo(target: number | string | HTMLElement, options: { duration?: number; ease?: string } = {}) {
    const { duration = 1.2, ease = 'power2.out' } = options;
    
    let targetPosition: number;
    
    if (typeof target === 'number') {
      targetPosition = target;
    } else if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (!element) return;
      const rect = element.getBoundingClientRect();
      targetPosition = this.currentScroll + rect.top;
    } else {
      const rect = target.getBoundingClientRect();
      targetPosition = this.currentScroll + rect.top;
    }
    
    targetPosition = Math.max(0, Math.min(targetPosition, this.getMaxScroll()));
    
    gsap.to(this, {
      targetScroll: targetPosition,
      duration,
      ease,
      overwrite: true
    });
  }

  public subscribe(id: string, callback: (state: ScrollState) => void, priority = 0) {
    this.callbacks.push({ id, callback, priority });
    this.callbacks.sort((a, b) => b.priority - a.priority);
    
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb.id !== id);
    };
  }

  private notifyCallbacks() {
    this.callbacks.forEach(({ callback }) => {
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
    
    this.callbacks = [];
    
    // Restore normal scrolling
    document.body.style.height = '';
    document.body.style.overflow = '';
  }
}

export const smoothScrollSystem = SmoothScrollSystem.getInstance();