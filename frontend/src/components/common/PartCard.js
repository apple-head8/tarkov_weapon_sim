import React from "react";
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    ImageListItemBar,
} from "@mui/material";

const PartCard = ({
    part,
    isSelected = false,
    isSelectedCard = false,
    onClick,
}) => {
    // partがない場合は空カードを表示
    const hasPart = !!part;

    return (
        <Card
            sx={{
                width: 150,
                height: 200,
                backgroundColor: isSelectedCard
                    ? "#4c8cc6"
                    : isSelected
                    ? "#4c8cc6"
                    : "#3a3a3a",
                color: "#fff",
                border: isSelectedCard
                    ? "2px dotted #ffffff"
                    : isSelected
                    ? "2px solid #4c8cc6"
                    : "none",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": {
                    transform: "scale(1.05)",
                },
                overflow: "hidden",
            }}
            onClick={onClick}
        >
            <Box sx={{ position: "relative", height: 120, width: "100%" }}>
                {hasPart ? (
                    <CardMedia
                        component="img"
                        image={`${part.image512pxLink}?w=248&fit=crop&auto=format`}
                        alt={part.name}
                        sx={{
                            objectFit: "contain",
                            width: "100%",
                            height: "100%",
                        }}
                    />
                ) : (
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "#2e2e2e",
                        }}
                    />
                )}
                <ImageListItemBar
                    title={hasPart ? part.name ?? "　" : "No part selected"}
                    position="bottom"
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        background: "rgba(50,50,50,0.7)",
                        height: 48, // 高さを増やす（32→48程度）
                        "& .MuiImageListItemBar-title": {
                            fontSize: "0.8rem",
                            fontWeight: "bold",
                            whiteSpace: "normal", // 折り返し許可
                            display: "-webkit-box",
                            WebkitLineClamp: 2, // 2行まで表示
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        },
                    }}
                />
            </Box>
            <CardContent
                sx={{
                    padding: "4px",
                    flexGrow: 1,
                    backgroundColor: "rgba(50,50,50,0.7)",
                }}
            >
                {hasPart ? (
                    <>
                        <Typography variant="body2" align="center">
                            Weight: {part.weight ?? 0}kg
                        </Typography>
                        <Typography variant="body2" align="center">
                            Ergo: {part.ergonomicsModifier ?? 0}
                        </Typography>
                        <Typography variant="body2" align="center">
                            Price: ¥{part.lastLowPrice?.toLocaleString() ?? "-"}
                        </Typography>
                    </>
                ) : (
                    <Typography
                        variant="body2"
                        align="center"
                        sx={{ color: "#999" }}
                    >
                        No data
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default PartCard;
