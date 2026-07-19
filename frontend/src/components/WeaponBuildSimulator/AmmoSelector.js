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

    const selectedAmmoId = ammoOptions.some((ammo) => ammo.id === selectedAmmo?.id)
        ? selectedAmmo.id
        : "";

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
            effects.push(`反動 ${recoil}`);
        }

        if (lightBleed) {
            effects.push(`軽出血 ${lightBleed}`);
        }

        if (heavyBleed) {
            effects.push(`重出血 ${heavyBleed}`);
        }

        if (properties.tracer) {
            effects.push(`曳光弾 ${properties.tracerColor ?? ""}`.trim());
        }

        if (properties.projectileCount > 1) {
            effects.push(`ペレット x${properties.projectileCount}`);
        }

        return effects;
    }

    function getArmorPenetrationMark(penetrationPower, armorClass) {
        if (!Number.isFinite(penetrationPower)) return "×";

        const reliableClass = Math.floor(penetrationPower / 10);
        const remainder = penetrationPower % 10;

        if (armorClass <= reliableClass) return "◎";
        if (armorClass === reliableClass + 1) {
            if (remainder >= 7) return "○";
            if (remainder >= 1) return "△";
        }

        return "×";
    }

    function getPenetrationMarkColor(mark) {
        const colors = {
            "◎": "#4ade80",
            "○": "#facc15",
            "△": "#fb923c",
            "×": "#ef4444",
        };

        return colors[mark] ?? colors["×"];
    }

    function getArmorClassColor(armorClass) {
        const colors = {
            1: "#c4b5fd",
            2: "#a78bfa",
            3: "#8b5cf6",
            4: "#7c3aed",
            5: "#a21caf",
            6: "#db2777",
        };

        return colors[armorClass] ?? "text.secondary";
    }

    function ArmorClassPenetration({ penetrationPower }) {
        return (
            <Box sx={{ mt: 2 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 1,
                        mb: 0.75,
                    }}
                >
                    <Typography
                        sx={{
                            color: "text.secondary",
                            fontSize: "0.82rem",
                            fontWeight: 700,
                        }}
                    >
                        アーマークラス別 貫通目安
                    </Typography>
                    <Typography
                        sx={{
                            color: "rgba(255,255,255,0.56)",
                            fontSize: "0.72rem",
                        }}
                    >
                        簡易
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(6, 1fr)",
                        gap: 0.75,
                    }}
                >
                    {[1, 2, 3, 4, 5, 6].map((armorClass) => {
                        const mark = getArmorPenetrationMark(
                            penetrationPower,
                            armorClass
                        );

                        return (
                            <Box
                                key={armorClass}
                                sx={{
                                    overflow: "hidden",
                                    borderRadius: 1,
                                    border:
                                        "1px solid rgba(255,255,255,0.12)",
                                    backgroundColor:
                                        "rgba(255,255,255,0.06)",
                                }}
                            >
                                <Typography
                                    sx={{
                                        py: 0.35,
                                        textAlign: "center",
                                        color: getArmorClassColor(armorClass),
                                        fontSize: "0.76rem",
                                        fontWeight: 800,
                                    }}
                                >
                                    クラス {armorClass}
                                </Typography>
                                <Box
                                    sx={{
                                        py: 0.65,
                                        textAlign: "center",
                                        backgroundColor:
                                            getPenetrationMarkColor(mark),
                                        color: "#111",
                                        fontWeight: 800,
                                        fontSize: "1.05rem",
                                    }}
                                >
                                    {mark}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
                <Typography
                    variant="caption"
                    sx={{
                        display: "block",
                        mt: 0.75,
                        color: "rgba(255,255,255,0.56)",
                        lineHeight: 1.5,
                    }}
                >
                    弾薬の貫通力のみから算出した簡易目安です。実際の貫通結果はアーマーの残耐久や素材などによって変動します。
                </Typography>
            </Box>
        );
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
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
            }}
        >
            <Typography variant="h6">弾薬</Typography>
            <Box sx={{ padding: { xs: 1, md: 2 } }}>
                <Select
                    value={selectedAmmoId}
                    onChange={handleAmmoChange}
                    renderValue={(selectedId) => {
                        const ammo = ammoOptions.find(
                            (item) => item.id === selectedId
                        );

                        if (!ammo) return "";

                        return `${ammo.name} / アーマーダメージ ${ammo.properties?.armorDamage ?? "-"}`;
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
                                    アーマー {ammo.properties?.armorDamage ?? "-"}
                                </Typography>
                            </Box>
                        </MenuItem>
                    ))}
                </Select>

                {!caliber && (
                    <Typography sx={{ color: "text.secondary" }}>
                        武器を選択すると、対応する弾薬を確認できます。
                    </Typography>
                )}

                {caliber && !ammoOptions.length && (
                    <Typography sx={{ color: "text.secondary" }}>
                        {caliber} の弾薬データがありません。
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
                                label="ダメージ"
                                value={properties.damage}
                            />
                            <AmmoStatCard
                                label="貫通力"
                                value={properties.penetrationPower}
                            />
                            <AmmoStatCard
                                label="アーマー"
                                value={properties.armorDamage}
                            />
                            <AmmoStatCard
                                label="初速"
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
                                    特殊効果なし
                                </Typography>
                            )}
                        </Box>
                        <ArmorClassPenetration
                            penetrationPower={properties.penetrationPower}
                        />
                    </>
                )}
            </Box>
        </Box>
    );
}

export default AmmoSelector;
