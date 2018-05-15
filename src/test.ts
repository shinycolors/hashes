import check_hashes from "./check";

async function process_exit() {
  setTimeout(() => {
    process.exit(1);
  }, 1000);
}

check_hashes()
  .then(item => {
    if (
      !Array.isArray(item) ||
      typeof item === "undefined" ||
      item.length !== 0
    ) {
      const errStr =
        "Test is unsuccessful.\n" +
        "Maybe hashes are changed or Forbidden by AWS/enza\n" +
        "Received items: " +
        JSON.stringify(item) +
        "\n";
      throw new Error(errStr);
    } else {
      /* tslint:disable-next-line:no-console */
      console.info("Test Success.");
    }
  })
  .catch(err => {
    const errStr = "Test Failed.\n" + "Error:\n" + err.stack;
    process_exit();
    throw new Error(errStr);
  });
