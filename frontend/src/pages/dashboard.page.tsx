import React, { FC, useState, useEffect } from "react";

import { RouteComponentProps } from "@reach/router";
import { IUserProps } from "../dtos/user.dto";
import { UserCard } from "../components/users/user-card";
import { CircularProgress } from "@mui/material";

import { BackendClient } from "../clients/backend.client";

const backendClient = new BackendClient();

export const DashboardPage: FC<RouteComponentProps> = () => {
  const [users, setUsers] = useState<IUserProps[]>([]);
  const [loading, setloading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const searchUser = () => {
    if (!search) {
      return;
    }
    const searchResult = users.filter((user) => user.first_name.includes(search));
     setUsers(searchResult);
  };

  const getPage = async (action: "back" | "next") => {
    setloading(true);
    const page = action === "back" ? currentPage - 1 : currentPage + 1;
    setCurrentPage(page);

    const result = await backendClient.getAllUsers(page);
    setUsers(result.data);
    setloading(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await backendClient.getAllUsers(currentPage);
      setUsers(result.data);
      setloading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <div style={{ paddingTop: "30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
              }}
            >
              <CircularProgress size="60px" />
            </div>
          ) : (
            <>
              <div>
                Search: <input style={{ marginTop: 40 }} type="text" value={search} onChange={(e) => setSearch(e.target.value)}/>
                <button value="Search" onClick={searchUser}>Search</button>
              </div>
              <div>
                {users.length
                  ? users.map((user) => {
                      return <UserCard key={user.id} {...user} />;
                    })
                  : null}
              </div>

              <div>
                <button disabled={currentPage === 1} onClick={() => getPage("back")}>Back</button>
                <button onClick={() => getPage("next")}>Next</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
