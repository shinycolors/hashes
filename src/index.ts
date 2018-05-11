import fs = require("fs");
import createHash from "./hash";
import axios from "axios";

async function check_hashes(): Promise<Array<object> | any> {
  const hashfile = require("../hashes.json");

  try {
    return new Promise<object[]>(async resolve => {
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
          }
          await req().then(r => {
            if (typeof r === "object")
              items.push(r)
          });
        };
        resolve(items)
      })
  } catch (error) {
      throw new Error(error);
  }
}

check_hashes().then(item => {
  fs.writeFileSync("changes.json", JSON.stringify(item), "utf-8");
});
/*
** The basic source code that extract hashes from files.

async function run(): Promise<Map<string, string> | any> {
  let CustomObject: { [key: string]: string } = {};
  let length: number = 0;
  fs.readdir("./images", async (err, files) => {
    if (err) throw err;
    files.forEach(async(file) => {
      let filehash: string;
      const hashname: string = file.split(".")[0];
      const input: string = fs.readFileSync("./images/" + file, {
        encoding: "utf-8"
      });
      filehash = await createHash(input)
      length += 1
      console.log("FileName: " + hashname);
      console.log("Sha-512 : " + filehash);

      CustomObject[hashname] = filehash
      if (files.length == length) {
        console.log(files.length)
        console.log(length)
        console.log(CustomObject)
        fs.writeFileSync('hashes.json', JSON.stringify(CustomObject), 'utf-8')
      }
    });
  });
}

run();
*/
