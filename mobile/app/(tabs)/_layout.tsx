import { Tabs } from 'expo-router';
import { Home, ScanLine, Clock } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false, 
      tabBarActiveTintColor: '#FF3000', 
      tabBarInactiveTintColor: '#999',
      tabBarStyle: {
        backgroundColor: '#000',
        borderTopWidth: 4,
        borderTopColor: '#000',
        height: 60,
        paddingBottom: 10,
        paddingTop: 10,
      }
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'SUBMIT',
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
          tabBarLabelStyle: { fontFamily: 'System', fontWeight: '900', fontSize: 10, letterSpacing: 1 }
        }}
      />
      <Tabs.Screen
        name="my-complaints"
        options={{
          title: 'CASES',
          tabBarIcon: ({ color }) => <Clock color={color} size={24} />,
          tabBarLabelStyle: { fontFamily: 'System', fontWeight: '900', fontSize: 10, letterSpacing: 1 }
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'VERIFY',
          tabBarIcon: ({ color }) => <ScanLine color={color} size={24} />,
          tabBarLabelStyle: { fontFamily: 'System', fontWeight: '900', fontSize: 10, letterSpacing: 1 }
        }}
      />
    </Tabs>
  );
}
