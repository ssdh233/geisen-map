import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Popover from "@material-ui/core/Popover";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";

const { REACT_APP_API_URL } = process.env;

function User() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // TODO status code thing
    fetch(`${REACT_APP_API_URL}/user`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => {
        setUser(json);
      })
      .catch(() => {});
  }, []);

  return (
    <div
      style={{
        zIndex: 10000,
        position: "fixed",
        right: 16,
        top: 16,
      }}
    >
      <Avatar
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
          setIsMenuOpen(true);
        }}
      >
        {user && user.name.substring(0, 1)}
      </Avatar>
      {isMenuOpen && (
        <UserMenu
          loggedIn={!!user}
          open={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          anchorEl={anchorEl}
        />
      )}
    </div>
  );
}

type UserMenuProps = {
  open: boolean;
  loggedIn: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
};

function UserMenu({ open, onClose, anchorEl, loggedIn }: UserMenuProps) {
  function handleSignOut() {
    document.cookie += "accessToken=; Max-Age=0";
    document.cookie += "refreshToken=; Max-Age=0";
    window.location.reload();
  }

  function handleTwitterLogin() {
    fetch(`${REACT_APP_API_URL}/twitter/request_token`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.token) {
          window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${json.token}`;
        }
      });
  }

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <MenuList>
        {loggedIn ? (
          <>
            <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
            <MenuItem>Profile</MenuItem>
          </>
        ) : (
          <MenuItem onClick={handleTwitterLogin}>TwitterでSign in</MenuItem>
        )}
      </MenuList>
    </Popover>
  );
}

export default User;
