import "axios";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    __isRetry?: boolean;
  }
}
