module.exports = {
	plugins: ["@typescript-eslint", "jest", "promise", "unicorn"],
	extends: [
		"plugin:@typescript-eslint/recommended",
		"plugin:jest/recommended",
		"plugin:promise/recommended",
		"plugin:unicorn/recommended",
		"prettier",
		"prettier/react",
		"prettier/@typescript-eslint",
	],
	env: {
		node: true,
		browser: true,
		jest: true,
	},
	rules: {
		// Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
		"no-prototype-builtins": "off",
		// https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
		"import/prefer-default-export": "off",
		// Too restrictive: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
		"react/destructuring-assignment": "off",
		// No jsx extension: https://github.com/facebook/create-react-app/issues/87#issuecomment-234627904
		"react/jsx-filename-extension": "off",
		// Use function hoisting to improve code readability
		"no-use-before-define": ["error", { functions: false, classes: true, variables: true }],
		// Makes no sense to allow type inferrence for expression parameters, but require typing the response
		"@typescript-eslint/explicit-function-return-type": ["error", { allowExpressions: true, allowTypedFunctionExpressions: true }],
		"@typescript-eslint/no-use-before-define": ["error", { functions: false, classes: true, variables: true, typedefs: true }],
		// Common abbreviations are known and readable
		"unicorn/prevent-abbreviations": "off",
		"@typescript-eslint/explicit-member-accessibility": "off",
		"lines-between-class-members": "off",
		"@typescript-eslint/explicit-function-return-type": "off",
		"no-plusplus": "off",
		"@typescript-eslint/array-type": ["error", { default: "array-simple" }],
		"@typescript-eslint/no-empty-interface": "off",
		"class-methods-use-this": "off",
		"no-underscore-dangle": "off",
		semi: [2, "never"],
		"unicorn/no-for-loop": "off",
		"@typescript-eslint/ban-types": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off"
	},
}
