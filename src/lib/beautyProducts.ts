import { supabase } from './supabase';

export interface BeautyProduct {
  id: string;
  standard_id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image_url: string;
}

export async function getBeautyProducts(standardId?: string): Promise<BeautyProduct[]> {
  let query = supabase.from('beauty_products').select('*');
  
  if (standardId) {
    query = query.eq('standard_id', standardId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getBeautyProductsByStandard(): Promise<Record<string, BeautyProduct[]>> {
  const { data: standards, error: standardsError } = await supabase
    .from('beauty_standards')
    .select('*');

  if (standardsError) throw standardsError;

  const { data: products, error: productsError } = await supabase
    .from('beauty_products')
    .select('*');

  if (productsError) throw productsError;

  return standards.reduce((acc, standard) => {
    acc[standard.id] = products.filter(p => p.standard_id === standard.id);
    return acc;
  }, {} as Record<string, BeautyProduct[]>);
}