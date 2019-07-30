import { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { GameCenter } from "../types";

interface Prop {
  data: GameCenter;
}

const useStyles = makeStyles({
  gameCenterInfo: {
    padding: "16px 24px",
    width: 400
  },
  name: {
    marginBottom: 20
  }
});

function GameCenterInfo(props: Prop) {
  if (!props.data) return null;

  const { name, infos, games } = props.data;
  const classes = useStyles();

  return (
    <div className={classes.gameCenterInfo}>
      <h2 className={classes.name}>{name}</h2>
      <h3>店舗情報</h3>
      <ul>
        {infos &&
          infos
            .filter(info => info.infoType !== "name")
            .map(info => <li key={info.infoType}>{info.text}</li>)}
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
                      .map(gameInfo => (
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

export default GameCenterInfo;
