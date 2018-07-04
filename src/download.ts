import { ArgumentParser } from "argparse";
import fs = require("fs");
import * as request from "request-promise-native";
import * as yn from "yn";

let onlyChanges = false;

function init() {
  const parser = new ArgumentParser({
    addHelp: true,
    description: "Downloader",
    version: "0.0.1"
  });
  parser.addArgument(["-p", "--proxy"], {
    help: "Enable proxy, override settings when receive args",
    nargs: "*"
  });
  parser.addArgument(["-c", "--changes"], {
    action: "storeTrue",
    help: "Only download changes"
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
    if (args.changes) {
      onlyChanges = true;
    }
  } catch (e) {
    throw new Error(e);
  }
}

function loadProxyConfig() {
  try {
    const proxy = process.env.PROXY || require("../config/proxy.json").proxy;
    return { proxy };
  } catch (e) {
    /* tslint:disable-next-line:no-console */
    console.log("Error: Fail to load proxy settings! Disable Proxy...\n" + e);
    return {};
  }
}

function changesFilenames() {
  const arr: string[] = [];
  const changes: any[] = require("../changes.json");
  changes.forEach(item => {
    arr.push(item.filename);
  });
  return arr;
}

async function download() {
  const array = !onlyChanges
    ? Object.keys(require("../hashes.json"))
    : changesFilenames();
  const proxyConfig =
    yn(process.env.ENABLE_PROXY) === true ? loadProxyConfig() : {};

  const client = request.defaults({
    baseUrl: "https://shinycolors.enza.fun/assets/",
    encoding: null,
    headers: {
      Accept: "image/webp,image/apng,image/*,*/*;q=0.8"
    },
    // resolveWithFullResponse: true,
    ...proxyConfig
  });

  const storeLocation = "./downloads/";

  if (!fs.existsSync(storeLocation)) {
    fs.mkdirSync(storeLocation);
  }

  for (const filename of array) {
    await client
      .get(filename)
      // .on("response", (response: any) => {}
      // })
      // TODO: set file extension by response.
      .pipe(fs.createWriteStream(storeLocation + filename + ".png"));
  }
}

init();
download();
