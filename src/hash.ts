import crypto = require("crypto");

function createHash(buffer: any): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const sum: string = crypto
      .createHash("sha512")
      .update(buffer)
      .digest("hex");
    resolve(sum);
  });
}

export default createHash;
