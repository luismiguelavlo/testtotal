export interface AuthSCIResponse {
  response: Response;
  token: string;
}

export interface Response {
  errors: number;
  description: any[];
}
