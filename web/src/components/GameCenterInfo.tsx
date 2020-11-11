import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Button from "@material-ui/core/Button";

import distance from "../utils/distance";
import { DrawerState } from "./MyDrawer";
import { GameCenter } from "../types";
import CheckInDialog from "./CheckInDialog";
import { User } from "../App";

const { REACT_APP_API_URL } = process.env;

const useStyles = makeStyles({
  gameCenterInfo: {
    padding: "0 24px 16px",
  },
  name: ({ isSP }: { isSP: boolean }) => ({
    // left/right margin to make sure it's not covering the close button on SP
    padding: isSP ? "16px 30px" : "16px 24px",
    textAlign: isSP ? "center" : "left",
  }),
  button: {
    display: "flex",
    flexDirection: "column",
    width: "20%",
    fontSize: 10,
    alignItems: "center",
    textAlign: "center",
  },
});

export function GameCenterInfoHeader(props: { data: GameCenter }) {
  const isSP = useMediaQuery("(max-width: 768px)");
  const classes = useStyles({ isSP });

  if (!props.data) return null;
  const { name } = props.data;

  return <h2 className={classes.name}>{name}</h2>;
}

export function GameCenterInfoBody(props: {
  data: GameCenter;
  userLocation: [number, number] | null;
  requestUserLocation: (onSuccess?: () => void) => void;
}) {
  const isSP = useMediaQuery("(max-width: 768px)");
  const classes = useStyles({ isSP });

  if (!props.data) return null;
  const { address, infos, games } = props.data;

  return (
    <div className={classes.gameCenterInfo}>
      <h3>店舗情報</h3>
      <ul>
        <li>{address.fullAddress}</li>
        {infos && infos.map((info) => <li key={info.infoType}>{info.text}</li>)}
      </ul>
      <h3>ゲーム情報</h3>
      <ul>
        {games &&
          games.map((game) => (
            <Fragment key={game.name}>
              <li>{game.name}</li>
              {game.infos.length > 0 && (
                <ul>
                  {game.infos &&
                    game.infos
                      .filter((gameInfo) => gameInfo.infoType !== "main")
                      .map((gameInfo) => (
                        <li key={gameInfo.infoType}>{gameInfo.text}</li>
                      ))}
                </ul>
              )}
            </Fragment>
          ))}
      </ul>
    </div>
  );
}

function GameCenterInfo(props: {
  match: {
    params: {
      gamecenterId?: string;
    };
  };
  user: User | null;
  userLocation: [number, number] | null;
  requestUserLocation: (onSuccess?: () => void) => void;
  onChangeFilterExapnded: (state: boolean) => void;
  onChangeSpDrawerState: (state: DrawerState) => void;
}) {
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
  const [data, setData] = useState<GameCenter | null>(null);
  const { gamecenterId } = props.match.params;

  useEffect(() => {
    async function myFunc() {
      const res = await fetch(
        `${REACT_APP_API_URL}/gamecenter/${gamecenterId}`
      );
      const data = await res.json();

      setData(data);
    }

    myFunc();
  }, [gamecenterId]);

  useEffect(() => {
    props.onChangeFilterExapnded(false);
    props.onChangeSpDrawerState("halfOpen");
  }, []);

  const d =
    (data?.geo &&
      props.userLocation &&
      distance(
        data?.geo.lat,
        data?.geo.lng,
        props.userLocation[0],
        props.userLocation[1],
        "K"
      ) * 1000) ||
    -1;
  const isCloseEnough = d !== -1 && d < 100;

  return (
    data && (
      <>
        <CheckInDialog
          userLocation={props.userLocation}
          requestUserLocation={props.requestUserLocation}
          gamecenterData={data}
          open={checkInDialogOpen}
          onClose={() => setCheckInDialogOpen(false)}
        />
        {!!props.user && isCloseEnough && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={() => setCheckInDialogOpen(true)}
              variant="contained"
              color="primary"
            >
              チェックイン！
            </Button>
          </div>
        )}
        <GameCenterInfoHeader data={data} />
        <GameCenterInfoBody
          data={data}
          userLocation={props.userLocation}
          requestUserLocation={props.requestUserLocation}
        />
      </>
    )
  );
}

export default GameCenterInfo;
