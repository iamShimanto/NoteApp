import type { payload } from "../../utils/token.ts"

declare global {
  namespace Express {
    interface Request {
      user?: payload;
    }
  }
}

export {};
