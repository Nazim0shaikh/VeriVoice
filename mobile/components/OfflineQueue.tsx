import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Storage, QueuedComplaint } from '../services/storage';
import { WifiOff, Wifi } from 'lucide-react-native';

export const OfflineQueue: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    const fetchQueue = async () => {
      const q = await Storage.getQueue();
      setQueueCount(q.length);
    };
    
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
      fetchQueue();
      
      if (state.isConnected) {
        syncQueue();
      }
    });

    return () => unsubscribe();
  }, []);

  const syncQueue = async () => {
    const queue = await Storage.getQueue();
    if (queue.length === 0) return;

    console.log(`Syncing ${queue.length} offline complaints...`);
    // Example: For each item -> push to API -> Storage.dequeue(item.id) -> loop
    
    // Simulating instant sync for demo
    await Storage.clearQueue();
    setQueueCount(0);
  };

  if (!isOffline && queueCount === 0) return null;

  return (
    <View style={[styles.container, isOffline ? styles.offlineBg : styles.syncBg]}>
      {isOffline ? (
        <WifiOff color="#FFF" size={20} />
      ) : (
        <Wifi color="#FFF" size={20} />
      )}
      <Text style={styles.text}>
        {isOffline 
          ? `OFFLINE - QUEUED (${queueCount})` 
          : `SYNCING QUEUE... (${queueCount})`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 4,
    borderColor: '#000',
    marginBottom: 20,
  },
  offlineBg: {
    backgroundColor: '#FF3000',
  },
  syncBg: {
    backgroundColor: '#000',
  },
  text: {
    color: '#FFF',
    fontFamily: 'System',
    fontWeight: '900',
    letterSpacing: 2,
    marginLeft: 12,
    fontSize: 12,
  },
});
