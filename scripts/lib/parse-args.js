module.exports = parseArgs;

///////////////////////////////////////////

function parseArgs(argv) {
  let isLight = false;

  const args = argv;
  const isLightId = args.findIndex((arg) => /^(--light|-l)/i.test(arg));

  if (isLightId !== -1) {
    isLight = true;
    args.splice(isLightId, 1);
  }

  return {
    args,
    options: {
      isLight,
    },
  };
}
