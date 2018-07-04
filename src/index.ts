import { ArgumentParser } from "argparse";
import fs = require("fs");
import check_hashes from "./check";

let saveChanges = false;

function init() {
  const parser = new ArgumentParser({
    addHelp: true,
    description: "Hash checker",
    version: "0.0.1"
  });
  parser.addArgument(["-p", "--proxy"], {
    help: "Enable proxy, override settings when receive args",
    nargs: "*"
  });
  parser.addArgument(["-w", "--write"], {
    action: "storeTrue",
    help: "Write changes to `hashes.json`"
  });

  const args = parser.parseArgs();

  try {
    if (args.proxy) {
      const name = "PROXY";
      if (!process.env.hasOwnProperty(name)) {
        const enableName = "ENABLE_PROXY";
        const proxyConfig = require("../config/proxy.json").proxy;
        process.env[name] = args.proxy[0] || proxyConfig;
        process.env[enableName] = "1";
      }
    }
    if (args.write) {
      saveChanges = true;
    }
  } catch (e) {
    throw new Error(e);
  }
}

init();
check_hashes()
  .then(item => {
    fs.writeFileSync("changes.json", JSON.stringify(item), "utf-8");

    if (saveChanges) {
      const items: any[] = item instanceof Error ? [] : item;
      const hashes: any = require("../hashes.json");
      for (const key of Object.keys(hashes)) {
        for (const i of items) {
          if (i.filename === key) {
            hashes[key] = i.new_hash;
          }
        }
      }

      fs.writeFileSync("hashes.json", JSON.stringify(hashes), "utf-8");
    }
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
