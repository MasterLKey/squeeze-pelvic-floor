import React from 'react';
import { View, type ViewProps } from 'react-native';

interface Props extends ViewProps {
  children:   React.ReactNode;
  className?: string;
}

export function Card({ children, className = '', style, ...props }: Props) {
  return (
    <View
      className={`bg-white rounded-3xl p-4 shadow-sm ${className}`}
      style={[{ shadowColor: '#8B5CF6', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3 }, style]}
      {...props}
    >
      {children}
    </View>
  );
}
