const path = require("path");
const { spawnSync } = require("child_process");

const tasks = [
    {
        name: "武器パーツデータ",
        script: "fetchWeaponPartsData.js",
    },
    {
        name: "弾薬データ",
        script: "fetchAmmoData.js",
    },
];

for (const task of tasks) {
    const scriptPath = path.resolve(__dirname, task.script);

    console.log(`\nFetching ${task.name}...`);

    const result = spawnSync(process.execPath, [scriptPath], {
        stdio: "inherit",
    });

    if (result.status !== 0) {
        console.error(`Failed to fetch ${task.name}.`);
        process.exit(result.status ?? 1);
    }
}

console.log("\nAll data fetch tasks completed.");
