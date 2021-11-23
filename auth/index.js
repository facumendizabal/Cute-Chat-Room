const jwt = require("jsonwebtoken");

const config = require("../config");
const error = require("../utils/error");

const secret = config.jwt.secret;

// Handle all the JWT logic

function sign(data) {
  try {
    return jwt.sign(data, secret);
  } catch {
    throw error("Internal Server Error", 500);
  }
}

function verify(token) {
  try {
    return jwt.verify(token, secret);
  } catch {
    throw error("Authenication Denied", 401);
  }
}

const check = {
  own: function (req, owner) {
    const decoded = decodeHeader(req);

    if (decoded.id !== owner) {
      throw error("Authentication denied", 401);
    }
  },
  logged: function (req) {
    if (readTokenCookie(req)) {
      return
    } else {
      const decoded = decodeHeader(req);
    }
  },
};

function readTokenCookie(req) {
  let cookieToken = req.signedCookies.chatroom_authtoken;
  if (cookieToken === undefined) {
    return false
  } else { 
    const decoded = verify(cookieToken);
    
    req.user = decoded;
    return true;
  }
}

function formatToken(auth) {
  if (!auth) {
    throw error("Authenication Denied", 401);
  }

  if (auth.indexOf("Bearer ") === -1) {
    throw error("Authenication Denied", 401);
  }

  let token = auth.replace("Bearer ", "");

  return token;
}

function decodeHeader(req) {
  const authorization = req.headers.authorization || "";
  const token = formatToken(authorization);
  const decoded = verify(token);

  req.user = decoded;
  return decoded;
}

module.exports = {
  sign,
  check,
};
