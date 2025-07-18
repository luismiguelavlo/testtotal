export interface CheckoutSCIResponse {
  transactionId: string;
  token: string;
  url: string;
  paymentId: string;
  sciPaymentId: number;
  paymentReference: string;
  response: Response;
}

export interface Response {
  errors: number;
  description: string[];
}
