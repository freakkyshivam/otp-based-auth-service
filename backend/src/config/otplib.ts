 
import { authenticator } from "otplib";
import crypto from "node:crypto";
authenticator.options = {
  step: 30,
  digits: 6,
  window: 1,
  crypto
};

export default authenticator;
