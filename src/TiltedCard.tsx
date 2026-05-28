import type { SpringOptions } from 'motion/react';
import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { Lock } from 'lucide-react';

interface TiltedCardProps {
    imageSrc: React.ComponentProps<'img'>['src'];
    altText?: string;
    captionText?: string;
    containerHeight?: React.CSSProperties['height'];
    containerWidth?: React.CSSProperties['width'];
    imageHeight?: React.CSSProperties['height'];
    imageWidth?: React.CSSProperties['width'];
    scaleOnHover?: number;
    rotateAmplitude?: number;
    showMobileWarning?: boolean;
    showTooltip?: boolean;
    overlayContent?: React.ReactNode;
    displayOverlayContent?: boolean;
    isCensored?: boolean;
    censoredHoverText?: string;
}

const springValues: SpringOptions = {
    damping: 30,
    stiffness: 100,
    mass: 2
};

export default function TiltedCard({
    imageSrc,
    altText = 'Tilted card image',
    captionText = '',
    containerHeight = '300px',
    containerWidth = '100%',
    imageHeight = '300px',
    imageWidth = '300px',
    scaleOnHover = 1.1,
    rotateAmplitude = 14,
    showMobileWarning = true,
    showTooltip = true,
    overlayContent = null,
    displayOverlayContent = false,
    isCensored = false,
    censoredHoverText = 'Connect with Sumedh to know more'
}: TiltedCardProps) {
    const ref = useRef<HTMLElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useMotionValue(0), springValues);
    const rotateY = useSpring(useMotionValue(0), springValues);
    const scale = useSpring(1, springValues);
    const opacity = useSpring(0);
    const rotateFigcaption = useSpring(0, {
        stiffness: 350,
        damping: 30,
        mass: 1
    });

    const [lastY, setLastY] = useState(0);

    function handleMouse(e: React.MouseEvent<HTMLElement>) {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
        const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

        rotateX.set(rotationX);
        rotateY.set(rotationY);

        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);

        const velocityY = offsetY - lastY;
        rotateFigcaption.set(-velocityY * 0.6);
        setLastY(offsetY);
    }

    function handleMouseEnter() {
        scale.set(scaleOnHover);
        opacity.set(1);
    }

    function handleMouseLeave() {
        opacity.set(0);
        scale.set(1);
        rotateX.set(0);
        rotateY.set(0);
        rotateFigcaption.set(0);
    }

    return (
        <figure
            ref={ref}
            className="relative w-full h-full [perspective:800px] flex flex-col items-center justify-center pointer-events-auto group"
            style={{
                height: containerHeight,
                width: containerWidth
            }}
            onMouseMove={handleMouse}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {showMobileWarning && (
                <div className="absolute top-4 text-center text-sm block sm:hidden text-white/40">
                    This effect is not optimized for mobile. Check on desktop.
                </div>
            )}

            <motion.div
                className="relative [transform-style:preserve-3d]"
                style={{
                    width: imageWidth,
                    height: imageHeight,
                    rotateX,
                    rotateY,
                    scale
                }}
            >
                <motion.img
                    src={imageSrc}
                    alt={altText}
                    className={`absolute top-0 left-0 object-cover rounded-[15px] will-change-transform [transform:translateZ(0)] border border-white/10 ${isCensored ? 'filter blur-[16px] brightness-[0.3] select-none pointer-events-none' : ''}`}
                    style={{
                        width: imageWidth,
                        height: imageHeight
                    }}
                />

                {isCensored && (
                    <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center p-4 text-center rounded-[15px] select-none pointer-events-none">
                        <div className="absolute inset-0 bg-black/45 rounded-[15px] backdrop-blur-[4px] border border-red-500/20 group-hover:border-[#B9FF2C]/30 transition-colors duration-500" />
                        
                        <div className="relative z-10 flex flex-col items-center justify-center gap-3 transition-all duration-500 ease-out p-2 w-full">
                            <div className="w-12 h-12 rounded-full border border-red-500/30 bg-red-950/20 text-red-400 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse group-hover:animate-none group-hover:border-[#B9FF2C]/30 group-hover:bg-[#B9FF2C]/10 group-hover:text-[#B9FF2C] group-hover:shadow-[0_0_15px_rgba(185,255,44,0.2)] transition-colors duration-500">
                                <Lock size={20} />
                            </div>
                            
                            <div className="text-center">
                                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-red-400 group-hover:text-[#B9FF2C] transition-colors duration-500 font-semibold block">
                                    NDA Secured
                                </span>
                            </div>

                            <div className="relative w-full flex flex-col items-center justify-center min-h-[90px]">
                                <h4 className="font-display text-base font-bold text-white tracking-wide transition-all duration-300 md:group-hover:opacity-0 md:group-hover:scale-95 md:absolute text-center">
                                    {altText}
                                </h4>

                                <div className="hidden md:flex opacity-0 md:group-hover:opacity-100 transition-all duration-500 scale-95 md:group-hover:scale-100 flex-col items-center justify-center text-center px-1 pointer-events-none">
                                    <p className="text-white/80 text-[11px] leading-normal font-sans font-medium max-w-[200px]">
                                        This project is under a non-disclosure agreement.
                                    </p>
                                    <p className="font-mono text-[8px] text-[#B9FF2C] font-bold tracking-wider mt-2.5 uppercase">
                                        Connect with Sumedh to know more
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {displayOverlayContent && overlayContent && !isCensored && (
                    <motion.div className="absolute top-0 left-0 z-[2] will-change-transform [transform:translateZ(30px)] w-full h-full pointer-events-none">
                        {overlayContent}
                    </motion.div>
                )}
            </motion.div>

            {showTooltip && (
                <motion.figcaption
                    className="pointer-events-none absolute left-0 top-0 rounded-[4px] bg-white px-[10px] py-[4px] text-[10px] text-[#2d2d2d] opacity-0 z-[3] hidden sm:block font-mono"
                    style={{
                        x,
                        y,
                        opacity,
                        rotate: rotateFigcaption
                    }}
                >
                    {isCensored ? censoredHoverText : captionText}
                </motion.figcaption>
            )}
        </figure>
    );
}
