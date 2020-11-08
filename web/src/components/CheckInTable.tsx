import React, { useMemo, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

import cx from "../utils/classname";
import dayjs from "dayjs";

const useStyles = makeStyles({
  svg: {
    fontSize: 10,
  },
  day: {
    shapeRendering: "geometricPrecision",
    outline: "1px solid var(--color-calendar-graph-day-border)",
    outlineOffset: "-1px",
    rx: "2",
    ry: "2",
    opacity: "0.5",
  },
  empty: {
    fill: "#ebedf0",
  },
  checked: {
    fill: "#40c463",
  },
  tooltip: {
    top: "15px !important",
  },
  tooltipTouch: {
    padding: "4px 8px",
    fontSize: "0.625rem",
    fontWeight: 500,
    lineHeight: "1.4em",
  },
});

function CheckInTable() {
  const [tooltip, setTooltip] = useState(-1);
  const classes = useStyles();

  const days = useMemo(() => {
    const today = dayjs(new Date());
    const lastDayOfThisWeek = today.add(6 - today.day());

    return Array(27 * 7)
      .fill(0)
      .map((_, i) => lastDayOfThisWeek.subtract(i, "day"));
  }, []);

  const monthLabels = useMemo(() => {
    const today = dayjs(new Date());
    const lastDayOfThisWeek = today.add(6 - today.day());

    return Array(6)
      .fill(0)
      .map((_, i) => {
        const startDayOfMonth = today.subtract(i, "month").startOf("month");
        console.log(
          i,
          Math.floor(lastDayOfThisWeek.diff(startDayOfMonth, "day") / 7)
        );
        return (
          <text
            text-anchor="start"
            dx={
              363 -
              14 *
                Math.floor(lastDayOfThisWeek.diff(startDayOfMonth, "day") / 7)
            }
            dy="10"
          >
            {startDayOfMonth.month() + 1}月
          </text>
        );
      });
  }, []);

  return (
    <>
      <svg width="400" height="112" className={classes.svg}>
        <ClickAwayListener onClickAway={() => setTooltip(-1)}>
          <g transform="translate(0, 20)">
            {days.map((day, i) => (
              <Tooltip
                title={`${day.month() + 1}月${day.date()}日`}
                arrow
                placement="top"
                classes={{
                  popper: classes.tooltip,
                  touch: classes.tooltipTouch,
                }}
                open={tooltip === i}
                disableFocusListener
                disableHoverListener
                disableTouchListener
              >
                <rect
                  className={cx(
                    classes.day,
                    i % 7 === 3 ? classes.checked : classes.empty
                  )}
                  onClick={() => setTooltip(i)}
                  width="10"
                  height="10"
                  x={364 - Math.floor(i / 7) * 14}
                  y={(6 - (i % 7)) * 13}
                  fill="var(--color-calendar-graph-day-bg)"
                ></rect>
              </Tooltip>
            ))}
          </g>
        </ClickAwayListener>
        <text text-anchor="start" dx="378" dy="42">
          月
        </text>
        <text text-anchor="start" dx="378" dy="67">
          水
        </text>
        <text text-anchor="start" dx="378" dy="92">
          土
        </text>
        {monthLabels}
      </svg>
    </>
  );
}

export default CheckInTable;
