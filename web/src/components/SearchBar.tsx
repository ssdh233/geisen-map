import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import DirectionsSubwayIcon from "@material-ui/icons/DirectionsSubway";
import MenuItem from "@material-ui/core/MenuItem";
import Downshift from "downshift";
import reactLeaflet from "react-leaflet";

import { Geo } from "../types";

const { REACT_APP_API_URL } = process.env;

const useStyles = makeStyles({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    marginBottom: 8,
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    width: "calc(100% - 16px)",
  },
  suggestionIcon: {
    marginRight: 10,
  },
  suggestionDescription: {
    marginLeft: 10,
    color: "rgba(0, 0, 0, 0.54)",
    fontSize: 14,
  },
});

const SUGGESTION_TYPE_ICON_MAP = { station: DirectionsSubwayIcon } as {
  [type: string]: React.FunctionComponent<{ className: string }>;
};

type Props = {
  onSearch: (viewport: reactLeaflet.Viewport) => void;
  onMenuButtonClick: () => void;
};

type Suggestion = {
  text: string;
  description: string;
  geo: Geo;
  type: string; // TODO enum
};

function SearchBar(props: Props) {
  const [text, setText] = useState("");
  const [selectedItem, setSelectedItem] = useState(null as Suggestion | null);
  const [suggestions, setSuggestions] = useState([] as Suggestion[]);
  const classes = useStyles();

  // TODO debouncing
  const fetchSuggestions = useCallback(async (text) => {
    if (text) {
      const res = await fetch(`${REACT_APP_API_URL}/geoInfo?q=${text}`);
      if (res.status === 200) {
        const data = await res.json();
        if (data.length > 0) {
          setSuggestions(data);
        } else {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions(text);
  }, [text, fetchSuggestions]);

  function handleChange(selectedItem: Suggestion | null) {
    if (selectedItem) {
      setSelectedItem(selectedItem);
      props.onSearch({
        center: [selectedItem.geo.lat, selectedItem.geo.lng],
        zoom: selectedItem.geo.zoom,
      });
    }
  }

  async function hanldeSearch() {
    setSuggestions([]);
    if (text) {
      const res = await fetch(`${REACT_APP_API_URL}/geoInfo?q=${text}`);
      if (res.status === 200) {
        const data = await res.json();
        if (data.length > 0) {
          const firstSuggestion = data[0];
          props.onSearch({
            center: [firstSuggestion.geo.lat, firstSuggestion.geo.lng],
            zoom: firstSuggestion.geo.zoom,
          });
        }
      }
    }
  }

  return (
    <Downshift
      onChange={handleChange}
      itemToString={(item) => (item ? item.text : text)}
      inputValue={text}
      onInputValueChange={(value) => {
        setSelectedItem(null);
        setText(value);
      }}
      selectedItem={selectedItem}
    >
      {({ getInputProps, getItemProps, isOpen }) => (
        <div>
          <Paper className={classes.root}>
            <IconButton
              className={classes.iconButton}
              aria-label="menu"
              onClick={props.onMenuButtonClick}
            >
              <MenuIcon />
            </IconButton>
            <InputBase
              className={classes.input}
              placeholder="駅名で検索"
              inputProps={{ "aria-label": "" }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  hanldeSearch();
                }
              }}
              onFocus={() => fetchSuggestions(text)}
              {...getInputProps()}
            />
            <IconButton
              onClick={hanldeSearch}
              className={classes.iconButton}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
          </Paper>
          {isOpen && (
            <Paper className={classes.paper} square>
              {suggestions.map((item, index) => (
                <MenuItem
                  key={index}
                  {...getItemProps({
                    index,
                    item,
                  })}
                >
                  {React.createElement(SUGGESTION_TYPE_ICON_MAP[item.type], {
                    className: classes.suggestionIcon,
                  })}
                  {item.text}
                  <span className={classes.suggestionDescription}>
                    {item.description}
                  </span>
                </MenuItem>
              ))}
            </Paper>
          )}
        </div>
      )}
    </Downshift>
  );
}

export default SearchBar;
