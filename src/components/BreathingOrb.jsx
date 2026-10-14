import { useEffect, useRef } from 'react'
import { MOODS } from '../theme.js'

export default function BreathingOrb({ mood='neutral', listening=false, thinking=false, speaking=false, aboutToSpeak=false, size=120, onClick }) {
  const canvasRef = useRef(null)
  const animRef   = useRef(null)
  const t         = useRef(0)
  const p         = MOODS[mood] || MOODS.neutral

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr; canvas.height = size * dpr
    ctx.scale(dpr, dpr)
    const cx = size/2, cy = size/2

    const draw = () => {
      ctx.clearRect(0, 0, size, size)
      const tick = t.current
      const bSpd  = speaking?0.07:aboutToSpeak?0.055:thinking?0.05:listening?0.032:0.013
      const bAmp  = speaking?0.14:aboutToSpeak?0.10:thinking?0.10:listening?0.07:0.038
      const wob   = speaking?0.12:aboutToSpeak?0.08:thinking?0.09:listening?0.055:0.024
      const breathe = 1+Math.sin(tick*bSpd*60)*bAmp
      const r = size*0.36*breathe

      // Glow layers
      const layers = speaking?5:aboutToSpeak?4:3
      for (let i=layers;i>=1;i--) {
        const gr=ctx.createRadialGradient(cx,cy,r*0.35,cx,cy,r*(1+i*0.3))
        gr.addColorStop(0,p.glow.replace(/[\d.]+\)$/,`${(speaking?0.14:0.08)/i})`))
        gr.addColorStop(1,'transparent')
        ctx.beginPath();ctx.arc(cx,cy,r*(1+i*0.3),0,Math.PI*2);ctx.fillStyle=gr;ctx.fill()
      }

      // Blob
      ctx.save();ctx.translate(cx,cy);ctx.beginPath()
      for (let i=0;i<=12;i++) {
        const angle=(i/12)*Math.PI*2
        const noise=1+Math.sin(tick*0.020*60+i*1.3)*wob+Math.cos(tick*0.013*60+i*2.1)*wob*0.6+(speaking?Math.sin(tick*0.09*60+i*0.7)*0.05:0)
        const px=Math.cos(angle)*r*noise,py=Math.sin(angle)*r*noise
        i===0?ctx.moveTo(px,py):ctx.lineTo(px,py)
      }
      ctx.closePath()
      const g=ctx.createRadialGradient(-r*0.22,-r*0.28,0,0,0,r*1.15)
      g.addColorStop(0,p.orb[0]);g.addColorStop(0.5,p.orb[1]);g.addColorStop(1,p.orb[2])
      ctx.fillStyle=g;ctx.shadowBlur=speaking?45:aboutToSpeak?35:26;ctx.shadowColor=p.glow;ctx.fill()
      const sh=ctx.createRadialGradient(-r*0.3,-r*0.35,0,-r*0.1,-r*0.1,r*0.62)
      sh.addColorStop(0,`rgba(255,255,255,${0.16+Math.sin(tick*0.03*60)*0.07})`);sh.addColorStop(1,'transparent')
      ctx.fillStyle=sh;ctx.fill();ctx.restore()

      // Speaking waves
      if (speaking||aboutToSpeak) {
        for (let i=0;i<(speaking?4:2);i++) {
          const spd=speaking?0.028:0.018,prog=(tick*spd*60+i*14)%14/14
          const wR=r*(1.18+i*0.2+prog*0.65),a=(speaking?0.24:0.12)*(1-prog)
          ctx.beginPath();ctx.arc(cx,cy,wR,0,Math.PI*2)
          ctx.strokeStyle=`${p.accent}${Math.round(Math.max(0,a)*255).toString(16).padStart(2,'0')}`
          ctx.lineWidth=speaking?1.5:1;ctx.stroke()
        }
      }

      // Listening ripples
      if (listening&&!speaking) {
        for (let i=0;i<3;i++) {
          const prog=(tick*0.018*60+i*18)%18/18
          ctx.beginPath();ctx.arc(cx,cy,r*(1.2+i*0.22+prog*0.7),0,Math.PI*2)
          ctx.strokeStyle=`${p.accent}${Math.round(0.18*(1-prog)*255).toString(16).padStart(2,'0')}`
          ctx.lineWidth=1;ctx.stroke()
        }
      }

      // Thinking particles
      if (thinking&&!speaking) {
        for (let i=0;i<7;i++) {
          const angle=(i/7)*Math.PI*2+tick*0.022*60
          ctx.beginPath();ctx.arc(cx+Math.cos(angle)*r*(1.4+Math.sin(tick*0.04*60+i)*0.15),cy+Math.sin(angle)*r*(1.4+Math.sin(tick*0.04*60+i)*0.15),2.2+Math.sin(tick*0.055*60+i*1.5),0,Math.PI*2)
          ctx.fillStyle=`${p.accent}cc`;ctx.shadowBlur=10;ctx.shadowColor=p.glow;ctx.fill()
        }
      }

      // Idle sparkles
      if (!speaking&&!listening&&!thinking&&!aboutToSpeak) {
        for (let i=0;i<4;i++) {
          const phase=(tick*0.007*60+i*18)%18/18
          if (phase<0.2) {
            const a=phase<0.1?phase/0.1:(0.2-phase)/0.1
            ctx.beginPath();ctx.arc(cx+Math.cos((i/4)*Math.PI*2+tick*0.003*60)*r*(0.65+phase*0.9),cy+Math.sin((i/4)*Math.PI*2+tick*0.003*60)*r*(0.65+phase*0.9),1.8,0,Math.PI*2)
            ctx.fillStyle=`rgba(255,255,255,${a*0.5})`;ctx.fill()
          }
        }
      }

      // Pre-speech pulse
      if (aboutToSpeak) {
        const pulse=(Math.sin(tick*0.08*60)+1)/2
        ctx.beginPath();ctx.arc(cx,cy,r*1.08,0,Math.PI*2)
        ctx.strokeStyle=`${p.accent}${Math.round(pulse*90).toString(16).padStart(2,'0')}`
        ctx.lineWidth=2.5;ctx.stroke()
      }

      t.current++;animRef.current=requestAnimationFrame(draw)
    }
    draw()
    return ()=>cancelAnimationFrame(animRef.current)
  },[mood,listening,thinking,speaking,aboutToSpeak,size])

  return <canvas ref={canvasRef} onClick={onClick} style={{width:size,height:size,filter:'blur(0.2px)',display:'block',cursor:onClick?'pointer':'default'}} />
}
