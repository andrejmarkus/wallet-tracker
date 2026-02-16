export interface ApiResponse<T = any> {
  status: 'success' | 'error' | 'fail';
  message: string;
  data?: T;
  error?: any;
  timestamp: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class ApiResponseBuilder {
  static success<T>(data: T, message = 'Operation successful', pagination?: ApiResponse['pagination']): ApiResponse<T> {
    return {
      status: 'success',
      message,
      data,
      timestamp: new Date().toISOString(),
      pagination,
    };
  }

  static error(message = 'Internal Server Error', error?: any): ApiResponse {
    return {
      status: 'error',
      message,
      error: process.env.NODE_ENV === 'development' ? error : undefined,
      timestamp: new Date().toISOString(),
    };
  }

  static fail(message = 'Validation failed', error?: any): ApiResponse {
    return {
      status: 'fail',
      message,
      data: error,
      timestamp: new Date().toISOString(),
    };
  }
}
