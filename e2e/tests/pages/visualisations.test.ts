import type { Locator } from "@playwright/test";

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

test("should preserve place popups and relations when zooming beyond source tile levels", async ({
	page,
}) => {
	// This exercises the popup at the initial zoom and after six consecutive zoom gestures.
	test.slow();
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.setViewportSize({ width: 1440, height: 1000 });
	const errors: Array<string> = [];
	page.on("pageerror", (error) => {
		errors.push(error.message);
	});
	await page.goto("/geo-visualisation");
	const canvas = page.locator("canvas.maplibregl-canvas");
	await expect(canvas).toBeVisible();
	const bounds = await canvas.boundingBox();
	expect(bounds).not.toBeNull();
	if (bounds == null) throw new Error("Map canvas has no bounds");

	// Vienna's point is just southeast of the default camera's center.
	let position = { x: bounds.width / 2 + 37, y: bounds.height / 2 + 40 };
	await expect(async () => {
		await canvas.hover({ position: { x: 50, y: 50 } });
		await canvas.hover({ position });
		await expect(canvas).toHaveCSS("cursor", "pointer");
	}).toPass();
	await canvas.click({ position });

	const popup = page.locator(".maplibregl-popup-content");
	await expect(popup).toBeVisible();
	await expect(popup.getByRole("heading", { name: "Vienna", exact: true })).toBeVisible();
	await expect(popup.getByRole("listitem")).not.toHaveCount(0);
	const relations = await popup.getByRole("listitem").allTextContents();

	// Six double-clicks take the default zoom 14 to zoom 20, beyond GeoJSON's default maxzoom 18.
	for (let step = 0; step < 6; step++) {
		await canvas.click({ position: { x: 50, y: 50 } });
		await expect(popup).toBeHidden();
		await canvas.dblclick({ position });
		await canvas.click({ position: { x: 50, y: 50 } });
		await expect(popup).toBeHidden();
		await expect(async () => {
			position = await findNearbyMapPoint(canvas, position);
		}).toPass();
		await canvas.click({ position });
		await expect(popup.getByRole("heading", { name: "Vienna", exact: true })).toBeVisible();
		await expect(popup.getByRole("listitem")).toHaveText(relations);
	}

	const scale = await page.locator(".maplibregl-ctrl-scale").innerText();
	expect(scale.trim()).toMatch(/^\d+\s*m$/);
	expect(Number.parseInt(scale, 10)).toBeLessThanOrEqual(5);
	await test
		.info()
		.attach("map-at-high-zoom", { body: await canvas.screenshot(), contentType: "image/png" });
	expect(errors).toEqual([]);
});

test("should explain when the map cannot initialize WebGL 2", async ({
	createAccessibilityScanner,
	page,
}) => {
	await page.addInitScript(() => {
		// oxlint-disable-next-line typescript/unbound-method -- Reapplied to each canvas via Reflect.apply.
		const getContext = HTMLCanvasElement.prototype.getContext;
		Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
			configurable: true,
			value(
				this: HTMLCanvasElement,
				contextId: string,
				options?: unknown,
			): RenderingContext | null {
				if (contextId === "webgl2") return null;
				return Reflect.apply(getContext, this, [contextId, options]) as RenderingContext | null;
			},
		});
	});
	const errors: Array<string> = [];
	page.on("pageerror", (error) => {
		errors.push(error.message);
	});
	await page.goto("/geo-visualisation");
	await expect(page.getByRole("heading", { name: "Map unavailable", exact: true })).toBeVisible();
	await expect(
		page
			.getByRole("status")
			.filter({ has: page.getByRole("heading", { name: "Map unavailable", exact: true }) }),
	).toContainText("graphics");
	await expect(page.locator("canvas.maplibregl-canvas")).toHaveCount(0);
	const { getViolations } = await createAccessibilityScanner();
	expect(await getViolations()).toEqual([]);
	await test.info().attach("graphics-unavailable", {
		body: await page.getByRole("main").screenshot(),
		contentType: "image/png",
	});
	await page.getByRole("link", { name: "Explore the network instead", exact: true }).click();
	await expect(page).toHaveURL(/\/network-visualisation$/);
	expect(errors).toEqual([]);
});

test("should not report a failed map style request as unsupported graphics", async ({ page }) => {
	await page.route(
		"https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
		async (route) => {
			await route.fulfill({ status: 503, contentType: "text/plain", body: "Service unavailable" });
		},
	);
	const error = page.waitForEvent("console", {
		async predicate(message) {
			if (message.type() !== "error") return false;
			for (const argument of message.args()) {
				if (
					await argument.evaluate((error: unknown) => {
						return error instanceof Error && error.message.includes("503");
					})
				)
					return true;
			}
			return false;
		},
	});
	await page.goto("/geo-visualisation");
	await error;
	await expect(page.locator("canvas.maplibregl-canvas")).toBeVisible();
	await expect(page.getByRole("heading", { name: "Map unavailable", exact: true })).toHaveCount(0);
});

interface PixelPosition {
	x: number;
	y: number;
}

/** Track the rendered dot through zooming without relying on private map internals. */
async function findNearbyMapPoint(canvas: Locator, near: PixelPosition): Promise<PixelPosition> {
	for (const radius of [0, 4, 8, 12, 16]) {
		const offsets =
			radius === 0
				? [[0, 0]]
				: [
						[0, -radius],
						[0, radius],
						[-radius, 0],
						[radius, 0],
						[-radius, -radius],
						[radius, -radius],
						[-radius, radius],
						[radius, radius],
					];
		for (const [x = 0, y = 0] of offsets) {
			const position = { x: near.x + x, y: near.y + y };
			await canvas.hover({ position });
			if (
				await canvas.evaluate((element) => {
					return getComputedStyle(element).cursor === "pointer";
				})
			)
				return position;
		}
	}
	throw new Error("Map point is not yet rendered near the zoom anchor");
}
