import { MetaAdsCampaign } from "@/types";
import axios from 'axios'

export async function fetchMetaCampaigns(): Promise<MetaAdsCampaign[]> {
  try {    
    const response = await axios.get<MetaAdsCampaign[]>('http://localhost:8000/mock/meta?user_email=sewlesew@gmail.com'); 
    return response.data;
  } catch (error) {
    console.error('Failed to fetch Instantly campaigns:', error);
    return [];
  }
}