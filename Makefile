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
	@echo "select your version type\n1: major\n2: minor\n3: patch"
	@read -p "release version type" versionType\
	case $$versionType in '1') \
	rVersion='major';; \
	'2') \
	rVersion='minor';; \
	*) \
	rVersion='patch';; \
	esac; \
	npm version $$rVersion

do-npm-publish:
	npm publish

do-git-checkout-develop:
	git checkout develop

do-git-pull:
	git fetch && git pull

do-git-push:
	git push

