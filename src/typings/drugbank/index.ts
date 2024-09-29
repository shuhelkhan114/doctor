export interface DrugNamesResponse {
  products: Drug[];
}

export interface Drug {
  hits: Hit[];
  name: string;
  prescribable_name?: string;
  rx_norm_prescribable_name?: string;
  country: string;
  ndc_product_codes: string[];
  dpd_codes: any;
  ema_product_codes: any;
  ema_ma_numbers: any;
  dosage_form: string;
  strength: Strength;
  route: string;
  approved: boolean;
  unapproved: boolean;
  generic: boolean;
  otc: boolean;
  mixture: boolean;
  allergen: boolean;
  vaccine: boolean;
  ingredients: Ingredient[];
  images: any[];
}

export interface Hit {
  field: string;
  value: string;
}

export interface Strength {
  number: string;
  unit: string;
}

export interface Ingredient {
  drugbank_id: string;
  name: string;
  cas: string;
  strength: Strength2;
}

export interface Strength2 {
  number: string;
  unit: string;
}
