import type { payload } from "../../utils/token";

declare global {
  namespace Express {
    interface Request {
      user?: payload;
    }
  }
}

export {};
