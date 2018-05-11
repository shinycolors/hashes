import check_hashes from "./check";

async function process_exit() {
  setTimeout(function() {
    process.exit(1);
  }, 1000);
}

check_hashes()
  .then(item => {
    if (
      !Array.isArray(item) ||
      typeof item === "undefined" ||
      item.length != 0
    ) {
      const errstr =
        "Test is unsuccessful.\n" +
        "Maybe hashes are changed or Forbidden by AWS/enza\n" +
        "Received items:\n" +
        item +
        "\n";
      throw new Error(errstr);
    } else {
      console.log("Test Suceess.");
    }
  })
  .catch(err => {
    const errstr = "Test Failed.\n" + "Error:\n" + err.stack;
    process_exit();
    throw new Error(errstr);
  });
