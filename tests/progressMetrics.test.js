import test from "node:test";
import assert from "node:assert/strict";
import { calculateStreak, calculateWeightProgress, completedDaysInWeek } from "../src/utils/progressMetrics.js";

test("calcula uma sequência que inclui hoje", () => {
    const history = ["2026-07-21", "2026-07-20", "2026-07-19"].map((completedAt) => ({ completedAt: `${completedAt}T12:00:00` }));
    assert.equal(calculateStreak(history, new Date("2026-07-21T18:00:00")), 3);
});

test("mantém a sequência quando o último treino foi ontem", () => {
    const history = ["2026-07-20", "2026-07-19"].map((completedAt) => ({ completedAt: `${completedAt}T12:00:00` }));
    assert.equal(calculateStreak(history, new Date("2026-07-21T18:00:00")), 2);
});

test("conta dias únicos concluídos na semana", () => {
    const history = ["2026-07-20T10:00:00", "2026-07-20T18:00:00", "2026-07-21T10:00:00"].map((completedAt) => ({ completedAt }));
    assert.equal(completedDaysInWeek(history, new Date("2026-07-21T18:00:00")), 2);
});

test("limita o progresso de peso entre zero e cem", () => {
    assert.equal(calculateWeightProgress(100, 90, 80), 50);
    assert.equal(calculateWeightProgress(100, 75, 80), 100);
    assert.equal(calculateWeightProgress(100, 105, 80), 0);
});
