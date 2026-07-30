interface Product {
  id: string;
  name: string;
  imageUrl: string;
  quantity: number;
  price: number;
}

interface Package {
  id: string;
  amount: number;
  products: Product[];
}

interface RedirectUrls {
  confirmUrl: string;
  cancelUrl: string;
}

export interface PaymentData {
  amount: number;
  currency: string;
  orderId: string;
  packages: Package[];
  redirectUrls: RedirectUrls;
}

export interface LinePayResponse {
  returnCode: string;
  returnMessage: string;
  info: {
    paymentUrl: {
      web: string;
      app: string;
      universal: string;
    };
    transactionId: number;
    paymentAccessToken: string;
  };
}