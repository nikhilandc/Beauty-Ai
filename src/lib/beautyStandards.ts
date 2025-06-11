import { supabase } from './supabase';

export interface BeautyStandard {
  id: string;
  culture: string;
  name: string;
  description: string;
  key_features: string[];
  style_recommendations: string[];
}

export interface BeautyMatch {
  standard: BeautyStandard;
  percentage: number;
}

export async function getBeautyStandards(): Promise<BeautyStandard[]> {
  const { data, error } = await supabase
    .from('beauty_standards')
    .select('*');

  if (error) throw error;
  return data;
}

export async function analyzeBeautyStandards(
  facialFeatures: string[]
): Promise<BeautyMatch[]> {
  // Get all beauty standards
  const standards = await getBeautyStandards();
  
  // Calculate match percentages using feature matching
  const matches = standards.map(standard => {
    const matchingFeatures = standard.key_features.filter(feature =>
      facialFeatures.some(userFeature =>
        userFeature.toLowerCase().includes(feature.toLowerCase())
      )
    );
    
    const percentage = Math.round(
      (matchingFeatures.length / standard.key_features.length) * 100
    );

    return {
      standard,
      percentage
    };
  });

  // Sort by match percentage
  return matches.sort((a, b) => b.percentage - a.percentage);
}

export async function saveBeautyMatches(
  userId: string,
  matches: BeautyMatch[]
): Promise<void> {
  const { error } = await supabase
    .from('user_beauty_matches')
    .insert(
      matches.map(match => ({
        user_id: userId,
        standard_id: match.standard.id,
        match_percentage: match.percentage
      }))
    );

  if (error) throw error;
}