# favish/editor

This is a fork of Ory. Please make all changes on the favish branch so that we can easily merge in upstream changes from master. We're tracking with the Ory versions by appending a patch number to the corresponding version on master. For example, at the time of the fork, Ory master was on v0.4.4. Consequently, all tags on the favish branch until v0.4.5 will be v0.4.4-1, v0.4.4-2 and so on.

## Publishing to NPM
Lerna will take care of publishing all packages to NPM with the same version. After committing your code via git, run `lerna publish --no-git-tag-version` to publish. The flag `--no-git-tag-version` prevents updating the package.json versions since the Ory convention is to keep them at 0.0.0. This is nice because there will be less noise when merging in commits from Ory master.

## Pushing to Git
After publishing the packages to NPM, let's keep the versions in sync with git. Run `git tag v<npm-version-goes-here>` to do so. Remember to run `git push --tags` when pushing. 