import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  typescript: true,
  rules: {
    'react-dom/no-dangerously-set-innerhtml': 'off',
  },
  ignores: ['scripts/**/*'],
})
