import React, { useState, useEffect } from "react";
import { User } from "../App";

import CheckInTable, { CheckIn } from "./CheckInTable";
import { DrawerState } from "./MyDrawer";

type Props = {
  user: User | null;
  onChangeSpDrawerState: (state: DrawerState) => void;
};

export default function ProfilePage(props: Props) {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  useEffect(() => {
    props.onChangeSpDrawerState("open");
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/checkIns`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => setCheckIns(json));
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1>{props.user?.name}</h1>
      <h2>チェックイン</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          maxWidth: 400,
          margin: "16px auto",
        }}
      >
        <CheckInTable checkIns={checkIns} />
      </div>
      <h2>アクティビティ</h2>
      <div>
        {checkIns.map((checkIn) => {
          const date = new Date(checkIn.date);
          return (
            <p>
              {date.toLocaleDateString()} {date.getHours()}:{date.getMinutes()}{" "}
              {checkIn.gamecenterName}
            </p>
          );
        })}
      </div>
    </div>
  );
}
