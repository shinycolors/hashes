import fs = require("fs");
import createHash from "./hash";
import axios from "axios";

async function check_hashes(): Promise<Array<object> | Error> {
  const hashfile = require("../hashes.json");

  try {
    return new Promise<object[]>(async (resolve, reject) => {
      let items: object[] = [];
      for (const hashed_name in hashfile) {
        const req = async (): Promise<object | any> => {
          return await axios({
            method: "GET",
            url: "https://shinycolors.enza.fun/assets/" + hashed_name,
            headers: {
              Accept: "image/webp,image/apng,image/*,*/*;q=0.8"
            }
          })
            .then(async response => {
              let filehash = await createHash(response.data);
              let old_filehash = hashfile[hashed_name];
              if (filehash != old_filehash) {
                console.log("Hash Changed! Hashed Filename: " + hashed_name);
                console.log("OLD : " + old_filehash);
                console.log("NEW : " + filehash);
                console.log("----------------------------------------------");
                return {
                  filename: hashed_name,
                  old_hash: old_filehash,
                  new_hash: filehash
                };
              }
            })
            .catch(err => {
              if (err.response.status == 403)
                if (
                  err.response.data.includes(
                    "The Amazon CloudFront distribution is configured to block access from your country."
                  )
                )
                  throw new Error(
                    "It's blocked by country level. Please turn on proxy or vpn."
                  );
                else
                  throw new Error(
                    "It's blocked but not conuntry level. Maybe you are banned from enza?"
                  );

              throw new Error(err);
            });
        };
        await req()
          .then(r => {
            if (typeof r === "object") items.push(r);
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
