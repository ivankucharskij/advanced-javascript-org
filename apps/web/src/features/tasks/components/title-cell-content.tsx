import { Box, Tooltip, Typography } from "@mui/material";
import type { GetTasks200DataItem } from "@repo/api-client";

import { useTextOverflow } from "@/lib/useTextOverflow";

export default function TitleCellContent({
  title,
  description,
}: Pick<GetTasks200DataItem, "title" | "description">) {
  const [titleRef, getTitleTooltip] = useTextOverflow();
  const [descriptionRef, getDescriptionTooltip] = useTextOverflow();

  return (
    <Box sx={{ display: "grid" }}>
      <Tooltip title={getTitleTooltip(title)}>
        <Typography ref={titleRef} className="truncate" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Tooltip>

      <Tooltip title={getDescriptionTooltip(description ?? "")}>
        <Typography
          variant="subtitle2"
          ref={descriptionRef}
          className="truncate"
        >
          {description}
        </Typography>
      </Tooltip>
    </Box>
  );
}
