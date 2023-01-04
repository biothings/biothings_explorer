const checkIfZombified = () => {
  if (process.ppid === 1) {
    console.log("Bull processor zombified, exiting...");
    throw new Error("Bull processor zombified, exiting...");
  } else {
    setTimeout(checkIfZombified, 1000);
  }
}

exports.checkIfZombified = checkIfZombified;
