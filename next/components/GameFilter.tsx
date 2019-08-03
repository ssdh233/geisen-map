import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import { NAME_MAP, intializeFilter } from "../constants/game";
import { Filter } from "../types";

type Props = {
  filter: Filter;
  onChange: (filter: Filter) => void;
}

const useStyles = makeStyles({
  checkboxes: {
    paddingLeft: 16
  },
});

function GameFilter(props: Props) {

  const classes = useStyles();

  const FilterCheckBox = ({ gameName }: { gameName: string }) => (
    <FormControlLabel
      control={
        <Checkbox
          checked={props.filter[gameName]}
          onChange={() => props.onChange({
            ...props.filter,
            [gameName]: !props.filter[gameName]
          })}
          value={gameName}
          color="primary"
        />
      }
      label={NAME_MAP[gameName]}
    />
  );

  const hasSomthingSelected = Object.keys(props.filter).some(gameName => props.filter[gameName]);

  return (<FormGroup row className={classes.checkboxes}>
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
  </FormGroup>);
}

export default GameFilter;