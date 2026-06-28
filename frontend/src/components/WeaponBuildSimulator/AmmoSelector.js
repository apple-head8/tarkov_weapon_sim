import React, { useEffect, useMemo } from "react";
import { Box, Chip, MenuItem, Select, Typography } from "@mui/material";
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
    const ammoEffects = buildAmmoEffects(properties);

    const handleAmmoChange = (event) => {
        const ammo = ammoOptions.find((item) => item.id === event.target.value);
        setSelectedAmmo(ammo ?? null);
    };

    function formatModifier(value) {
        if (!value) return null;

        const percent = Math.round(value * 100);
        return `${percent > 0 ? "+" : ""}${percent}%`;
    }

    function buildAmmoEffects(properties) {
        if (!properties) return [];

        const effects = [];
        const recoil = formatModifier(properties.recoilModifier);
        const lightBleed = formatModifier(properties.lightBleedModifier);
        const heavyBleed = formatModifier(properties.heavyBleedModifier);

        if (recoil) {
            effects.push(`Recoil ${recoil}`);
        }

        if (lightBleed) {
            effects.push(`Light Bleed ${lightBleed}`);
        }

        if (heavyBleed) {
            effects.push(`Heavy Bleed ${heavyBleed}`);
        }

        if (properties.tracer) {
            effects.push(`Tracer ${properties.tracerColor ?? ""}`.trim());
        }

        if (properties.projectileCount > 1) {
            effects.push(`Pellets x${properties.projectileCount}`);
        }

        return effects;
    }

    function AmmoStatCard({ label, value, unit }) {
        return (
            <Box
                sx={{
                    minWidth: 112,
                    flex: "1 1 112px",
                    padding: 1.25,
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 1,
                }}
            >
                <Typography
                    sx={{
                        color: "text.secondary",
                        fontSize: "0.72rem",
                        lineHeight: 1.2,
                    }}
                >
                    {label}
                </Typography>
                <Typography
                    sx={{
                        fontSize: "1.35rem",
                        fontWeight: 700,
                        lineHeight: 1.25,
                    }}
                >
                    {value ?? "-"}
                    {value != null && unit ? (
                        <Typography
                            component="span"
                            sx={{
                                ml: 0.5,
                                color: "text.secondary",
                                fontSize: "0.75rem",
                            }}
                        >
                            {unit}
                        </Typography>
                    ) : null}
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                padding: 2,
                backgroundColor: "#2a2a2a",
                color: "#fff",
                borderRadius: 1,
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
            }}
        >
            <Typography variant="h6">Ammo</Typography>
            <Box sx={{ padding: 2 }}>
                <Select
                    value={selectedAmmo?.id ?? ""}
                    onChange={handleAmmoChange}
                    renderValue={(selectedId) => {
                        const ammo = ammoOptions.find(
                            (item) => item.id === selectedId
                        );

                        if (!ammo) return "";

                        return `${ammo.name} / Armor ${ammo.properties?.armorDamage ?? "-"}`;
                    }}
                    fullWidth
                    size="small"
                    disabled={!ammoOptions.length}
                    sx={{ mb: 2 }}
                >
                    {ammoOptions.map((ammo) => (
                        <MenuItem key={ammo.id} value={ammo.id}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: 2,
                                    width: "100%",
                                }}
                            >
                                <Typography
                                    sx={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {ammo.name}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: "text.secondary",
                                        flexShrink: 0,
                                    }}
                                >
                                    Armor {ammo.properties?.armorDamage ?? "-"}
                                </Typography>
                            </Box>
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
                    <>
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1,
                            }}
                        >
                            <AmmoStatCard
                                label="Damage"
                                value={properties.damage}
                            />
                            <AmmoStatCard
                                label="Penetration"
                                value={properties.penetrationPower}
                            />
                            <AmmoStatCard
                                label="Armor Damage"
                                value={properties.armorDamage}
                            />
                            <AmmoStatCard
                                label="Speed"
                                value={properties.initialSpeed}
                                unit="m/s"
                            />
                        </Box>
                        <Box
                            sx={{
                                mt: 1.5,
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1,
                            }}
                        >
                            {ammoEffects.length > 0 ? (
                                ammoEffects.map((effect) => (
                                    <Chip
                                        key={effect}
                                        label={effect}
                                        size="small"
                                        sx={{
                                            backgroundColor:
                                                "rgba(187,134,252,0.12)",
                                            border:
                                                "1px solid rgba(187,134,252,0.35)",
                                            color: "#fff",
                                        }}
                                    />
                                ))
                            ) : (
                                <Typography
                                    variant="body2"
                                    sx={{ color: "text.secondary" }}
                                >
                                    No special effects
                                </Typography>
                            )}
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
}

export default AmmoSelector;
