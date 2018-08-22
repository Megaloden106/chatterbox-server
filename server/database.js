const _data = {
  results: []
};

exports.add = (message) => {
  _data.results.push(message);
};

exports.get = () => {
  return _data;
};

exports.delete = () => {
  // TODO
};