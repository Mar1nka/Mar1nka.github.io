(function () {

    'use strict';

    const TIME_OVER_MS = 300500;

    class Game {
        constructor () {
            this.timeOverTimerId = undefined;
            this.timeOverHandlerBind = this.timeOverHandler.bind(this);

            this.messageElement = null;

            this.audioContext = null;

            // Create a buffer for the incoming sound content
            this.audioSource = null;

            this.toggleAudioButton = null;

            this.toggleAudio = this.toggleAudio.bind(this);
            this.showGameWinMessageBind = this.showGameWinMessage.bind(this);
            this.showGameOverMessageBind = this.showGameOverMessage.bind(this);
            this.destroyBind = this.destroy.bind(this);

            this.playGround = undefined;
        }


        start () {
            this.playGround = new PlayGround();
            this.playGround.start();

            this.scheduleTimeOver();
            this.initAudio();

            this.toggleAudioButton = document.querySelector('.toggle-audio-button');

            this.toggleAudioButton.addEventListener('click', this.toggleAudio);
            window.addEventListener('hashchange', this.destroyBind);
            EventObserver.addEventListener('gameOver', this.showGameOverMessageBind);
            EventObserver.addEventListener('winning', this.showGameWinMessageBind);
        }

        restart () {
            this.playGround.start();
            this.scheduleTimeOver();
        }


        scheduleTimeOver () {
            this.timeOverTimerId = setTimeout(this.timeOverHandlerBind, TIME_OVER_MS);
        }


        timeOverHandler () {
            this.stop();
            this.showGameOverMessage();
        }


        initAudio () {
            this.audioContext = new AudioContext();

            // Create a buffer for the incoming sound content
            this.audioSource = this.audioContext.createBufferSource();

            let request = new XMLHttpRequest();

            request.open('GET', 'music/game.mp3', true);

            // Setting the responseType to arraybuffer sets up the audio decoding
            request.responseType = 'arraybuffer';

            request.onload = () => {

                this.audioContext.decodeAudioData(request.response, (buffer) => {
                    this.audioSource.buffer = buffer;

                    // Connect the audio to audioSource (multiple audio buffers can be connected!)
                    this.audioSource.connect(this.audioContext.destination);

                    // Simple setting for the buffer
                    this.audioSource.loop = true;

                    // Play the sound!
                    this.audioSource.start();
                }, function (e) {
                    console.log('Audio error! ', e);
                });
            }

            request.send();
        }

        toggleAudio () {
            if (this.audioContext) {
                if (this.audioContext.state === 'running') {
                    this.audioContext.suspend();
                    this.toggleAudioButton.classList.toggle('toggle-audio-button--disabled')
                } else if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                    this.toggleAudioButton.classList.toggle('toggle-audio-button--disabled')
                }
            }
        }

        showGameWinMessage () {
            this.showMessage('You are a winner!!!');
        }

        showGameOverMessage () {
            this.playGround.destroy();
            this.showMessage('Game over');
        }

        removeMessage () {
            if (this.messageElement) {
                this.messageElement.parentNode.removeChild(this.messageElement);
                this.messageElement = null;
            }
        }


        showMessage (message) {
            let _this = this;

            let messageTextElement = document.createElement('p');
            messageTextElement.innerText = message;

            let messageTextWrapperElement = document.createElement('div');
            messageTextWrapperElement.classList.add('game-message__text');
            messageTextWrapperElement.appendChild(messageTextElement);


            let messageMenuButtonElement = document.createElement('a');
            messageMenuButtonElement.classList.add('game-message__button');
            messageMenuButtonElement.innerText = 'menu';
            messageMenuButtonElement.href = '#main-menu';


            let messageAgainButtonElement = messageMenuButtonElement.cloneNode(true);
            messageAgainButtonElement.innerText = 'Play again';
            messageAgainButtonElement.href = '#game';

            messageAgainButtonElement.addEventListener('click', function () {
                _this.removeMessage();
                _this.restart();
            })

            let messageButtonWrapperElement = document.createElement('div');
            messageButtonWrapperElement.classList.add('game-message__button-wrapper');
            messageButtonWrapperElement.appendChild(messageMenuButtonElement);
            messageButtonWrapperElement.appendChild(messageAgainButtonElement);

            let messageElement = document.createElement('div');
            messageElement.classList.add('game-message');
            messageElement.appendChild(messageTextWrapperElement);
            messageElement.appendChild(messageButtonWrapperElement);

            document.body.appendChild(messageElement);

            this.messageElement = messageElement;
        }


        stop () {
            clearTimeout(this.timeOverTimerId);
        }


        destroy () {
            this.stop();
            this.playGround.destroy();
            this.removeMessage();

            this.toggleAudioButton.removeEventListener('click', this.toggleAudio);
            window.removeEventListener('hashchange', this.destroyBind);

            EventObserver.removeEventListener('gameOver', this.showGameOverMessageBind);
            EventObserver.removeEventListener('winning', this.showGameWinMessageBind);
            this.audioContext.close();
        }

    }

    global.Game = Game;
})();
