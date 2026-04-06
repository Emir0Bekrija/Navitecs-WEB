import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "motion/react";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Start cursor at center of screen to prevent jumping if mouse isn't detected yet
  const cursorX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const cursorY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);

  // Smooth trailing effect
  const springConfig = { damping: 40, stiffness: 600, mass: 0.1 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [isVisible, cursorX, cursorY]);

  // Creates a spotlight effect: 100% opacity in a circle around the mouse, fading out to 15% opacity everywhere else.
  const maskImage = useMotionTemplate`radial-gradient(circle 600px at ${cursorXSpring}px ${cursorYSpring}px, black 0%, rgba(0,0,0,0.1) 100%)`;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* 
        This is the global full-screen background effect.
        We apply the motion template mask here so that the background stays static,
        but the visibility window (spotlight) follows the mouse pointer.
      */}
      <motion.div 
        className="absolute inset-0 w-full h-full opacity-100"
        style={{
          maskImage,
          WebkitMaskImage: maskImage,
        }}
      >
        {/* Animated grid/blueprint lines filling the infinite space */}
        <motion.div 
          animate={{ 
            backgroundPosition: ["0px 0px", "64px 64px"],
          }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute inset-0 w-[200vw] h-[200vh] -left-[50vw] -top-[50vh]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px),
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px, 64px 64px, 16px 16px, 16px 16px",
          }}
        />

        {/* Huge global architectural rotating elements centered on the screen */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 240, ease: "linear" }}
          className="absolute top-1/2 left-1/2 w-[2400px] h-[2400px] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center mix-blend-screen"
        >
          {/* Concentric rings and large blueprint crosshairs */}
          <div className="absolute w-[1200px] h-[1200px] border-[2px] border-white/10 rounded-full" />
          <div className="absolute w-[800px] h-[800px] border border-dashed border-white/20 rounded-full" />
          
          <div className="absolute w-full h-[2px] bg-white/10" />
          <div className="absolute w-[2px] h-full bg-white/10" />
        </motion.div>
      </motion.div>
    </div>
  );
}
