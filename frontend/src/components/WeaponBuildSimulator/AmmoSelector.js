import React, { useEffect, useMemo } from "react";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import ammoData from "../../data/ammo.json";

function AmmoSelector({ selectedGun, selectedAmmo, setSelectedAmmo }) {
    const caliber = selectedGun?.properties?.caliber;

    const ammoOptions = useMemo(() => {
        if (!caliber) return [];

        return ammoData.data.items
            .filter((ammo) => ammo.properties?.caliber === caliber)
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [caliber]);

    useEffect(() => {
        if (!ammoOptions.length) {
            setSelectedAmmo(null);
            return;
        }

        const currentAmmoIsValid = ammoOptions.some(
            (ammo) => ammo.id === selectedAmmo?.id
        );

        if (!currentAmmoIsValid) {
            setSelectedAmmo(ammoOptions[0]);
        }
    }, [ammoOptions, selectedAmmo, setSelectedAmmo]);

    const properties = selectedAmmo?.properties;

    const handleAmmoChange = (event) => {
        const ammo = ammoOptions.find((item) => item.id === event.target.value);
        setSelectedAmmo(ammo ?? null);
    };

    return (
        <Box
            sx={{
                padding: 2,
                backgroundColor: "#2a2a2a",
                color: "#fff",
                borderRadius: 1,
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
                height: "100%",
            }}
        >
            <Typography variant="h6">Ammo</Typography>
            <Box sx={{ padding: 2 }}>
                <Select
                    value={selectedAmmo?.id ?? ""}
                    onChange={handleAmmoChange}
                    fullWidth
                    size="small"
                    disabled={!ammoOptions.length}
                    sx={{ mb: 2 }}
                >
                    {ammoOptions.map((ammo) => (
                        <MenuItem key={ammo.id} value={ammo.id}>
                            {ammo.name}
                        </MenuItem>
                    ))}
                </Select>

                {!caliber && (
                    <Typography sx={{ color: "text.secondary" }}>
                        Select a weapon to choose ammo.
                    </Typography>
                )}

                {caliber && !ammoOptions.length && (
                    <Typography sx={{ color: "text.secondary" }}>
                        No ammo data for {caliber}.
                    </Typography>
                )}

                {properties && (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                            gap: 1,
                        }}
                    >
                        <Typography>Damage: {properties.damage ?? "-"}</Typography>
                        <Typography>
                            Penetration: {properties.penetrationPower ?? "-"}
                        </Typography>
                        <Typography>
                            Armor Damage: {properties.armorDamage ?? "-"}
                        </Typography>
                        <Typography>
                            Recoil: {properties.recoilModifier ?? 0}
                        </Typography>
                        <Typography>
                            Accuracy: {properties.accuracyModifier ?? 0}
                        </Typography>
                        <Typography>
                            Speed: {properties.initialSpeed ?? "-"} m/s
                        </Typography>
                        <Typography>
                            Frag:{" "}
                            {properties.fragmentationChance != null
                                ? `${Math.round(
                                      properties.fragmentationChance * 100
                                  )}%`
                                : "-"}
                        </Typography>
                        <Typography>
                            Count: {properties.projectileCount ?? 1}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default AmmoSelector;
