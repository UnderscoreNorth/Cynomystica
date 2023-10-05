import jwt from "jsonwebtoken";
import Config from "../../config.json";
import RefreshTokens from "../sqliteTables/refreshTokens";
import formatDate from "./formatDate";
const accessExpiry = 60 * 15 * 1 * 1; //15 minutes
const refreshExpiry = 60 * 60 * 24 * 7; //7 days
export function sign(username: string, type: "access" | "refresh") {
  let expiry = 0;
  if (username) {
    username = username.toLowerCase();
    switch (type) {
      case "refresh":
        expiry = refreshExpiry;
        break;
      case "access":
        expiry = accessExpiry;
        break;
      default:
        return false;
    }
    let expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + expiry);
    let payload = { username, expires: "", type };
    payload.expires = expiryDate.toLocaleString("en-US", {
      timeZone: "America/Toronto",
    });
    let token = jwt.sign({ payload }, Config.JWT_SALT, {
      expiresIn: expiry,
    });
    if (type == "refresh") {
      RefreshTokens.insert(username, token, formatDate(expiryDate));
    }
    return {
      username,
      token,
      expires: payload.expires,
    };
  } else {
    return false;
  }
}
export async function verify(
  token: string,
  username: string,
  type: "access" | "refresh"
) {
  //check for debugger key
  if (Config.DEBUG === true) return true;
  jwt.verify(token, Config.JWT_SALT, function (err, decoded) {
    if (err) {
      return false;
    } else {
      if (
        decoded.payload.username != username ||
        decoded.payload.type != type
      ) {
        return false;
      }
    }
  });
  if (type == "refresh") {
    await RefreshTokens.check(token).then((result) => {
      if (!result) return false;
    });
  }
  return true;
}
export async function refreshAcessToken(token: string, username: string) {
  if (await verify(token, username, "refresh")) {
    let newAccessToken = sign(username, "access");
    let newRefreshToken = sign(username, "refresh");
    revoke(token);
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } else {
    return false;
  }
}
export async function revoke(token: string) {
  let decoded = jwt.decode(token);
  RefreshTokens.revoke(decoded.payload.username, token);
}
