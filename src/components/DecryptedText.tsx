import { useState, useEffect, useRef } from 'react';
import { useSoundFX } from './SoundProvider';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

interface DecryptedTextProps {
  text: string;
  className?: string;
  isHovered?: boolean;
}

export default function DecryptedText({ text, className, isHovered }: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const { playTick } = useSoundFX();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isHovered) {
      let iteration = 0;
      clearInterval(intervalRef.current!);
      
      intervalRef.current = setInterval(() => {
        // Play sound only when iteration is progressing (i.e., not yet fully decrypted)
        if (iteration < text.length) {
          playTick();
        }

        setDisplayText(
          text.split('').map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return text[index];
            }
            return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
          }).join('')
        );

        if (iteration >= text.length) {
          clearInterval(intervalRef.current!);
        }

        iteration += 1 / 3;
      }, 30);
    } else {
      clearInterval(intervalRef.current!);
      setDisplayText(text);
    }

    return () => clearInterval(intervalRef.current!);
  }, [isHovered, text]);

  return <span className={className}>{displayText}</span>;
}
