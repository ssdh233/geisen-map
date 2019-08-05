import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FilterListIcon from "@material-ui/icons/FilterList";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { NAME_MAP, intializeFilter } from "../constants/game";
import cx from "../utils/classname";
import { Filter } from "../types";

type Props = {
  expanded: boolean;
  onChangeExpanded: (expanded: boolean) => void;
  filter: Filter;
  onChange: (filter: Filter) => void;
  // prop to controll the expanded icon arrow
  expandedIconState?: boolean;
};

type StyleParam = { isSP: boolean; expanded: boolean };

const useStyles = makeStyles({
  container: ({ isSP, expanded }: StyleParam) => ({
    overflow: "hidden",
    maxHeight: expanded ? (isSP ? 500 : 1000) : 48,
    padding: "12px 16px",
    transition: "max-height 150ms"
  }),
  expander: {
    padding: 0,
    border: 0,
    cursor: "pointer",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    width: "100%"
  },
  filterIcon: {
    marginRight: 8
  },
  label: {
    textAlign: "left",
    flexGrow: 1
  },
  expandIconContainer: {
    width: 48,
    height: 24,
    display: "flex",
    alignItems: "center",
    position: "relative"
  },
  expandIconButton: {
    position: "absolute"
  },
  expandIcon: {
    transition: "transform 150ms"
  },
  expandIconRotated: {
    transform: "rotate(180deg)"
  },
  checkBoxContainer: ({ isSP }: StyleParam) => ({
    marginTop: 8,
    width: "100vw",
    maxHeight: isSP ? "50vh" : undefined,
    overflow: "scroll",
    display: "block"
  })
});

function GameFilter(props: Props) {
  const isSP = useMediaQuery("(max-width:768px)");
  const classes = useStyles({ isSP, expanded: props.expanded });

  const FilterCheckBox = ({ gameName }: { gameName: string }) => (
    <FormControlLabel
      control={
        <Checkbox
          checked={props.filter[gameName]}
          onChange={() =>
            props.onChange({
              ...props.filter,
              [gameName]: !props.filter[gameName]
            })
          }
          value={gameName}
          color="primary"
        />
      }
      label={NAME_MAP[gameName]}
    />
  );

  const hasSomthingSelected = Object.keys(props.filter).some(gameName => props.filter[gameName]);

  return (
    <div className={classes.container}>
      <div className={classes.expander} onClick={() => props.onChangeExpanded(!props.expanded)}>
        <FilterListIcon className={classes.filterIcon} />
        <div className={classes.label}>機種絞り込み</div>
        <div className={classes.expandIconContainer}>
          <IconButton className={classes.expandIconButton}>
            <ExpandMoreIcon
              className={cx(
                classes.expandIcon,
                (props.expandedIconState !== undefined ? props.expandedIconState : props.expanded) &&
                  classes.expandIconRotated
              )}
            />
          </IconButton>
        </div>
      </div>
      <FormGroup row className={classes.checkBoxContainer}>
        <FormControl component="fieldset">
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={hasSomthingSelected}
                  onChange={() => props.onChange(intializeFilter(!hasSomthingSelected))}
                  value="selectAll"
                  color="primary"
                />
              }
              label={hasSomthingSelected ? "すべて解除" : "すべて選択"}
            />
            {Object.keys(NAME_MAP).map(gameName => (
              <FilterCheckBox key={gameName} gameName={gameName} />
            ))}
          </FormGroup>
        </FormControl>
      </FormGroup>
    </div>
  );
}

export default GameFilter;
