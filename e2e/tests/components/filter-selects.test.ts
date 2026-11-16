import { expect, test } from "@playwright/test";

for (const pathname of ["/geo-visualisation", "/network-visualisation"]) {
	test.describe(`filter selects on ${pathname}`, () => {
		test.use({ viewport: { width: 1000, height: 600 } });

		test("keeps long dropdowns inside the viewport and scrolls their options", async ({ page }) => {
			await page.goto(pathname);
			for (const name of ["Persons", "Professions", "Relation types"]) {
				const input = page.getByRole("combobox", { name, exact: true });
				await input.click();
				await input.press("ArrowDown");
				const listbox = page.getByRole("listbox");
				await expect(listbox).toBeVisible();
				await expect(input).toHaveAttribute("aria-expanded", "true");
				await expect(page.locator('[data-trigger="ComboBox"][data-entering]')).toHaveCount(0);
				await expect
					.poll(async () => {
						return listbox.evaluate((element) => {
							const bounds = element.getBoundingClientRect();
							return bounds.top >= 0 && bounds.bottom <= window.innerHeight;
						});
					})
					.toBe(true);
				await expect(listbox).toHaveCSS("overflow-y", "auto");
				await input.press("End");
				await expect
					.poll(async () => {
						return listbox.getByRole("option").evaluateAll((options) => {
							const focused = options.find((option) => {
								return option.hasAttribute("data-focused");
							});
							return (
								focused != null &&
								focused.getAttribute("aria-posinset") === focused.getAttribute("aria-setsize")
							);
						});
					})
					.toBe(true);
				await expect
					.poll(async () => {
						return listbox.evaluate((element) => {
							return element.scrollTop;
						});
					})
					.toBeGreaterThan(0);
				await input.press("Escape");
				await expect(listbox).toBeHidden();
			}
		});

		test("highlights options for both pointer and keyboard navigation", async ({ page }) => {
			await page.goto(pathname);
			const input = page.getByRole("combobox", { name: "Persons", exact: true });
			await input.click();
			await input.press("ArrowDown");
			const options = page.getByRole("option");
			await options.nth(1).hover();
			await expect(options.nth(1)).toHaveAttribute("data-hovered");
			await expect(options.nth(1)).toHaveCSS("background-color", "rgb(226, 232, 240)");
			await page.mouse.move(0, 0);
			await input.press("Home");
			await input.press("ArrowDown");
			await input.press("ArrowDown");
			await expect(options.nth(2)).toHaveAttribute("data-focused");
			await expect(options.nth(2)).toHaveCSS("background-color", "rgb(226, 232, 240)");
			await input.press("Enter");
			await expect(options.nth(2)).toHaveAttribute("aria-selected", "true");
			await input.press("Escape");
			await expect(page.getByRole("listbox")).toBeHidden();
			await expect(
				page
					.getByRole("grid", { name: "Persons", exact: true })
					.getByText("Stefan Zweig", { exact: true }),
			).toBeVisible();
			await page.getByRole("button", { name: /All genders/ }).click();
			await page.keyboard.press("ArrowDown");
			await expect(page.getByRole("option", { name: "Female", exact: true })).toHaveCSS(
				"background-color",
				"rgb(226, 232, 240)",
			);
		});
	});
}
