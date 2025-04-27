export type ApiError = {
  statusCode: number;
  message: string;
  details?: Record<string, any>;
};
