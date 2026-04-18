export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Complaint {
  id: string;
  text: string;
  hash: string;
  category: string;
  severity: number;
  department: string;
  summary: string;
  language: string;
  status: 'pending' | 'in_review' | 'resolved' | 'rejected';
  timestamp: any; // Can be a Firebase Timestamp
  location?: Location;
  blockchainTx?: string | null;
  blockchainBlock?: number | null;
  submitterToken?: string;
  tampered: boolean;
}
