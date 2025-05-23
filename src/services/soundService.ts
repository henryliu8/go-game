class SoundService {
  private static sounds: { [key: string]: HTMLAudioElement } = {};
  private static initialized = false;

  static init() {
    if (this.initialized) return;
    
    try {
      this.sounds = {
        place: new Audio('/sounds/sound.mp3'),
        capture: new Audio('/sounds/sound.mp3'),
        pass: new Audio('/sounds/sound.mp3'),
        gameOver: new Audio('/sounds/sound.mp3'),
      };

      // 预加载音效
      Object.values(this.sounds).forEach(sound => {
        sound.load();
      });

      this.initialized = true;
      console.log('音效系统初始化成功');
    } catch (error) {
      console.error('音效系统初始化失败:', error);
    }
  }

  static play(soundName: 'place' | 'capture' | 'pass' | 'gameOver') {
    if (!this.initialized) {
      this.init();
    }

    const sound = this.sounds[soundName];
    if (sound) {
      try {
        sound.currentTime = 0;
        const playPromise = sound.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('播放音效失败:', error);
            // 如果是因为用户未进行交互而无法播放，则在下次点击时重试
            if (error.name === 'NotAllowedError') {
              const retry = () => {
                this.play(soundName);
                document.removeEventListener('click', retry);
              };
              document.addEventListener('click', retry);
            }
          });
        }
      } catch (error) {
        console.error('播放音效时出错:', error);
      }
    }
  }

  // 设置音量（0-1）
  static setVolume(volume: number) {
    Object.values(this.sounds).forEach(sound => {
      sound.volume = Math.max(0, Math.min(1, volume));
    });
  }

  // 禁用/启用音效
  static setMuted(muted: boolean) {
    Object.values(this.sounds).forEach(sound => {
      sound.muted = muted;
    });
  }
}

export default SoundService; 