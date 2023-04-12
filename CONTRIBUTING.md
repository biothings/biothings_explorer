# How to Contribute

See the [main README](https://github.com/biothings/biothings_explorer#biothings-explorer-trapi-api). This file just has additional details.

## Set up Dev Environment

### Small Updates

If you're just updating one package and your changes won't affect other packages, you don't have to worry about any of this. If your changes will affect multiple packages but primarily affect just one, you may be able to get away with just using [`npm link`](https://docs.npmjs.com/cli/v7/commands/npm-link).

### Larger Updates

If your updates will affect multiple packages, you may find it helpful to use [NPM workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces). This feature is better than just `npm link` for handling the case of simultaneously updating multiple linked packages. Note it requires NPM v7+. Steps to get this working:

1. Create a new directory and `cd` into it
2. Add a top-level package.json with all the packages and their dependencies hoisted up to the top level ([something like this](https://www.dropbox.com/s/izsofa7r5alwwfd/package.json?dl=0) - notice the `workspaces` key)
3. For each package to be affected by your updates, clone its repo into subdirectory `./packages` ([demo bash script](https://www.dropbox.com/s/upggzaby7b978z8/clone_packages.sh?dl=0) to do this).
4. From the top-level directory, run the following:

- `npm install`
- `npm run build --workspaces`
- `npm run test --workspaces`

5. To run an NPM script for a specific package, try `npm run <script-name> --workspace=package-a` from the top-level directory, e.g., to start the biothings_explorer endpoint: `npm run start --workspace='@biothings-explorer/single-hop-app'`.
6. From the directories in `./packages`, you can edit code and run git commands, e.g., `cd './packages/@biothings-explorer/single-hop-app'` and `git pull`.
7. For now, you still need to run the build step for each package affected by your updates: `npm run build --workspaces` from the top-level directory. If it doesn't work immediately, try running it again. (We can automate this in the future.)
