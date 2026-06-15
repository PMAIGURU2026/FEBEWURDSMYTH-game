/**
 * WURDSMYTH Ambient Audio — Web Audio API
 * Royalty-free: generated entirely in code, no external files.
 * Plays soft relaxing pad chords while the game is open.
 */

const AudioEngine = (() => {
    let ctx = null;
    let masterGain = null;
    let isPlaying = false;
    let oscillators = [];
    let intervalId = null;

    // Relaxing C major pentatonic frequencies (Hz)
    const CHORDS = [
        [261.63, 329.63, 392.00],  // C major
        [293.66, 369.99, 440.00],  // D minor
        [349.23, 440.00, 523.25],  // F major
        [392.00, 493.88, 587.33],  // G major
    ];

    function getCtx() {
        if (!ctx) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = ctx.createGain();
            masterGain.gain.setValueAtTime(0, ctx.currentTime);
            masterGain.connect(ctx.destination);
        }
        return ctx;
    }

    function playChord(frequencies) {
        const audio = getCtx();
        const now = audio.currentTime;
        const duration = 6;

        frequencies.forEach(freq => {
            // Main oscillator — soft sine wave
            const osc = audio.createOscillator();
            const gain = audio.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            // Add subtle detune for warmth
            const osc2 = audio.createOscillator();
            const gain2 = audio.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(freq * 1.005, now);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.04, now + 1.5);
            gain.gain.linearRampToValueAtTime(0.03, now + duration - 1);
            gain.gain.linearRampToValueAtTime(0, now + duration);

            gain2.gain.setValueAtTime(0, now);
            gain2.gain.linearRampToValueAtTime(0.02, now + 1.5);
            gain2.gain.linearRampToValueAtTime(0, now + duration);

            osc.connect(gain);
            gain.connect(masterGain);
            osc2.connect(gain2);
            gain2.connect(masterGain);

            osc.start(now);
            osc.stop(now + duration);
            osc2.start(now);
            osc2.stop(now + duration);

            oscillators.push(osc, osc2);
        });
    }

    let chordIndex = 0;
    function nextChord() {
        playChord(CHORDS[chordIndex % CHORDS.length]);
        chordIndex++;
    }

    function start() {
        if (isPlaying) return;
        isPlaying = true;
        getCtx();

        // Fade master in
        masterGain.gain.cancelScheduledValues(ctx.currentTime);
        masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 2);

        if (ctx.state === 'suspended') ctx.resume();

        nextChord();
        intervalId = setInterval(nextChord, 6000);
    }

    function stop() {
        if (!isPlaying) return;
        isPlaying = false;

        masterGain.gain.cancelScheduledValues(ctx.currentTime);
        masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);

        clearInterval(intervalId);
        intervalId = null;
    }

    function toggle() {
        if (isPlaying) {
            stop();
            return false;
        } else {
            start();
            return true;
        }
    }

    function isActive() { return isPlaying; }

    return { start, stop, toggle, isActive };
})();
