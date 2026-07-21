export const dayKey = (date) => {
    const value = new Date(date);
    return `${value.getFullYear()}-${value.getMonth()}-${value.getDate()}`;
};

export function calculateStreak(history, referenceDate = new Date()) {
    const completedDays = new Set(history.map((item) => dayKey(item.completedAt)));
    const cursor = new Date(referenceDate);

    if (!completedDays.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);

    let streak = 0;
    while (completedDays.has(dayKey(cursor))) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}

export function completedDaysInWeek(history, referenceDate = new Date()) {
    const monday = new Date(referenceDate);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(referenceDate.getDate() - ((referenceDate.getDay() + 6) % 7));
    return new Set(history.filter((item) => new Date(item.completedAt) >= monday).map((item) => dayKey(item.completedAt))).size;
}

export function calculateWeightProgress(firstWeight, currentWeight, goal) {
    if (!firstWeight || !currentWeight || !goal || firstWeight === goal) return 0;
    return Math.min(100, Math.max(0, ((firstWeight - currentWeight) / (firstWeight - goal)) * 100));
}
