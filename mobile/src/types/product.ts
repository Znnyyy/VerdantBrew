export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  is_available: boolean;
}

export interface ProductDetail extends Product {
  description: string;
  category_name: string;
  option_groups: OptionGroup[];
}

export interface OptionGroup {
  id: number;
  name: string;
  selection_type: string;
  is_required: boolean;
  values: OptionValue[];
}

export interface OptionValue {
  id: number;
  label: string;
  extra_price: number;
}
