import fs = require("fs");
import createHash from "./hash";
import axios from "axios";

async function check_hashes() {
  const hashfile = require("../hashes.json");

  for (const hashed_name in hashfile) {
    try {
      const req_data = await axios({
        method: "GET",
        url: "https://shinycolors.enza.fun/assets/" + hashed_name,
        headers: {
          Accept: "image/webp,image/apng,image/*,*/*;q=0.8"
        }
      }).then(async response => {
        let filehash = await createHash(response.data);
        let old_filehash = hashfile[hashed_name];
        if (filehash != old_filehash) {
          console.log("Hash Changed! Hashed Filename: " + hashed_name);
          console.log("OLD : " + old_filehash);
          console.log("NEW : " + filehash);
          console.log("----------------------------------------------");
        }
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

check_hashes();
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
