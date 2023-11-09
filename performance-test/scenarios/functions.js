module.exports = {
  statusComplete: statusComplete,
};

function statusComplete(context, next) {
  const continueLooping = context.vars.status !== "Complete";
  return next(continueLooping);
}
