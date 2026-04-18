import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_KEY = '@verivoice_complaint_queue';

export interface QueuedComplaint {
  id: string;
  text: string;
  location: any | null;
  savedAt: number;
}

export const Storage = {
  // Push a new complaint to offline queue
  async enqueue(complaintData: Omit<QueuedComplaint, 'id' | 'savedAt'>): Promise<void> {
    try {
      const existing = await this.getQueue();
      const newComplaint: QueuedComplaint = {
        ...complaintData,
        id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        savedAt: Date.now()
      };
      
      const newQueue = [...existing, newComplaint];
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
    } catch (e) {
      console.error("Error enqueuing complaint", e);
    }
  },

  // Get current queue
  async getQueue(): Promise<QueuedComplaint[]> {
    try {
      const data = await AsyncStorage.getItem(QUEUE_KEY);
      return data ? JSON.stringify(JSON.parse(data)) !== "undefined" ? JSON.parse(data) : [] : [];
    } catch (e) {
      return [];
    }
  },

  // Clear queue
  async clearQueue(): Promise<void> {
    await AsyncStorage.removeItem(QUEUE_KEY);
  },

  // Remove a specific successful upload from queue
  async dequeue(id: string): Promise<void> {
    try {
      const existing = await this.getQueue();
      const filtered = existing.filter(c => c.id !== id);
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error("Error dequeueing complaint", e);
    }
  }
};
