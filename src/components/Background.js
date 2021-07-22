
import Particles from 'react-particles-js';

const Background = () => {
    return (
        <div className="particles" style={{ zIndex: '1', position: 'absolute', width: '100vw', height: '100vh' }}>
            <Particles
                params={{
                    "particles": {
                        "number": {
                            "value": 60,
                            "density": {
                                "enable": false
                            }
                        },
                        "size": {
                            "value": 2.8,
                            "random": true,
                            "anim": {
                                "speed": 2,
                                "size_min": 0.3
                            }
                        },
                        "line_linked": {
                            "enable": false
                        },
                        "move": {
                            "random": true,
                            "speed": 0.5,
                            "direction": "top",
                            "out_mode": "out"
                        }
                    },
                    "interactivity": {
                        "events": {
                            "onhover": {
                                "enable": true,
                                "mode": "bubble"
                            },
                            "onclick": {
                                "enable": true,
                                "mode": "repulse"
                            }
                        },
                        "modes": {
                            "bubble": {
                                "distance": 250,
                                "duration": 2,
                                "size": 0,
                                "opacity": 0
                            },
                            "repulse": {
                                "distance": 200,
                                "duration": 5
                            }
                        }
                    }
                }} />

        </div>
    )
}

export default Background;