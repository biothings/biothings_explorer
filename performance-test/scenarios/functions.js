module.exports = {
  statusComplete: statusComplete,
};

function statusComplete(context, next) {
  const continueLooping = context.vars.status !== "Complete";
  if (context.vars.status === "Error") {
    return next(new Error("Query failed."))
  }
  return next(continueLooping);
}
