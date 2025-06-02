
import { Variants } from 'framer-motion';

// Sophisticated animation variants for demo components
export const demoAnimations = {
  // Container animations
  container: {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  } as Variants,

  // Staggered children animations
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  } as Variants,

  staggerItem: {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  } as Variants,

  // Card hover effects
  cardHover: {
    rest: {
      scale: 1,
      rotateY: 0,
      rotateX: 0,
      z: 0,
      filter: "brightness(1) blur(0px)",
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    },
    hover: {
      scale: 1.03,
      rotateY: 5,
      rotateX: 5,
      z: 50,
      filter: "brightness(1.1) blur(0px)",
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  } as Variants,

  // Tab switching animations
  tabSwitch: {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45,
      filter: "blur(4px)"
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45,
      filter: "blur(4px)",
      transition: {
        duration: 0.3
      }
    })
  } as Variants,

  // Button interactions
  button: {
    rest: {
      scale: 1,
      y: 0,
      boxShadow: "0px 2px 4px rgba(0,0,0,0.1)"
    },
    hover: {
      scale: 1.05,
      y: -2,
      boxShadow: "0px 8px 16px rgba(0,0,0,0.15)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95,
      y: 0,
      boxShadow: "0px 1px 2px rgba(0,0,0,0.1)"
    }
  } as Variants,

  // Loading animations
  loading: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  } as Variants,

  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  } as Variants,

  // Scroll reveal animations
  scrollReveal: {
    hidden: {
      opacity: 0,
      y: 75,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  } as Variants,

  // Floating animations
  float: {
    animate: {
      y: [-10, 0, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  } as Variants,

  // Morphing effects
  morph: {
    initial: {
      borderRadius: "0px",
      rotate: 0
    },
    animate: {
      borderRadius: ["0px", "50px", "25px", "0px"],
      rotate: [0, 180, 360],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  } as Variants
};

// Gesture configurations
export const gestureConfig = {
  drag: {
    dragConstraints: { left: -100, right: 100, top: -50, bottom: 50 },
    dragElastic: 0.2,
    dragTransition: { bounceStiffness: 600, bounceDamping: 20 }
  },
  
  swipe: {
    threshold: 10,
    velocity: 500
  }
};

// Reduced motion variants for accessibility
export const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};
