module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'useForm',
      externals: {
        react: 'React'
      }
    }
  }
}
