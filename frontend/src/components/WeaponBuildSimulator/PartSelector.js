import React from "react";
import { Tabs, Tab, Box, Card, CardContent, Typography } from "@mui/material";

function PartSelector({
    selectedTab,
    handleTabChange,
    categories,
    parts,
    handlePartSelect,
    selectedParts,
    clearPartSelect,
}) {
    return (
        <>
            {/* Tabs for part categories */}
            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                textColor="inherit"
                indicatorColor="primary"
            >
                {categories.map((category) => (
                    <Tab key={category} label={category} value={category} />
                ))}
            </Tabs>

            {/* Parts within the selected tab */}
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    padding: 2,
                    backgroundColor: "#1e1e1e",
                    borderRadius: 1,
                    marginTop: 2,
                }}
            >
                <Card
                    sx={{
                        minWidth: 150,
                        backgroundColor:
                            selectedTab in selectedParts
                                ? "#4c8cc6"
                                : "#1e1e1e",
                        color: "#fff",
                        transition: "transform 0.2s",
                        cursor: "pointer",
                        "&:hover": {
                            transform: "scale(1.05)",
                        },
                        borderStyle: "dotted", //borderを破線に
                        borderColor: "#3a3a3a",
                        borderColor:
                            selectedTab in selectedParts
                                ? "#ffffff"
                                : "#3a3a3a",
                    }}
                    onClick={() => clearPartSelect(selectedTab)}
                >
                    <CardContent>
                        <Typography variant="body1" align="center">
                            {selectedParts[selectedTab]?.name ?? "　"}
                        </Typography>
                        <Typography variant="body2" align="center">
                            Weight: {selectedParts[selectedTab]?.weight}kg
                        </Typography>
                        <Typography variant="body2" align="center">
                            Ergonomics: {selectedParts[selectedTab]?.ergonomics}
                        </Typography>
                    </CardContent>
                </Card>
                <Box
                    sx={{
                        display: "flex",
                        flex: 1,
                        overflowX: "auto",
                        overflowY: "hidden",
                        gap: 2,
                        backgroundColor: "#1e1e1e",
                    }}
                >
                    {parts[selectedTab].map((part) => (
                        <Card
                            key={part.id}
                            sx={{
                                minWidth: 150,
                                backgroundColor:
                                    selectedParts[selectedTab]?.id === part.id
                                        ? "#4c8cc6"
                                        : "#3a3a3a",
                                color: "#fff",
                                transition: "transform 0.2s",
                                cursor: "pointer",
                                border:
                                    selectedParts[selectedTab]?.id === part.id
                                        ? "2px solid #4c8cc6"
                                        : "none",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                },
                            }}
                            onClick={() => handlePartSelect(selectedTab, part)}
                        >
                            <CardContent>
                                <Typography variant="body1" align="center">
                                    {part.name}
                                </Typography>
                                <Typography variant="body2" align="center">
                                    Weight: {part.weight}kg
                                </Typography>
                                <Typography variant="body2" align="center">
                                    Ergonomics: {part.ergonomics}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>
        </>
    );
}

export default PartSelector;
