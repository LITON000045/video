// Custom Video Player Controls and YouTube Integration

class VideoPlayer {
    constructor() {
        this.youtubeAPIReady = false;
        this.players = new Map();
        this.currentPlayer = null;
        this.playerDefaults = {
            autoplay: 0,
            controls: 1,
            rel: 0,
            modestbranding: 1,
            showinfo: 0,
            loop: 0,
            playlist: '',
            iv_load_policy: 3,
            fs: 1,
            cc_load_policy: 0
        };

        this.init();
    }

    init() {
        this.loadYouTubeAPI();
        this.setupVideoPreviews();
        this.setupKeyboardControls();
    }

    loadYouTubeAPI() {
        // Load YouTube IFrame API
        if (window.YT && window.YT.Player) {
            this.youtubeAPIReady = true;
            return;
        }

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // YouTube API callback
        window.onYouTubeIframeAPIReady = () => {
            this.youtubeAPIReady = true;
            console.log('YouTube API ready');
        };
    }

    createPlayer(containerId, videoId, options = {}) {
        return new Promise((resolve, reject) => {
            if (!this.youtubeAPIReady) {
                // Wait for API to be ready
                const checkAPI = setInterval(() => {
                    if (this.youtubeAPIReady) {
                        clearInterval(checkAPI);
                        this.createPlayerInstance(containerId, videoId, options, resolve, reject);
                    }
                }, 100);

                // Timeout after 10 seconds
                setTimeout(() => {
                    clearInterval(checkAPI);
                    reject(new Error('YouTube API failed to load'));
                }, 10000);
                return;
            }

            this.createPlayerInstance(containerId, videoId, options, resolve, reject);
        });
    }

    createPlayerInstance(containerId, videoId, options, resolve, reject) {
        const playerOptions = {
            ...this.playerDefaults,
            ...options,
            videoId: videoId,
            playerVars: {
                ...this.playerDefaults,
                ...options
            },
            events: {
                onReady: (event) => {
                    const player = event.target;
                    this.players.set(containerId, player);
                    this.currentPlayer = player;

                    // Setup custom controls if needed
                    if (options.customControls) {
                        this.setupCustomControls(player, containerId);
                    }

                    // Track video play
                    this.trackVideoPlay(videoId);

                    resolve(player);
                },
                onStateChange: (event) => {
                    this.handlePlayerStateChange(event, videoId);
                },
                onError: (event) => {
                    console.error('YouTube player error:', event.data);
                    this.handlePlayerError(event.data, videoId);
                    reject(new Error(`YouTube player error: ${event.data}`));
                }
            }
        };

        const player = new YT.Player(containerId, playerOptions);
    }

    setupCustomControls(player, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Create custom control overlay
        const controlsHTML = `
            <div class="custom-video-controls">
                <button class="video-control-btn play-pause-btn" title="Play/Pause">
                    <svg class="play-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                    <svg class="pause-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                        <rect x="6" y="4" width="4" height="16"/>
                        <rect x="14" y="4" width="4" height="16"/>
                    </svg>
                </button>
                <div class="video-progress">
                    <div class="video-progress-filled"></div>
                </div>
                <div class="video-time">
                    <span class="current-time">0:00</span> / <span class="total-time">0:00</span>
                </div>
                <button class="video-control-btn mute-btn" title="Mute/Unmute">
                    <svg class="volume-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                    <svg class="muted-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                </button>
                <button class="video-control-btn fullscreen-btn" title="Fullscreen">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                    </svg>
                </button>
            </div>
        `;

        const controlsDiv = document.createElement('div');
        controlsDiv.innerHTML = controlsHTML;
        controlsDiv.className = 'video-controls-wrapper';
        container.appendChild(controlsDiv);

        // Setup control event listeners
        this.setupControlEvents(player, controlsDiv);
    }

    setupControlEvents(player, controlsDiv) {
        const playPauseBtn = controlsDiv.querySelector('.play-pause-btn');
        const muteBtn = controlsDiv.querySelector('.mute-btn');
        const fullscreenBtn = controlsDiv.querySelector('.fullscreen-btn');
        const progressBar = controlsDiv.querySelector('.video-progress');

        // Play/Pause
        playPauseBtn.addEventListener('click', () => {
            const state = player.getPlayerState();
            if (state === YT.PlayerState.PLAYING) {
                player.pauseVideo();
            } else {
                player.playVideo();
            }
        });

        // Mute/Unmute
        muteBtn.addEventListener('click', () => {
            if (player.isMuted()) {
                player.unMute();
            } else {
                player.mute();
            }
        });

        // Fullscreen
        fullscreenBtn.addEventListener('click', () => {
            const iframe = player.getIframe();
            if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
            } else if (iframe.webkitRequestFullscreen) {
                iframe.webkitRequestFullscreen();
            } else if (iframe.mozRequestFullScreen) {
                iframe.mozRequestFullScreen();
            }
        });

        // Progress bar
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            const duration = player.getDuration();
            player.seekTo(duration * percent, true);
        });

        // Update controls
        this.updatePlayerControls(player, controlsDiv);
    }

    updatePlayerControls(player, controlsDiv) {
        const updateInterval = setInterval(() => {
            if (!player.getIframe()) {
                clearInterval(updateInterval);
                return;
            }

            const currentTime = player.getCurrentTime();
            const duration = player.getDuration();
            const state = player.getPlayerState();

            // Update time display
            const currentTimeEl = controlsDiv.querySelector('.current-time');
            const totalTimeEl = controlsDiv.querySelector('.total-time');
            if (currentTimeEl) currentTimeEl.textContent = this.formatTime(currentTime);
            if (totalTimeEl) totalTimeEl.textContent = this.formatTime(duration);

            // Update progress bar
            const progressBar = controlsDiv.querySelector('.video-progress-filled');
            if (progressBar && duration > 0) {
                progressBar.style.width = `${(currentTime / duration) * 100}%`;
            }

            // Update play/pause button
            const playIcon = controlsDiv.querySelector('.play-icon');
            const pauseIcon = controlsDiv.querySelector('.pause-icon');
            if (state === YT.PlayerState.PLAYING) {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            } else {
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            }

            // Update mute button
            const volumeIcon = controlsDiv.querySelector('.volume-icon');
            const mutedIcon = controlsDiv.querySelector('.muted-icon');
            if (player.isMuted()) {
                volumeIcon.style.display = 'none';
                mutedIcon.style.display = 'block';
            } else {
                volumeIcon.style.display = 'block';
                mutedIcon.style.display = 'none';
            }
        }, 100);
    }

    handlePlayerStateChange(event, videoId) {
        const state = event.data;

        switch (state) {
            case YT.PlayerState.PLAYING:
                console.log('Video playing:', videoId);
                this.trackVideoEvent('play', videoId);
                break;
            case YT.PlayerState.PAUSED:
                console.log('Video paused:', videoId);
                this.trackVideoEvent('pause', videoId);
                break;
            case YT.PlayerState.ENDED:
                console.log('Video ended:', videoId);
                this.trackVideoEvent('complete', videoId);
                this.handleVideoEnd(videoId);
                break;
            case YT.PlayerState.BUFFERING:
                console.log('Video buffering:', videoId);
                break;
            case YT.PlayerState.CUED:
                console.log('Video cued:', videoId);
                break;
        }
    }

    handlePlayerError(errorCode, videoId) {
        let errorMessage = 'An error occurred while playing the video.';

        switch (errorCode) {
            case 2:
                errorMessage = 'The video contains invalid parameters.';
                break;
            case 5:
                errorMessage = 'The video cannot be played in an HTML5 player.';
                break;
            case 100:
                errorMessage = 'This video is private or has been removed.';
                break;
            case 101:
            case 150:
                errorMessage = 'This video cannot be embedded on this website.';
                break;
        }

        console.error(`Video error for ${videoId}:`, errorMessage);
        this.showVideoError(errorMessage);
        this.trackVideoError(errorCode, videoId);
    }

    handleVideoEnd(videoId) {
        // Could implement related videos or replay functionality here
        const player = Array.from(this.players.values()).find(p =>
            p.getVideoData().video_id === videoId
        );

        if (player) {
            // Show replay button or related videos
            this.showEndScreen(player, videoId);
        }
    }

    showEndScreen(player, videoId) {
        // This could show a custom end screen with related projects
        // For now, we'll just track the completion
        this.trackVideoEvent('complete', videoId);
    }

    setupVideoPreviews() {
        // Setup hover effects for video thumbnails
        document.addEventListener('mouseover', (e) => {
            const thumbnail = e.target.closest('.featured-thumbnail, .portfolio-thumbnail');
            if (thumbnail) {
                this.showVideoPreview(thumbnail);
            }
        });

        document.addEventListener('mouseout', (e) => {
            const thumbnail = e.target.closest('.featured-thumbnail, .portfolio-thumbnail');
            if (thumbnail) {
                this.hideVideoPreview(thumbnail);
            }
        });
    }

    showVideoPreview(thumbnail) {
        // Add subtle zoom effect
        const img = thumbnail.querySelector('img');
        if (img) {
            img.style.transform = 'scale(1.05)';
        }

        // Enhance play button visibility
        const playButton = thumbnail.querySelector('.play-overlay');
        if (playButton) {
            playButton.style.opacity = '1';
        }
    }

    hideVideoPreview(thumbnail) {
        const img = thumbnail.querySelector('img');
        if (img) {
            img.style.transform = 'scale(1)';
        }

        const playButton = thumbnail.querySelector('.play-overlay');
        if (playButton) {
            playButton.style.opacity = '';
        }
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.currentPlayer || !window.portfolioApp.isModalOpen) return;

            switch (e.key) {
                case ' ':
                case 'k':
                    e.preventDefault();
                    this.togglePlay();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.seek(-10); // Seek back 10 seconds
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.seek(10); // Seek forward 10 seconds
                    break;
                case 'm':
                    e.preventDefault();
                    this.toggleMute();
                    break;
                case 'f':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    e.preventDefault();
                    this.seekToPercent(parseInt(e.key) * 10);
                    break;
            }
        });
    }

    togglePlay() {
        if (!this.currentPlayer) return;

        const state = this.currentPlayer.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
            this.currentPlayer.pauseVideo();
        } else {
            this.currentPlayer.playVideo();
        }
    }

    seek(seconds) {
        if (!this.currentPlayer) return;

        const currentTime = this.currentPlayer.getCurrentTime();
        const newTime = Math.max(0, Math.min(currentTime + seconds, this.currentPlayer.getDuration()));
        this.currentPlayer.seekTo(newTime, true);
    }

    seekToPercent(percent) {
        if (!this.currentPlayer) return;

        const duration = this.currentPlayer.getDuration();
        const targetTime = (duration * percent) / 100;
        this.currentPlayer.seekTo(targetTime, true);
    }

    toggleMute() {
        if (!this.currentPlayer) return;

        if (this.currentPlayer.isMuted()) {
            this.currentPlayer.unMute();
        } else {
            this.currentPlayer.mute();
        }
    }

    toggleFullscreen() {
        if (!this.currentPlayer) return;

        const iframe = this.currentPlayer.getIframe();
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
        } else if (iframe.webkitRequestFullscreen) {
            iframe.webkitRequestFullscreen();
        } else if (iframe.mozRequestFullScreen) {
            iframe.mozRequestFullScreen();
        }
    }

    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    showVideoError(message) {
        // Show error message in the modal
        const modalVideoContainer = document.getElementById('modalVideoContainer');
        if (modalVideoContainer) {
            modalVideoContainer.innerHTML = `
                <div class="video-error">
                    <div class="video-error-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </div>
                    <h4>Video Unavailable</h4>
                    <p>${message}</p>
                    <button class="btn btn-secondary" onclick="window.portfolioApp.closeModal()">Close</button>
                </div>
            `;
        }
    }

    // Analytics methods
    trackVideoPlay(videoId) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'video_play', {
                'video_id': videoId,
                'page_title': document.title
            });
        }
    }

    trackVideoEvent(action, videoId) {
        if (typeof gtag !== 'undefined') {
            gtag('event', `video_${action}`, {
                'video_id': videoId
            });
        }

        console.log(`Video ${action}:`, videoId);
    }

    trackVideoError(errorCode, videoId) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'video_error', {
                'video_id': videoId,
                'error_code': errorCode
            });
        }
    }

    // Public methods
    playVideo(containerId, videoId, options = {}) {
        return this.createPlayer(containerId, videoId, {
            ...options,
            autoplay: 1
        });
    }

    pauseVideo(containerId) {
        const player = this.players.get(containerId);
        if (player) {
            player.pauseVideo();
        }
    }

    stopVideo(containerId) {
        const player = this.players.get(containerId);
        if (player) {
            player.stopVideo();
        }
    }

    destroyPlayer(containerId) {
        const player = this.players.get(containerId);
        if (player) {
            player.destroy();
            this.players.delete(containerId);
        }
    }

    // Enhanced modal integration
    integrateWithModal() {
        // Override the modal opening to include video player
        const originalOpenModal = window.portfolioApp.openModal.bind(window.portfolioApp);

        window.portfolioApp.openModal = async (projectId) => {
            // Call original modal opening
            originalOpenModal(projectId);

            // Get project details
            const project = window.portfolioApp.projects.find(p => p.id === projectId);
            if (!project || !project.youtubeId) return;

            // Wait for modal to be visible
            await new Promise(resolve => setTimeout(resolve, 300));

            // Create video player
            try {
                await window.videoPlayer.playVideo('modalVideoContainer', project.youtubeId, {
                    customControls: true,
                    rel: 0,
                    modestbranding: 1,
                    showinfo: 0
                });
            } catch (error) {
                console.error('Failed to create video player:', error);
            }
        };

        // Override modal closing to destroy video player
        const originalCloseModal = window.portfolioApp.closeModal.bind(window.portfolioApp);

        window.portfolioApp.closeModal = () => {
            // Destroy video player
            window.videoPlayer.destroyPlayer('modalVideoContainer');

            // Call original modal closing
            originalCloseModal();
        };
    }
}

// Initialize video player
document.addEventListener('DOMContentLoaded', () => {
    window.videoPlayer = new VideoPlayer();

    // Integrate with modal after a short delay to ensure everything is loaded
    setTimeout(() => {
        window.videoPlayer.integrateWithModal();
    }, 1000);
});

// Handle visibility changes to pause videos when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause all videos when tab is hidden
        window.videoPlayer.players.forEach(player => {
            if (player.getPlayerState() === YT.PlayerState.PLAYING) {
                player.pauseVideo();
            }
        });
    }
});