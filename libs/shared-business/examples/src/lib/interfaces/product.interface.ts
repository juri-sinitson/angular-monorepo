export interface ProductInterface {
  id: string;
  code: string;
  name: string;
  description: string;  
  price: number;
  category: string;
  quantity: number;
  inventoryStatus: 'INSTOCK' | 'OUTOFSTOCK' | 'LOWSTOCK';
  rating: number;
}
