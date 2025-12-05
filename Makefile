start:
	npx expo start --clear

lint:
	npx eslint .

lint-fix:
	npx eslint . --fix

ios-dev-build:
	eas build --platform ios --profile development

ios-preview-build:
	eas build --platform ios --profile preview
