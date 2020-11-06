import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { DrawerState } from "./MyDrawer";
import { GameCenter } from "../types";
import CheckInDialog from "./CheckInDialog";

const { REACT_APP_API_URL } = process.env;

type Prop = {
  data: GameCenter;
};

const useStyles = makeStyles({
  gameCenterInfo: {
    padding: "0 24px 16px",
  },
  name: ({ isSP }: { isSP: boolean }) => ({
    // left/right margin to make sure it's not covering the close button on SP
    padding: isSP ? "16px 30px" : "16px 24px",
    textAlign: isSP ? "center" : "left",
  }),
});

export function GameCenterInfoHeader(props: Prop) {
  const isSP = useMediaQuery("(max-width: 768px)");
  const classes = useStyles({ isSP });

  if (!props.data) return null;
  const { name } = props.data;

  return <h2 className={classes.name}>{name}</h2>;
}

export function GameCenterInfoBody(props: Prop) {
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

  return (
    data && (
      <>
        <button onClick={() => setCheckInDialogOpen(true)}>
          クソザコCheck in
        </button>
        <CheckInDialog
          gamecenterData={data}
          open={checkInDialogOpen}
          onClose={() => setCheckInDialogOpen(false)}
        />
        <GameCenterInfoHeader data={data} />
        <GameCenterInfoBody data={data} />
      </>
    )
  );
}

export default GameCenterInfo;
