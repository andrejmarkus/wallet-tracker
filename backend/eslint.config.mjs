import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'generated/**']
  },
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic
)
