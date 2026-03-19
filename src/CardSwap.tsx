/* eslint-disable react-hooks/refs */
import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef
} from 'react';
import gsap from 'gsap';

export interface CardSwapRef {
  bringToFront: (index: number) => void;
}

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  onCardClick?: (idx: number) => void;
  onFrontChange?: (frontIndex: number) => void;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
  containerClassName?: string;
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute top-1/2 left-1/2 rounded-xl border border-white bg-black [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
  />
));
Card.displayName = 'Card';

interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

const CardSwap = forwardRef<CardSwapRef, CardSwapProps>(function CardSwap(
  {
    width = 500,
    height = 400,
    cardDistance = 60,
    verticalDistance = 70,
    onCardClick,
    onFrontChange,
    skewAmount = 6,
    easing = 'elastic',
    containerClassName = '',
    children
  },
  ref
) {
  const config =
    easing === 'elastic'
      ? {
        ease: 'elastic.out(0.6,0.9)' as const,
        durDrop: 2,
        durMove: 2,
        durReturn: 2,
        promoteOverlap: 0.9,
        returnDelay: 0.05
      }
      : {
        ease: 'power1.inOut' as const,
        durMove: 0.8,
      };

  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
  const cardElementsRef = useRef<Array<HTMLDivElement | null>>([]);

  const order = useRef<number[]>(Array.from({ length: childArr.length }, (_, i) => i));

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const container = useRef<HTMLDivElement>(null);

  const bringToFront = useCallback(
    (clickedIdx: number) => {
      const total = childArr.length;
      const currentOrder = order.current;
      if (currentOrder[0] === clickedIdx) {
        onCardClick?.(clickedIdx);
        return;
      }
      onFrontChange?.(clickedIdx);
      tlRef.current?.kill();
      const newOrder = [clickedIdx, ...currentOrder.filter((i) => i !== clickedIdx)];
      const tl = gsap.timeline();
      tlRef.current = tl;
      for (let i = 0; i < total; i++) {
        const cardIdx = newOrder[i];
        const el = cardElementsRef.current[cardIdx];
        if (!el) continue;
        const slot = makeSlot(i, cardDistance, verticalDistance, total);
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            zIndex: slot.zIndex,
            duration: config.durMove,
            ease: config.ease
          },
          i * 0.05
        );
      }
      tl.call(() => {
        order.current = newOrder;
      });
      onCardClick?.(clickedIdx);
    },
    [childArr.length, cardDistance, verticalDistance, config.durMove, config.ease, onCardClick, onFrontChange]
  );

  useImperativeHandle(ref, () => ({ bringToFront }), [bringToFront]);

  useEffect(() => {
    order.current = Array.from({ length: childArr.length }, (_, i) => i);
  }, [childArr.length]);

  useEffect(() => {
    const total = childArr.length;
    const nextElements = Array.from({ length: childArr.length }, (_, i) =>
      container.current?.querySelector(`[data-card-swap-index="${i}"]`) as HTMLDivElement | null
    );
    cardElementsRef.current = nextElements;

    nextElements.forEach((cardElement, i) => {
      if (!cardElement) return;
      placeNow(cardElement, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
    });
    onFrontChange?.(order.current[0]);
  }, [childArr.length, cardDistance, verticalDistance, skewAmount, onFrontChange]);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
        key: i,
        'data-card-swap-index': i,
        style: { width, height, ...(child.props.style ?? {}) },
        onClick: (e: React.MouseEvent<HTMLDivElement>) => {
          e.stopPropagation();
          child.props.onClick?.(e);
          bringToFront(i);
        }
      } as CardProps)
      : child
  );

  const baseContainerClass =
    'absolute bottom-0 right-0 transform translate-x-[5%] translate-y-[20%] origin-bottom-right perspective-[900px] overflow-visible max-[768px]:translate-x-[25%] max-[768px]:translate-y-[25%] max-[768px]:scale-[0.75] max-[480px]:translate-x-[25%] max-[480px]:translate-y-[25%] max-[480px]:scale-[0.55]';

  return (
    <div
      ref={container}
      className={containerClassName ? `${baseContainerClass} ${containerClassName}` : baseContainerClass}
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
});

CardSwap.displayName = 'CardSwap';
export default CardSwap;
