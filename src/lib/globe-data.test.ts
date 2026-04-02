import assert from "node:assert/strict";
import test from "node:test";

import { getRegionFocusLocation, getRegionHighlightShapeIds } from "@/lib/globe-data";

test("all region has no focus point or highlight ids", () => {
	assert.equal(getRegionFocusLocation("all"), null);
	assert.deepEqual(getRegionHighlightShapeIds("all"), []);
});

test("region highlight ids match cards with available shapes", () => {
	const europeHighlightIds = getRegionHighlightShapeIds("Europe");

	assert.ok(europeHighlightIds.length > 0);
	assert.equal(new Set(europeHighlightIds).size, europeHighlightIds.length);
	assert.ok(europeHighlightIds.includes("250"));
	assert.ok(europeHighlightIds.includes("724"));
});

test("region focus location is deterministic and falls within the expected envelope", () => {
	const first = getRegionFocusLocation("Europe");
	const second = getRegionFocusLocation("Europe");

	assert.deepEqual(first, second);
	assert.ok(first);
	assert.ok(first.lat > 40 && first.lat < 60);
	assert.ok(first.lng > 0 && first.lng < 30);
});
