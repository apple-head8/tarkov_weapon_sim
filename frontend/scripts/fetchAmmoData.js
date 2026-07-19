const fs = require("fs");
const path = require("path");

const query = `
query {
  items(lang: ja, categoryNames: ["弾薬"]) {
    id
    name
    shortName
    basePrice
    avg24hPrice
    lastLowPrice
    weight
    properties {
      ... on ItemPropertiesAmmo {
        caliber
        damage
        penetrationPower
        armorDamage
        accuracyModifier
        recoilModifier
        fragmentationChance
        lightBleedModifier
        heavyBleedModifier
        initialSpeed
        projectileCount
        tracer
        tracerColor
      }
    }
  }
}
`;

async function main() {
    const response = await fetch("https://api.tarkov.dev/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
    });

    const result = await response.json();

    if (result.errors) {
        console.error(JSON.stringify(result.errors, null, 2));
        process.exit(1);
    }

    const items = result.data.items.filter((item) => item.properties?.caliber);
    const outputPath = path.resolve(__dirname, "../src/data/ammo.json");

    fs.writeFileSync(
        outputPath,
        JSON.stringify({ data: { items } }, null, 2) + "\n",
        "utf8"
    );

    console.log(`Wrote ${items.length} ammo items to ${outputPath}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
