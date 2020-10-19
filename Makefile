lint: do-lint
lint-fix: do-lint-fix
patch-release: do-build do-lint do-test do-npm-version do-npm-publish do-git-push

do-build:
	npm run build

do-test:
	npm run test

do-lint:
	./node_modules/.bin/eslint src/*/** --fix-dry-run

do-lint-fix:
	./node_modules/.bin/eslint src/*/** --fix

do-npm-version:
	npm version patch

do-npm-publish:
	npm publish

do-git-checkout-develop:
	git checkout develop

do-git-pull:
	git fetch && git pull

do-git-push:
	git push

