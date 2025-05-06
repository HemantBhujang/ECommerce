export interface Product {
    id?: number;
    name: string;
    description: string;
    old_price: string;
    discount_price: string;
    discount: number;
    category: string;
    parent_category: string;
    sub_category: string;
    stock: number;
    image: string;
    image2?: string;
    image3?: string;
    image4?: string;
    image5?: string;
    size: string;
    color: string;
    quantity: number;
    created_at: string;
  }
  