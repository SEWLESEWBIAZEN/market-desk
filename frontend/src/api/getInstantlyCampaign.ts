import { InstantlyCampaign } from "@/types";
import axios from 'axios'

export async function fetchInstantlyCampaigns(): Promise<InstantlyCampaign[]> {
  try {
    
    const response = await axios.get<InstantlyCampaign[]>('http://localhost:8000/mock/instantly?user_email=sewlesew@gmail.com');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch Instantly campaigns:', error);
    return [];
  }
}