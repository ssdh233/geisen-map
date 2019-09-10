import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { GameCenter } from "../types";

type Prop = {
  data: GameCenter;
};

const useStyles = makeStyles({
  gameCenterInfo: ({ isSP }: { isSP: boolean }) => ({
    padding: "0 24px 16px",
    width: isSP ? "100%" : 400
  }),
  name: ({ isSP }: { isSP: boolean }) => ({
    // left/right margin to make sure it's not covering the close button on SP
    padding: isSP ? "16px 30px" : "16px 24px",
    textAlign: isSP ? "center" : "left"
  })
});

export function GameCenterInfoHeader(props: Prop) {
  if (!props.data) return null;

  const { name } = props.data;
  const isSP = useMediaQuery("(max-width: 768px)");
  const classes = useStyles({ isSP });

  return <h2 className={classes.name}>{name}</h2>;
}

export function GameCenterInfoBody(props: Prop) {
  if (!props.data) return null;

  const { address, infos, games } = props.data;
  const isSP = useMediaQuery("(max-width: 768px)");
  const classes = useStyles({ isSP });

  return (
    <div className={classes.gameCenterInfo}>
      <h3>店舗情報</h3>
      <ul>
        <li>{address.fullAddress}</li>
        {infos && infos.map(info => <li key={info.infoType}>{info.text}</li>)}
      </ul>
      <h3>ゲーム情報</h3>
      <ul>
        {games &&
          games.map(game => (
            <Fragment key={game.name}>
              <li>{game.name}</li>
              {game.infos.length > 0 && (
                <ul>
                  {game.infos &&
                    game.infos
                      .filter(gameInfo => gameInfo.infoType !== "main")
                      .map(gameInfo => <li key={gameInfo.infoType}>{gameInfo.text}</li>)}
                </ul>
              )}
            </Fragment>
          ))}
      </ul>
    </div>
  );
}

function GameCenterInfo(props: Prop) {
  return (
    <>
      <GameCenterInfoHeader {...props} />
      <GameCenterInfoBody {...props} />
    </>
  );
}

export default GameCenterInfo;
