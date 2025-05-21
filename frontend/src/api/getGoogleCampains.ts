import { GoogleAdsCampaign } from "@/types";
import axios from 'axios'


export async function fetchGoogleCampaigns(): Promise<GoogleAdsCampaign[]> {
  try {    
    const response = await axios.get<GoogleAdsCampaign[]>('http://localhost:8000/mock/google?user_email=sewlesew@gmail.com');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch google campaigns:', error);
    return [];
  }
}