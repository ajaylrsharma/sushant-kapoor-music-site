import { api, APIError, Gateway, Header } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { secret } from "encore.dev/config";
import * as crypto from "crypto";

const adminUsername = secret("AdminUsername");
const adminPassword = secret("AdminPassword");
const tokenSecret = secret("AdminTokenSecret");

interface AuthParams {
  authorization?: Header<"Authorization">;
}

export interface AuthData {
  userID: string;
}

export const auth = authHandler<AuthParams, AuthData>(async (params) => {
  const token = params.authorization?.replace("Bearer ", "");
  if (!token) {
    throw APIError.unauthenticated("missing token");
  }

  const expected = computeToken(adminUsername(), tokenSecret());
  if (!timingSafeEqual(token, expected)) {
    throw APIError.unauthenticated("invalid token");
  }

  return { userID: adminUsername() };
});

export const gateway = new Gateway({ authHandler: auth });

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export const login = api<LoginRequest, LoginResponse>(
  { expose: true, method: "POST", path: "/admin/login", auth: false },
  async (req) => {
    const validUser = timingSafeEqual(req.username, adminUsername());
    const validPass = timingSafeEqual(req.password, adminPassword());

    if (!validUser || !validPass) {
      throw APIError.unauthenticated("invalid credentials");
    }

    const token = computeToken(adminUsername(), tokenSecret());
    return { token };
  }
);

function computeToken(username: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(username).digest("hex");
}

function timingSafeEqual(a: string, b: string): boolean {
  const ha = crypto.createHmac("sha256", "cmp").update(a).digest();
  const hb = crypto.createHmac("sha256", "cmp").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}
