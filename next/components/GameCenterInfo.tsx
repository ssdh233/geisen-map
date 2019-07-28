import { Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';

interface Prop {
  data: any
}

const useStyles = makeStyles({
  gameCenterInfo: {
    padding: "16px 24px",
    width: 400
  },
  name: {
    marginBottom: 20
  },
});

function GameCenterInfo(props: Prop) {
  if (!props.data) return null;

  const { name, infos, games } = props.data;
  const classes = useStyles();

  return <div className={classes.gameCenterInfo}>
    <h2 className={classes.name}>{name}</h2>
    <h3>店舗情報</h3>
    <ul>
      {infos && infos.filter((info: any) => info.infoType !== "name").map((info: any) => (
        <li key={info.infoType}>
          {info.text}
        </li>
      ))}
    </ul>
    <h3>ゲーム情報</h3>
    <ul>
      {games && games.map((game: any) => (
        <Fragment key={game.name}>
          <li>{game.name}</li>
          {game.infos.length > 0 &&
            <ul>
              {game.infos && game.infos.filter((gameInfo: any) => gameInfo.infoType !== "main").map(((gameInfo: any) => (
                <li key={gameInfo.infoType}>
                  {gameInfo.text}
                </li>
              )))}
            </ul>
          }
        </Fragment>
      ))}
    </ul>
  </div >
}

export default GameCenterInfo;