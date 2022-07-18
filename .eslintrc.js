module.exports = {
  'extends': ['eslint:recommended', 'google'],
  'env': {
    browser: true,
    node: true,
    es6: true,
  },
  'rules': {
    'space-in-parens': ['error', 'never'],
  },
  'parserOptions': {
    'ecmaVersion': 2017,
  },
};
