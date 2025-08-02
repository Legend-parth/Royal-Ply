interface DeviceCapabilities {
  tier: 'ultra-high' | 'high' | 'mid' | 'budget' | 'legacy';
  ram: number;
  cores: number;
  gpu: 'dedicated' | 'integrated' | 'basic' | 'unknown';
  refreshRate: number;
  networkSpeed: 'fast' | 'medium' | 'slow';
  batteryLevel?: number;
  isMobile: boolean;
  webglSupport: boolean;
  webgl2Support: boolean;
  maxTextureSize: number;
  performanceScore: number;
}

interface OptimizationSettings {
  animations: {
    particles: boolean;
    complex3D: boolean;
    physics: boolean;
    morphing: boolean;
    shaders: boolean;
    maxParticles: number;
    animationDuration: number;
    easing: string;
  };
  rendering: {
    useWebGL: boolean;
    useWebGL2: boolean;
    antialiasing: boolean;
    shadows: boolean;
    reflections: boolean;
    maxFPS: number;
  };
  assets: {
    imageQuality: 'ultra' | 'high' | 'medium' | 'low';
    useWebP: boolean;
    useAVIF: boolean;
    lazyLoading: boolean;
    preloadCritical: boolean;
  };
  features: {
    customCursor: boolean;
    smoothScrolling: boolean;
    backgroundEffects: boolean;
    soundVisualization: boolean;
    realTimeEffects: boolean;
  };
}

class DeviceOptimizationManager {
  private capabilities: DeviceCapabilities;
  private settings: OptimizationSettings;
  private performanceMonitor: PerformanceMonitor;
  private observers: ((settings: OptimizationSettings) => void)[] = [];

  constructor() {
    this.capabilities = this.detectCapabilities();
    this.settings = this.generateOptimizationSettings();
    this.performanceMonitor = new PerformanceMonitor();
    this.startPerformanceMonitoring();
  }

  private detectCapabilities(): DeviceCapabilities {
    // RAM Detection
    const ram = (navigator as any).deviceMemory || this.estimateRAM();
    
    // CPU Cores
    const cores = navigator.hardwareConcurrency || 4;
    
    // GPU Detection
    const gpu = this.detectGPU();
    
    // WebGL Support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    const gl2 = canvas.getContext('webgl2');
    const webglSupport = !!gl;
    const webgl2Support = !!gl2;
    
    // Max Texture Size
    let maxTextureSize = 2048;
    if (gl) {
      maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    }
    
    // Refresh Rate Detection
    const refreshRate = this.detectRefreshRate();
    
    // Network Speed
    const networkSpeed = this.detectNetworkSpeed();
    
    // Mobile Detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Battery Level (if available)
    const batteryLevel = this.getBatteryLevel();
    
    // Performance Score Calculation
    const performanceScore = this.calculatePerformanceScore({
      ram, cores, gpu, refreshRate, webglSupport, webgl2Support, maxTextureSize, isMobile
    });
    
    // Determine Tier
    const tier = this.determineTier(performanceScore, ram, cores, gpu, isMobile);
    
    return {
      tier,
      ram,
      cores,
      gpu,
      refreshRate,
      networkSpeed,
      batteryLevel,
      isMobile,
      webglSupport,
      webgl2Support,
      maxTextureSize,
      performanceScore
    };
  }

  private estimateRAM(): number {
    // Fallback RAM estimation based on other factors
    const cores = navigator.hardwareConcurrency || 4;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      return cores >= 8 ? 8 : cores >= 6 ? 6 : cores >= 4 ? 4 : 2;
    } else {
      return cores >= 16 ? 16 : cores >= 8 ? 8 : cores >= 4 ? 4 : 2;
    }
  }

  private detectGPU(): 'dedicated' | 'integrated' | 'basic' | 'unknown' {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return 'basic';
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'unknown';
    
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
    
    // Dedicated GPU indicators
    if (renderer.includes('nvidia') || renderer.includes('amd') || renderer.includes('radeon') || 
        renderer.includes('geforce') || renderer.includes('quadro') || renderer.includes('tesla')) {
      return 'dedicated';
    }
    
    // Integrated GPU indicators
    if (renderer.includes('intel') || renderer.includes('integrated') || renderer.includes('uhd') ||
        renderer.includes('iris') || renderer.includes('vega')) {
      return 'integrated';
    }
    
    return 'unknown';
  }

  private detectRefreshRate(): number {
    return new Promise<number>((resolve) => {
      let start = performance.now();
      let frames = 0;
      
      const measureFPS = () => {
        frames++;
        const now = performance.now();
        
        if (now - start >= 1000) {
          resolve(Math.round(frames * 1000 / (now - start)));
        } else {
          requestAnimationFrame(measureFPS);
        }
      };
      
      requestAnimationFrame(measureFPS);
    }).then(fps => fps).catch(() => 60); // Default to 60Hz
  }

  private detectNetworkSpeed(): 'fast' | 'medium' | 'slow' {
    const connection = (navigator as any).connection;
    if (!connection) return 'medium';
    
    const effectiveType = connection.effectiveType;
    if (effectiveType === '4g' || effectiveType === '5g') return 'fast';
    if (effectiveType === '3g') return 'medium';
    return 'slow';
  }

  private getBatteryLevel(): number | undefined {
    return new Promise<number | undefined>((resolve) => {
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          resolve(battery.level);
        }).catch(() => resolve(undefined));
      } else {
        resolve(undefined);
      }
    }).then(level => level).catch(() => undefined);
  }

  private calculatePerformanceScore(params: any): number {
    let score = 0;
    
    // RAM Score (0-30 points)
    score += Math.min(30, params.ram * 2);
    
    // CPU Score (0-20 points)
    score += Math.min(20, params.cores * 2);
    
    // GPU Score (0-25 points)
    if (params.gpu === 'dedicated') score += 25;
    else if (params.gpu === 'integrated') score += 15;
    else if (params.gpu === 'basic') score += 5;
    
    // WebGL Score (0-15 points)
    if (params.webgl2Support) score += 15;
    else if (params.webglSupport) score += 10;
    
    // Refresh Rate Score (0-10 points)
    score += Math.min(10, params.refreshRate / 12);
    
    // Mobile Penalty
    if (params.isMobile) score *= 0.7;
    
    return Math.round(score);
  }

  private determineTier(score: number, ram: number, cores: number, gpu: string, isMobile: boolean): DeviceCapabilities['tier'] {
    if (score >= 80 && ram >= 16 && cores >= 8 && gpu === 'dedicated' && !isMobile) {
      return 'ultra-high';
    } else if (score >= 60 && ram >= 8 && cores >= 4 && (gpu === 'dedicated' || gpu === 'integrated')) {
      return 'high';
    } else if (score >= 40 && ram >= 4 && cores >= 4) {
      return 'mid';
    } else if (score >= 20 && ram >= 2) {
      return 'budget';
    } else {
      return 'legacy';
    }
  }

  private generateOptimizationSettings(): OptimizationSettings {
    const { tier, isMobile, webglSupport, webgl2Support, refreshRate, batteryLevel } = this.capabilities;
    
    // Base settings for each tier
    const tierSettings = {
      'ultra-high': {
        animations: {
          particles: true,
          complex3D: true,
          physics: true,
          morphing: true,
          shaders: true,
          maxParticles: 200,
          animationDuration: 1.0,
          easing: 'power3.out'
        },
        rendering: {
          useWebGL: true,
          useWebGL2: webgl2Support,
          antialiasing: true,
          shadows: true,
          reflections: true,
          maxFPS: Math.min(refreshRate, 120)
        },
        assets: {
          imageQuality: 'ultra' as const,
          useWebP: true,
          useAVIF: true,
          lazyLoading: true,
          preloadCritical: true
        },
        features: {
          customCursor: true,
          smoothScrolling: true,
          backgroundEffects: true,
          soundVisualization: true,
          realTimeEffects: true
        }
      },
      'high': {
        animations: {
          particles: true,
          complex3D: true,
          physics: true,
          morphing: false,
          shaders: false,
          maxParticles: 100,
          animationDuration: 0.8,
          easing: 'power2.out'
        },
        rendering: {
          useWebGL: webglSupport,
          useWebGL2: false,
          antialiasing: true,
          shadows: true,
          reflections: false,
          maxFPS: Math.min(refreshRate, 60)
        },
        assets: {
          imageQuality: 'high' as const,
          useWebP: true,
          useAVIF: false,
          lazyLoading: true,
          preloadCritical: true
        },
        features: {
          customCursor: !isMobile,
          smoothScrolling: true,
          backgroundEffects: true,
          soundVisualization: true,
          realTimeEffects: false
        }
      },
      'mid': {
        animations: {
          particles: true,
          complex3D: false,
          physics: false,
          morphing: false,
          shaders: false,
          maxParticles: 50,
          animationDuration: 0.6,
          easing: 'power2.out'
        },
        rendering: {
          useWebGL: webglSupport,
          useWebGL2: false,
          antialiasing: false,
          shadows: false,
          reflections: false,
          maxFPS: 60
        },
        assets: {
          imageQuality: 'medium' as const,
          useWebP: true,
          useAVIF: false,
          lazyLoading: true,
          preloadCritical: false
        },
        features: {
          customCursor: !isMobile,
          smoothScrolling: true,
          backgroundEffects: false,
          soundVisualization: false,
          realTimeEffects: false
        }
      },
      'budget': {
        animations: {
          particles: false,
          complex3D: false,
          physics: false,
          morphing: false,
          shaders: false,
          maxParticles: 20,
          animationDuration: 0.4,
          easing: 'ease-out'
        },
        rendering: {
          useWebGL: false,
          useWebGL2: false,
          antialiasing: false,
          shadows: false,
          reflections: false,
          maxFPS: 30
        },
        assets: {
          imageQuality: 'low' as const,
          useWebP: false,
          useAVIF: false,
          lazyLoading: true,
          preloadCritical: false
        },
        features: {
          customCursor: false,
          smoothScrolling: false,
          backgroundEffects: false,
          soundVisualization: false,
          realTimeEffects: false
        }
      },
      'legacy': {
        animations: {
          particles: false,
          complex3D: false,
          physics: false,
          morphing: false,
          shaders: false,
          maxParticles: 0,
          animationDuration: 0.2,
          easing: 'ease'
        },
        rendering: {
          useWebGL: false,
          useWebGL2: false,
          antialiasing: false,
          shadows: false,
          reflections: false,
          maxFPS: 30
        },
        assets: {
          imageQuality: 'low' as const,
          useWebP: false,
          useAVIF: false,
          lazyLoading: false,
          preloadCritical: false
        },
        features: {
          customCursor: false,
          smoothScrolling: false,
          backgroundEffects: false,
          soundVisualization: false,
          realTimeEffects: false
        }
      }
    };

    let settings = { ...tierSettings[tier] };
    
    // Battery-based adjustments
    if (batteryLevel && batteryLevel < 0.2) {
      settings.animations.maxParticles = Math.floor(settings.animations.maxParticles * 0.5);
      settings.rendering.maxFPS = Math.min(settings.rendering.maxFPS, 30);
      settings.features.backgroundEffects = false;
    }
    
    return settings;
  }

  private startPerformanceMonitoring() {
    this.performanceMonitor.onPerformanceChange((metrics) => {
      // Adjust settings based on real-time performance
      if (metrics.averageFPS < 30 && this.settings.animations.maxParticles > 10) {
        this.settings.animations.maxParticles = Math.floor(this.settings.animations.maxParticles * 0.8);
        this.notifyObservers();
      }
      
      if (metrics.memoryUsage > 0.8) {
        this.settings.features.backgroundEffects = false;
        this.settings.animations.particles = false;
        this.notifyObservers();
      }
    });
  }

  public getCapabilities(): DeviceCapabilities {
    return { ...this.capabilities };
  }

  public getSettings(): OptimizationSettings {
    return { ...this.settings };
  }

  public subscribe(callback: (settings: OptimizationSettings) => void) {
    this.observers.push(callback);
    return () => {
      this.observers = this.observers.filter(obs => obs !== callback);
    };
  }

  private notifyObservers() {
    this.observers.forEach(callback => callback({ ...this.settings }));
  }

  public forceRecalibration() {
    this.capabilities = this.detectCapabilities();
    this.settings = this.generateOptimizationSettings();
    this.notifyObservers();
  }
}

class PerformanceMonitor {
  private metrics = {
    averageFPS: 60,
    memoryUsage: 0,
    cpuUsage: 0,
    frameDrops: 0
  };
  
  private callbacks: ((metrics: typeof this.metrics) => void)[] = [];
  private isMonitoring = false;

  constructor() {
    this.startMonitoring();
  }

  private startMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    let frameCount = 0;
    let lastTime = performance.now();
    let fpsHistory: number[] = [];

    const monitor = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      
      if (deltaTime >= 1000) {
        const fps = (frameCount * 1000) / deltaTime;
        fpsHistory.push(fps);
        
        if (fpsHistory.length > 10) {
          fpsHistory.shift();
        }
        
        this.metrics.averageFPS = fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length;
        
        // Memory usage estimation
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          this.metrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        }
        
        this.notifyCallbacks();
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      frameCount++;
      
      if (this.isMonitoring) {
        requestAnimationFrame(monitor);
      }
    };

    requestAnimationFrame(monitor);
  }

  public onPerformanceChange(callback: (metrics: typeof this.metrics) => void) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  private notifyCallbacks() {
    this.callbacks.forEach(callback => callback({ ...this.metrics }));
  }

  public destroy() {
    this.isMonitoring = false;
    this.callbacks = [];
  }
}

export const deviceOptimization = new DeviceOptimizationManager();
export type { DeviceCapabilities, OptimizationSettings };