interface DeviceCapabilities {
  tier: 'premium' | 'standard' | 'essential';
  ram: number;
  cores: number;
  gpu: 'dedicated' | 'integrated' | 'basic' | 'unknown';
  refreshRate: number;
  networkSpeed: 'fast' | 'medium' | 'slow';
  batteryLevel?: number;
  isMobile: boolean;
  isTablet: boolean;
  webglSupport: boolean;
  webgl2Support: boolean;
  maxTextureSize: number;
  performanceScore: number;
  pixelRatio: number;
  screenSize: { width: number; height: number };
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
    parallax: boolean;
  };
  rendering: {
    useWebGL: boolean;
    useWebGL2: boolean;
    antialiasing: boolean;
    shadows: boolean;
    reflections: boolean;
    maxFPS: number;
    quality: 'ultra' | 'high' | 'medium' | 'low';
  };
  assets: {
    imageQuality: 'ultra' | 'high' | 'medium' | 'low';
    useWebP: boolean;
    useAVIF: boolean;
    lazyLoading: boolean;
    preloadCritical: boolean;
    compressionLevel: number;
  };
  features: {
    customCursor: boolean;
    smoothScrolling: boolean;
    backgroundEffects: boolean;
    soundVisualization: boolean;
    realTimeEffects: boolean;
    advancedLoader: boolean;
  };
  performance: {
    targetFPS: number;
    memoryLimit: number;
    batteryOptimization: boolean;
    adaptiveQuality: boolean;
  };
}

class DeviceCapabilityDetector {
  private static instance: DeviceCapabilityDetector;
  private capabilities: DeviceCapabilities;
  private settings: OptimizationSettings;
  private performanceMonitor: PerformanceMonitor;
  private observers: ((settings: OptimizationSettings) => void)[] = [];

  private constructor() {
    this.capabilities = this.detectCapabilities();
    this.settings = this.generateOptimizationSettings();
    this.performanceMonitor = new PerformanceMonitor();
    this.startPerformanceMonitoring();
  }

  static getInstance(): DeviceCapabilityDetector {
    if (!DeviceCapabilityDetector.instance) {
      DeviceCapabilityDetector.instance = new DeviceCapabilityDetector();
    }
    return DeviceCapabilityDetector.instance;
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
    
    // Screen and Device Info
    const pixelRatio = window.devicePixelRatio || 1;
    const screenSize = {
      width: window.screen.width,
      height: window.screen.height
    };
    
    // Device Type Detection
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?=.*Mobile)|Tablet/i.test(userAgent) && !/Mobile/i.test(userAgent);
    
    // Refresh Rate Detection
    const refreshRate = this.detectRefreshRate();
    
    // Network Speed
    const networkSpeed = this.detectNetworkSpeed();
    
    // Battery Level (if available)
    const batteryLevel = this.getBatteryLevel();
    
    // Performance Score Calculation
    const performanceScore = this.calculatePerformanceScore({
      ram, cores, gpu, refreshRate, webglSupport, webgl2Support, 
      maxTextureSize, isMobile, isTablet, pixelRatio, screenSize
    });
    
    // Determine Tier
    const tier = this.determineTier(performanceScore, ram, cores, gpu, isMobile, isTablet);
    
    return {
      tier,
      ram,
      cores,
      gpu,
      refreshRate,
      networkSpeed,
      batteryLevel,
      isMobile,
      isTablet,
      webglSupport,
      webgl2Support,
      maxTextureSize,
      performanceScore,
      pixelRatio,
      screenSize
    };
  }

  private estimateRAM(): number {
    const cores = navigator.hardwareConcurrency || 4;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      return cores >= 8 ? 8 : cores >= 6 ? 6 : cores >= 4 ? 4 : 2;
    } else {
      return cores >= 16 ? 32 : cores >= 8 ? 16 : cores >= 4 ? 8 : 4;
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
        renderer.includes('geforce') || renderer.includes('quadro') || renderer.includes('tesla') ||
        renderer.includes('rtx') || renderer.includes('gtx')) {
      return 'dedicated';
    }
    
    // Integrated GPU indicators
    if (renderer.includes('intel') || renderer.includes('integrated') || renderer.includes('uhd') ||
        renderer.includes('iris') || renderer.includes('vega') || renderer.includes('apple')) {
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
          const fps = Math.round(frames * 1000 / (now - start));
          resolve(Math.min(fps, 144)); // Cap at 144Hz
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
    const downlink = connection.downlink;
    
    if (effectiveType === '4g' || effectiveType === '5g' || downlink > 10) return 'fast';
    if (effectiveType === '3g' || downlink > 1.5) return 'medium';
    return 'slow';
  }

  private getBatteryLevel(): Promise<number | undefined> {
    return new Promise<number | undefined>((resolve) => {
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          resolve(battery.level);
        }).catch(() => resolve(undefined));
      } else {
        resolve(undefined);
      }
    });
  }

  private calculatePerformanceScore(params: any): number {
    let score = 0;
    
    // RAM Score (0-25 points)
    score += Math.min(25, params.ram * 2);
    
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
    
    // Screen Resolution Score (0-5 points)
    const totalPixels = params.screenSize.width * params.screenSize.height * params.pixelRatio;
    if (totalPixels > 8000000) score += 5; // 4K+
    else if (totalPixels > 2000000) score += 3; // 1080p+
    else if (totalPixels > 1000000) score += 1; // 720p+
    
    // Mobile/Tablet Penalty
    if (params.isMobile) score *= 0.6;
    else if (params.isTablet) score *= 0.8;
    
    return Math.round(score);
  }

  private determineTier(
    score: number, 
    ram: number, 
    cores: number, 
    gpu: string, 
    isMobile: boolean, 
    isTablet: boolean
  ): DeviceCapabilities['tier'] {
    if (score >= 80 && ram >= 16 && cores >= 8 && gpu === 'dedicated' && !isMobile) {
      return 'premium';
    } else if (score >= 50 && ram >= 8 && cores >= 4 && (gpu === 'dedicated' || gpu === 'integrated')) {
      return 'standard';
    } else {
      return 'essential';
    }
  }

  private generateOptimizationSettings(): OptimizationSettings {
    const { tier, isMobile, isTablet, webglSupport, webgl2Support, refreshRate, batteryLevel } = this.capabilities;
    
    const tierSettings = {
      premium: {
        animations: {
          particles: true,
          complex3D: true,
          physics: true,
          morphing: true,
          shaders: true,
          maxParticles: 200,
          animationDuration: 1.0,
          easing: 'power3.out',
          parallax: true
        },
        rendering: {
          useWebGL: true,
          useWebGL2: webgl2Support,
          antialiasing: true,
          shadows: true,
          reflections: true,
          maxFPS: Math.min(refreshRate, 120),
          quality: 'ultra' as const
        },
        assets: {
          imageQuality: 'ultra' as const,
          useWebP: true,
          useAVIF: true,
          lazyLoading: true,
          preloadCritical: true,
          compressionLevel: 0.9
        },
        features: {
          customCursor: !isMobile,
          smoothScrolling: true,
          backgroundEffects: true,
          soundVisualization: true,
          realTimeEffects: true,
          advancedLoader: true
        },
        performance: {
          targetFPS: 60,
          memoryLimit: 512,
          batteryOptimization: false,
          adaptiveQuality: true
        }
      },
      standard: {
        animations: {
          particles: true,
          complex3D: false,
          physics: true,
          morphing: false,
          shaders: false,
          maxParticles: 100,
          animationDuration: 0.8,
          easing: 'power2.out',
          parallax: true
        },
        rendering: {
          useWebGL: webglSupport,
          useWebGL2: false,
          antialiasing: true,
          shadows: false,
          reflections: false,
          maxFPS: Math.min(refreshRate, 60),
          quality: 'high' as const
        },
        assets: {
          imageQuality: 'high' as const,
          useWebP: true,
          useAVIF: false,
          lazyLoading: true,
          preloadCritical: true,
          compressionLevel: 0.8
        },
        features: {
          customCursor: !isMobile,
          smoothScrolling: true,
          backgroundEffects: true,
          soundVisualization: false,
          realTimeEffects: false,
          advancedLoader: true
        },
        performance: {
          targetFPS: 60,
          memoryLimit: 256,
          batteryOptimization: isMobile,
          adaptiveQuality: true
        }
      },
      essential: {
        animations: {
          particles: false,
          complex3D: false,
          physics: false,
          morphing: false,
          shaders: false,
          maxParticles: 20,
          animationDuration: 0.5,
          easing: 'ease-out',
          parallax: false
        },
        rendering: {
          useWebGL: false,
          useWebGL2: false,
          antialiasing: false,
          shadows: false,
          reflections: false,
          maxFPS: 30,
          quality: 'low' as const
        },
        assets: {
          imageQuality: 'low' as const,
          useWebP: false,
          useAVIF: false,
          lazyLoading: true,
          preloadCritical: false,
          compressionLevel: 0.6
        },
        features: {
          customCursor: false,
          smoothScrolling: false,
          backgroundEffects: false,
          soundVisualization: false,
          realTimeEffects: false,
          advancedLoader: false
        },
        performance: {
          targetFPS: 30,
          memoryLimit: 128,
          batteryOptimization: true,
          adaptiveQuality: false
        }
      }
    };

    let settings = { ...tierSettings[tier] };
    
    // Battery-based adjustments
    if (batteryLevel && batteryLevel < 0.2) {
      settings.animations.maxParticles = Math.floor(settings.animations.maxParticles * 0.3);
      settings.rendering.maxFPS = Math.min(settings.rendering.maxFPS, 30);
      settings.features.backgroundEffects = false;
      settings.performance.batteryOptimization = true;
    }
    
    return settings;
  }

  private startPerformanceMonitoring() {
    this.performanceMonitor.onPerformanceChange((metrics) => {
      // Adjust settings based on real-time performance
      if (metrics.averageFPS < 30 && this.settings.animations.maxParticles > 10) {
        this.settings.animations.maxParticles = Math.floor(this.settings.animations.maxParticles * 0.7);
        this.notifyObservers();
      }
      
      if (metrics.memoryUsage > 0.8) {
        this.settings.features.backgroundEffects = false;
        this.settings.animations.particles = false;
        this.notifyObservers();
      }
      
      // Adaptive quality based on FPS
      if (metrics.averageFPS < 45 && this.settings.rendering.quality !== 'low') {
        const qualityLevels = ['ultra', 'high', 'medium', 'low'];
        const currentIndex = qualityLevels.indexOf(this.settings.rendering.quality);
        if (currentIndex < qualityLevels.length - 1) {
          this.settings.rendering.quality = qualityLevels[currentIndex + 1] as any;
          this.notifyObservers();
        }
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
    frameDrops: 0,
    renderTime: 0
  };
  
  private callbacks: ((metrics: typeof this.metrics) => void)[] = [];
  private isMonitoring = false;
  private frameCount = 0;
  private lastTime = 0;
  private fpsHistory: number[] = [];

  constructor() {
    this.startMonitoring();
  }

  private startMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    const monitor = (currentTime: number) => {
      if (this.lastTime) {
        const deltaTime = currentTime - this.lastTime;
        const fps = 1000 / deltaTime;
        
        this.fpsHistory.push(fps);
        if (this.fpsHistory.length > 60) { // Keep last 60 frames
          this.fpsHistory.shift();
        }
        
        this.metrics.averageFPS = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
        this.metrics.renderTime = deltaTime;
        
        // Memory usage estimation
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          this.metrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        }
        
        // Frame drops detection
        if (fps < 45) {
          this.metrics.frameDrops++;
        }
        
        this.notifyCallbacks();
      }
      
      this.lastTime = currentTime;
      this.frameCount++;
      
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
    // Only notify every 30 frames to avoid spam
    if (this.frameCount % 30 === 0) {
      this.callbacks.forEach(callback => callback({ ...this.metrics }));
    }
  }

  public getMetrics() {
    return { ...this.metrics };
  }

  public destroy() {
    this.isMonitoring = false;
    this.callbacks = [];
  }
}

export const deviceCapabilityDetector = DeviceCapabilityDetector.getInstance();
export type { DeviceCapabilities, OptimizationSettings };