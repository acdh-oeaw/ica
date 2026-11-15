import { expect, test } from "@/e2e/lib/test";

for (const pathname of ["/geo-visualisation", "/network-visualisation"]) {
	test.describe(pathname, () => {
		test("should filter persons and remove a selection", async ({ page }) => {
			await page.goto(pathname);
			const persons = page.getByRole("combobox", { name: "Persons", exact: true });
			await persons.fill("Werfel");
			const option = page.getByRole("option", { name: "Franz Werfel", exact: true });
			await expect(option).toBeVisible();
			await option.click();
			await persons.press("Escape");
			const remove = page.getByRole("button", { name: "Remove Franz Werfel", exact: true });
			await expect(remove).toBeVisible();
			await remove.click();
			await expect(remove).toHaveCount(0);
			await persons.fill("no-person-with-this-name");
			await expect(page.getByText("Nothing found", { exact: true })).toBeVisible();
		});

		test("should change gender using the keyboard", async ({ page }) => {
			await page.goto(pathname);
			const gender = page.getByRole("button", { name: /Gender/ });
			await expect(gender).toBeEnabled();
			await expect(gender).toContainText("All genders");
			await gender.press("ArrowDown");
			const female = page.getByRole("option", { name: "Female", exact: true });
			await expect(female).toBeVisible();
			await page.keyboard.press("f");
			await expect(female).toBeFocused();
			await page.keyboard.press("Enter");
			await expect(gender).toContainText("Female");
		});
	});
}

test("should load the map and allow zooming", async ({ page }) => {
	const workerLoaded = page.waitForEvent("worker", {
		predicate(worker) {
			return worker.url().includes("maplibre-gl-worker");
		},
	});
	await page.goto("/geo-visualisation");
	const worker = await workerLoaded;
	expect(
		await worker.evaluate(() => {
			return self.location.pathname;
		}),
	).toMatch(/maplibre-gl-worker.*\.mjs$/);
	await expect(page.getByRole("region", { name: "Map" })).toBeVisible();
	await expect(page.locator("canvas.maplibregl-canvas")).toBeVisible();
	await page.getByRole("button", { name: "Zoom in", exact: true }).click();
	await page.getByRole("button", { name: "Zoom out", exact: true }).click();
});
