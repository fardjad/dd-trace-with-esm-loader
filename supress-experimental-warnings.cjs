const process = require("node:process");

const warningsToSupress = [
  /Node\.js specifier resolution flag/,
  /Custom ESM Loaders/,
  /Fetch API/,
  /test runner/,
];

const { emit } = process;

process.emit = function (name, data, ...rest) {
  if (
    name === "warning" &&
    typeof data === "object" &&
    data.name === "ExperimentalWarning" &&
    warningsToSupress.some((regex) => regex.test(data.message))
  ) {
    return;
  }

  return emit.apply(process, [name, data, ...rest]);
};
