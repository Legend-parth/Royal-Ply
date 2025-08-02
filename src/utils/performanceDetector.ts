interface PerformanceCapabilities {
  tier: 'high' | 'medium' | 'low';
  ram: number;
  cores: number;
  hasWebGL: boolean;
  hasWebGL2: boolean;
  maxTextureSize: number;
  fps: number;
  batteryLevel?: number;
  connectionSpeed: 'fast' | 'medium' | 'slow';
}

class PerformanceDetector {
  private capabilities: PerformanceCapabilities;
  private fpsHistory: number[] = [];
  private lastFrameTime = 0;
  private frameCount = 0;

  constructor() {
    this.capabilities = this.detectCapabilities();
    this.startFPSMonitoring();
  }

  private detectCapabilities(): PerformanceCapabilities {
    // RAM detection
    const ram = (navigator as any).deviceMemory || 4;
    
    // CPU cores detection
    const cores = navigator.hardwareConcurrency || 4;
    
    // WebGL detection
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    const gl2 = canvas.getContext('webgl2');
    const hasWebGL = !!gl;
    const hasWebGL2 = !!gl2;
    
    // Max texture size
    let maxTextureSize = 2048;
    if (gl) {
      maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    }
    
    // Connection speed estimation
    const connection = (navigator as any).connection;
    let connectionSpeed: 'fast' | 'medium' | 'slow' = 'medium';
    
    if (connection) {
      const effectiveType = connection.effectiveType;
      if (effectiveType === '4g' || effectiveType === '5g') {
        connectionSpeed = 'fast';
      } else if (effectiveType === '3g') {
        connectionSpeed = 'medium';
      } else {
        connectionSpeed = 'slow';
      }
    }
    
    // Performance tier calculation
    let tier: 'high' | 'medium' | 'low' = 'medium';
    
    if (ram >= 8 && cores >= 8 && hasWebGL2 && maxTextureSize >= 4096) {
      tier = 'high';
    } else if (ram >= 4 && cores >= 4 && hasWebGL) {
      tier = 'medium';
    } else {
      tier = 'low';
    }
    
    return {
      tier,
      ram,
      cores,
      hasWebGL,
      hasWebGL2,
      maxTextureSize,
      fps: 60,
      connectionSpeed
    };
  }

  private startFPSMonitoring() {
    const measureFPS = (currentTime: number) => {
      if (this.lastFrameTime) {
        const delta = currentTime - this.lastFrameTime;
        const fps = 1000 / delta;
        
        this.fpsHistory.push(fps);
        if (this.fpsHistory.length > 60) {
          this.fpsHistory.shift();
        }
        
        // Calculate average FPS
        const avgFPS = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
        this.capabilities.fps = avgFPS;
        
        // Auto-adjust performance tier based on FPS
        if (avgFPS < 30 && this.capabilities.tier !== 'low') {
          this.capabilities.tier = 'low';
          this.notifyPerformanceChange();
        } else if (avgFPS > 55 && this.capabilities.tier === 'low') {
          this.capabilities.tier = 'medium';
          this.notifyPerformanceChange();
        }
      }
      
      this.lastFrameTime = currentTime;
      this.frameCount++;
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }

  private notifyPerformanceChange() {
    window.dispatchEvent(new CustomEvent('performanceChange', {
      detail: this.capabilities
    }));
  }

  public getCapabilities(): PerformanceCapabilities {
    return { ...this.capabilities };
  }

  public shouldUseAnimation(animationType: 'basic' | 'advanced' | 'complex'): boolean {
    const { tier, fps } = this.capabilities;
    
    if (fps < 25) return false;
    
    switch (animationType) {
      case 'complex':
        return tier === 'high' && fps > 50;
      case 'advanced':
        return (tier === 'high' || tier === 'medium') && fps > 40;
      case 'basic':
        return fps > 30;
      default:
        return true;
    }
  }

  public getAnimationConfig() {
    const { tier, fps } = this.capabilities;
    
    const configs = {
      high: {
        particleCount: 100,
        animationDuration: 1,
        easing: 'power3.out',
        useWebGL: true,
        use3D: true,
        complexAnimations: true
      },
      medium: {
        particleCount: 50,
        animationDuration: 0.8,
        easing: 'power2.out',
        useWebGL: this.capabilities.hasWebGL,
        use3D: true,
        complexAnimations: false
      },
      low: {
        particleCount: 10,
        animationDuration: 0.5,
        easing: 'ease-out',
        useWebGL: false,
        use3D: false,
        complexAnimations: false
      }
    };
    
    return configs[tier];
  }
}

export const performanceDetector = new PerformanceDetector();
export type { PerformanceCapabilities };