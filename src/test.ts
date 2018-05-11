import check_hashes from "./check";

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
        item;
      throw new Error(errstr);
    } else {
      console.log("Test Suceess.")
    }
  })
  .catch(err => {
    const errstr = "Test Failed.\n" + "Error:\n" + err;
    throw new Error(errstr);
  });
