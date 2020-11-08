import React, { useEffect } from "react";

import CheckInTable from "./CheckInTable";
import { DrawerState } from "./MyDrawer";

type Props = {
  onChangeSpDrawerState: (state: DrawerState) => void;
};

export default function ProfilePage(props: Props) {
  useEffect(() => {
    props.onChangeSpDrawerState("open");
  }, []);

  return (
    <div>
      <h1>まつまつ</h1>
      <h2>チェックイン</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          maxWidth: 400,
          margin: "auto",
        }}
      >
        <CheckInTable />
      </div>
      <h2>アクティビティ</h2>
      <div>
        {Array(10)
          .fill(0)
          .map(() => (
            <p>2020年11月08日 15:20 なになにラウンドワン</p>
          ))}
      </div>
    </div>
  );
}
