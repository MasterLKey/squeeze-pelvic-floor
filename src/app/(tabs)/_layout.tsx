import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, View, Text } from 'react-native';
import { COLORS } from '@/lib/constants';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    index:    '🏠',
    history:  '📊',
    programs: '🎯',
    settings: '⚙️',
  };
  return (
    <View className="items-center">
      <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{icons[name] ?? '●'}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown:     false,
        tabBarActiveTintColor:   COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor:  '#F3F4F6',
          borderTopWidth:  1,
          height:          Platform.OS === 'ios' ? 84 : 64,
          paddingBottom:   Platform.OS === 'ios' ? 28 : 8,
          paddingTop:      8,
        },
        tabBarLabelStyle: {
          fontSize:   11,
          fontWeight: '600',
          marginTop:  2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title:    'Today',
          tabBarIcon: ({ focused }) => <TabIcon name="index" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title:    'History',
          tabBarIcon: ({ focused }) => <TabIcon name="history" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="programs"
        options={{
          title:    'Programs',
          tabBarIcon: ({ focused }) => <TabIcon name="programs" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title:    'Settings',
          tabBarIcon: ({ focused }) => <TabIcon name="settings" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
