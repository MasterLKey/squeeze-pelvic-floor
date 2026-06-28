import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, type TouchableOpacityProps } from 'react-native';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface Props extends TouchableOpacityProps {
  title:     string;
  variant?:  Variant;
  loading?:  boolean;
  size?:     'sm' | 'md' | 'lg';
}

const VARIANT_CLASSES: Record<Variant, { container: string; text: string }> = {
  primary:   { container: 'bg-primary-600 active:bg-primary-700', text: 'text-white' },
  secondary: { container: 'bg-primary-100 active:bg-primary-200', text: 'text-primary-700' },
  ghost:     { container: 'bg-transparent active:bg-gray-100', text: 'text-primary-600' },
  danger:    { container: 'bg-red-500 active:bg-red-600', text: 'text-white' },
};

const SIZE_CLASSES: Record<'sm' | 'md' | 'lg', { container: string; text: string }> = {
  sm:  { container: 'px-4 py-2 rounded-xl', text: 'text-sm font-semibold' },
  md:  { container: 'px-6 py-3.5 rounded-2xl', text: 'text-base font-semibold' },
  lg:  { container: 'px-8 py-4 rounded-2xl', text: 'text-lg font-bold' },
};

export function Button({ title, variant = 'primary', loading, size = 'md', className = '', disabled, ...props }: Props) {
  const v = VARIANT_CLASSES[variant];
  const s = SIZE_CLASSES[size];

  return (
    <TouchableOpacity
      className={`items-center justify-center ${v.container} ${s.container} ${disabled || loading ? 'opacity-50' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#7c3aed'} />
      ) : (
        <Text className={`${v.text} ${s.text}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
