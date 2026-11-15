# Ideas crossing the Atlantic

Frontend for the [Ideas crossing the Atlantic (ICA)](https://ica-db.acdh.oeaw.ac.at/) project.

Deployed at <https://ica.acdh.oeaw.ac.at>.

Development requires Node.js 26 and the pnpm version pinned in `devEngines.packageManager`.

Run `pnpm format:check`, `pnpm lint:check`, and `pnpm types:check` to check formatting with Oxfmt,
code with type-aware Oxlint, styles with Stylelint 18, and types with TypeScript 7. Use
`pnpm format:fix` and `pnpm lint:fix` to apply automatic fixes.

Generate visual snapshots on the CI runner so font rendering matches the validation environment.
Push the current branch, then run `pnpm test:e2e:update-snapshots:ci`. The helper requires an
authenticated GitHub CLI (`gh`), dispatches validation in snapshot-update mode, and downloads the
`snapshots` artifact into `e2e/snapshots/`. Review and commit the resulting images.

To download snapshots from a completed run, use `pnpm test:e2e:update-snapshots:ci --run <run-id>`.
