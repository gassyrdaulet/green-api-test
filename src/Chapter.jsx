import { Box, Card, Typography, Tooltip } from "@mui/material";

function Chapter({ children, label, sx, tip }) {
  return (
    <Tooltip
      title={tip}
      placement="top"
      arrow
      PopperProps={{ style: { maxWidth: "150px", textAlign: "center" } }}
    >
      <Box
        sx={{
          ...sx,
          position: "relative",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            left: 10,
            top: -10,
            color: "#777",
            px: 1,
            backgroundColor: "white",
            whiteSpace: "nowrap",
            maxWidth: "80%",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </Typography>
        <Card
          sx={{ p: "20px", height: "Calc(100% - 40.5px) " }}
          variant="outlined"
        >
          {children}
        </Card>
      </Box>
    </Tooltip>
  );
}

export default Chapter;
