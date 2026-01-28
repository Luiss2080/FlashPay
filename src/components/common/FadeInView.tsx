import React, { useEffect, useRef } from "react";
import { Animated, ViewStyle } from "react-native";

interface FadeInViewProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  delay?: number;
  duration?: number;
}

export const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  style,
  delay = 0,
  duration = 500,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: duration,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: duration,
        delay: delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, duration]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: opacity,
          transform: [{ translateY: translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};
