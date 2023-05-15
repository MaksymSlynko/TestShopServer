export interface IProducts {
  productId: number;
  productName: string;
  count: number;
  price: number;
}

export interface IOrder {
  id: number;
  userId: number;
  orderDetails: string;
  totalPrice: number;
  status: string;
  deliveryAddress: string;
  createdTime: string;
}
