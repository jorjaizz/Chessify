let ctx = null

function ensureCtx() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone({ freq = 440, endFreq = null, dur = 0.1, type = 'square', vol = 0.15, delay = 0 }) {
  const ac = ensureCtx()
  if (!ac) return
  const t0 = ac.currentTime + delay
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (endFreq) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(endFreq, 1), t0 + dur)
  }
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.008)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(gain).connect(ac.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

export const sfx = {
  click() {
    tone({ freq: 520, dur: 0.05, type: 'triangle', vol: 0.12 })
  },
  move() {
    tone({ freq: 170, endFreq: 120, dur: 0.08, type: 'triangle', vol: 0.16 })
  },
  capture() {
    tone({ freq: 130, endFreq: 55, dur: 0.16, type: 'square', vol: 0.18 })
    tone({ freq: 80, endFreq: 45, dur: 0.12, type: 'sawtooth', vol: 0.1, delay: 0.02 })
  },
  power() {
    tone({ freq: 240, endFreq: 660, dur: 0.16, type: 'sawtooth', vol: 0.14 })
    tone({ freq: 480, endFreq: 990, dur: 0.14, type: 'triangle', vol: 0.1, delay: 0.05 })
  },
  neigh() {
    tone({ freq: 700, endFreq: 1200, dur: 0.18, type: 'triangle', vol: 0.13 })
    tone({ freq: 350, endFreq: 900, dur: 0.22, type: 'sawtooth', vol: 0.08, delay: 0.06 })
  },
  dismount() {
    tone({ freq: 500, endFreq: 160, dur: 0.14, type: 'triangle', vol: 0.12 })
  },
  victory() {
    const seq = [523, 659, 784, 1046, 1318]
    seq.forEach((f, i) => tone({ freq: f, dur: 0.16, type: 'triangle', vol: 0.14, delay: i * 0.09 }))
    tone({ freq: 261, endFreq: 1046, dur: 0.4, type: 'square', vol: 0.08, delay: 0.02 })
  },
}