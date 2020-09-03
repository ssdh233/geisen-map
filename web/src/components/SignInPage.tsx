import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import useQuery from "../utils/useQuery";

const { REACT_APP_API_URL } = process.env;

const useStyles = makeStyles({
  page: {
    margin: "auto",
    padding: "24px 0",
    width: 400,
    display: "flex",
    flexDirection: "column",
    "& > *": {
      marginBottom: 16,
    },
  },
});

function SignInPage() {
  const { type, twitterName } = useQuery();
  const classes = useStyles();

  return (
    <form
      action={`${REACT_APP_API_URL}/twitter/signin`}
      method="post"
      className={classes.page}
    >
      {/** TODO think about to do this on client side or server side */}
      <div>
        新規登録: {type === "twitter" && "Twitter"} {twitterName}
      </div>
      <TextField
        required
        id="email"
        name="email"
        label="Email"
        variant="outlined"
      />
      <TextField
        required
        id="name"
        name="name"
        label="ニックネーム"
        variant="outlined"
      />
      <Button variant="contained" color="primary" type="submit">
        登録する
      </Button>
    </form>
  );
}

export default SignInPage;
