import * as request from "request-promise-native";
import * as yn from "yn";
import createHash from "./hash";

function loadProxyConfig() {
  try {
    const proxy = require("../config/proxy.json").proxy;
    return { proxy };
  } catch (e) {
    /* tslint:disable-next-line:no-console */
    console.log("Error: Fail to load proxy settings! Disable Proxy...\n" + e);
    return {};
  }
}

async function check_hashes(): Promise<object[] | Error> {
  const hashFile = require("../hashes.json");
  const proxyConfig =
    yn(process.env.ENABLE_PROXY) === true ? loadProxyConfig() : {};

  const client = request.defaults({
    baseUrl: "https://shinycolors.enza.fun/assets/",
    encoding: null,
    headers: {
      Accept: "image/webp,image/apng,image/*,*/*;q=0.8"
    },
    resolveWithFullResponse: true,
    ...proxyConfig
  });

  try {
    return new Promise<object[]>(async (resolve, reject) => {
      const items: object[] = [];
      for (const hashedName of Object.keys(hashFile)) {
        const req = async (): Promise<object | any> => {
          return client
            .get(hashedName)
            .then(async (response: any) => {
              const res = await response;
              const data = res.body.toString(); // It was from my oldest mistake...

              if (res.body.length !== Number(res.headers["content-length"])) {
                throw new Error(
                  `Content Length(${Number(
                    res.headers["content-length"]
                  )}) is not same as received body length(${
                    res.body.length
                  }) on \"${hashedName}\"`
                );
              }

              const fileHash = await createHash(data);
              const oldFileHash = hashFile[hashedName];
              if (fileHash !== oldFileHash) {
                /* tslint:disable-next-line:no-console */
                console.log(
                  "Hash Changed! Hashed Filename: " +
                    hashedName +
                    "\nOLD : " +
                    oldFileHash +
                    "\nNEW : " +
                    fileHash +
                    "\n----------------------------------------------"
                );
                return {
                  filename: hashedName,
                  old_hash: oldFileHash,
                  /* tslint:disable-next-line:object-literal-sort-keys */
                  new_hash: fileHash
                };
              }
            })
            .catch((err: any) => {
              if (err.statusCode === 403) {
                if (
                  err.message.includes(
                    "The Amazon CloudFront distribution is configured to block access from your country."
                  )
                ) {
                  throw new Error(
                    "It's blocked by country level. Please turn on proxy or vpn."
                  );
                } else {
                  throw new Error(
                    "It's blocked but not country level. Maybe you are banned from enza?"
                  );
                }
              }

              throw new Error(err);
            });
        };
        await req()
          .then(r => {
            if (typeof r === "object") {
              items.push(r);
            }
          })
          .catch(err => {
            reject(new Error(err));
          });
      }
      resolve(items);
    });
  } catch (error) {
    throw new Error(error);
  }
}

export default check_hashes;
