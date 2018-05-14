import axios from "axios";
import fs = require("fs");
import yn = require("yn");
import createHash from "./hash";

function loadProxyConfig() {
  try {
    return require("../config/proxy.json");
  } catch (e) {
    /* tslint:disable-next-line:no-console */
    console.log("Error: Fail to load proxy settings! Disable Proxy...\n" + e);
    return { proxy: false };
  }
}

async function check_hashes(): Promise<object[] | Error> {
  const hashfile = require("../hashes.json");
  const proxyConfig =
    yn(process.env.ENABLE_PROXY) === true
      ? loadProxyConfig()
      : { proxy: false };

  try {
    return new Promise<object[]>(async (resolve, reject) => {
      const items: object[] = [];
      for (const hashedName of Object.keys(hashfile)) {
        const req = async (): Promise<object | any> => {
          return axios({
            headers: {
              Accept: "image/webp,image/apng,image/*,*/*;q=0.8"
            },
            method: "GET",
            url: "https://shinycolors.enza.fun/assets/" + hashedName,
            ...proxyConfig
          })
            .then(async response => {
              const filehash = await createHash(response.data);
              const oldFilehash = hashfile[hashedName];
              if (filehash !== oldFilehash) {
                /* tslint:disable-next-line:no-console */
                console.log(
                  "Hash Changed! Hashed Filename: " +
                    hashedName +
                    "\nOLD : " +
                    oldFilehash +
                    "\nNEW : " +
                    filehash +
                    "\n----------------------------------------------"
                );
                return {
                  filename: hashedName,
                  old_hash: oldFilehash,
                  /* tslint:disable-next-line:object-literal-sort-keys */
                  new_hash: filehash
                };
              }
            })
            .catch(err => {
              if (err.response.status === 403) {
                if (
                  err.response.data.includes(
                    "The Amazon CloudFront distribution is configured to block access from your country."
                  )
                ) {
                  throw new Error(
                    "It's blocked by country level. Please turn on proxy or vpn."
                  );
                } else {
                  throw new Error(
                    "It's blocked but not conuntry level. Maybe you are banned from enza?"
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
