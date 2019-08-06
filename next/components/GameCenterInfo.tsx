import { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { GameCenter } from "../types";

type Prop = {
  data: GameCenter;
};

const useStyles = makeStyles({
  gameCenterInfo: ({ isSP }: { isSP: boolean }) => ({
    padding: "16px 24px",
    width: isSP ? "100%" : 400
  }),
  name: ({ isSP }: { isSP: boolean }) => ({
    // left/right margin to make sure it's not covering the close button on SP
    margin: isSP ? "0 30px 20px" : "0 0 20px",
    textAlign: isSP ? "center" : "left"
  })
});

function GameCenterInfo(props: Prop) {
  if (!props.data) return null;

  const isSP = useMediaQuery("(max-width: 768px)");
  const { name, infos, games } = props.data;
  const classes = useStyles({ isSP });

  return (
    <div className={classes.gameCenterInfo}>
      <h2 className={classes.name}>{name}</h2>
      <h3>店舗情報</h3>
      <ul>
        {infos && infos.filter(info => info.infoType !== "name").map(info => <li key={info.infoType}>{info.text}</li>)}
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

export default GameCenterInfo;
