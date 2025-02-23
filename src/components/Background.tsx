import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import CLOUDS from 'vanta/dist/vanta.clouds.min';

export const Background = () => {
    const [vantaEffect, setVantaEffect] = useState<any>(null);
    const backgroundRef = useRef(null);

    useEffect(() => {
        if (!vantaEffect) {
            setVantaEffect(
                CLOUDS({
                    el: backgroundRef.current,
                    THREE: THREE,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    backgroundColor: 0xffffff,
                    skyColor: 0x68b8d7,
                    cloudColor: 0xadc1de,
                    cloudShadowColor: 0x183550,
                    sunColor: 0xff9919,
                    sunGlareColor: 0xff6633,
                    sunlightColor: 0xff9933,
                    speed: 1.0
                })
            );
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    return <div ref={backgroundRef} className="vanta-background" />;
}; 