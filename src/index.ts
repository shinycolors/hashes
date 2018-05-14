import fs = require("fs");
import check_hashes from "./check";

check_hashes()
  .then(item => {
    fs.writeFileSync("changes.json", JSON.stringify(item), "utf-8");
  })
  .catch(err => {
    throw new Error(err);
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
